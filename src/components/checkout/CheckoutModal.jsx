"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import toast from "react-hot-toast";
import {
    LuX, LuUser, LuMail, LuPhone, LuLoader, LuArrowRight, LuBadgeCheck,
    LuSmartphone, LuClock, LuTag, LuHash, LuCalendar, LuGraduationCap,
} from "react-icons/lu";
import { API_URL } from "@/config/api";
import { useLanguage } from "@/context/LanguageContext";

const GATEWAYS = [
    { id: "bkash", label: "bKash", color: "bg-[#d12053]" },
    { id: "rocket", label: "Rocket", color: "bg-[#8c3494]" },
    { id: "nagad", label: "Nagad", color: "bg-[#f7941d]" },
];

const inputBase =
    "w-full pl-10 pr-3 py-2.5 rounded-lg text-sm text-gray-800 bg-gray-50 border outline-none transition-colors focus:bg-white focus:border-[#E62D26]";

const Field = ({ label, optional, error, icon: Icon, children }) => (
    <div>
        <label className="text-xs font-semibold text-gray-700 mb-1.5 block">
            {label} {optional ? <span className="text-gray-400 font-normal">({optional})</span> : <span className="text-red-500">*</span>}
        </label>
        <div className="relative">
            <Icon className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" size={16} />
            {children}
        </div>
        {error && <p className="text-red-500 text-xs mt-1">{error}</p>}
    </div>
);

const CheckoutModal = ({ isOpen, onClose, course }) => {
    const router = useRouter();
    const { language } = useLanguage();
    const isBn = language === "bn";
    const bengaliClass = isBn ? "hind-siliguri" : "";
    const tr = (bn, en) => (isBn ? bn : en);

    const [form, setForm] = useState({ fullName: "", email: "", phone: "" });
    const [payOption, setPayOption] = useState("now"); // now | later
    const [gateway, setGateway] = useState("bkash");
    const [payment, setPayment] = useState({
        senderNumber: "",
        transactionId: "",
        time: "",
        date: new Date().toISOString().split("T")[0],
    });
    const [couponCode, setCouponCode] = useState("");
    const [coupon, setCoupon] = useState(null);
    const [discount, setDiscount] = useState(0);
    const [couponApplying, setCouponApplying] = useState(false);
    const [errors, setErrors] = useState({});
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);

    const price = Number(
        course?.discountPrice && course.discountPrice > 0
            ? course.discountPrice
            : course?.price || parseInt(course?.fee?.replace(/[^\d]/g, "") || "0")
    ) || 0;
    const total = Math.max(price - discount, 0);

    // Prefill from the logged-in user
    useEffect(() => {
        if (!isOpen) return;
        try {
            const user = JSON.parse(localStorage.getItem("user") || "{}");
            setForm({
                fullName: `${user.firstName || ""} ${user.lastName || ""}`.trim() || user.name || "",
                email: user.email || "",
                phone: user.phone || "",
            });
        } catch { /* ignore */ }
    }, [isOpen]);

    // Lock page scroll + close on Escape
    useEffect(() => {
        if (!isOpen) return;
        const onKey = (e) => e.key === "Escape" && onClose();
        document.body.style.overflow = "hidden";
        window.addEventListener("keydown", onKey);
        return () => {
            document.body.style.overflow = "";
            window.removeEventListener("keydown", onKey);
        };
    }, [isOpen, onClose]);

    const setField = (setter) => (e) => {
        const { name, value } = e.target;
        setter((prev) => ({ ...prev, [name]: value }));
        if (errors[name]) setErrors((prev) => ({ ...prev, [name]: "" }));
    };

    const applyCoupon = async () => {
        if (!couponCode.trim()) return toast.error(tr("কুপন কোড লিখুন", "Please enter a coupon code"));
        setCouponApplying(true);
        try {
            const res = await fetch(`${API_URL}/coupons/apply`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ code: couponCode.trim(), cartTotal: price, productType: "course" }),
            });
            const data = await res.json();
            if (data.success && data.data?.valid) {
                setCoupon(data.data.couponCode);
                setDiscount(data.data.discount);
                toast.success(tr(`কুপন প্রয়োগ হয়েছে! ৳${data.data.discount} সাশ্রয়`, `Coupon applied! You save ৳${data.data.discount}`));
            } else {
                toast.error(data.message || tr("কুপন কোডটি সঠিক নয়", "Invalid coupon code"));
            }
        } catch {
            toast.error(tr("কুপন প্রয়োগ করা যায়নি", "Failed to apply coupon"));
        } finally {
            setCouponApplying(false);
        }
    };

    const removeCoupon = () => {
        setCoupon(null);
        setDiscount(0);
        setCouponCode("");
    };

    const collectErrors = (list) => {
        const next = {};
        list.forEach((err) => {
            if (err.path) next[err.path.includes(".") ? err.path.split(".").pop() : err.path] = err.message;
        });
        setErrors((prev) => ({ ...prev, ...next }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!course?._id) return;
        setLoading(true);

        const payNow = payOption === "now";
        const item = {
            productId: course._id,
            productType: "course",
            title: course.title,
            price,
            image: course.thumbnail || course.image || "",
        };
        const paymentMethod = payNow ? "manual" : "pay_later";
        const token = localStorage.getItem("token");

        try {
            if (token) {
                const orderRes = await fetch(`${API_URL}/orders`, {
                    method: "POST",
                    headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
                    body: JSON.stringify({
                        items: [item],
                        paymentMethod,
                        paymentStatus: "pending",
                        discountAmount: discount || 0,
                        couponCode: coupon || "",
                    }),
                });
                const orderResult = await orderRes.json();
                if (!orderRes.ok) {
                    if (Array.isArray(orderResult.errorMessages)) collectErrors(orderResult.errorMessages);
                    throw new Error(orderResult.message || "Failed to create order");
                }

                if (payNow) {
                    const manualRes = await fetch(`${API_URL}/orders/${orderResult.data._id}/manual-payment`, {
                        method: "PATCH",
                        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
                        body: JSON.stringify({ method: gateway, ...payment }),
                    });
                    if (!manualRes.ok) {
                        const errorData = await manualRes.json();
                        if (Array.isArray(errorData.errorMessages)) collectErrors(errorData.errorMessages);
                        throw new Error(errorData.message || "Failed to submit payment details");
                    }
                }
            } else {
                const guestRes = await fetch(`${API_URL}/orders/guest-checkout`, {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                        fullName: form.fullName,
                        email: form.email,
                        phone: form.phone,
                        address: "",
                        items: [item],
                        paymentMethod,
                        manualMethod: gateway,
                        senderNumber: payNow ? payment.senderNumber : "",
                        transactionId: payNow ? payment.transactionId : "",
                        time: payNow ? payment.time : "",
                        date: payNow ? payment.date : "",
                        discountAmount: discount || 0,
                        couponCode: coupon || "",
                    }),
                });
                const guestResult = await guestRes.json();
                if (!guestRes.ok) {
                    if (Array.isArray(guestResult.errorMessages) && guestResult.errorMessages.length) {
                        collectErrors(guestResult.errorMessages);
                        guestResult.errorMessages.forEach((err) => toast.error(err.message, { duration: 5000 }));
                    } else {
                        toast.error(guestResult.message || "Checkout failed");
                    }
                    return;
                }
                // Auto-login the guest
                if (guestResult.data?.tokens?.accessToken) {
                    localStorage.setItem("token", guestResult.data.tokens.accessToken);
                    localStorage.setItem("refreshToken", guestResult.data.tokens.refreshToken);
                    localStorage.setItem("user", JSON.stringify(guestResult.data.user));
                }
            }

            setSuccess(true);
            setTimeout(() => router.push("/dashboard/user/courses"), 3000);
        } catch (error) {
            console.error("Checkout error:", error);
            toast.error(error.message || "Checkout failed");
        } finally {
            setLoading(false);
        }
    };

    const errCls = (name) => (errors[name] ? "border-red-400 bg-red-50" : "border-gray-200");

    return (
        <AnimatePresence>
            {isOpen && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="fixed inset-0 z-[9998] bg-black/60 backdrop-blur-sm overflow-y-auto"
                    onMouseDown={(e) => e.target === e.currentTarget && onClose()}
                >
                    <div className="min-h-full flex items-center justify-center p-4 pt-16" onMouseDown={(e) => e.target === e.currentTarget && onClose()}>
                        <motion.div
                            initial={{ opacity: 0, y: 24, scale: 0.97 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            exit={{ opacity: 0, y: 24, scale: 0.97 }}
                            transition={{ duration: 0.2 }}
                            className={`relative w-full max-w-2xl bg-white rounded-3xl shadow-2xl ${bengaliClass}`}
                        >
                            <button
                                type="button"
                                onClick={onClose}
                                aria-label="Close"
                                className="absolute -top-12 right-0 w-9 h-9 rounded-lg bg-white text-gray-700 hover:text-red-600 flex items-center justify-center shadow-lg"
                            >
                                <LuX size={18} />
                            </button>

                            {success ? (
                                <div className="px-8 py-14 text-center">
                                    <div className="w-16 h-16 mx-auto mb-5 rounded-full bg-emerald-50 border border-emerald-100 flex items-center justify-center">
                                        <LuBadgeCheck className="text-emerald-500" size={32} />
                                    </div>
                                    <h3 className="text-xl font-bold text-gray-900 mb-2">
                                        {tr("অর্ডার সফল হয়েছে!", "Order placed successfully!")}
                                    </h3>
                                    <p className="text-sm text-gray-500 max-w-sm mx-auto mb-6">
                                        {payOption === "now"
                                            ? tr("ভেরিফিকেশনের পর কোর্সটি সক্রিয় হবে।", "Your course will be activated after payment verification.")
                                            : tr("আপনি পরে পেমেন্ট করতে পারবেন। আমাদের একজন অ্যাডভাইজার আপনার সাথে যোগাযোগ করবেন।", "You can pay later. An advisor will contact you shortly.")}
                                    </p>
                                    <button
                                        onClick={() => router.push("/dashboard/user/courses")}
                                        className="px-6 py-2.5 bg-[#E62D26] text-white text-sm font-semibold rounded-lg hover:bg-[#c41e18] transition-colors inline-flex items-center gap-2"
                                    >
                                        {tr("আমার কোর্সগুলো দেখুন", "Go to My Courses")} <LuArrowRight size={16} />
                                    </button>
                                </div>
                            ) : (
                                <form onSubmit={handleSubmit}>
                                    <div className="px-7 pt-6 pb-4 border-b border-gray-100">
                                        <h3 className="text-lg font-bold text-gray-900">{tr("এনরোল করুন", "Enroll now")}</h3>
                                        <p className="text-xs text-gray-500 mt-0.5">
                                            {tr("তথ্য দিয়ে ভর্তি প্রক্রিয়া সম্পন্ন করুন।", "Fill in your details to complete your enrollment.")}
                                        </p>
                                    </div>

                                    <div className="px-7 py-5 space-y-4">
                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                            <Field label={tr("আপনার নাম", "Your name")} icon={LuUser} error={errors.fullName}>
                                                <input required name="fullName" value={form.fullName} onChange={setField(setForm)}
                                                    placeholder={tr("আপনার নাম লিখুন", "Enter your name")} className={`${inputBase} ${errCls("fullName")}`} />
                                            </Field>
                                            <Field label={tr("মোবাইল নম্বর", "Mobile number")} icon={LuPhone} error={errors.phone}>
                                                <input required name="phone" value={form.phone} onChange={setField(setForm)}
                                                    placeholder="01XXXXXXXXX" className={`${inputBase} ${errCls("phone")}`} />
                                            </Field>
                                            <Field label={tr("কোর্স", "Course")} icon={LuGraduationCap}>
                                                <input readOnly value={course?.title || ""} className={`${inputBase} border-gray-200 truncate cursor-default`} />
                                            </Field>
                                            <Field label={tr("ইমেইল", "Email address")} icon={LuMail} error={errors.email}>
                                                <input required type="email" name="email" value={form.email} onChange={setField(setForm)}
                                                    placeholder="you@example.com" className={`${inputBase} ${errCls("email")}`} />
                                            </Field>
                                        </div>

                                        {/* Payment option */}
                                        <div>
                                            <p className="text-xs font-semibold text-gray-700 mb-1.5">
                                                {tr("পেমেন্ট অপশন", "Payment option")} <span className="text-red-500">*</span>
                                            </p>
                                            <div className="grid grid-cols-2 gap-3">
                                                {[
                                                    { id: "now", icon: LuSmartphone, label: tr("এখনই পেমেন্ট", "Pay now") },
                                                    { id: "later", icon: LuClock, label: tr("পরে পেমেন্ট", "Pay later") },
                                                ].map((opt) => (
                                                    <button
                                                        key={opt.id}
                                                        type="button"
                                                        onClick={() => setPayOption(opt.id)}
                                                        className={`flex items-center justify-center gap-2 py-2.5 rounded-lg text-sm font-semibold border transition-colors ${payOption === opt.id
                                                            ? "bg-gray-900 text-white border-gray-900"
                                                            : "bg-white text-gray-700 border-gray-200 hover:border-gray-400"}`}
                                                    >
                                                        <opt.icon size={16} /> {opt.label}
                                                    </button>
                                                ))}
                                            </div>
                                        </div>

                                        {payOption === "now" ? (
                                            <div className="p-4 rounded-xl bg-gray-50 border border-dashed border-gray-200 space-y-4">
                                                <div className="flex flex-wrap items-center gap-2">
                                                    {GATEWAYS.map((g) => (
                                                        <button
                                                            key={g.id}
                                                            type="button"
                                                            onClick={() => setGateway(g.id)}
                                                            className={`px-4 py-1.5 rounded-md text-xs font-bold transition-colors ${gateway === g.id
                                                                ? `${g.color} text-white`
                                                                : "bg-white text-gray-600 border border-gray-200"}`}
                                                        >
                                                            {g.label}
                                                        </button>
                                                    ))}
                                                    <span className="ml-auto text-sm font-bold text-gray-900 tracking-tight">
                                                        01829818616 <span className="text-[10px] font-normal text-gray-400 uppercase">{tr("পার্সোনাল", "Personal")}</span>
                                                    </span>
                                                </div>
                                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                                    <Field label={tr("সেন্ডার নম্বর", "Sender number")} icon={LuPhone} error={errors.senderNumber}>
                                                        <input required name="senderNumber" value={payment.senderNumber} onChange={setField(setPayment)}
                                                            placeholder="01XXXXXXXXX" className={`${inputBase} bg-white ${errCls("senderNumber")}`} />
                                                    </Field>
                                                    <Field label={tr("ট্রানজেকশন আইডি", "Transaction ID")} icon={LuHash} error={errors.transactionId}>
                                                        <input required name="transactionId" value={payment.transactionId} onChange={setField(setPayment)}
                                                            placeholder="8N7A6D5E4F" className={`${inputBase} bg-white ${errCls("transactionId")}`} />
                                                    </Field>
                                                    <Field label={tr("পেমেন্ট সময়", "Time")} icon={LuClock} error={errors.time}>
                                                        <input required type="time" name="time" value={payment.time} onChange={setField(setPayment)}
                                                            className={`${inputBase} bg-white ${errCls("time")}`} />
                                                    </Field>
                                                    <Field label={tr("পেমেন্ট তারিখ", "Date")} icon={LuCalendar} error={errors.date}>
                                                        <input required type="date" name="date" value={payment.date} onChange={setField(setPayment)}
                                                            className={`${inputBase} bg-white ${errCls("date")}`} />
                                                    </Field>
                                                </div>
                                            </div>
                                        ) : (
                                            <p className="text-xs text-gray-500 bg-amber-50 border border-amber-100 rounded-lg px-3 py-2.5">
                                                {tr(
                                                    "এখন কোনো পেমেন্ট লাগবে না। অর্ডার সম্পন্ন করুন, পরে আপনার সুবিধামতো পেমেন্ট করতে পারবেন।",
                                                    "No payment is needed right now. Place your order and pay later at your convenience."
                                                )}
                                            </p>
                                        )}

                                        {/* Coupon + total */}
                                        <div className="flex flex-col sm:flex-row sm:items-center gap-3 pt-1">
                                            <div className="flex gap-2 flex-1">
                                                <div className="relative flex-1">
                                                    <LuTag className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={15} />
                                                    <input
                                                        value={couponCode}
                                                        onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
                                                        disabled={!!coupon}
                                                        placeholder={tr("কুপন কোড", "Coupon code")}
                                                        className={`${inputBase} border-gray-200 uppercase text-xs font-semibold`}
                                                    />
                                                </div>
                                                <button
                                                    type="button"
                                                    onClick={coupon ? removeCoupon : applyCoupon}
                                                    disabled={couponApplying}
                                                    className="px-4 rounded-lg bg-gray-900 text-white text-xs font-bold hover:bg-[#E62D26] transition-colors disabled:opacity-50"
                                                >
                                                    {coupon ? tr("সরান", "Remove") : tr("প্রয়োগ", "Apply")}
                                                </button>
                                            </div>
                                            <div className="text-right">
                                                <span className="text-xs text-gray-500 mr-2">{tr("মোট", "Total")}</span>
                                                {discount > 0 && <span className="text-xs text-gray-400 line-through mr-1.5">৳{price.toLocaleString()}</span>}
                                                <span className="text-xl font-black text-[#E62D26]">৳{total.toLocaleString()}</span>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="px-7 pb-7">
                                        <button
                                            type="submit"
                                            disabled={loading}
                                            className="w-full py-3.5 bg-[#E62D26] text-white rounded-xl font-bold text-sm hover:bg-[#c41e18] transition-all shadow-lg shadow-red-200 flex items-center justify-center gap-2 disabled:opacity-70"
                                        >
                                            {loading ? <LuLoader className="animate-spin" size={18} /> : (
                                                <>
                                                    {payOption === "now" ? tr("ভর্তি নিশ্চিত করুন", "Confirm enrollment") : tr("অর্ডার করুন, পরে পেমেন্ট", "Place order, pay later")}
                                                    <LuArrowRight size={16} />
                                                </>
                                            )}
                                        </button>
                                    </div>
                                </form>
                            )}
                        </motion.div>
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    );
};

export default CheckoutModal;
