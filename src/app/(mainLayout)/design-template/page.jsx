"use client";

import React from "react";
import { motion } from "framer-motion";
import { LuGlobe, LuSparkles, LuArrowRight } from "react-icons/lu";
import { FaFacebookF, FaPhone } from "react-icons/fa";
import { useLanguage } from "@/context/LanguageContext";

// Contact details for custom website enquiries
const PHONE = "01711946614";
const FACEBOOK_URL = "https://www.facebook.com/extrainweb";

const DesignTemplatePage = () => {
  const { language } = useLanguage();
  const isBn = language === "bn";
  const bengaliClass = isBn ? "hind-siliguri" : "";

  return (
    <section className="relative overflow-hidden min-h-[85vh] flex items-center justify-center bg-gradient-to-br from-[#fff5f4] via-[#fef7f0] to-[#fff5f4] dark:from-slate-950 dark:via-slate-900 dark:to-slate-950 px-4 py-20">
      {/* Background effects */}
      <div className="absolute top-0 right-0 w-1/3 h-full bg-gradient-to-l from-red-400/10 dark:from-red-500/5 to-transparent blur-3xl pointer-events-none" />
      <div className="absolute -bottom-32 -left-32 w-80 h-80 bg-amber-400/10 dark:bg-amber-500/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute top-24 right-[12%] w-20 h-20 border-2 border-red-500/20 rounded-2xl rotate-12 animate-float" />
      <div className="absolute bottom-28 left-[10%] w-16 h-16 border-2 border-orange-500/20 rounded-full animate-float" style={{ animationDelay: "1s" }} />

      <div className="relative z-10 w-full max-w-3xl mx-auto flex flex-col items-center text-center">
        {/* Badge */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/80 dark:bg-slate-800/80 border border-red-100 dark:border-slate-700 shadow-sm mb-6"
        >
          <LuSparkles className="text-red-500" size={16} />
          <span className={`text-sm font-semibold text-gray-700 dark:text-gray-200 ${bengaliClass}`}>
            {isBn ? "ওয়েবসাইট সার্ভিস" : "Website Service"}
          </span>
        </motion.div>

        {/* Icon */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.05 }}
          className="w-20 h-20 rounded-2xl bg-gradient-to-br from-red-500 to-orange-500 flex items-center justify-center shadow-lg shadow-red-200 dark:shadow-none mb-7"
        >
          <LuGlobe className="text-white" size={38} />
        </motion.div>

        {/* Heading */}
        <motion.h1
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className={`text-3xl sm:text-4xl lg:text-5xl font-bold leading-tight tracking-tight text-gray-900 dark:text-white mb-5 ${isBn ? "hind-siliguri" : "outfit"}`}
        >
          {isBn ? (
            <>কাস্টম <span className="text-red-600">ওয়েবসাইট</span> তৈরি</>
          ) : (
            <>Custom <span className="text-red-600">Website</span> Development</>
          )}
        </motion.h1>

        {/* Subtitle */}
        <motion.p
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
          className={`text-base sm:text-lg text-gray-600 dark:text-gray-300 leading-relaxed max-w-2xl mb-9 ${bengaliClass}`}
        >
          {isBn
            ? "আপনার যেকোনো ধরনের কাস্টম ওয়েবসাইট প্রয়োজন হলে আমরা বিশ্বের সেরা ও সর্বাধুনিক প্রযুক্তি দিয়ে তৈরি করে দিই। আপনার আইডিয়া অনুযায়ী প্রফেশনাল, দ্রুতগতির ও নিরাপদ ওয়েবসাইট বানাতে আজই আমাদের মেসেজ করুন।"
            : "Need any kind of custom website? We build it for you with the world's latest and best technology. For a professional, fast and secure website tailored to your idea, message us today."}
        </motion.p>

        {/* CTA Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-3"
        >
          <a
            href={FACEBOOK_URL}
            target="_blank"
            rel="noopener noreferrer"
            className={`group inline-flex items-center justify-center gap-2.5 px-7 py-3.5 rounded-xl bg-gradient-to-r from-red-500 to-orange-500 text-white font-semibold shadow-lg shadow-red-200 dark:shadow-none hover:scale-[1.03] transition-transform ${bengaliClass}`}
          >
            <FaFacebookF size={16} />
            {isBn ? "মেসেজ করুন" : "Message Us"}
            <LuArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
          </a>
          <a
            href={`tel:${PHONE}`}
            className={`inline-flex items-center justify-center gap-2.5 px-7 py-3.5 rounded-xl bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 text-gray-800 dark:text-gray-100 font-semibold hover:border-red-400 hover:text-red-600 transition-colors ${bengaliClass}`}
          >
            <FaPhone size={15} />
            {PHONE}
          </a>
        </motion.div>

        {/* small helper line */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className={`mt-6 text-sm text-gray-500 dark:text-gray-400 ${bengaliClass}`}
        >
          {isBn ? "যেকোনো প্রয়োজনে সরাসরি যোগাযোগ করুন" : "Reach out directly for any requirement"}
        </motion.p>
      </div>
    </section>
  );
};

export default DesignTemplatePage;
