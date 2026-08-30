"use client";

import React, { Suspense, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchCoursesData } from "@/redux/CourseSlice";
import { fetchCategories, setSelectedCategories } from "@/redux/categorySlice";
import Image from "next/image";
import Link from "next/link";
import CourseCard from "@/components/sheard/CourseCard";
import { HiOutlineAcademicCap, HiOutlineSparkles } from "react-icons/hi2";
import {
  LuBookOpen,
  LuUsers,
  LuSearch,
  LuX,
  LuArrowUpDown,
  LuGrid3X3,
  LuLayoutGrid,
  LuStar,
  LuDollarSign,
  LuTrendingUp,
  LuArrowRight,
  LuSparkles
} from "react-icons/lu";
import { useLanguage } from "@/context/LanguageContext";
import { motion, AnimatePresence } from "framer-motion";

// Loading fallback component
const LoadingFallback = () => (
  <div className="flex items-center justify-center py-20">
    <div className="w-10 h-10 border-3 border-[#E62D26]/30 border-t-[#E62D26] rounded-full animate-spin"></div>
  </div>
);

// Floating Element Component
const FloatingElement = ({ children, delay = 0, duration = 3, className = "" }) => (
  <motion.div
    initial={{ y: 0 }}
    animate={{ y: [-10, 10, -10] }}
    transition={{ duration, repeat: Infinity, delay, ease: "easeInOut" }}
    className={className}
  >
    {children}
  </motion.div>
);

// Course Card Skeleton
const CourseCardSkeleton = () => (
  <div className="bg-white dark:bg-white/5 rounded-2xl border border-slate-100 dark:border-white/10 overflow-hidden animate-pulse">
    <div className="aspect-[16/10] bg-slate-100 dark:bg-white/5"></div>
    <div className="p-5 space-y-3">
      <div className="h-5 bg-slate-100 dark:bg-white/5 rounded w-3/4"></div>
      <div className="h-4 bg-slate-100 dark:bg-white/5 rounded w-1/2"></div>
      <div className="h-8 bg-slate-100 dark:bg-white/5 rounded w-1/3"></div>
    </div>
  </div>
);

const CourseContent = () => {
  const dispatch = useDispatch();
  const { courses = [], loading } = useSelector((state) => state.courses || {});
  const { items: categories = [], selectedCategories = [] } = useSelector((state) => state.categories || {});
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedType, setSelectedType] = useState("All");
  const [sortBy, setSortBy] = useState("default");
  const [viewMode, setViewMode] = useState("grid");
  const [isVisible, setIsVisible] = useState(false);
  const { t, language } = useLanguage();
  const bengaliClass = language === "bn" ? "hind-siliguri" : "";

  useEffect(() => {
    setIsVisible(true);
    dispatch(fetchCoursesData());
    dispatch(fetchCategories());
  }, [dispatch]);

  const courseTypes = [
    { name: 'All', label: language === 'bn' ? 'সব' : 'All' },
    { name: 'Online', label: language === 'bn' ? 'অনলাইন' : 'Online' },
    { name: 'Offline', label: language === 'bn' ? 'অফলাইন' : 'Offline' },
    { name: 'Recorded', label: language === 'bn' ? 'রেকর্ডেড' : 'Recorded' }
  ];

  // Get category name from ID
  const getCategoryName = (categoryId) => {
    if (!categoryId) return "";
    if (typeof categoryId === "object" && categoryId.name) return categoryId.name;
    if (typeof categoryId === "string" && categoryId.length < 20) return categoryId;
    const category = categories.find(cat => cat._id === categoryId || cat.id === categoryId);
    return category?.name || "";
  };

  // Filter courses
  const filteredCourses = courses.filter((course) => {
    if (!course) return false;
    const rawType = course?.courseType || course?.type || course?.mode || "";
    const cType = rawType.toString().toLowerCase();
    const sType = (selectedType || "All").toLowerCase();
    const typeMatch = sType === "all" || cType === sType;

    let categoryMatch = true;
    if (selectedCategories.length > 0) {
      const courseCategoryName = getCategoryName(course.category);
      categoryMatch = selectedCategories.includes(courseCategoryName);
    }

    const q = (searchQuery || "").trim().toLowerCase();
    const searchMatch =
      q === "" ||
      (course.title && course.title.toLowerCase().includes(q)) ||
      (course.titleBn && course.titleBn.toLowerCase().includes(q)) ||
      (course.technology && course.technology.toLowerCase().includes(q)) ||
      getCategoryName(course.category).toLowerCase().includes(q);

    return typeMatch && categoryMatch && searchMatch;
  });

  // Sort courses
  const sortedCourses = [...filteredCourses].sort((a, b) => {
    const aPrice = a.price || (parseInt(a.fee?.replace(/[^\d]/g, '') || 0));
    const bPrice = b.price || (parseInt(b.fee?.replace(/[^\d]/g, '') || 0));
    const aRating = a.averageRating || a.rating || 5;
    const bRating = b.averageRating || b.rating || 5;
    const aStudents = a.totalEnrollments || a.totalStudentsEnroll || 0;
    const bStudents = b.totalEnrollments || b.totalStudentsEnroll || 0;

    switch (sortBy) {
      case "rating": return bRating - aRating;
      case "price-low": return aPrice - bPrice;
      case "price-high": return bPrice - aPrice;
      case "students": return bStudents - aStudents;
      default: return 0;
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
      {/* Hero Section with Floating Elements */}
      <section className="relative py-12 lg:py-16 bg-slate-50 dark:bg-[#0a0a0a] overflow-hidden">
        {/* Animated Background */}
        <div className="absolute inset-0 bg-gradient-to-br from-[#E62D26]/5 via-transparent to-[#F79952]/5"></div>

        {/* Grid Pattern */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(230,45,38,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(230,45,38,0.02)_1px,transparent_1px)] bg-[size:60px_60px]"></div>

        {/* Animated Gradient Orbs */}
        <motion.div
          animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.5, 0.3] }}
          transition={{ duration: 8, repeat: Infinity }}
          className="absolute -top-20 -left-20 w-96 h-96 bg-gradient-to-br from-[#E62D26]/20 to-[#E62D26]/5 rounded-full blur-3xl"
        />
        <motion.div
          animate={{ scale: [1.2, 1, 1.2], opacity: [0.3, 0.5, 0.3] }}
          transition={{ duration: 8, repeat: Infinity, delay: 2 }}
          className="absolute -bottom-20 -right-20 w-96 h-96 bg-gradient-to-br from-[#F79952]/20 to-[#F79952]/5 rounded-full blur-3xl"
        />

        {/* Floating Decorative Elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <FloatingElement delay={0} className="absolute top-20 left-[10%] hidden lg:block">
            <div className="w-12 h-12 bg-white/80 dark:bg-white/10 backdrop-blur-sm rounded-xl shadow-lg flex items-center justify-center border border-white/50">
              <span className="text-2xl">📚</span>
            </div>
          </FloatingElement>

          <FloatingElement delay={1} duration={4} className="absolute top-32 right-[12%] hidden lg:block">
            <div className="w-14 h-14 bg-gradient-to-br from-[#F79952] to-[#E62D26] rounded-2xl shadow-lg flex items-center justify-center rotate-12">
              <span className="text-2xl">🎓</span>
            </div>
          </FloatingElement>

          <FloatingElement delay={0.5} duration={3.5} className="absolute bottom-24 left-[15%] hidden lg:block">
            <div className="px-4 py-2 bg-slate-900/90 backdrop-blur-sm rounded-lg shadow-lg border border-slate-700">
              <code className="text-xs text-emerald-400 font-mono">&lt;Learn/&gt;</code>
            </div>
          </FloatingElement>

          <FloatingElement delay={1.5} className="absolute bottom-32 right-[8%] hidden lg:block">
            <div className="w-10 h-10 bg-amber-400/90 backdrop-blur-sm rounded-full shadow-lg flex items-center justify-center">
              <span className="text-lg">⭐</span>
            </div>
          </FloatingElement>

          {/* Decorative Dots */}
          <div className="absolute top-1/2 left-8 w-2 h-2 bg-[#E62D26]/40 rounded-full hidden lg:block"></div>
          <div className="absolute top-1/3 left-12 w-1.5 h-1.5 bg-[#F79952]/40 rounded-full hidden lg:block"></div>
          <div className="absolute bottom-1/3 right-8 w-2 h-2 bg-[#E62D26]/40 rounded-full hidden lg:block"></div>
          <div className="absolute bottom-1/2 right-16 w-1.5 h-1.5 bg-[#F79952]/40 rounded-full hidden lg:block"></div>
        </div>

        <div className="container mx-auto px-4 lg:px-16 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: isVisible ? 1 : 0, y: isVisible ? 0 : 20 }}
            transition={{ duration: 0.6 }}
            className="text-center max-w-3xl mx-auto"
          >
            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-white/80 dark:bg-white/5 backdrop-blur-sm border border-[#E62D26]/20 rounded-full shadow-sm mb-4">
              <span className="flex h-1.5 w-1.5 relative">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#E62D26] opacity-75"></span>
                <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-[#E62D26]"></span>
              </span>
              <span className={`text-[10px] font-medium text-slate-600 dark:text-slate-300 ${bengaliClass}`}>
                {language === "bn" ? "প্রিমিয়াম কোর্স" : "Premium Courses"}
              </span>
            </div>

            {/* Title */}
            <h1 className={`text-2xl md:text-3xl lg:text-4xl font-bold text-slate-800 dark:text-white mb-3 outfit leading-tight ${bengaliClass}`}>
              {language === "bn" ? "আমাদের " : "Discover Our "}
              <span className="relative">
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#E62D26] to-[#F79952]">
                  {language === "bn" ? "প্রিমিয়াম কোর্স" : "Premium Courses"}
                </span>
                <svg className="absolute -bottom-2 left-0 w-full" viewBox="0 0 200 8" fill="none">
                  <path d="M1 5.5C47.6667 2.16667 141 -1.8 199 5.5" stroke="#E62D26" strokeWidth="2" strokeLinecap="round" />
                </svg>
              </span>
            </h1>

            {/* Description */}
            <p className={`text-slate-500 dark:text-slate-400 text-xs lg:text-sm max-w-xl mx-auto leading-relaxed mb-6 ${bengaliClass}`}>
              {language === "bn"
                ? "ইন্ডাস্ট্রি এক্সপার্টদের কাছ থেকে শিখুন এবং আপনার ক্যারিয়ার ট্রান্সফর্ম করুন।"
                : "Learn from industry experts and transform your career with our comprehensive course catalog."}
            </p>

            {/* Stats Cards */}
            <div className="flex flex-wrap justify-center gap-4 lg:gap-6 mb-8">
              <div className="group flex items-center gap-2 px-4 py-2.5 bg-white/80 dark:bg-white/5 backdrop-blur-sm rounded-xl border border-slate-100 dark:border-white/10 shadow-sm hover:shadow-md hover:border-[#E62D26]/30 transition-all duration-300">
                <div className="w-9 h-9 bg-gradient-to-br from-[#E62D26]/10 to-[#E62D26]/5 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform">
                  <LuBookOpen className="text-[#E62D26] text-base" />
                </div>
                <div className="text-left">
                  <p className="text-lg font-bold text-slate-800 dark:text-white outfit">{courses.length || '20'}+</p>
                  <p className={`text-[10px] text-slate-500 dark:text-slate-400 ${bengaliClass}`}>{language === 'bn' ? 'কোর্স' : 'Courses'}</p>
                </div>
              </div>

              <div className="group flex items-center gap-2 px-4 py-2.5 bg-white/80 dark:bg-white/5 backdrop-blur-sm rounded-xl border border-slate-100 dark:border-white/10 shadow-sm hover:shadow-md hover:border-[#F79952]/30 transition-all duration-300">
                <div className="w-9 h-9 bg-gradient-to-br from-[#F79952]/10 to-[#F79952]/5 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform">
                  <HiOutlineSparkles className="text-[#F79952] text-base" />
                </div>
                <div className="text-left">
                  <p className="text-lg font-bold text-slate-800 dark:text-white outfit">10+</p>
                  <p className={`text-[10px] text-slate-500 dark:text-slate-400 ${bengaliClass}`}>{language === 'bn' ? 'ক্যাটাগরি' : 'Categories'}</p>
                </div>
              </div>

              <div className="group flex items-center gap-2 px-4 py-2.5 bg-white/80 dark:bg-white/5 backdrop-blur-sm rounded-xl border border-slate-100 dark:border-white/10 shadow-sm hover:shadow-md hover:border-emerald-500/30 transition-all duration-300">
                <div className="w-9 h-9 bg-gradient-to-br from-emerald-500/10 to-emerald-500/5 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform">
                  <LuUsers className="text-emerald-500 text-base" />
                </div>
                <div className="text-left">
                  <p className="text-lg font-bold text-slate-800 dark:text-white outfit">5K+</p>
                  <p className={`text-[10px] text-slate-500 dark:text-slate-400 ${bengaliClass}`}>{language === 'bn' ? 'শিক্ষার্থী' : 'Students'}</p>
                </div>
              </div>
            </div>

            {/* Search Bar */}
            <div className="max-w-xl mx-auto">
              <div className="relative">
                <LuSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder={language === "bn" ? "কোর্স খুঁজুন..." : "Search courses..."}
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
              {courseTypes.map((type) => (
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
                  <option value="students">{language === 'bn' ? 'জনপ্রিয়' : 'Popular'}</option>
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
                .slice(0, 8)
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
            <HiOutlineSparkles className="text-[#E62D26]" size={16} />
            <span className={`text-sm text-slate-600 dark:text-slate-400 ${bengaliClass}`}>
              <span className="font-bold text-slate-800 dark:text-white">{sortedCourses.length}</span>
              {language === "bn" ? " টি কোর্স পাওয়া গেছে" : " courses found"}
            </span>
          </div>
        </div>
      </section>

      {/* Courses Grid */}
      <section className="py-12 lg:py-16 bg-slate-50 dark:bg-[#0d0d0d]">
        <div className="container mx-auto px-4 lg:px-16">
          <AnimatePresence mode="wait">
            {loading ? (
              <motion.div
                key="loading"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className={`grid gap-6 ${viewMode === "grid" ? "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3" : "grid-cols-1"}`}
              >
                {[1, 2, 3, 4, 5, 6].map((i) => (
                  <CourseCardSkeleton key={i} />
                ))}
              </motion.div>
            ) : sortedCourses.length > 0 ? (
              <motion.div
                key="courses"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className={`grid gap-6 ${viewMode === "grid" ? "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3" : "grid-cols-1"}`}
              >
                {sortedCourses.map((course, index) => (
                  <motion.div
                    key={course?._id || course?.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05, duration: 0.3 }}
                  >
                    <CourseCard course={course} view={viewMode === 'grid' ? 'grid' : 'list'} />
                  </motion.div>
                ))}
              </motion.div>
            ) : (
              <motion.div
                key="empty"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="text-center py-20"
              >
                <div className="w-20 h-20 bg-slate-100 dark:bg-white/5 rounded-full flex items-center justify-center mx-auto mb-4">
                  <LuSearch className="text-slate-400" size={32} />
                </div>
                <h3 className={`text-lg font-bold text-slate-800 dark:text-white mb-2 ${bengaliClass}`}>
                  {language === "bn" ? "কোন কোর্স পাওয়া যায়নি" : "No courses found"}
                </h3>
                <p className={`text-sm text-slate-500 ${bengaliClass}`}>
                  {language === "bn" ? "অন্য কিওয়ার্ড দিয়ে খুঁজুন" : "Try a different search keyword"}
                </p>
              </motion.div>
            )}
          </AnimatePresence>
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
                {language === "bn" ? "প্রাইভেট টিউশন" : "Private Tutoring"}
              </span>
            </div>

            <h2 className={`text-xl lg:text-2xl font-bold text-white mb-3 outfit ${bengaliClass}`}>
              {language === "bn" ? "১-অন-১ মেন্টরশিপ দরকার?" : "Need 1-on-1 Mentorship?"}
            </h2>
            <p className={`text-white/80 text-xs mb-6 ${bengaliClass}`}>
              {language === "bn"
                ? "আমাদের এক্সপার্ট মেন্টরদের সাথে প্রাইভেট সেশন বুক করুন।"
                : "Book private sessions with our expert mentors for personalized learning."}
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

const Course = () => {
  return (
    <Suspense fallback={<LoadingFallback />}>
      <CourseContent />
    </Suspense>
  );
};

export default Course;
