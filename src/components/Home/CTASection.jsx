"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { useLanguage } from "@/context/LanguageContext";

const CTASection = () => {
    const { language, t } = useLanguage();
    const bengaliClass = language === "bn" ? "hind-siliguri" : "";

    return (
        <section className="py-12 lg:py-16 bg-white dark:bg-[#0a0a0a]">
            <div className="container mx-auto px-4 lg:px-16">
                <div className="grid md:grid-cols-2 gap-8 lg:gap-10">
                    {/* Become An Instructor Card */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.5 }}
                        className="bg-[#F9F7F3] dark:bg-gray-900/50 rounded-3xl p-8 lg:p-12 flex flex-col md:flex-row items-center gap-8 overflow-hidden relative border border-amber-100/50 dark:border-amber-900/20 shadow-sm"
                    >
                        {/* Text Content */}
                        <div className="flex-1 z-10 text-center md:text-left">
                            <h3 className={`text-2xl lg:text-3xl font-bold text-gray-900 dark:text-white mb-4 ${bengaliClass}`}>
                                {language === 'bn' ? t("home_sections.becomeInstructor") : 'Become An Instructor'}
                            </h3>
                            <p className={`text-gray-600 dark:text-gray-400 text-sm lg:text-base mb-8 leading-relaxed ${bengaliClass}`}>
                                {language === 'bn'
                                    ? t("whatWeProvide.features.jobPlacementDesc")
                                    : 'Top instructors from around the world teach millions of students on HiictPark.'
                                }
                            </p>
                            <Link
                                href="/become-instructor"
                                className={`inline-flex items-center px-8 py-4 bg-[#E62D26] hover:bg-[#c41e18] text-white font-bold rounded-xl transition-all shadow-lg shadow-red-200 dark:shadow-none hover:-translate-y-1 ${bengaliClass}`}
                            >
                                {language === 'bn' ? t("home_sections.startTeaching") : 'Start teaching today'}
                            </Link>
                        </div>

                        {/* Instructor Images */}
                        <div className="relative w-56 h-48 lg:w-64 lg:h-56 flex-shrink-0 mt-6 md:mt-0">
                            {/* Person 1 - Left */}
                            <div className="absolute left-0 bottom-0 w-28 lg:w-32 h-36 lg:h-44 z-10">
                                <Image
                                    src="https://images.unsplash.com/photo-1535930749574-1399327ce78f?w=300"
                                    alt="Instructor"
                                    fill
                                    className="object-cover object-top rounded-t-3xl grayscale-[20%] hover:grayscale-0 transition-all"
                                />
                            </div>
                            {/* Person 2 - Center */}
                            <div className="absolute left-1/2 -translate-x-1/2 bottom-0 w-32 lg:w-36 h-40 lg:h-52 z-20 shadow-[-20px_0_40px_rgba(0,0,0,0.1)]">
                                <Image
                                    src="https://i.ibb.co.com/DH9dMRWX/Shaikh-Nazmul-Hossain-Picture.jpg"
                                    alt="Shaikh Nazmul Hossain"
                                    fill
                                    className="object-cover object-top rounded-t-3xl outline outline-8 outline-[#F9F7F3] dark:outline-gray-900"
                                />
                            </div>
                            {/* Person 3 - Right */}
                            <div className="absolute right-0 bottom-0 w-28 lg:w-32 h-36 lg:h-44 z-10">
                                <Image
                                    src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=300"
                                    alt="Instructor"
                                    fill
                                    className="object-cover object-top rounded-t-3xl grayscale-[20%] hover:grayscale-0 transition-all"
                                />
                            </div>
                        </div>
                    </motion.div>

                    {/* Transform Access Card */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.5, delay: 0.1 }}
                        className="bg-[#F1F5F9] dark:bg-slate-900/50 rounded-3xl p-8 lg:p-12 flex flex-col md:flex-row items-center gap-8 overflow-hidden relative border border-slate-200 dark:border-slate-800 shadow-sm"
                    >
                        {/* Text Content */}
                        <div className="flex-1 z-10 text-center md:text-left">
                            <h3 className={`text-2xl lg:text-3xl font-bold text-gray-900 dark:text-white mb-4 ${bengaliClass}`}>
                                {language === 'bn' ? t("home_sections.transformEducation") : 'Transform Access To Education'}
                            </h3>
                            <p className={`text-gray-600 dark:text-gray-400 text-sm lg:text-base mb-8 leading-relaxed ${bengaliClass}`}>
                                {language === 'bn'
                                    ? t("contactPage.socialDescription")
                                    : 'Create an account to receive our newsletter, course recommendations and promotions.'
                                }
                            </p>
                            <Link
                                href="/register"
                                className={`inline-flex items-center px-8 py-4 bg-[#E62D26] hover:bg-[#c41e18] text-white font-bold rounded-xl transition-all shadow-lg shadow-red-200 dark:shadow-none hover:-translate-y-1 ${bengaliClass}`}
                            >
                                {language === 'bn' ? t("home_sections.registerFree") : 'Register for free'}
                            </Link>
                        </div>

                        {/* Course Cards Preview */}
                        <div className="relative w-56 h-48 lg:w-64 lg:h-56 flex-shrink-0 mt-8 md:mt-0">
                            {/* FREE Badge */}
                            <motion.div
                                animate={{ scale: [1, 1.1, 1] }}
                                transition={{ repeat: Infinity, duration: 2 }}
                                className="absolute -top-4 -right-2 z-30 bg-[#52B788] text-white text-xs font-bold px-4 py-3 rounded-full shadow-xl flex flex-col items-center justify-center border-4 border-white dark:border-slate-900"
                            >
                                <span className="block text-[10px] uppercase opacity-80">for</span>
                                <span className="block text-sm">FREE</span>
                            </motion.div>

                            {/* Card 1 - Browser Window */}
                            <div className="absolute left-0 top-2 w-40 lg:w-48 bg-white dark:bg-slate-800 rounded-xl shadow-2xl p-3 z-10 border border-slate-100 dark:border-slate-700">
                                <div className="flex gap-1.5 mb-3">
                                    <div className="w-2.5 h-2.5 rounded-full bg-red-400"></div>
                                    <div className="w-2.5 h-2.5 rounded-full bg-yellow-400"></div>
                                    <div className="w-2.5 h-2.5 rounded-full bg-green-400"></div>
                                </div>
                                <div className="space-y-2">
                                    <div className="h-2.5 bg-slate-100 dark:bg-slate-700 rounded-full"></div>
                                    <div className="h-2.5 bg-blue-100 dark:bg-blue-900/50 rounded-full w-3/4"></div>
                                    <div className="grid grid-cols-2 gap-2 mt-3">
                                        <div className="h-10 bg-slate-50 dark:bg-slate-700/50 rounded-lg"></div>
                                        <div className="h-10 bg-slate-50 dark:bg-slate-700/50 rounded-lg"></div>
                                    </div>
                                    <div className="h-8 bg-blue-600/10 dark:bg-blue-600/20 rounded-lg mt-2"></div>
                                </div>
                            </div>

                            {/* Card 2 - Course Card Overlay */}
                            <div className="absolute right-0 bottom-0 w-36 lg:w-44 bg-white dark:bg-slate-800 rounded-2xl shadow-2xl overflow-hidden z-20 border border-slate-100 dark:border-slate-700 transform rotate-3 hover:rotate-0 transition-transform duration-500">
                                <div className="h-20 bg-gradient-to-br from-blue-400 to-indigo-600 relative">
                                    <Image
                                        src="https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=300"
                                        alt="Course"
                                        fill
                                        className="object-cover opacity-60 mix-blend-overlay"
                                    />
                                    <div className="absolute inset-0 flex items-center justify-center">
                                        <div className="w-8 h-8 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center">
                                            <div className="w-0 h-0 border-t-[5px] border-t-transparent border-l-[8px] border-l-white border-b-[5px] border-b-transparent ml-1"></div>
                                        </div>
                                    </div>
                                </div>
                                <div className="p-3">
                                    <div className="h-2.5 bg-slate-100 dark:bg-slate-700 rounded-full mb-2"></div>
                                    <div className="h-2.5 bg-slate-50 dark:bg-slate-800 rounded-full w-2/3"></div>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                </div>
            </div>
        </section>
    );
};

export default CTASection;
