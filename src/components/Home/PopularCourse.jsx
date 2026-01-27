"use client";

import React, { useState } from "react";
import { useSelector } from "react-redux";
import { LuChevronLeft, LuChevronRight, LuChevronDown, LuFilter, LuArrowUpDown } from "react-icons/lu";
import { useLanguage } from "@/context/LanguageContext";
import { motion, AnimatePresence } from "framer-motion";
import SharedCourseCard from "@/components/sheard/CourseCard";

const API_URL = process.env.NEXT_PUBLIC_API_URL || (process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api');

// Loading Skeleton
const CourseCardSkeleton = () => (
  <div className="w-full animate-pulse">
    <div className="bg-white dark:bg-gray-900 rounded-lg overflow-hidden">
      <div className="aspect-[4/3] bg-gray-200 dark:bg-gray-800" />
      <div className="p-4 space-y-3">
        <div className="h-5 bg-gray-200 dark:bg-gray-800 rounded w-20" />
        <div className="h-5 bg-gray-200 dark:bg-gray-800 rounded w-3/4" />
        <div className="h-4 bg-gray-200 dark:bg-gray-800 rounded w-1/2" />
        <div className="h-6 bg-gray-200 dark:bg-gray-800 rounded w-1/4" />
      </div>
    </div>
  </div>
);

const PopularCourse = () => {
  const [activeCategory, setActiveCategory] = useState('all');
  const [activeSort, setActiveSort] = useState('popularity');
  const [startIndex, setStartIndex] = useState(0);
  const [openDropdown, setOpenDropdown] = useState(null); // 'category' | 'sort' | null
  const { language, t } = useLanguage();
  const bengaliClass = language === "bn" ? "hind-siliguri" : "";

  const { items: categories = [] } = useSelector((state) => state.categories);
  const { courses = [], loading } = useSelector((state) => state.courses);

  const visibleItems = 6;

  // Prepare Dropdown Options
  const categoryOptions = [
    { id: 'all', label: language === 'bn' ? t("home_sections.all") : 'All Categories' },
    ...categories.map(cat => ({
      id: cat._id,
      label: language === 'bn' ? cat.nameBn || cat.name : cat.name
    }))
  ];

  const sortOptions = [
    { id: 'popularity', label: language === 'bn' ? t("home_sections.popularity") : 'Most Popular' },
    { id: 'trending', label: language === 'bn' ? t("home_sections.trending") : 'Trending' },
    { id: 'featured', label: language === 'bn' ? t("home_sections.featured") : 'Featured' },
    { id: 'rating', label: language === 'bn' ? 'রেটিং' : 'Top Rated' },
  ];

  // Combined Parsing Logic
  const getProcessedCourses = () => {
    let result = [...courses];

    // 1. Apply Category Filter
    if (activeCategory !== 'all') {
      result = result.filter(c => {
        const catId = c.category?._id || c.category;
        return catId === activeCategory;
      });
    }

    // 2. Apply Sort/Filter Logic
    switch (activeSort) {
      case 'trending':
        // Filter for trending (> 5 enrollments) and then sort by enrollments
        result = result.filter(c => (c.totalEnrollments || 0) > 5).sort((a, b) => (b.totalEnrollments || 0) - (a.totalEnrollments || 0));
        break;
      case 'featured':
        result = result.filter(c => c.isFeatured);
        break;
      case 'rating':
        result.sort((a, b) => (b.averageRating || 0) - (a.averageRating || 0));
        break;
      case 'popularity':
      default:
        result.sort((a, b) => (b.totalEnrollments || 0) - (a.totalEnrollments || 0));
        break;
    }

    return result;
  };

  const filteredCourses = getProcessedCourses();
  const visibleCourses = filteredCourses.slice(startIndex, startIndex + visibleItems);

  const handlePrev = () => {
    setStartIndex(prev => prev > 0 ? prev - 1 : Math.max(filteredCourses.length - visibleItems, 0));
  };

  const handleNext = () => {
    setStartIndex(prev => prev + visibleItems < filteredCourses.length ? prev + 1 : 0);
  };

  const toggleDropdown = (name) => {
    setOpenDropdown(openDropdown === name ? null : name);
  };

  const getActiveLabel = (type) => {
    if (type === 'category') {
      const active = categoryOptions.find(c => c.id === activeCategory);
      return active ? active.label : 'All Categories';
    }
    if (type === 'sort') {
      const active = sortOptions.find(s => s.id === activeSort);
      return active ? active.label : 'Most Popular';
    }
    return '';
  };

  return (
    <section className="py-12 lg:py-16 bg-white dark:bg-[#0a0a0a]">
      <div className="container mx-auto px-4 lg:px-16">
        {/* Header - Redesigned Left Align with Dropdown */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 mb-10 relative z-10">
          <div className="text-left space-y-2">
            <motion.span
              initial={{ opacity: 0, x: -10 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="inline-block px-3 py-1 bg-primary/10 text-primary text-xs font-bold tracking-wider uppercase rounded-md border border-primary/20"
            >
              {language === 'bn' ? 'জনপ্রিয় কোর্স' : 'Popular Courses'}
            </motion.span>

            <motion.h2
              initial={{ opacity: 0, x: -15 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className={`text-3xl md:text-4xl font-bold text-gray-900 dark:text-white leading-tight ${bengaliClass}`}
            >
              {language === 'bn' ? 'শিক্ষার্থীরা যা দেখছে' : 'Students are Viewing'}
            </motion.h2>
          </div>

          {/* Two Dropdowns - Right Aligned Side by Side */}
          <div className="flex flex-col sm:flex-row gap-3 min-w-[300px] z-20">

            {/* Category Dropdown */}
            <div className="relative flex-1">
              <button
                onClick={() => toggleDropdown('category')}
                className="w-full flex items-center justify-between px-4 py-2.5 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg text-sm font-semibold text-gray-700 dark:text-gray-200 hover:border-primary/50 transition-all   whitespace-nowrap gap-4"
              >
                <div className="flex items-center gap-2">
                  <LuFilter className="text-gray-400" size={14} />
                  <span className={`truncate ${bengaliClass}`}>{getActiveLabel('category')}</span>
                </div>
                <LuChevronDown className={`text-gray-400 transition-transform duration-300 ${openDropdown === 'category' ? 'rotate-180' : ''}`} size={16} />
              </button>

              <AnimatePresence>
                {openDropdown === 'category' && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                    className="absolute top-full right-0 mt-2 w-full sm:w-56 bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 rounded-xl shadow-xl overflow-hidden max-h-64 overflow-y-auto"
                  >
                    {categoryOptions.map((opt) => (
                      <button
                        key={opt.id}
                        onClick={() => {
                          setActiveCategory(opt.id);
                          setOpenDropdown(null);
                          setStartIndex(0);
                        }}
                        className={`w-full text-left px-4 py-2.5 text-xs sm:text-sm font-medium transition-colors hover:bg-gray-50 dark:hover:bg-gray-700 border-b border-gray-50 dark:border-gray-700/50 last:border-0 ${activeCategory === opt.id
                            ? 'text-primary bg-primary/5'
                            : 'text-gray-600 dark:text-gray-400'
                          } ${bengaliClass}`}
                      >
                        {opt.label}
                      </button>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Sort Dropdown */}
            <div className="relative flex-1">
              <button
                onClick={() => toggleDropdown('sort')}
                className="w-full flex items-center justify-between px-4 py-2.5 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg text-sm font-semibold text-gray-700 dark:text-gray-200 hover:border-primary/50 transition-all whitespace-nowrap gap-4"
              >
                <div className="flex items-center gap-2">
                  <LuArrowUpDown className="text-gray-400" size={14} />
                  <span className={`truncate ${bengaliClass}`}>{getActiveLabel('sort')}</span>
                </div>
                <LuChevronDown className={`text-gray-400 transition-transform duration-300 ${openDropdown === 'sort' ? 'rotate-180' : ''}`} size={16} />
              </button>

              <AnimatePresence>
                {openDropdown === 'sort' && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                    className="absolute top-full right-0 mt-2 w-full sm:w-48 bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 rounded-xl shadow-xl overflow-hidden"
                  >
                    {sortOptions.map((opt) => (
                      <button
                        key={opt.id}
                        onClick={() => {
                          setActiveSort(opt.id);
                          setOpenDropdown(null);
                          setStartIndex(0);
                        }}
                        className={`w-full text-left px-4 py-2.5 text-xs sm:text-sm font-medium transition-colors hover:bg-gray-50 dark:hover:bg-gray-700 border-b border-gray-50 dark:border-gray-700/50 last:border-0 ${activeSort === opt.id
                            ? 'text-primary bg-primary/5'
                            : 'text-gray-600 dark:text-gray-400'
                          } ${bengaliClass}`}
                      >
                        {opt.label}
                      </button>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

          </div>
        </div>

        {/* Courses Carousel */}
        <div className="relative">
          {/* Navigation Buttons */}
          {filteredCourses.length > visibleItems && (
            <>
              <button
                onClick={handlePrev}
                className="absolute -left-4 lg:-left-6 top-1/2 -translate-y-1/2 z-10 w-10 h-10 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-full shadow-lg flex items-center justify-center text-gray-500 hover:bg-gray-50 dark:hover:bg-gray-700 transition-all"
              >
                <LuChevronLeft size={20} />
              </button>
              <button
                onClick={handleNext}
                className="absolute -right-4 lg:-right-6 top-1/2 -translate-y-1/2 z-10 w-10 h-10 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-full shadow-lg flex items-center justify-center text-gray-500 hover:bg-gray-50 dark:hover:bg-gray-700 transition-all"
              >
                <LuChevronRight size={20} />
              </button>
            </>
          )}

          {/* Course Cards Grid */}
          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
              {[1, 2, 3, 4, 5, 6].map(i => <CourseCardSkeleton key={i} />)}
            </div>
          ) : (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.3 }}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8"
            >
              {visibleCourses.length > 0 ? (
                visibleCourses.map((course) => (
                  <SharedCourseCard key={course._id} course={course} />
                ))
              ) : (
                <div className="col-span-full text-center py-12">
                  <p className={`text-gray-500 ${bengaliClass}`}>
                    {language === 'bn' ? t("navbar.noCategories") : 'No courses found'}
                  </p>
                </div>
              )}
            </motion.div>
          )}
        </div>
      </div>
    </section>
  );
};

export default PopularCourse;

