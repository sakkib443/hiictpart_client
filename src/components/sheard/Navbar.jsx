"use client";

import Link from "next/link";
import Image from "next/image";
import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { BiCategory, BiMenu, BiX } from "react-icons/bi";
import {
  LuBookOpenCheck, LuChevronDown, LuLogOut,
  LuLayoutDashboard, LuShoppingCart, LuSearch,
  LuSparkles, LuUser, LuArrowRight, LuSun, LuMoon, LuChevronRight,
  LuCode, LuGlobe, LuBookOpen, LuLayers, LuPalette, LuCpu, LuDatabase, LuSmartphone
} from "react-icons/lu";
import { HiOutlineSparkles, HiOutlineUserCircle } from "react-icons/hi2";
import { useSelector } from "react-redux";
import LanguageSwitcher from "./LanguageSwitcher";
import { useLanguage } from "@/context/LanguageContext";
import { motion, AnimatePresence } from "framer-motion";

import { API_BASE_URL as API_URL } from "@/config/api";

// Category icons mapping
const categoryIcons = {
  'web-development': LuGlobe,
  'programming': LuCode,
  'design': LuPalette,
  'database': LuDatabase,
  'mobile': LuSmartphone,
  'software': LuCpu,
  'default': LuLayers
};

// Category Mega Menu Component
const CategoryMegaMenu = ({ closeMobileMenu, language, bengaliClass, t }) => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeParent, setActiveParent] = useState(null);
  const router = useRouter();

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await fetch(`${API_URL}/categories`);
        const data = await res.json();
        if (data.success) {
          // Organize categories into parent and child structure
          const allCategories = data.data || [];
          const parentCategories = allCategories.filter(cat => !cat.parentCategory);
          const organized = parentCategories.map(parent => ({
            ...parent,
            children: allCategories.filter(cat =>
              cat.parentCategory &&
              (cat.parentCategory._id === parent._id || cat.parentCategory === parent._id)
            )
          }));
          setCategories(organized);
          if (organized.length > 0) {
            setActiveParent(organized[0]._id);
          }
        }
      } catch (error) {
        console.error('Error fetching categories:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchCategories();
  }, []);

  const handleCategoryClick = (slug, type) => {
    closeMobileMenu();
    if (type === 'course') {
      router.push(`/courses?category=${slug}`);
    } else if (type === 'website') {
      router.push(`/website?category=${slug}`);
    } else if (type === 'software') {
      router.push(`/software?category=${slug}`);
    } else {
      router.push(`/courses?category=${slug}`);
    }
  };

  const getIcon = (slug) => {
    const IconComponent = categoryIcons[slug] || categoryIcons['default'];
    return IconComponent;
  };

  if (loading) {
    return (
      <div className="p-8 flex items-center justify-center">
        <div className="w-8 h-8 border-3 border-red-500/30 border-t-red-500 rounded-full animate-spin"></div>
      </div>
    );
  }

  if (categories.length === 0) {
    return (
      <div className="p-8 text-center text-gray-500">
        <p className={bengaliClass}>{language === 'bn' ? t("navbar.noCategories") : 'No categories found'}</p>
      </div>
    );
  }

  const activeCategory = categories.find(cat => cat._id === activeParent);

  return (
    <div className="flex h-[400px]">
      {/* Left Side - Parent Categories */}
      <div className="w-[240px] bg-white dark:bg-gray-900/50 p-2 border-r border-gray-100 dark:border-gray-800 overflow-y-auto custom-scrollbar">
        <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400 dark:text-gray-500 mb-3 px-3 mt-2">
          {language === 'bn' ? 'ক্যাটাগরি' : 'Categories'}
        </p>
        <div className="space-y-1">
          {categories.map((category) => {
            const Icon = getIcon(category.slug);
            const isActive = activeParent === category._id;
            return (
              <button
                key={category._id}
                onMouseEnter={() => setActiveParent(category._id)}
                onClick={() => handleCategoryClick(category.slug, category.type)}
                className={`w-full flex items-center justify-between gap-3 px-3 py-3 rounded-xl transition-all ${isActive
                  ? 'bg-red-50 dark:bg-red-500/10 text-red-600 dark:text-red-400 font-semibold'
                  : 'text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800'
                  }`}
              >
                <div className="flex items-center gap-3">
                  <Icon size={18} className={isActive ? 'text-red-500' : 'text-gray-400'} />
                  <span className={`text-[13px] ${bengaliClass}`}>
                    {language === 'bn' && category.nameBn ? category.nameBn : category.name}
                  </span>
                </div>
                {category.children && category.children.length > 0 && (
                  <LuChevronRight size={14} className={`transition-transform opacity-50 ${isActive ? 'translate-x-1 opacity-100' : ''}`} />
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Right Side - Child Categories */}
      <div className="flex-1 p-6 overflow-y-auto bg-gray-50/50 dark:bg-black/20">
        {activeCategory && (
          <div className="h-full flex flex-col">
            {/* Active Parent Header */}
            <div className="flex items-center gap-4 pb-6 mb-2">
              <div className="w-12 h-12 rounded-2xl bg-white dark:bg-gray-800 flex items-center justify-center text-red-500 shadow-sm border border-gray-100 dark:border-gray-700">
                {(() => {
                  const Icon = getIcon(activeCategory.slug);
                  return <Icon size={24} />;
                })()}
              </div>
              <div>
                <h4 className={`text-lg font-bold text-gray-900 dark:text-white ${bengaliClass}`}>
                  {language === 'bn' && activeCategory.nameBn ? activeCategory.nameBn : activeCategory.name}
                </h4>
                <p className={`text-xs text-gray-500 dark:text-gray-400 ${bengaliClass}`}>
                  {activeCategory.children?.length || 0} {language === 'bn' ? 'টি সাব-ক্যাটাগরি' : 'subcategories'}
                </p>
              </div>
            </div>

            {/* Child Categories Grid */}
            {activeCategory.children && activeCategory.children.length > 0 ? (
              <div className="grid grid-cols-2 gap-3 content-start">
                {activeCategory.children.map((child) => (
                  <button
                    key={child._id}
                    onClick={() => handleCategoryClick(child.slug, child.type)}
                    className="flex items-center gap-3 p-3 rounded-xl bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 hover:border-red-200 dark:hover:border-red-500/30 hover:shadow-md transition-all group text-left"
                  >
                    <div className="w-8 h-8 rounded-lg bg-gray-50 dark:bg-gray-700 flex items-center justify-center group-hover:bg-red-50 dark:group-hover:bg-red-500/20 transition-colors">
                      <div className="w-2 h-2 rounded-full bg-gray-400 group-hover:bg-red-500 transition-colors"></div>
                    </div>
                    <span className={`text-sm font-medium text-gray-700 dark:text-gray-200 group-hover:text-red-600 dark:group-hover:text-red-400 ${bengaliClass}`}>
                      {language === 'bn' && child.nameBn ? child.nameBn : child.name}
                    </span>
                  </button>
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center flex-1 text-center opacity-60">
                <LuLayers className="text-gray-400 mb-3" size={32} />
                <p className={`text-sm text-gray-500 dark:text-gray-400 ${bengaliClass}`}>
                  {language === 'bn' ? 'কোনো সাব-ক্যাটাগরি নেই' : 'No subcategories available'}
                </p>
                <button
                  onClick={() => handleCategoryClick(activeCategory.slug, activeCategory.type)}
                  className={`mt-4 px-4 py-2 bg-red-50 text-red-600 text-xs font-bold rounded-lg ${bengaliClass}`}
                >
                  {language === 'bn' ? 'সব দেখুন' : 'View All'}
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};


const Navbar = () => {
  const [isSticky, setIsSticky] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [user, setUser] = useState(null);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);
  const pathname = usePathname();
  const router = useRouter();
  const { items = [] } = useSelector((state) => state.cart || {});
  const { t, language } = useLanguage();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Dark mode toggle handler
  useEffect(() => {
    try {
      if (typeof window !== 'undefined') {
        const savedTheme = localStorage.getItem("theme");
        if (savedTheme === "dark") {
          setIsDarkMode(true);
          document.documentElement.classList.add("dark");
        }
      }
    } catch (error) {
      console.error("Error loading theme:", error);
    }
  }, []);

  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode);
    try {
      if (typeof window !== 'undefined') {
        if (!isDarkMode) {
          document.documentElement.classList.add("dark");
          localStorage.setItem("theme", "dark");
        } else {
          document.documentElement.classList.remove("dark");
          localStorage.setItem("theme", "light");
        }
      }
    } catch (error) {
      console.error("Error saving theme:", error);
    }
  };

  useEffect(() => {
    try {
      if (typeof window !== 'undefined') {
        const storedUser = localStorage.getItem("user");
        if (storedUser) {
          setTimeout(() => setUser(JSON.parse(storedUser)), 0);
        }
      }
    } catch (error) {
      console.error("Error loading user:", error);
    }
  }, []);

  const handleLogout = () => {
    try {
      if (typeof window !== 'undefined') {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
      }
    } catch (error) {
      console.error("Error during logout:", error);
    }
    setUser(null);
    closeMobileMenu();
    router.replace("/login");
  };

  useEffect(() => {
    const handleScroll = () => {
      setIsSticky(window.scrollY > 10);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Close profile dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (isProfileDropdownOpen && !event.target.closest('.profile-dropdown-container')) {
        setIsProfileDropdownOpen(false);
      }
    };
    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, [isProfileDropdownOpen]);

  const toggleMobileMenu = () => setIsMobileMenuOpen(!isMobileMenuOpen);
  const closeMobileMenu = () => setIsMobileMenuOpen(false);

  // Design Template submenu items
  const designTemplateSubmenu = [
    { href: "/website", label: language === 'bn' ? "ওয়েবসাইট" : "Website", icon: LuGlobe },
    { href: "/design-template", label: language === 'bn' ? "ডিজাইন টেমপ্লেট" : "Design Template", icon: LuPalette },
  ];

  const menu = [
    { href: "/", label: t("navbar.home") },
    { href: "/courses", label: t("navbar.courses") },
    { href: "#", label: language === 'bn' ? "ডিজাইন টেমপ্লেট" : "Design Template", hasSubmenu: true, submenu: designTemplateSubmenu },
    { href: "/blog", label: language === 'bn' ? "ব্লগ" : "Blog" },
    { href: "/about", label: t("navbar.about") },
    { href: "/contact", label: t("navbar.contact") },
  ];

  const bengaliClass = language === "bn" ? "hind-siliguri" : "";

  return (
    <>
      <AnimatePresence>
        {isMobileMenuOpen && (
          <>
            {/* Mobile Menu Overlay */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={closeMobileMenu}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[60] lg:hidden"
            />

            {/* Mobile Menu Panel */}
            <motion.div
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "spring", damping: 30, stiffness: 300 }}
              className="fixed lg:hidden top-0 left-0 w-[85%] max-w-[320px] h-full bg-white dark:bg-[#0f0f0f] z-[70] shadow-2xl flex flex-col border-r border-gray-100 dark:border-gray-800"
            >
              {/* Mobile Menu Header */}
              <div className="flex items-center justify-between p-5 border-b border-gray-100 dark:border-gray-800">
                <Link href="/" onClick={closeMobileMenu}>
                  <img className="w-32" src="/images/ejobsitlogo.png" alt="Hi Ict Park" />
                </Link>
                <button
                  onClick={closeMobileMenu}
                  className="w-8 h-8 flex items-center justify-center rounded-full bg-gray-50 dark:bg-gray-800 text-gray-500 dark:text-gray-400 hover:text-red-500 transition-colors"
                >
                  <BiX className="text-xl" />
                </button>
              </div>

              {/* Mobile Scroll Content */}
              <div className="flex-1 overflow-y-auto p-5 scrollbar-hide">
                {/* Mobile settings row */}
                <div className="flex gap-3 mb-6">
                  {/* Language */}
                  <div className="flex-1 bg-gray-50 dark:bg-gray-800/50 rounded-xl p-3 border border-gray-100 dark:border-gray-800">
                    <p className="text-[10px] uppercase font-bold text-gray-400 mb-2">Language</p>
                    <LanguageSwitcher variant="compact" />
                  </div>
                  {/* Theme */}
                  <button
                    onClick={toggleDarkMode}
                    className="flex-1 bg-gray-50 dark:bg-gray-800/50 rounded-xl p-3 border border-gray-100 dark:border-gray-800 flex flex-col items-start"
                  >
                    <p className="text-[10px] uppercase font-bold text-gray-400 mb-2">Theme</p>
                    <div className="flex items-center gap-2">
                      {isDarkMode ? <LuMoon className="text-amber-400" /> : <LuSun className="text-amber-500" />}
                      <span className="text-sm font-medium text-gray-700 dark:text-gray-300">{isDarkMode ? 'Dark' : 'Light'}</span>
                    </div>
                  </button>
                </div>

                {/* Main Navigation */}
                <nav className="space-y-1">
                  {menu.map(({ href, label, hasSubmenu, submenu }) => (
                    hasSubmenu ? (
                      <div key={label} className="space-y-1">
                        <div className="flex items-center justify-between px-3 py-3 rounded-lg text-gray-800 dark:text-gray-200 font-medium">
                          <span className={bengaliClass}>{label}</span>
                          <LuChevronDown size={14} className="text-gray-400" />
                        </div>
                        <div className="pl-4 space-y-1 border-l-2 border-gray-100 dark:border-gray-800 ml-3">
                          {submenu.map((item) => (
                            <Link
                              key={item.href}
                              href={item.href}
                              onClick={closeMobileMenu}
                              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-all ${pathname === item.href
                                ? "text-red-600 bg-red-50 dark:bg-red-500/10 font-medium"
                                : "text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
                                }`}
                            >
                              <item.icon size={16} />
                              <span className={bengaliClass}>{item.label}</span>
                            </Link>
                          ))}
                        </div>
                      </div>
                    ) : (
                      <Link
                        key={href}
                        href={href}
                        onClick={closeMobileMenu}
                        className={`flex items-center justify-between px-3 py-3 rounded-lg transition-all ${pathname === href
                          ? "bg-red-50 dark:bg-red-500/10 text-red-600 dark:text-red-400 font-medium"
                          : "text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800"
                          }`}
                      >
                        <span className={`text-[15px] ${bengaliClass}`}>{label}</span>
                      </Link>
                    )
                  ))}
                </nav>
              </div>

              {/* Mobile Auth Footer */}
              <div className="p-5 border-t border-gray-100 dark:border-gray-800 bg-gray-50/50 dark:bg-gray-900">
                {user ? (
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-red-500 text-white flex items-center justify-center font-bold text-lg overflow-hidden border-2 border-white shadow-md">
                      {user.image ? <img src={user.image} alt={user.name} className="w-full h-full object-cover" /> : (user.name?.charAt(0) || "U")}
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-bold text-gray-900 dark:text-white truncate">{user.name}</p>
                      <button onClick={handleLogout} className="text-xs text-red-500 font-medium hover:underline">Sign Out</button>
                    </div>
                    <Link href="/dashboard/user" onClick={closeMobileMenu} className="p-2 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 text-gray-500">
                      <LuLayoutDashboard />
                    </Link>
                  </div>
                ) : (
                  <div className="grid grid-cols-2 gap-3">
                    <Link href="/login" onClick={closeMobileMenu} className="py-3 text-center rounded-xl border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 font-semibold text-sm hover:bg-white transition-all">Sign In</Link>
                    <Link href="/register" onClick={closeMobileMenu} className="py-3 text-center rounded-xl bg-red-500 text-white font-semibold text-sm shadow-lg shadow-red-500/20 hover:bg-red-600 transition-all">Register</Link>
                  </div>
                )}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      <nav
        className={`sticky top-0 z-50 transition-all duration-300 border-b ${isSticky
          ? "bg-white/80 dark:bg-[#0a0a0a]/80 backdrop-blur-xl border-gray-200/50 dark:border-gray-800 py-3 shadow-sm"
          : "bg-white dark:bg-black border-transparent py-5"
          }`}
      >
        <div className="container mx-auto px-4 lg:px-8 max-w-[1440px]">
          <div className="flex items-center justify-between gap-6">

            {/* Left: Logo & Categories */}
            <div className="flex items-center gap-10">
              <Link href="/" className="relative flex-shrink-0">
                <img
                  className={`transition-all duration-300 ${isSticky ? "w-32 lg:w-36" : "w-36 lg:w-40"}`}
                  src="/images/ejobsitlogo.png"
                  alt="Hi Ict Park"
                />
              </Link>

              {/* Category Dropdown - Desktop */}
              <div className="hidden lg:block relative group">
                <button className="flex items-center gap-2 text-[14px] font-semibold text-gray-600 dark:text-gray-300 hover:text-red-500 dark:hover:text-red-400 transition-colors">
                  <span className={`tracking-wide ${language === 'bn' ? 'hind-siliguri' : ''}`}>
                    {t("navbar.category")}
                  </span>
                  <LuChevronDown className="text-gray-400 group-hover:rotate-180 transition-transform duration-300" size={16} />
                </button>

                {/* Categories Mega Menu */}
                <div className="absolute top-full left-0 mt-6 w-[700px] bg-white dark:bg-[#151515] rounded-2xl shadow-[0_20px_60px_-15px_rgba(0,0,0,0.1)] dark:shadow-black/50 border border-gray-100 dark:border-gray-800/50 opacity-0 invisible group-hover:opacity-100 group-hover:visible group-hover:translate-y-0 translate-y-4 transition-all duration-300 z-50 overflow-hidden">
                  <CategoryMegaMenu closeMobileMenu={closeMobileMenu} language={language} bengaliClass={bengaliClass} t={t} />
                </div>
              </div>
            </div>

            {/* Center: Navigation Links - Desktop */}
            <div className="hidden xl:flex items-center gap-1">
              {menu.map(({ href, label, hasSubmenu, submenu }) => (
                hasSubmenu ? (
                  <div key={label} className="relative group px-3 py-2">
                    <button
                      className={`flex items-center gap-1.5 text-[15px] font-medium transition-colors duration-200 ${pathname.includes(href) ? "text-red-600 dark:text-red-400" : "text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
                        } ${language === 'bn' ? 'hind-siliguri' : ''}`}
                    >
                      {label}
                      <LuChevronDown size={12} className="opacity-50 group-hover:rotate-180 transition-transform" />
                    </button>
                    {/* Dropdown */}
                    <div className="absolute top-full left-1/2 -translate-x-1/2 mt-2 w-56 bg-white dark:bg-[#151515] rounded-xl shadow-xl border border-gray-100 dark:border-gray-800 opacity-0 invisible group-hover:opacity-100 group-hover:visible translate-y-2 group-hover:translate-y-0 transition-all duration-200 z-50 p-2">
                      {submenu.map((item) => (
                        <Link
                          key={item.href}
                          href={item.href}
                          className={`flex items-center gap-3 px-4 py-3 rounded-lg text-sm transition-all hover:bg-gray-50 dark:hover:bg-white/5 ${pathname === item.href ? 'text-red-600 font-medium bg-red-50 dark:bg-white/5' : 'text-gray-600 dark:text-gray-400'} ${language === 'bn' ? 'hind-siliguri' : ''}`}
                        >
                          <item.icon size={16} />
                          <span>{item.label}</span>
                        </Link>
                      ))}
                    </div>
                  </div>
                ) : (
                  <Link
                    key={href}
                    href={href}
                    className={`px-4 py-2 text-[15px] font-medium transition-colors duration-200 ${pathname === href
                      ? "text-red-600 dark:text-red-400"
                      : "text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
                      } ${language === 'bn' ? 'hind-siliguri' : ''}`}
                  >
                    {label}
                  </Link>
                )
              ))}
            </div>

            {/* Right: Actions */}
            <div className="flex items-center gap-3 lg:gap-5">

              {/* Language Switcher */}
              <div className="hidden lg:block">
                <LanguageSwitcher />
              </div>

              {/* Theme Toggle */}
              <button
                onClick={toggleDarkMode}
                className="hidden lg:flex w-9 h-9 items-center justify-center rounded-full text-gray-500 hover:bg-gray-100 dark:hover:bg-white/10 transition-all"
              >
                {isDarkMode ? <LuMoon size={18} /> : <LuSun size={18} />}
              </button>

              {/* Cart */}
              <Link href="/cart" className="relative w-9 h-9 flex items-center justify-center rounded-full text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white transition-all">
                <LuShoppingCart size={20} />
                {mounted && items.length > 0 && (
                  <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center border-2 border-white dark:border-black">
                    {items.length}
                  </span>
                )}
              </Link>

              {/* Profile / Auth */}
              {mounted && user ? (
                <div className="profile-dropdown-container relative hidden sm:block">
                  <button
                    onClick={() => setIsProfileDropdownOpen(!isProfileDropdownOpen)}
                    className="flex items-center gap-3 pl-1 pr-1 py-1 rounded-full hover:bg-gray-50 dark:hover:bg-white/5 transition-all"
                  >
                    <div className="w-9 h-9 rounded-full border border-gray-200 dark:border-gray-700 overflow-hidden">
                      {user.image ? (
                        <img src={user.image} alt="User" className="w-full h-full object-cover" />
                      ) : (
                        <div className="w-full h-full bg-red-500 flex items-center justify-center text-white text-xs font-bold uppercase">
                          {(user.name || "U").charAt(0)}
                        </div>
                      )}
                    </div>
                  </button>

                  {/* Profile Dropdown */}
                  <AnimatePresence>
                    {isProfileDropdownOpen && (
                      <motion.div
                        initial={{ opacity: 0, y: 10, scale: 0.98 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 10, scale: 0.98 }}
                        transition={{ duration: 0.15 }}
                        className="absolute top-full right-0 mt-3 w-64 bg-white dark:bg-[#151515] rounded-2xl shadow-xl border border-gray-100 dark:border-gray-800 overflow-hidden z-50"
                      >
                        <div className="p-5 border-b border-gray-100 dark:border-gray-800">
                          <p className="font-bold text-gray-900 dark:text-white truncate">{user.name}</p>
                          <p className="text-xs text-gray-500 dark:text-gray-400 truncate mt-0.5">{user.email || user.gmail}</p>
                        </div>
                        <div className="p-2">
                          <Link href={user.role === 'admin' ? "/dashboard/admin" : user.role === 'mentor' ? "/dashboard/mentor" : "/dashboard/user"}
                            onClick={() => setIsProfileDropdownOpen(false)}
                            className="flex items-center gap-3 px-4 py-3 rounded-lg text-sm text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-white/5 transition-colors"
                          >
                            <LuLayoutDashboard size={16} />
                            <span>Dashboard</span>
                          </Link>
                          <button
                            onClick={() => {
                              setIsProfileDropdownOpen(false);
                              handleLogout();
                            }}
                            className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm text-red-600 hover:bg-red-50 dark:hover:bg-red-900/10 transition-colors"
                          >
                            <LuLogOut size={16} />
                            <span>Log Out</span>
                          </button>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              ) : mounted ? (
                <Link href="/login" className="hidden sm:inline-flex items-center gap-2 px-6 py-2.5 rounded-full bg-red-600 hover:bg-red-700 text-white text-[14px] font-semibold transition-all shadow-lg shadow-red-500/20">
                  <span>Sign In</span>
                  <LuArrowRight size={16} />
                </Link>
              ) : (
                <div className="w-24 h-9 bg-gray-100 dark:bg-gray-800 rounded-full animate-pulse hidden sm:block"></div>
              )}

              {/* Mobile Toggle */}
              <button
                className="lg:hidden w-10 h-10 flex items-center justify-center rounded-full hover:bg-gray-100 dark:hover:bg-white/10 text-gray-900 dark:text-white transition-all"
                onClick={toggleMobileMenu}
              >
                <BiMenu size={24} />
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Global Styles for Fonts */}
      <style jsx global>{`
        .outfit { font-family: 'Outfit', sans-serif; }
        .hind-siliguri { font-family: 'Hind Siliguri', sans-serif; }
        /* Hide scrollbar for Chrome, Safari and Opera */
        .scrollbar-hide::-webkit-scrollbar {
            display: none;
        }
        /* Hide scrollbar for IE, Edge and Firefox */
        .scrollbar-hide {
            -ms-overflow-style: none;  /* IE and Edge */
            scrollbar-width: none;  /* Firefox */
        }
        
        /* Custom Scrollbar for Mega Menu */
        .custom-scrollbar::-webkit-scrollbar {
          width: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background-color: rgba(156, 163, 175, 0.3);
          border-radius: 20px;
        }
      `}</style>
    </>
  );
};

export default Navbar;
