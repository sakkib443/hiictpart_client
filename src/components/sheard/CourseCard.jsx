"use client";
import Image from "next/image";
import Link from "next/link";
import React, { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { addToCart } from "@/redux/cartSlice";
import { BiCategory } from "react-icons/bi";
import { FaStar, FaArrowRight } from "react-icons/fa";
import { LuBookOpenCheck, LuClock, LuUsers, LuPlay, LuLayoutGrid, LuShoppingCart, LuHeart, LuList, LuCheck, LuEye, LuSparkles } from "react-icons/lu";
import { HiOutlineAcademicCap } from "react-icons/hi2";
import { useLanguage } from "@/context/LanguageContext";
import { useTheme } from "@/providers/ThemeProvider";
import { motion } from "framer-motion";

const CourseCard = ({ course, view = "grid" }) => {
  const { isDark } = useTheme();
  const dispatch = useDispatch();
  const [isAdded, setIsAdded] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const courseId = course._id || course.id;
  const { items: categories = [] } = useSelector((state) => state.categories);
  const { t, language } = useLanguage();
  const bengaliClass = language === "bn" ? "hind-siliguri" : "";

  // Get category name from ID or object
  const getCategoryName = (categoryData) => {
    if (!categoryData) return t("coursesPage.category") || "General";
    if (typeof categoryData === "object" && categoryData.name) return categoryData.name;
    const category = categories.find(cat => cat._id === categoryData || cat.id === categoryData);
    return category?.name || categoryData || "General";
  };

  // Field mapping
  const title = course.title || "Untitled Course";
  const thumbnail = course.thumbnail || course.image || "/placeholder-course.jpg";
  const price = course.price !== undefined ? course.price : (parseInt(course.fee?.replace(/[^\d]/g, '') || 0));
  const discountPrice = course.discountPrice;
  const priceLabel = course.priceLabel;
  const type = course.courseType || course.type || "Recorded";
  const totalLessons = course.totalLessons || course.totalVideos || 10;
  const lessons = `${totalLessons} Lessons`;
  const students = course.totalEnrollments !== undefined ? `${course.totalEnrollments}+ Enrolled` : "50+ Enrolled";
  const rating = course.averageRating || course.rating || 5;
  const lastUpdated = course.updatedAt ? new Date(course.updatedAt).toLocaleDateString() : "Recently Updated";
  const duration = course.duration || course.totalDuration || "3 Months";
  const displayPrice = discountPrice || price;

  // Handle Add to Cart
  const handleAddToCart = (e) => {
    e.preventDefault();
    e.stopPropagation();
    dispatch(addToCart({
      id: courseId,
      title: title,
      price: displayPrice,
      image: thumbnail,
      type: "course"
    }));
    setIsAdded(true);
    setTimeout(() => setIsAdded(false), 2000);
  };

  // List View Rendering
  if (view === "list") {
    return (
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        whileHover={{ y: -2 }}
        className="group w-full flex flex-col md:flex-row bg-white dark:bg-[#0d0d0d] rounded-2xl border border-slate-100 dark:border-white/10 overflow-hidden hover:shadow-xl hover:shadow-slate-200/50 dark:hover:shadow-black/20 hover:border-[#E62D26]/20 transition-all duration-300"
      >
        {/* Left: Image (35%) */}
        <div className="relative w-full md:w-[35%] h-56 md:h-auto shrink-0 overflow-hidden p-3">
          <Link href={`/courses/${courseId}`} className="block h-full w-full">
            <Image
              width={400}
              height={300}
              src={thumbnail}
              alt={title}
              className="h-full w-full object-cover rounded-xl transition-transform duration-700 group-hover:scale-105"
            />
          </Link>
          {/* Play Overlay */}
          <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-black/20 backdrop-blur-[1px]">
            <Link href={`/courses/${courseId}`} className="w-14 h-14 bg-white/30 backdrop-blur-md rounded-full flex items-center justify-center text-white border border-white/50 hover:bg-[#E62D26] hover:border-[#E62D26] transition-all hover:scale-110">
              <LuPlay className="ml-1" size={20} fill="currentColor" />
            </Link>
          </div>
        </div>

        {/* Middle: Content (40%) */}
        <div className="flex-1 p-6 border-r border-slate-50 dark:border-white/5 flex flex-col justify-center">
          <Link href={`/courses/${courseId}`}>
            <h3 className={`text-xl font-bold text-slate-800 dark:text-white leading-tight mb-2 hover:text-[#E62D26] transition-colors ${bengaliClass}`}>
              {title}
            </h3>
          </Link>
          <div className="flex items-center gap-2 mb-4 text-sm text-slate-500">
            <span className="italic">in</span>
            <span className="font-medium text-slate-700 dark:text-slate-300 bg-slate-100 dark:bg-white/10 px-2 py-0.5 rounded text-xs uppercase tracking-wide">
              {getCategoryName(course.category)}
            </span>
          </div>

          <ul className="space-y-2 mb-4">
            <li className="flex items-start gap-2 text-sm text-slate-600 dark:text-slate-400">
              <LuClock className="text-[#E62D26] mt-0.5 shrink-0" size={16} />
              <span>Duration: {duration}</span>
            </li>
            <li className="flex items-start gap-2 text-sm text-slate-600 dark:text-slate-400">
              <LuUsers className="text-[#E62D26] mt-0.5 shrink-0" size={16} />
              <span>{students}</span>
            </li>
            <li className="flex items-start gap-2 text-sm text-slate-600 dark:text-slate-400">
              <LuCheck className="text-[#E62D26] mt-0.5 shrink-0" size={16} />
              <span>Lifetime Access</span>
            </li>
          </ul>
        </div>

        {/* Right: Actions (25%) */}
        <div className="w-full md:w-[25%] p-6 bg-slate-50/50 dark:bg-white/5 flex flex-col items-center justify-center text-center gap-1 border-l border-slate-100 dark:border-white/5">
          <div className="flex w-full justify-end gap-2 mb-2 text-slate-400">
            <button className="hover:text-[#E62D26] transition-colors"><LuList size={18} /></button>
            <button className="hover:text-amber-500 transition-colors"><LuHeart size={18} /></button>
          </div>

          <div className="text-3xl font-bold text-[#E62D26] font-outfit mb-1">
            {priceLabel || `৳${(discountPrice || price).toLocaleString()}`}
          </div>

          <div className="flex text-amber-500 gap-0.5 text-xs mb-1">
            {[...Array(5)].map((_, i) => (
              <FaStar key={i} className={i < Math.round(rating) ? "fill-current" : "text-slate-200 dark:text-slate-600"} />
            ))}
            <span className="text-slate-400 ml-1">({course.reviews?.length || 0})</span>
          </div>

          <p className="text-xs text-slate-500 dark:text-slate-400 mb-1">{students}</p>
          <p className="text-[10px] text-slate-400 mb-4">Last updated: {lastUpdated}</p>

          <div className="flex items-center gap-3 w-full">
            <button
              onClick={handleAddToCart}
              disabled={isAdded}
              className={`p-2.5 border rounded-xl transition-all shadow-sm ${isAdded ? 'bg-emerald-500 border-emerald-500 text-white' : 'bg-white dark:bg-white/10 border-slate-200 dark:border-white/10 text-slate-600 dark:text-white hover:text-[#E62D26] hover:border-[#E62D26]'}`}
            >
              {isAdded ? <LuCheck size={20} /> : <LuShoppingCart size={20} />}
            </button>
            <Link
              href={`/courses/${courseId}`}
              className="flex-1 py-2.5 bg-white dark:bg-white/10 border border-[#E62D26] text-[#E62D26] rounded-xl text-sm font-medium hover:bg-[#E62D26] hover:text-white transition-all shadow-sm flex items-center justify-center gap-2"
            >
              Details
            </Link>
          </div>
        </div>
      </motion.div>
    );
  }

  // Grid View Rendering - Enhanced
  return (
    <motion.div
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      whileHover={{ y: -8 }}
      transition={{ type: "spring", stiffness: 300, damping: 20 }}
      className="group w-full h-full flex flex-col"
    >
      <div className={`relative h-full bg-white dark:bg-[#0d0d0d] rounded-2xl border border-slate-100 dark:border-white/10 overflow-hidden hover:shadow-2xl hover:shadow-slate-200/60 dark:hover:shadow-black/30 hover:border-[#E62D26]/30 transition-all duration-500 flex flex-col`}>

        {/* Gradient Glow Effect on Hover */}
        <div className={`absolute inset-0 bg-gradient-to-br from-[#E62D26]/5 via-transparent to-[#F79952]/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none`}></div>

        {/* Image Section */}
        <div className="relative h-48 w-full overflow-hidden shrink-0 p-3">
          <Link href={`/courses/${courseId}`} className="block h-full w-full">
            <Image
              width={400}
              height={250}
              src={thumbnail}
              alt={title}
              className="h-full w-full object-cover rounded-xl transition-transform duration-700 group-hover:scale-110"
            />
          </Link>

          {/* Type Badge (Top Left) - Enhanced */}
          <div className="absolute top-4 left-4">
            <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold text-white shadow-lg backdrop-blur-sm ${type.toLowerCase() === 'offline'
                ? 'bg-gradient-to-r from-blue-500 to-blue-600'
                : type.toLowerCase() === 'online'
                  ? 'bg-gradient-to-r from-emerald-500 to-emerald-600'
                  : 'bg-gradient-to-r from-[#F79952] to-[#E62D26]'
              }`}>
              <LuSparkles size={12} />
              {type}
            </span>
          </div>

          {/* Rating Badge (Top Right) - Enhanced */}
          <div className="absolute top-4 right-4 bg-white/95 dark:bg-slate-800/95 backdrop-blur-sm rounded-lg px-2.5 py-1.5 flex items-center gap-1.5 shadow-lg">
            <FaStar className="text-amber-500 text-xs" />
            <span className="text-xs font-bold text-slate-800 dark:text-white">{rating.toFixed(1)}</span>
          </div>

          {/* Play Overlay - Enhanced */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: isHovered ? 1 : 0 }}
            className="absolute inset-0 flex items-center justify-center bg-gradient-to-t from-black/60 via-black/20 to-transparent backdrop-blur-[2px] rounded-xl m-3"
          >
            <Link href={`/courses/${courseId}`} className="w-16 h-16 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center text-white border-2 border-white/40 hover:bg-[#E62D26] hover:border-[#E62D26] transition-all hover:scale-110 shadow-2xl">
              <LuPlay className="ml-1" size={24} fill="currentColor" />
            </Link>
          </motion.div>

          {/* Quick Actions - On Hover */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: isHovered ? 1 : 0, x: isHovered ? 0 : 20 }}
            className="absolute right-4 bottom-4 flex flex-col gap-2"
          >
            <button className="w-9 h-9 bg-white/95 dark:bg-slate-800/95 backdrop-blur-sm rounded-lg flex items-center justify-center text-slate-600 dark:text-white hover:bg-[#E62D26] hover:text-white transition-all shadow-lg">
              <LuHeart size={16} />
            </button>
          </motion.div>
        </div>

        {/* Content Section */}
        <div className="p-5 flex flex-col flex-1 relative">
          {/* Category */}
          <div className="flex items-center gap-2 mb-3">
            <div className="w-6 h-6 bg-gradient-to-br from-[#E62D26]/10 to-[#F79952]/10 rounded-md flex items-center justify-center">
              <LuLayoutGrid className="text-[#E62D26] text-xs" />
            </div>
            <span className={`text-xs font-medium text-slate-500 dark:text-slate-400 ${bengaliClass}`}>
              {getCategoryName(course.category)}
            </span>
          </div>

          {/* Title */}
          <Link href={`/courses/${courseId}`} className="mb-2 block group/title">
            <h3 className={`text-base font-bold text-slate-800 dark:text-white leading-tight line-clamp-2 group-hover/title:text-[#E62D26] transition-colors ${bengaliClass}`}>
              {title}
            </h3>
          </Link>

          {/* Metadata */}
          <div className="flex items-center gap-4 mb-4 text-xs text-slate-500 dark:text-slate-400 font-medium pb-4 border-b border-slate-100 dark:border-white/10">
            <div className="flex items-center gap-1.5">
              <LuBookOpenCheck className="text-[#E62D26]" />
              <span>{lessons}</span>
            </div>
            <div className="flex items-center gap-1.5">
              <LuUsers className="text-[#F79952]" />
              <span>{students}</span>
            </div>
          </div>

          {/* Price & Rating Row */}
          <div className="flex items-center justify-between mb-4">
            <div>
              <p className="text-[9px] text-slate-400 font-medium mb-0.5 uppercase tracking-wider">Course Fee</p>
              <div className="flex items-center gap-1.5">
                <span className="text-lg font-bold bg-gradient-to-r from-[#E62D26] to-[#F79952] bg-clip-text text-transparent font-outfit">
                  {priceLabel || `৳${(discountPrice || price).toLocaleString()}`}
                </span>
                {!priceLabel && discountPrice && (
                  <span className="text-[10px] text-slate-300 dark:text-slate-500 line-through">৳{price.toLocaleString()}</span>
                )}
              </div>
            </div>
            <div className="flex items-center gap-1 px-2 py-1 bg-amber-50 dark:bg-amber-500/10 rounded-md">
              <FaStar className="text-amber-500 text-xs" />
              <span className="text-xs font-bold text-amber-600 dark:text-amber-400">{rating.toFixed(1)}</span>
            </div>
          </div>

          {/* Buttons - Enhanced */}
          <div className="grid grid-cols-2 gap-2 mt-auto">
            <Link
              href={`/courses/${courseId}`}
              className="flex items-center justify-center gap-1.5 py-2.5 bg-gradient-to-r from-[#E62D26] to-[#E62D26] hover:from-[#c41e18] hover:to-[#d42520] text-white rounded-lg text-xs font-semibold transition-all shadow-md shadow-[#E62D26]/20 hover:shadow-lg hover:shadow-[#E62D26]/30"
            >
              <LuBookOpenCheck size={14} />
              Details
            </Link>
            <motion.button
              whileTap={{ scale: 0.95 }}
              onClick={handleAddToCart}
              disabled={isAdded}
              className={`flex items-center justify-center gap-1.5 py-2.5 border-2 rounded-lg text-xs font-semibold transition-all ${isAdded
                  ? 'bg-emerald-500 border-emerald-500 text-white shadow-md shadow-emerald-500/20'
                  : 'bg-white dark:bg-transparent border-slate-200 dark:border-white/20 text-slate-700 dark:text-white hover:border-[#E62D26] hover:text-[#E62D26] dark:hover:border-[#E62D26] dark:hover:text-[#E62D26]'
                }`}
            >
              {isAdded ? <LuCheck size={14} /> : <LuShoppingCart size={14} />}
              {isAdded ? 'Added!' : 'Add'}
            </motion.button>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default CourseCard;
