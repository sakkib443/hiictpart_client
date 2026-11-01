"use client";
import React, { Suspense, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchWebsites } from "@/redux/websiteSlice";
import { fetchCategories, setSelectedCategories } from "@/redux/categorySlice";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import {
    LuGlobe,
    LuSearch,
    LuStar,
    LuEye,
    LuShoppingCart,
    LuArrowRight,
    LuGrid3X3,
    LuLayoutGrid,
    LuArrowUpDown,
    LuHeart,
    LuSparkles,
    LuX
} from "react-icons/lu";
import { useLanguage } from "@/context/LanguageContext";

// Loading fallback component
const LoadingFallback = () => (
    <div className="flex items-center justify-center py-20">
        <div className="w-10 h-10 border-3 border-[#E62D26]/30 border-t-[#E62D26] rounded-full animate-spin"></div>
    </div>
);

// Website Card Component
const WebsiteCard = ({ item, viewMode }) => {
    const { language } = useLanguage();
    const bengaliClass = language === "bn" ? "hind-siliguri" : "";

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className={`group bg-white dark:bg-white/5 rounded-2xl border border-slate-100 dark:border-white/10 overflow-hidden hover:shadow-xl hover:border-[#E62D26]/30 transition-all duration-300 ${viewMode === "list" ? "flex" : ""
                }`}
        >
            {/* Image */}
            <div className={`relative overflow-hidden ${viewMode === "list" ? "w-64 flex-shrink-0" : "aspect-[16/10]"}`}>
                <Image
                    src={item.thumbnail || item.image || "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=600"}
                    alt={item.title || item.name}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />

                {/* Quick Actions */}
                <div className="absolute top-3 right-3 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button className="w-8 h-8 bg-white/90 backdrop-blur-sm rounded-lg flex items-center justify-center text-slate-600 hover:text-[#E62D26] transition-colors">
                        <LuHeart size={16} />
                    </button>
                    <button className="w-8 h-8 bg-white/90 backdrop-blur-sm rounded-lg flex items-center justify-center text-slate-600 hover:text-[#E62D26] transition-colors">
                        <LuEye size={16} />
                    </button>
                </div>

                {/* Category Badge */}
                <div className="absolute bottom-3 left-3">
                    <span className="px-3 py-1 bg-white/90 backdrop-blur-sm rounded-full text-[10px] font-bold text-slate-700">
                        {item.type || item.category?.name || "Website"}
                    </span>
                </div>
            </div>

            {/* Content */}
            <div className={`p-5 ${viewMode === "list" ? "flex-1 flex flex-col justify-between" : ""}`}>
                <div>
                    <h3 className={`text-base font-bold text-slate-800 dark:text-white mb-2 group-hover:text-[#E62D26] transition-colors line-clamp-1 ${bengaliClass}`}>
                        {item.title || item.name}
                    </h3>

                    {/* Stats */}
                    <div className="flex items-center gap-4 text-slate-500 mb-3">
                        <div className="flex items-center gap-1">
                            <LuStar className="text-amber-400" size={14} />
                            <span className="text-xs font-semibold">{item.rating || 4.5}</span>
                        </div>
                        <div className="flex items-center gap-1">
                            <LuEye size={14} />
                            <span className="text-xs">{item.views || 0}</span>
                        </div>
                        <div className="flex items-center gap-1">
                            <LuShoppingCart size={14} />
                            <span className="text-xs">{item.sales || 0}</span>
                        </div>
                    </div>
                </div>

                {/* Price & Action */}
                <div className="flex items-center justify-between pt-3 border-t border-slate-100 dark:border-white/5">
                    <div>
                        {item.offerPrice ? (
                            <div className="flex items-center gap-2">
                                <span className="text-lg font-bold text-[#E62D26]">৳{item.offerPrice}</span>
                                <span className="text-sm text-slate-400 line-through">৳{item.price}</span>
                            </div>
                        ) : (
                            <span className="text-lg font-bold text-[#E62D26]">৳{item.price || 0}</span>
                        )}
                    </div>
                    <Link
                        href={`/website/${item._id}`}
                        className="flex items-center gap-1.5 px-4 py-2 bg-slate-100 dark:bg-white/5 hover:bg-[#E62D26] text-slate-700 dark:text-slate-300 hover:text-white rounded-lg text-xs font-semibold transition-all group/btn"
                    >
                        <span>{language === "bn" ? "দেখুন" : "View"}</span>
                        <LuArrowRight size={14} className="group-hover/btn:translate-x-0.5 transition-transform" />
                    </Link>
                </div>
            </div>
        </motion.div>
    );
};

const WebsiteContent = () => {
    const dispatch = useDispatch();
    const { websiteList = [], loading } = useSelector((state) => state.websites || {});
    const { items: categories = [], selectedCategories = [] } = useSelector((state) => state.categories || {});
    const [searchQuery, setSearchQuery] = useState("");
    const [selectedType, setSelectedType] = useState("All");
    const [sortBy, setSortBy] = useState("default");
    const [viewMode, setViewMode] = useState("grid");
    const [isVisible, setIsVisible] = useState(false);
    const { language } = useLanguage();
    const bengaliClass = language === "bn" ? "hind-siliguri" : "";

    useEffect(() => {
        setIsVisible(true);
        dispatch(fetchWebsites());
        dispatch(fetchCategories({ type: 'website' }));
    }, [dispatch]);

    const websiteTypes = [
        { name: 'All', label: language === 'bn' ? 'সব' : 'All' },
        { name: 'Static', label: language === 'bn' ? 'স্ট্যাটিক' : 'Static' },
        { name: 'Dynamic', label: language === 'bn' ? 'ডাইনামিক' : 'Dynamic' },
        { name: 'Full System', label: language === 'bn' ? 'ফুল সিস্টেম' : 'Full System' }
    ];

    // Get category name helper
    const getCategoryName = (category) => {
        if (!category) return "";
        if (typeof category === "string") return category;
        return category.name || "";
    };

    // Filter websites
    const filteredWebsites = websiteList.filter((item) => {
        if (!item) return false;
        const typeMatch = selectedType === "All" || item?.type === selectedType;
        let categoryMatch = true;
        if (selectedCategories.length > 0) {
            const itemCategoryName = getCategoryName(item.category);
            categoryMatch = selectedCategories.includes(itemCategoryName);
        }
        const q = (searchQuery || "").trim().toLowerCase();
        const searchMatch =
            q === "" ||
            (item.title && item.title.toLowerCase().includes(q)) ||
            (item.name && item.name.toLowerCase().includes(q)) ||
            getCategoryName(item.category).toLowerCase().includes(q);
        return typeMatch && categoryMatch && searchMatch;
    });

    // Sort websites
    const sortedWebsites = [...filteredWebsites].sort((a, b) => {
        switch (sortBy) {
            case "price-low":
                return (a.offerPrice || a.price) - (b.offerPrice || b.price);
            case "price-high":
                return (b.offerPrice || b.price) - (a.offerPrice || a.price);
            case "rating":
                return (b.rating || 0) - (a.rating || 0);
            default:
                return 0;
        }
    });

    const handleCategoryChange = (categoryName) => {
        const newSelection = selectedCategories.includes(categoryName) ? [] : [categoryName];
        dispatch(setSelectedCategories(newSelection));
    };

    const clearAllFilters = () => {
        dispatch(setSelectedCategories([]));
        setSearchQuery("");
        setSelectedType("All");
        setSortBy("default");
    };

    const hasActiveFilters = selectedCategories.length > 0 || searchQuery || selectedType !== "All";

    return (
        <div className="min-h-screen bg-white dark:bg-[#0a0a0a]">
            {/* Hero Section */}
            <section className="py-12 lg:py-16 bg-slate-50 dark:bg-[#0a0a0a]">
                <div className="container mx-auto px-4 lg:px-16">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: isVisible ? 1 : 0, y: isVisible ? 0 : 20 }}
                        transition={{ duration: 0.6 }}
                        className="text-center max-w-3xl mx-auto"
                    >
                        {/* Badge */}
                        <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-white dark:bg-white/5 border border-[#E62D26]/20 rounded-full shadow-sm mb-4">
                            <span className="flex h-1.5 w-1.5 relative">
                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#E62D26] opacity-75"></span>
                                <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-[#E62D26]"></span>
                            </span>
                            <span className={`text-[10px] font-medium text-slate-600 dark:text-slate-300 ${bengaliClass}`}>
                                {language === "bn" ? "প্রিমিয়াম ওয়েবসাইট" : "Premium Websites"}
                            </span>
                        </div>

                        {/* Title */}
                        <h1 className={`text-2xl md:text-3xl lg:text-4xl font-bold text-slate-800 dark:text-white mb-3 outfit leading-tight ${bengaliClass}`}>
                            {language === "bn" ? "ওয়েবসাইট " : "Website "}
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#E62D26] to-[#F79952]">
                                {language === "bn" ? "মার্কেটপ্লেস" : "Marketplace"}
                            </span>
                        </h1>

                        {/* Description */}
                        <p className={`text-slate-500 dark:text-slate-400 text-xs lg:text-sm max-w-xl mx-auto leading-relaxed mb-8 ${bengaliClass}`}>
                            {language === "bn"
                                ? "রেডি-টু-ডিপ্লয় ওয়েবসাইট কিনুন। স্টার্টআপ থেকে এন্টারপ্রাইজ পর্যন্ত সকলের জন্য।"
                                : "Buy ready-to-deploy websites. From startups to enterprises, get online in minutes."}
                        </p>

                        {/* Search Bar */}
                        <div className="max-w-xl mx-auto">
                            <div className="relative">
                                <LuSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
                                <input
                                    type="text"
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    placeholder={language === "bn" ? "ওয়েবসাইট খুঁজুন..." : "Search websites..."}
                                    className={`w-full pl-12 pr-4 py-3.5 bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-xl focus:ring-2 focus:ring-[#E62D26]/50 focus:border-[#E62D26] outline-none transition-all text-slate-800 dark:text-white text-sm placeholder-slate-400 ${bengaliClass}`}
                                />
                                {searchQuery && (
                                    <button
                                        onClick={() => setSearchQuery("")}
                                        className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                                    >
                                        <LuX size={18} />
                                    </button>
                                )}
                            </div>
                        </div>
                    </motion.div>
                </div>
            </section>

            {/* Filters Row */}
            <section className="py-6 bg-white dark:bg-[#0a0a0a] border-b border-slate-100 dark:border-white/5">
                <div className="container mx-auto px-4 lg:px-16">
                    <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
                        {/* Left - Type Filters */}
                        <div className="flex flex-wrap items-center gap-2">
                            <span className={`text-xs font-semibold text-slate-500 mr-2 ${bengaliClass}`}>
                                {language === "bn" ? "টাইপ:" : "Type:"}
                            </span>
                            {websiteTypes.map((type) => (
                                <button
                                    key={type.name}
                                    onClick={() => setSelectedType(type.name)}
                                    className={`px-4 py-2 rounded-lg text-xs font-semibold transition-all ${selectedType === type.name
                                            ? "bg-[#E62D26] text-white shadow-md shadow-[#E62D26]/20"
                                            : "bg-slate-100 dark:bg-white/5 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-white/10"
                                        } ${bengaliClass}`}
                                >
                                    {type.label}
                                </button>
                            ))}
                        </div>

                        {/* Right - Sort, View & Clear */}
                        <div className="flex items-center gap-3">
                            {/* Clear Filters */}
                            {hasActiveFilters && (
                                <button
                                    onClick={clearAllFilters}
                                    className={`flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-red-600 bg-red-50 dark:bg-red-500/10 rounded-lg hover:bg-red-100 transition-all ${bengaliClass}`}
                                >
                                    <LuX size={14} />
                                    {language === "bn" ? "ক্লিয়ার" : "Clear"}
                                </button>
                            )}

                            {/* Sort */}
                            <div className="relative">
                                <select
                                    value={sortBy}
                                    onChange={(e) => setSortBy(e.target.value)}
                                    className={`appearance-none pl-8 pr-8 py-2 bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-lg text-xs font-semibold text-slate-700 dark:text-slate-300 focus:outline-none focus:border-[#E62D26] cursor-pointer ${bengaliClass}`}
                                >
                                    <option value="default">{language === 'bn' ? 'সর্ট করুন' : 'Sort By'}</option>
                                    <option value="rating">{language === 'bn' ? 'টপ রেটেড' : 'Top Rated'}</option>
                                    <option value="price-low">{language === 'bn' ? 'কম দাম' : 'Price: Low'}</option>
                                    <option value="price-high">{language === 'bn' ? 'বেশি দাম' : 'Price: High'}</option>
                                </select>
                                <LuArrowUpDown className="absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400" size={14} />
                            </div>

                            {/* View Toggle */}
                            <div className="flex items-center gap-1 bg-slate-100 dark:bg-white/5 p-1 rounded-lg">
                                <button
                                    onClick={() => setViewMode("grid")}
                                    className={`p-2 rounded-md transition-all ${viewMode === "grid"
                                            ? "bg-white dark:bg-white/10 text-[#E62D26] shadow-sm"
                                            : "text-slate-500"
                                        }`}
                                >
                                    <LuGrid3X3 size={16} />
                                </button>
                                <button
                                    onClick={() => setViewMode("list")}
                                    className={`p-2 rounded-md transition-all ${viewMode === "list"
                                            ? "bg-white dark:bg-white/10 text-[#E62D26] shadow-sm"
                                            : "text-slate-500"
                                        }`}
                                >
                                    <LuLayoutGrid size={16} />
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Category Pills */}
                    {categories.length > 0 && (
                        <div className="flex flex-wrap items-center gap-2 mt-4 pt-4 border-t border-slate-100 dark:border-white/5">
                            <span className={`text-xs font-semibold text-slate-500 mr-2 ${bengaliClass}`}>
                                {language === "bn" ? "ক্যাটাগরি:" : "Category:"}
                            </span>
                            <button
                                onClick={() => dispatch(setSelectedCategories([]))}
                                className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all ${selectedCategories.length === 0
                                        ? "bg-[#E62D26] text-white"
                                        : "bg-slate-100 dark:bg-white/5 text-slate-600 dark:text-slate-300 hover:bg-slate-200"
                                    } ${bengaliClass}`}
                            >
                                {language === "bn" ? "সব" : "All"}
                            </button>
                            {categories
                                .filter(cat => cat.name.toLowerCase() !== 'all')
                                .map((cat) => (
                                    <button
                                        key={cat._id}
                                        onClick={() => handleCategoryChange(cat.name)}
                                        className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all ${selectedCategories.includes(cat.name)
                                                ? "bg-[#E62D26] text-white"
                                                : "bg-slate-100 dark:bg-white/5 text-slate-600 dark:text-slate-300 hover:bg-slate-200"
                                            } ${bengaliClass}`}
                                    >
                                        {cat.name}
                                    </button>
                                ))}
                        </div>
                    )}

                    {/* Results Count */}
                    <div className="mt-4 flex items-center gap-2">
                        <LuSparkles className="text-[#E62D26]" size={16} />
                        <span className={`text-sm text-slate-600 dark:text-slate-400 ${bengaliClass}`}>
                            <span className="font-bold text-slate-800 dark:text-white">{sortedWebsites.length}</span>
                            {language === "bn" ? " টি ওয়েবসাইট পাওয়া গেছে" : " websites found"}
                        </span>
                    </div>
                </div>
            </section>

            {/* Websites Grid */}
            <section className="py-12 lg:py-16 bg-slate-50 dark:bg-[#0d0d0d]">
                <div className="container mx-auto px-4 lg:px-16">
                    {loading ? (
                        <div className={`grid gap-6 ${viewMode === "grid" ? "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3" : "grid-cols-1"}`}>
                            {[1, 2, 3, 4, 5, 6].map((i) => (
                                <div key={i} className="bg-white dark:bg-white/5 rounded-2xl border border-slate-100 dark:border-white/10 overflow-hidden animate-pulse">
                                    <div className="aspect-[16/10] bg-slate-100 dark:bg-white/5"></div>
                                    <div className="p-5 space-y-3">
                                        <div className="h-5 bg-slate-100 dark:bg-white/5 rounded w-3/4"></div>
                                        <div className="h-4 bg-slate-100 dark:bg-white/5 rounded w-1/2"></div>
                                        <div className="h-8 bg-slate-100 dark:bg-white/5 rounded w-1/3"></div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : sortedWebsites.length > 0 ? (
                        <div className={`grid gap-6 ${viewMode === "grid" ? "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3" : "grid-cols-1"}`}>
                            {sortedWebsites.map((item, idx) => (
                                <WebsiteCard key={item._id} item={item} viewMode={viewMode} />
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-20">
                            <div className="w-20 h-20 bg-slate-100 dark:bg-white/5 rounded-full flex items-center justify-center mx-auto mb-4">
                                <LuGlobe className="text-slate-400" size={32} />
                            </div>
                            <h3 className={`text-lg font-bold text-slate-800 dark:text-white mb-2 ${bengaliClass}`}>
                                {language === "bn" ? "কোন ওয়েবসাইট পাওয়া যায়নি" : "No websites found"}
                            </h3>
                            <p className={`text-sm text-slate-500 ${bengaliClass}`}>
                                {language === "bn" ? "অন্য কিওয়ার্ড দিয়ে খুঁজুন" : "Try a different search keyword"}
                            </p>
                        </div>
                    )}
                </div>
            </section>

            {/* CTA Section */}
            <section className="py-12 lg:py-16 bg-gradient-to-br from-[#E62D26] to-[#F79952]">
                <div className="container mx-auto px-4 lg:px-16">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="text-center max-w-xl mx-auto"
                    >
                        <div className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-white/20 backdrop-blur-sm rounded-full mb-4">
                            <LuSparkles className="text-white text-xs" />
                            <span className={`text-[10px] font-medium text-white ${bengaliClass}`}>
                                {language === "bn" ? "কাস্টম ওয়েবসাইট" : "Custom Website"}
                            </span>
                        </div>

                        <h2 className={`text-xl lg:text-2xl font-bold text-white mb-3 outfit ${bengaliClass}`}>
                            {language === "bn" ? "আপনার নিজস্ব ওয়েবসাইট দরকার?" : "Need a Custom Website?"}
                        </h2>
                        <p className={`text-white/80 text-xs mb-6 ${bengaliClass}`}>
                            {language === "bn"
                                ? "আমাদের এক্সপার্ট ডেভেলপাররা আপনার জন্য কাস্টম ওয়েবসাইট তৈরি করতে পারে।"
                                : "Our expert developers can create a custom website tailored to your needs."}
                        </p>

                        <Link
                            href="/contact"
                            className={`inline-flex items-center gap-2 px-6 py-2.5 bg-white text-[#E62D26] text-xs font-bold rounded-lg hover:bg-white/90 transition-all shadow-md ${bengaliClass}`}
                        >
                            {language === "bn" ? "যোগাযোগ করুন" : "Contact Us"}
                            <LuArrowRight size={14} />
                        </Link>
                    </motion.div>
                </div>
            </section>
        </div>
    );
};

const WebsitePage = () => {
    return (
        <Suspense fallback={<LoadingFallback />}>
            <WebsiteContent />
        </Suspense>
    );
};

export default WebsitePage;
