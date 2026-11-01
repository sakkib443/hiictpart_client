"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { useLanguage } from "@/context/LanguageContext";
import { getTestimonials } from "./testimonialsData";

const Testimonials = () => {
    const { language, t } = useLanguage();
    const bengaliClass = language === "bn" ? "hind-siliguri" : "";
    const [currentPage, setCurrentPage] = useState(0);

    const testimonials = getTestimonials(language, t);

    const itemsPerPage = 3;
    const totalPages = Math.ceil(testimonials.length / itemsPerPage);
    const currentTestimonials = testimonials.slice(
        currentPage * itemsPerPage,
        (currentPage + 1) * itemsPerPage
    );

    return (
        <section className="py-16 lg:py-20 bg-white dark:bg-[#0a0a0a]">
            <div className="container mx-auto px-4 lg:px-16">
                <div className="grid lg:grid-cols-4 gap-8 lg:gap-12">
                    {/* Left Side - Title and Description */}
                    <motion.div
                        initial={{ opacity: 0, x: -30 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.5 }}
                        className="lg:col-span-1"
                    >
                        <h2 className={`text-2xl lg:text-3xl font-bold text-gray-900 dark:text-white mb-4 ${bengaliClass}`}>
                            {language === 'bn' ? t("home_sections.testimonials.peopleSay") : 'People Say'}
                            <br />
                            <span className="relative inline-block">
                                {language === 'bn' ? t("home_sections.testimonials.aboutHiictPark") : 'About HiictPark'}
                                <span className="absolute -bottom-1 left-0 w-20 h-1 bg-amber-400 rounded-full"></span>
                            </span>
                        </h2>

                        <p className={`text-gray-500 dark:text-gray-400 text-sm lg:text-base mb-6 ${bengaliClass}`}>
                            {language === 'bn'
                                ? t("home_sections.testimonials.description")
                                : 'One-stop solution for any eLearning center, online courses. People love HiictPark because they can create their sites with ease here.'
                            }
                        </p>

                        <Link
                            href="/reviews"
                            className={`inline-flex items-center px-6 py-3 bg-gray-900 dark:bg-white text-white dark:text-gray-900 font-medium rounded-lg hover:bg-gray-800 dark:hover:bg-gray-100 transition-colors ${bengaliClass}`}
                        >
                            {language === 'bn' ? t("home_sections.testimonials.viewAll") : 'View all'}
                        </Link>
                    </motion.div>

                    {/* Right Side - Testimonial Cards */}
                    <div className="lg:col-span-3">
                        <div className="grid md:grid-cols-3 gap-6">
                            {currentTestimonials.map((testimonial, index) => (
                                <motion.div
                                    key={testimonial.id}
                                    initial={{ opacity: 0, y: 20 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ duration: 0.4, delay: index * 0.1 }}
                                    className="bg-gray-50 dark:bg-gray-900 rounded-xl p-6 relative"
                                >
                                    {/* Quote Icon */}
                                    <div className="absolute top-6 right-6">
                                        <svg
                                            className="w-8 h-8 text-orange-400 opacity-50"
                                            fill="currentColor"
                                            viewBox="0 0 24 24"
                                        >
                                            <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z" />
                                        </svg>
                                    </div>

                                    {/* Title */}
                                    <h3 className={`font-bold text-lg mb-3 ${testimonial.titleColor} ${bengaliClass}`}>
                                        {testimonial.title}
                                    </h3>

                                    {/* Review */}
                                    <p className={`text-gray-600 dark:text-gray-400 text-sm leading-relaxed mb-6 ${bengaliClass}`}>
                                        {testimonial.review}
                                    </p>

                                    {/* User Info */}
                                    <div className="flex items-center gap-3">
                                        <div className="relative w-10 h-10 rounded-full overflow-hidden">
                                            <Image
                                                src={testimonial.avatar}
                                                alt={testimonial.name}
                                                fill
                                                className="object-cover"
                                            />
                                        </div>
                                        <div>
                                            <p className={`font-semibold text-gray-900 dark:text-white text-sm ${bengaliClass}`}>
                                                {testimonial.name}
                                            </p>
                                            <p className={`text-gray-500 dark:text-gray-400 text-xs ${bengaliClass}`}>
                                                / {testimonial.designation}
                                            </p>
                                        </div>
                                    </div>
                                </motion.div>
                            ))}
                        </div>

                        {/* Pagination Dots */}
                        {totalPages > 1 && (
                            <div className="flex justify-center gap-2 mt-8">
                                {Array.from({ length: totalPages }).map((_, index) => (
                                    <button
                                        key={index}
                                        onClick={() => setCurrentPage(index)}
                                        className={`w-2.5 h-2.5 rounded-full transition-all ${currentPage === index
                                            ? 'bg-gray-900 dark:bg-white w-6'
                                            : 'bg-gray-300 dark:bg-gray-600 hover:bg-gray-400'
                                            }`}
                                    />
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </section>
    );
};

export default Testimonials;
