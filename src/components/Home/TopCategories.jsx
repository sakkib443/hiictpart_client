"use client";

import React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import {
    LuBrain,
    LuPalette,
    LuCode,
    LuMegaphone,
    LuFilm,
    LuServer,
    LuUsers,
    LuGraduationCap,
    LuChevronRight
} from "react-icons/lu";
import { useLanguage } from "@/context/LanguageContext";

const TopCategories = () => {
    const { language, t } = useLanguage();
    const bengaliClass = language === "bn" ? "hind-siliguri" : "";

    const categories = [
        {
            icon: LuBrain,
            title: language === 'bn' ? t("home_sections.aiAutomation") : 'AI and Automation',
            subtitle: language === 'bn' ? t("home_sections.shapeFuture") : 'Shape the Future',
            slug: 'ai-automation',
            iconBg: 'bg-gradient-to-br from-red-400 to-cyan-500',
            borderColor: 'border-l-red-400',
        },
        {
            icon: LuPalette,
            title: language === 'bn' ? t("home_sections.artDesign") : 'Art & Design',
            subtitle: language === 'bn' ? t("home_sections.creativePlatform") : 'Platform for Creativity',
            slug: 'art-design',
            iconBg: 'bg-gradient-to-br from-orange-400 to-amber-500',
            borderColor: 'border-l-orange-400',
        },
        {
            icon: LuCode,
            title: language === 'bn' ? t("home_sections.programming") : 'Programming',
            subtitle: language === 'bn' ? t("home_sections.codeConfidence") : 'Code with Confidence',
            slug: 'programming',
            iconBg: 'bg-gradient-to-br from-cyan-400 to-blue-500',
            borderColor: 'border-l-cyan-400',
        },
        {
            icon: LuMegaphone,
            title: language === 'bn' ? t("home_sections.digitalMarketing") : 'Digital Marketing',
            subtitle: language === 'bn' ? t("home_sections.artInfluence") : 'The Art of Influence',
            slug: 'digital-marketing',
            iconBg: 'bg-gradient-to-br from-orange-400 to-red-500',
            borderColor: 'border-l-orange-400',
        },
        {
            icon: LuFilm,
            title: language === 'bn' ? t("home_sections.mediaFilm") : 'Media & Film',
            subtitle: language === 'bn' ? t("home_sections.storyMotion") : 'Storytelling in Motion',
            slug: 'media-film',
            iconBg: 'bg-gradient-to-br from-red-400 to-emerald-500',
            borderColor: 'border-l-red-400',
        },
        {
            icon: LuServer,
            title: language === 'bn' ? t("home_sections.networkingServer") : 'Networking & Server',
            subtitle: language === 'bn' ? t("home_sections.protectorIT") : 'Protector of IT Industry',
            slug: 'networking-server',
            iconBg: 'bg-gradient-to-br from-amber-400 to-orange-500',
            borderColor: 'border-l-amber-400',
        },
        {
            icon: LuUsers,
            title: language === 'bn' ? t("home_sections.management") : 'Management',
            subtitle: language === 'bn' ? t("home_sections.leadStrategy") : 'Leading with Strategy',
            slug: 'management',
            iconBg: 'bg-gradient-to-br from-blue-400 to-indigo-500',
            borderColor: 'border-l-blue-400',
        },
        {
            icon: LuGraduationCap,
            title: language === 'bn' ? t("home_sections.diploma") : 'Diploma',
            subtitle: language === 'bn' ? t("home_sections.skillUpStandOut") : 'Skill Up, Stand Out',
            slug: 'diploma',
            iconBg: 'bg-gradient-to-br from-pink-400 to-purple-500',
            borderColor: 'border-l-pink-400',
        },
    ];

    return (
        <section className="py-12 lg:py-16 bg-[#f8f9fa] dark:bg-[#0a0a0a]">
            <div className="container mx-auto px-4 lg:px-16">
                {/* Categories Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
                    {categories.map((category, index) => (
                        <motion.div
                            key={category.slug}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.4, delay: index * 0.05 }}
                        >
                            <div className={`bg-white dark:bg-gray-900 rounded-xl p-5 shadow-sm hover:shadow-md transition-all duration-300 h-full flex flex-col`}>
                                {/* Top Section */}
                                <div className="flex items-start justify-between mb-4">
                                    <div className="flex items-center gap-4">
                                        {/* Icon */}
                                        <div className={`w-12 h-12 rounded-xl ${category.iconBg} flex items-center justify-center shadow-lg`}>
                                            <category.icon className="w-6 h-6 text-white" />
                                        </div>

                                        {/* Text */}
                                        <div>
                                            <h3 className={`font-semibold text-gray-800 dark:text-white text-base ${bengaliClass}`}>
                                                {category.title}
                                            </h3>
                                            <p className={`text-sm text-gray-500 dark:text-gray-400 ${bengaliClass}`}>
                                                {category.subtitle}
                                            </p>
                                        </div>
                                    </div>

                                    {/* Arrow */}
                                    <div className="text-gray-300 dark:text-gray-600">
                                        <LuChevronRight className="w-5 h-5" />
                                    </div>
                                </div>

                                {/* Bottom Links */}
                                <div className="flex items-center justify-between mt-auto pt-3 border-t border-gray-100 dark:border-gray-800">
                                    <Link
                                        href={`/courses?category=${category.slug}`}
                                        className={`text-sm text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 transition-colors ${bengaliClass}`}
                                    >
                                        {language === 'bn' ? t("home_sections.exploreCourses") : 'Explore courses'}
                                    </Link>
                                    <Link
                                        href={`/courses?category=${category.slug}`}
                                        className={`text-sm font-medium text-orange-500 hover:text-orange-600 transition-colors ${bengaliClass}`}
                                    >
                                        {language === 'bn' ? t("home_sections.viewAll") : 'View All'}
                                    </Link>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default TopCategories;
