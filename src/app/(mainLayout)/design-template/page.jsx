"use client";
import { API_URL, API_BASE_URL } from '@/config/api';


import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import {
    LuPalette,
    LuSearch,
    LuFilter,
    LuGrid3X3,
    LuLayoutGrid,
    LuStar,
    LuEye,
    LuDownload,
    LuArrowRight,
    LuSparkles,
    LuHeart
} from "react-icons/lu";
import { useLanguage } from "@/context/LanguageContext";



const DesignTemplatePage = () => {
    const { language } = useLanguage();
    const bengaliClass = language === "bn" ? "hind-siliguri" : "";
    const [isVisible, setIsVisible] = useState(false);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState("");
    const [selectedCategory, setSelectedCategory] = useState("all");
    const [viewMode, setViewMode] = useState("grid");

    // Sample templates data (will be replaced with API data)
    const [templates, setTemplates] = useState([
        {
            _id: "1",
            title: "Business Pro Template",
            category: "Business",
            image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=600",
            price: 2500,
            rating: 4.8,
            downloads: 1250,
            views: 8500
        },
        {
            _id: "2",
            title: "Creative Portfolio",
            category: "Portfolio",
            image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=600",
            price: 1800,
            rating: 4.9,
            downloads: 980,
            views: 6200
        },
        {
            _id: "3",
            title: "E-commerce starter",
            category: "E-commerce",
            image: "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=600",
            price: 3500,
            rating: 4.7,
            downloads: 2100,
            views: 12000
        },
        {
            _id: "4",
            title: "Blog starter kit",
            category: "Blog",
            image: "https://images.unsplash.com/photo-1499750310107-5fef28a66643?w=600",
            price: 1200,
            rating: 4.6,
            downloads: 1800,
            views: 9500
        },
        {
            _id: "5",
            title: "Agency pro",
            category: "Agency",
            image: "https://images.unsplash.com/photo-1552664730-d307ca884978?w=600",
            price: 2800,
            rating: 4.9,
            downloads: 1500,
            views: 7800
        },
        {
            _id: "6",
            title: "Restaurant template",
            category: "Restaurant",
            image: "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=600",
            price: 2200,
            rating: 4.5,
            downloads: 890,
            views: 5400
        },
    ]);

    const categories = [
        { value: "all", label: language === "bn" ? "সব" : "All" },
        { value: "business", label: language === "bn" ? "বিজনেস" : "Business" },
        { value: "portfolio", label: language === "bn" ? "পোর্টফোলিও" : "Portfolio" },
        { value: "ecommerce", label: language === "bn" ? "ই-কমার্স" : "E-commerce" },
        { value: "blog", label: language === "bn" ? "ব্লগ" : "Blog" },
        { value: "agency", label: language === "bn" ? "এজেন্সি" : "Agency" },
    ];

    useEffect(() => {
        const timer = setTimeout(() => setIsVisible(true), 100);
        setLoading(false);
        return () => clearTimeout(timer);
    }, []);

    const filteredTemplates = templates.filter(template => {
        const matchesSearch = template.title.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesCategory = selectedCategory === "all" || template.category.toLowerCase() === selectedCategory;
        return matchesSearch && matchesCategory;
    });

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
                                {language === "bn" ? "ডিজাইন টেমপ্লেট" : "Design Templates"}
                            </span>
                        </div>

                        {/* Title */}
                        <h1 className={`text-2xl md:text-3xl lg:text-4xl font-bold text-slate-800 dark:text-white mb-3 outfit leading-tight ${bengaliClass}`}>
                            {language === "bn" ? "প্রিমিয়াম " : "Premium "}
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#E62D26] to-[#F79952]">
                                {language === "bn" ? "ডিজাইন টেমপ্লেট" : "Design Templates"}
                            </span>
                        </h1>

                        {/* Description */}
                        <p className={`text-slate-500 dark:text-slate-400 text-xs lg:text-sm max-w-xl mx-auto leading-relaxed mb-8 ${bengaliClass}`}>
                            {language === "bn"
                                ? "আপনার প্রজেক্টের জন্য পেশাদার ডিজাইন টেমপ্লেট খুঁজুন। সহজেই কাস্টমাইজ করুন এবং দ্রুত শুরু করুন।"
                                : "Find professional design templates for your projects. Easily customize and get started quickly."}
                        </p>

                        {/* Search Bar */}
                        <div className="max-w-xl mx-auto">
                            <div className="relative">
                                <LuSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
                                <input
                                    type="text"
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    placeholder={language === "bn" ? "টেমপ্লেট খুঁজুন..." : "Search templates..."}
                                    className={`w-full pl-12 pr-4 py-3.5 bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-xl focus:ring-2 focus:ring-[#E62D26]/50 focus:border-[#E62D26] outline-none transition-all text-slate-800 dark:text-white text-sm placeholder-slate-400 ${bengaliClass}`}
                                />
                            </div>
                        </div>
                    </motion.div>
                </div>
            </section>

            {/* Filters & View Toggle */}
            <section className="py-6 bg-white dark:bg-[#0a0a0a] border-b border-slate-100 dark:border-white/5">
                <div className="container mx-auto px-4 lg:px-16">
                    <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                        {/* Category Filters */}
                        <div className="flex flex-wrap items-center gap-2">
                            {categories.map((cat) => (
                                <button
                                    key={cat.value}
                                    onClick={() => setSelectedCategory(cat.value)}
                                    className={`px-4 py-2 rounded-lg text-xs font-semibold transition-all ${selectedCategory === cat.value
                                            ? "bg-[#E62D26] text-white shadow-md shadow-[#E62D26]/20"
                                            : "bg-slate-100 dark:bg-white/5 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-white/10"
                                        } ${bengaliClass}`}
                                >
                                    {cat.label}
                                </button>
                            ))}
                        </div>

                        {/* View Toggle */}
                        <div className="flex items-center gap-2 bg-slate-100 dark:bg-white/5 p-1 rounded-lg">
                            <button
                                onClick={() => setViewMode("grid")}
                                className={`p-2 rounded-md transition-all ${viewMode === "grid"
                                        ? "bg-white dark:bg-white/10 text-[#E62D26] shadow-sm"
                                        : "text-slate-500"
                                    }`}
                            >
                                <LuGrid3X3 size={18} />
                            </button>
                            <button
                                onClick={() => setViewMode("list")}
                                className={`p-2 rounded-md transition-all ${viewMode === "list"
                                        ? "bg-white dark:bg-white/10 text-[#E62D26] shadow-sm"
                                        : "text-slate-500"
                                    }`}
                            >
                                <LuLayoutGrid size={18} />
                            </button>
                        </div>
                    </div>
                </div>
            </section>

            {/* Templates Grid */}
            <section className="py-12 lg:py-16 bg-slate-50 dark:bg-[#0d0d0d]">
                <div className="container mx-auto px-4 lg:px-16">
                    {loading ? (
                        <div className="flex items-center justify-center py-20">
                            <div className="w-10 h-10 border-3 border-[#E62D26]/30 border-t-[#E62D26] rounded-full animate-spin"></div>
                        </div>
                    ) : filteredTemplates.length === 0 ? (
                        <div className="text-center py-20">
                            <div className="w-20 h-20 bg-slate-100 dark:bg-white/5 rounded-full flex items-center justify-center mx-auto mb-4">
                                <LuPalette className="text-slate-400" size={32} />
                            </div>
                            <h3 className={`text-lg font-bold text-slate-800 dark:text-white mb-2 ${bengaliClass}`}>
                                {language === "bn" ? "কোন টেমপ্লেট পাওয়া যায়নি" : "No templates found"}
                            </h3>
                            <p className={`text-sm text-slate-500 ${bengaliClass}`}>
                                {language === "bn" ? "অন্য কিওয়ার্ড দিয়ে খুঁজুন" : "Try a different search keyword"}
                            </p>
                        </div>
                    ) : (
                        <div className={`grid gap-6 ${viewMode === "grid" ? "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3" : "grid-cols-1"}`}>
                            {filteredTemplates.map((template, idx) => (
                                <motion.div
                                    key={template._id}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: isVisible ? 1 : 0, y: isVisible ? 0 : 20 }}
                                    transition={{ duration: 0.5, delay: idx * 0.1 }}
                                    className={`group bg-white dark:bg-white/5 rounded-2xl border border-slate-100 dark:border-white/10 overflow-hidden hover:shadow-xl hover:border-[#E62D26]/30 transition-all duration-300 ${viewMode === "list" ? "flex" : ""
                                        }`}
                                >
                                    {/* Image */}
                                    <div className={`relative overflow-hidden ${viewMode === "list" ? "w-64 flex-shrink-0" : "aspect-[16/10]"}`}>
                                        <Image
                                            src={template.image}
                                            alt={template.title}
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
                                                {template.category}
                                            </span>
                                        </div>
                                    </div>

                                    {/* Content */}
                                    <div className={`p-5 ${viewMode === "list" ? "flex-1 flex flex-col justify-between" : ""}`}>
                                        <div>
                                            <h3 className={`text-base font-bold text-slate-800 dark:text-white mb-2 group-hover:text-[#E62D26] transition-colors ${bengaliClass}`}>
                                                {template.title}
                                            </h3>

                                            {/* Stats */}
                                            <div className="flex items-center gap-4 text-slate-500 mb-3">
                                                <div className="flex items-center gap-1">
                                                    <LuStar className="text-amber-400" size={14} />
                                                    <span className="text-xs font-semibold">{template.rating}</span>
                                                </div>
                                                <div className="flex items-center gap-1">
                                                    <LuDownload size={14} />
                                                    <span className="text-xs">{template.downloads}</span>
                                                </div>
                                                <div className="flex items-center gap-1">
                                                    <LuEye size={14} />
                                                    <span className="text-xs">{template.views}</span>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Price & Action */}
                                        <div className="flex items-center justify-between pt-3 border-t border-slate-100 dark:border-white/5">
                                            <div>
                                                <span className="text-lg font-bold text-[#E62D26]">৳{template.price}</span>
                                            </div>
                                            <Link
                                                href={`/design-template/${template._id}`}
                                                className="flex items-center gap-1.5 px-4 py-2 bg-slate-100 dark:bg-white/5 hover:bg-[#E62D26] text-slate-700 dark:text-slate-300 hover:text-white rounded-lg text-xs font-semibold transition-all group/btn"
                                            >
                                                <span>{language === "bn" ? "দেখুন" : "View"}</span>
                                                <LuArrowRight size={14} className="group-hover/btn:translate-x-0.5 transition-transform" />
                                            </Link>
                                        </div>
                                    </div>
                                </motion.div>
                            ))}
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
                                {language === "bn" ? "কাস্টম ডিজাইন" : "Custom Design"}
                            </span>
                        </div>

                        <h2 className={`text-xl lg:text-2xl font-bold text-white mb-3 outfit ${bengaliClass}`}>
                            {language === "bn" ? "আপনার নিজস্ব ডিজাইন দরকার?" : "Need a Custom Design?"}
                        </h2>
                        <p className={`text-white/80 text-xs mb-6 ${bengaliClass}`}>
                            {language === "bn"
                                ? "আমাদের এক্সপার্ট ডিজাইনাররা আপনার জন্য কাস্টম ডিজাইন তৈরি করতে পারে।"
                                : "Our expert designers can create a custom design tailored to your needs."}
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

export default DesignTemplatePage;

