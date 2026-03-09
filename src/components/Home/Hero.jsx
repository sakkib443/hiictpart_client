"use client";
import { API_URL, API_BASE_URL } from '@/config/api';


import Link from "next/link";
import React, { useEffect, useState } from "react";
import { useLanguage } from "@/context/LanguageContext";
import { motion } from "framer-motion";
import { LuBrain, LuAward, LuTarget, LuUsers } from "react-icons/lu";



const Hero = () => {
    const { language, t } = useLanguage();
    const [heroData, setHeroData] = useState(null);

    const bengaliClass = language === "bn" ? "hind-siliguri" : "";

    const features = [
        {
            icon: LuBrain,
            title: language === 'bn' ? t("home_sections.learnEssential") : 'Learn The',
            subtitle: language === 'bn' ? t("home_sections.essentialSkills") : 'Essential Skills',
        },
        {
            icon: LuAward,
            title: language === 'bn' ? t("home_sections.earnCertificates") : 'Earn Certificates',
            subtitle: language === 'bn' ? t("home_sections.andDegrees") : 'And Degrees',
        },
        {
            icon: LuTarget,
            title: language === 'bn' ? t("home_sections.getReadyCareer") : 'Get Ready for The',
            subtitle: language === 'bn' ? t("home_sections.nextCareer") : 'Next Career',
        },
        {
            icon: LuUsers,
            title: language === 'bn' ? t("home_sections.masterAreas") : 'Master at',
            subtitle: language === 'bn' ? t("home_sections.differentAreas") : 'Different Areas',
        },
    ];

    // Fetch hero design from API
    useEffect(() => {
        const fetchHeroDesign = async () => {
            try {
                const res = await fetch(`${API_URL}/design/hero`);
                const data = await res.json();
                if (data.success && data.data?.heroContent) {
                    setHeroData(data.data.heroContent);
                }
            } catch (error) {
                console.error('Error fetching hero design:', error);
            }
        };
        fetchHeroDesign();
    }, [language]);





    const getBadgeText = () => {
        if (heroData?.badge?.text) {
            return language === 'bn' ? heroData.badge.textBn : heroData.badge.text;
        }
        return language === 'bn' ? t("hero.badge") : 'START TO SUCCESS';
    };

    const getDescriptionText = () => {
        if (heroData?.description?.text) {
            return language === 'bn' ? heroData.description.textBn : heroData.description.text;
        }
        return language === 'bn'
            ? t("hero.description")
            : 'Take your learning organisation to the next level.';
    };



    return (
        <section className="relative min-h-[85vh] overflow-hidden bg-[#fafafa] dark:bg-[#0a0a0a]">
            {/* Premium Background Elements */}
            <div className="absolute inset-0 pointer-events-none overflow-hidden">
                {/* Modern Mesh Gradient */}
                <div className="absolute -top-[10%] -left-[10%] w-[40%] h-[40%] bg-primary/5 rounded-full blur-[120px]" />
                <div className="absolute top-[20%] -right-[5%] w-[30%] h-[30%] bg-secondary/10 rounded-full blur-[100px]" />

                {/* Subtle Grid Pattern */}
                <div className="absolute inset-0 opacity-[0.03] dark:opacity-[0.05]"
                    style={{ backgroundImage: 'radial-gradient(#E62D26 0.5px, transparent 0.5px)', backgroundSize: '24px 24px' }} />



                {/* Soft Pink/Orange Gradient - Top Right */}
                <div className="absolute -top-32 -right-32 w-[700px] h-[700px] bg-gradient-to-br from-primary/5 via-secondary/5 to-transparent rounded-full blur-3xl opacity-60" />

                {/* Animated Circles */}
                <motion.div
                    className="absolute bottom-20 right-10 w-16 h-16 bg-gradient-to-br from-secondary to-primary rounded-full opacity-20 blur-xl"
                    animate={{ scale: [1, 1.2, 1] }}
                    transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                />
            </div>

            <div className="container mx-auto px-4 lg:px-20 py-10 lg:py-20">
                <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-center">
                    {/* Left Content */}
                    <motion.div
                        initial="hidden"
                        animate="visible"
                        variants={{
                            hidden: { opacity: 0 },
                            visible: {
                                opacity: 1,
                                transition: {
                                    staggerChildren: 0.2
                                }
                            }
                        }}
                        className="relative z-10"
                    >
                        {/* Status Badge */}
                        <motion.div
                            variants={{
                                hidden: { opacity: 0, y: 20 },
                                visible: { opacity: 1, y: 0 }
                            }}
                            className="mb-4"
                        >
                            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/50 dark:bg-white/5 border border-red-300  backdrop-blur-sm shadow-sm">
                                <span className="flex h-2 w-2 rounded-full bg-primary animate-ping"></span>
                                <span className={`text-primary  text-[10px]  md:text-xs tracking-wider uppercase ${bengaliClass}`}>
                                    {getBadgeText()}
                                </span>
                            </div>
                        </motion.div>

                        {/* Main Title */}
                        <motion.div
                            variants={{
                                hidden: { opacity: 0, y: 30 },
                                visible: { opacity: 1, y: 0 }
                            }}
                            className="mb-6"
                        >
                            <h1 className={`font-extrabold leading-[1.1] tracking-tight ${language === 'bn' ? 'hind-siliguri text-4xl md:text-5xl lg:text-6xl' : 'text-4xl md:text-5xl lg:text-7xl'}`}>
                                <span className="text-gray-900 dark:text-white block mb-2 font-medium opacity-80 text-lg md:text-2xl lg:text-2xl">
                                    {language === 'bn' ? 'আপনার ভবিষ্যৎ গড়ুন' : 'Elevate Your Skills'}
                                </span>
                                <span className="">
                                    HI ICT PARK
                                </span>
                                <span className="text-primary block text-[9px] md:text-[10px] tracking-[1em] md:tracking-[1.5em] mt-2 font-bold opacity-30">
                                    TRUSTED LEARNING PARTNER
                                </span>
                            </h1>
                        </motion.div>

                        {/* Description */}
                        <motion.div
                            variants={{
                                hidden: { opacity: 0, y: 20 },
                                visible: { opacity: 1, y: 0 }
                            }}
                            className="mb-6"
                        >
                            <p className={`text-gray-600 dark:text-gray-400 text-base max-w-lg leading-relaxed border-l-4 border-primary/10 pl-5 ${bengaliClass}`}>
                                {getDescriptionText()}
                            </p>
                        </motion.div>

                        {/* CTA Actions */}
                        <motion.div
                            variants={{
                                hidden: { opacity: 0, y: 20 },
                                visible: { opacity: 1, y: 0 }
                            }}
                            className="flex flex-wrap gap-5 items-center"
                        >
                            <Link href="/courses">
                                <button className="btn-gradient cursor-pointer px-8 py-3 rounded-md text-white shadow-lg shadow-primary/20 hover:shadow-primary/40 transition-all transform hover:-translate-y-1 active:scale-95 flex items-center gap-3 group text-sm font-bold">
                                    {language === 'bn' ? 'আজই শুরু করুন' : 'Get Started Now'}
                                    <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                                    </svg>
                                </button>
                            </Link>

                            <Link href="/about">
                                <button className="px-6 py-3 rounded-md border border-primary/20 text-gray-700 dark:text-gray-300 cursor-pointer hover:bg-primary/5 transition-all flex items-center gap-2 text-sm font-bold">
                                    {language === 'bn' ? 'আমাদের সম্পর্কে' : 'Why Choose Us?'}
                                </button>
                            </Link>
                        </motion.div>

                        {/* Trust/Stats Row */}
                        <motion.div
                            variants={{
                                hidden: { opacity: 0 },
                                visible: { opacity: 1 }
                            }}
                            className="mt-10 pt-8 border-t border-gray-100 dark:border-gray-800 flex flex-wrap gap-8"
                        >
                            <div className="flex flex-col">
                                <span className="text-xl font-bold text-primary">50k+</span>
                                <span className="text-xs text-gray-500 dark:text-gray-500 uppercase tracking-wider font-semibold">Active Students</span>
                            </div>
                            <div className="h-10 w-[1px] bg-gray-100 dark:bg-gray-800 hidden md:block"></div>
                            <div className="flex flex-col">
                                <span className="text-xl font-bold text-primary">480+</span>
                                <span className="text-xs text-gray-500 dark:text-gray-500 uppercase tracking-wider font-semibold">Experts Mentors</span>
                            </div>
                            <div className="h-10 w-[1px] bg-gray-100 dark:bg-gray-800 hidden md:block"></div>
                            <div className="flex flex-col">
                                <span className="text-xl font-bold text-primary">4.9/5</span>
                                <span className="text-xs text-gray-500 dark:text-gray-500 uppercase tracking-wider font-semibold">Average Rating</span>
                            </div>
                        </motion.div>
                    </motion.div>

                    {/* Right Content - Image Mockup Formation */}
                    <motion.div
                        initial={{ opacity: 0, x: 50 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.8, delay: 0.2 }}
                        className="relative flex justify-center lg:justify-end"
                    >
                        <div className="relative w-full max-w-xl lg:max-w-2xl">
                            {/* Main Grid Layout - 3 Images */}
                            <div className="grid grid-cols-12 gap-4 relative">

                                {/* Main Large Image - Left */}
                                <motion.div
                                    className="col-span-7 relative group"
                                    initial={{ opacity: 0, y: 30 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.4, duration: 0.7 }}
                                >
                                    <div className="relative overflow-hidden rounded-2xl shadow-2xl shadow-black/10 dark:shadow-black/30 border-2 border-white/60 dark:border-white/10">
                                        <img
                                            src="/images/57462951_2085649778223584_3709857119512559616_n.jpg"
                                            alt="Hi ICT Park Classroom - Students Learning"
                                            className="w-full h-[320px] lg:h-[400px] object-cover transition-transform duration-700 group-hover:scale-105"
                                        />
                                        {/* Gradient Overlay */}
                                        <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
                                        {/* Badge on image */}
                                        <div className="absolute bottom-4 left-4 bg-white/90 dark:bg-gray-900/90 backdrop-blur-sm rounded-xl px-4 py-2 shadow-lg">
                                            <p className="text-[10px] font-bold text-primary uppercase tracking-widest">Live Class</p>
                                            <p className="text-xs font-semibold text-gray-700 dark:text-gray-300">50+ Students</p>
                                        </div>
                                    </div>
                                </motion.div>

                                {/* Right Column - 2 Stacked Images */}
                                <div className="col-span-5 flex flex-col gap-4">
                                    {/* Top Right Image */}
                                    <motion.div
                                        className="relative group"
                                        initial={{ opacity: 0, y: -20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: 0.6, duration: 0.7 }}
                                    >
                                        <div className="relative overflow-hidden rounded-2xl shadow-xl shadow-black/10 dark:shadow-black/30 border-2 border-white/60 dark:border-white/10">
                                            <img
                                                src="/images/58068385_2070681143053781_5367478869567733760_n.jpg"
                                                alt="Hi ICT Park Seminar - Knowledge Sharing"
                                                className="w-full h-[150px] lg:h-[190px] object-cover transition-transform duration-700 group-hover:scale-105"
                                            />
                                            <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent" />
                                            <div className="absolute bottom-3 left-3 flex items-center gap-1.5">
                                                <div className="w-6 h-6 bg-[#E62D26] rounded-full flex items-center justify-center">
                                                    <span className="text-white text-[10px]">🎓</span>
                                                </div>
                                                <span className="text-white text-[10px] font-bold drop-shadow-lg">Seminar</span>
                                            </div>
                                        </div>
                                    </motion.div>

                                    {/* Bottom Right Image */}
                                    <motion.div
                                        className="relative group"
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: 0.8, duration: 0.7 }}
                                    >
                                        <div className="relative overflow-hidden rounded-2xl shadow-xl shadow-black/10 dark:shadow-black/30 border-2 border-white/60 dark:border-white/10">
                                            <img
                                                src="/images/58383539_2073583652763530_1902712555562860544_n.jpg"
                                                alt="Hi ICT Park Exam - Student Assessment"
                                                className="w-full h-[150px] lg:h-[190px] object-cover transition-transform duration-700 group-hover:scale-105"
                                            />
                                            <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent" />
                                            <div className="absolute bottom-3 left-3 flex items-center gap-1.5">
                                                <div className="w-6 h-6 bg-amber-500 rounded-full flex items-center justify-center">
                                                    <span className="text-white text-[10px]">📝</span>
                                                </div>
                                                <span className="text-white text-[10px] font-bold drop-shadow-lg">Exam Hall</span>
                                            </div>
                                        </div>
                                    </motion.div>
                                </div>
                            </div>

                            {/* Floating Decorative Elements */}
                            <motion.div
                                className="absolute -top-4 -left-4 bg-white dark:bg-gray-800 rounded-2xl px-4 py-3 shadow-xl border border-gray-100 dark:border-gray-700 z-20"
                                initial={{ opacity: 0, scale: 0 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ delay: 1.2, duration: 0.5 }}
                            >
                                <div className="flex items-center gap-2">
                                    <div className="w-8 h-8 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center">
                                        <span className="text-green-500 text-sm font-bold">✓</span>
                                    </div>
                                    <div>
                                        <p className="text-[10px] text-gray-400 font-medium">Success Rate</p>
                                        <p className="font-bold text-sm text-gray-800 dark:text-white">98%</p>
                                    </div>
                                </div>
                            </motion.div>

                            {/* Floating Rating Badge */}
                            <motion.div
                                className="absolute -bottom-3 right-[30%] bg-white dark:bg-gray-800 rounded-2xl px-4 py-3 shadow-xl border border-gray-100 dark:border-gray-700 z-20"
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 1.5, duration: 0.5 }}
                            >
                                <div className="flex items-center gap-2">
                                    <div className="flex -space-x-2">
                                        <div className="w-7 h-7 rounded-full bg-primary flex items-center justify-center text-white text-xs font-bold border-2 border-white dark:border-gray-800">S</div>
                                        <div className="w-7 h-7 rounded-full bg-amber-500 flex items-center justify-center text-white text-xs font-bold border-2 border-white dark:border-gray-800">A</div>
                                        <div className="w-7 h-7 rounded-full bg-green-500 flex items-center justify-center text-white text-xs font-bold border-2 border-white dark:border-gray-800">R</div>
                                    </div>
                                    <div>
                                        <p className="text-[10px] text-gray-400 font-medium">Students</p>
                                        <p className="font-bold text-xs text-gray-800 dark:text-white">50k+ Enrolled</p>
                                    </div>
                                </div>
                            </motion.div>

                            {/* Floating Dots */}
                            <motion.div
                                className="absolute top-[20%] -right-3 w-4 h-4 bg-[#E62D26] rounded-full z-10"
                                animate={{ y: [0, -10, 0], scale: [1, 1.2, 1] }}
                                transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                            />
                            <motion.div
                                className="absolute top-[50%] -left-3 w-3 h-3 bg-amber-400 rounded-full z-10"
                                animate={{ y: [0, 8, 0] }}
                                transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut", delay: 0.3 }}
                            />
                            <motion.div
                                className="absolute bottom-[15%] -right-2 w-3 h-3 border-2 border-[#E62D26] rounded-full z-10"
                                animate={{ scale: [1, 1.4, 1] }}
                                transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                            />
                        </div>
                    </motion.div>
                </div>
            </div>

            {/* Bottom Features Bar - Integrated */}
            <div className="hidden lg:block absolute bottom-0 left-0 w-full z-20 bg-[#12B9BF] dark:bg-[#10a1a7] shadow-[0_-10px_30px_rgba(0,0,0,0.1)] border-t border-white/10">
                <div className="container mx-auto px-4 lg:px-20 py-5">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                        {features.map((feature, index) => (
                            <motion.div
                                key={index}
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 1.5 + index * 0.1 }}
                                className="flex items-center gap-4 justify-center md:justify-start group cursor-default"
                            >
                                <div className="w-12 h-12 rounded-full border-2 border-white/20 flex items-center justify-center text-white group-hover:bg-white/10 transition-colors">
                                    <feature.icon size={22} />
                                </div>
                                <div className={`text-white ${bengaliClass}`}>
                                    <p className="text-[10px] md:text-xs font-medium text-blue-100 uppercase tracking-wider leading-none mb-1.5">{feature.title}</p>
                                    <p className="text-xs md:text-sm font-bold leading-none">{feature.subtitle}</p>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Animation Styles */}
            <style jsx>{`
                @keyframes draw {
                    from {
                        stroke-dasharray: 200;
                        stroke-dashoffset: 200;
                    }
                    to {
                        stroke-dashoffset: 0;
                    }
                }
                .animate-draw {
                    animation: draw 1s ease-out forwards;
                    animation-delay: 0.5s;
                    stroke-dasharray: 200;
                    stroke-dashoffset: 200;
                }
            `}</style>
        </section>
    );
};

export default Hero;

