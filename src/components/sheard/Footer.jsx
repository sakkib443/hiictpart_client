/* eslint-disable @next/next/no-img-element */
"use client";

import Link from "next/link";
import React, { useState } from "react";
import { FaFacebook, FaLinkedin, FaYoutube, FaInstagram } from "react-icons/fa";
import { IoCallOutline, IoLocationOutline, IoMailOutline } from "react-icons/io5";
import { LuSend, LuArrowUpRight, LuHeart } from "react-icons/lu";
import { useLanguage } from "@/context/LanguageContext";

const Footer = () => {
  const [email, setEmail] = useState("");
  const { t, language } = useLanguage();

  // Apply Bengali font class when language is Bengali
  const bengaliClass = language === "bn" ? "hind-siliguri" : "";

  const quickLinks = [
    { to: "/", label: t("navbar.home") },
    { to: "/about", label: t("navbar.about") },
    { to: "/courses", label: t("navbar.courses") },
    { to: "/success-story", label: t("navbar.successHistory") },
    { to: "/contact", label: t("navbar.contact") },
  ];

  const categories = [
    { key: "Programming", label: t("footer.programming") },
    { key: "Digital Marketing", label: t("footer.digitalMarketing") },
    { key: "Art & Design", label: t("footer.artDesign") },
    { key: "Networking", label: t("footer.networking") },
    { key: "Database", label: t("footer.database") },
    { key: "Language Skills", label: t("footer.languageSkills") },
  ];

  const socialLinks = [
    { icon: FaFacebook, href: "https://www.facebook.com/hiictpark", color: "#1877F2", label: "Facebook" },
    { icon: FaLinkedin, href: "https://www.linkedin.com/company/hiictpark/", color: "#0A66C2", label: "LinkedIn" },
    { icon: FaYoutube, href: "https://www.youtube.com/@hiictpark", color: "#FF0000", label: "YouTube" },
    { icon: FaInstagram, href: "https://www.instagram.com/hiictpark/", color: "#E4405F", label: "Instagram" },
  ];

  return (
    <footer className="relative bg-gradient-to-b from-gray-50 via-white to-gray-100 dark:from-[#0F172A] dark:via-[#1E293B] dark:to-[#0F172A] overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(65,191,184,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(65,191,184,0.03)_1px,transparent_1px)] bg-[size:40px_40px] dark:opacity-30"></div>

      {/* Gradient Orbs */}
      <div className="absolute top-20 left-10 w-72 h-72 bg-[#E62D26]/5 dark:bg-[#E62D26]/10 rounded-full blur-3xl"></div>
      <div className="absolute bottom-20 right-10 w-80 h-80 bg-[#F79952]/5 dark:bg-[#F79952]/10 rounded-full blur-3xl"></div>

      {/* Top CTA Section */}
      <div className="relative border-b border-gray-200 dark:border-gray-700/50">
        <div className="container mx-auto px-4 lg:px-16 py-12">
          <div className="flex flex-col lg:flex-row items-center justify-between gap-8 bg-gradient-to-r from-[#E62D26]/10 to-[#F79952]/10 dark:from-[#E62D26]/20 dark:to-[#F79952]/20 rounded-md p-6 lg:p-8 border border-gray-200 dark:border-gray-700/50">
            <div className="text-center lg:text-left">
              <h3 className={`text-xl lg:text-2xl font-bold text-gray-800 dark:text-white outfit mb-2 ${bengaliClass}`}>
                {t("footer.ctaHeading")}
              </h3>
              <p className={`text-gray-500 dark:text-gray-400 work text-sm ${bengaliClass}`}>
                {t("footer.ctaDescription")}
              </p>
            </div>
            <Link
              href="/courses"
              className={`group inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-[#E62D26] to-[#38a89d] text-white rounded-md font-semibold work hover:shadow-lg hover:shadow-[#E62D26]/30 transition-all duration-300 ${bengaliClass}`}
            >
              <span>{t("footer.exploreCourses")}</span>
              <LuArrowUpRight className="group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
            </Link>
          </div>
        </div>
      </div>

      {/* Main Footer Content */}
      <div className="relative container mx-auto px-4 lg:px-16 py-12 lg:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 lg:gap-8">

          {/* Brand Section */}
          <div className="lg:col-span-2 space-y-5">
            <Link href="/" className="inline-block">
              <img src="/images/ejobsitlogo.png" alt="eJobsIT" className="h-12 lg:h-14" />
            </Link>
            <p className={`text-gray-600 dark:text-gray-400 work text-sm leading-relaxed max-w-sm ${bengaliClass}`}>
              {t("footer.brandDescription")}
            </p>

            {/* Social Links */}
            <div className="flex gap-3">
              {socialLinks.map((social, index) => (
                <a
                  key={index}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group relative w-10 h-10 rounded-md bg-white dark:bg-[#1E293B] border border-gray-200 dark:border-gray-600/50 flex items-center justify-center hover:border-transparent hover:shadow-lg transition-all duration-300 overflow-hidden"
                  title={social.label}
                >
                  <social.icon
                    className="text-gray-500 dark:text-gray-400 group-hover:text-white transition-colors relative z-10"
                  />
                  <div
                    className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity"
                    style={{ backgroundColor: social.color }}
                  ></div>
                </a>
              ))}
            </div>

            {/* Newsletter */}
            <div className="pt-4">
              <h4 className={`text-gray-800 dark:text-white font-semibold outfit mb-3 ${bengaliClass}`}>{t("footer.subscribeNewsletter")}</h4>
              <div className="flex gap-2">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder={t("footer.enterEmail")}
                  className={`flex-1 px-4 py-2.5 bg-white dark:bg-[#1E293B] border border-gray-200 dark:border-gray-600/50 rounded-md text-gray-800 dark:text-gray-200 text-sm work placeholder:text-gray-400 dark:placeholder:text-gray-500 focus:outline-none focus:border-[#E62D26] transition-colors ${bengaliClass}`}
                />
                <button className="px-4 py-2.5 bg-[#E62D26] hover:bg-[#38a89d] text-white rounded-md transition-colors">
                  <LuSend className="text-lg" />
                </button>
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className={`text-gray-800 dark:text-white font-semibold outfit mb-5 flex items-center gap-2 ${bengaliClass}`}>
              <span className="w-2 h-2 bg-[#E62D26] rounded-full"></span>
              {t("footer.quickLinks")}
            </h4>
            <ul className="space-y-3">
              {quickLinks.map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.to}
                    className={`text-gray-600 dark:text-gray-400 hover:text-[#E62D26] text-sm work transition-colors inline-flex items-center gap-2 group ${bengaliClass}`}
                  >
                    <span className="w-0 group-hover:w-2 h-px bg-[#E62D26] transition-all duration-300"></span>
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Categories */}
          <div>
            <h4 className={`text-gray-800 dark:text-white font-semibold outfit mb-5 flex items-center gap-2 ${bengaliClass}`}>
              <span className="w-2 h-2 bg-[#F79952] rounded-full"></span>
              {t("footer.categories")}
            </h4>
            <ul className="space-y-3">
              {categories.map((cat) => (
                <li key={cat.key}>
                  <Link
                    href={`/courses?category=${encodeURIComponent(cat.key)}`}
                    className={`text-gray-600 dark:text-gray-400 hover:text-[#F79952] text-sm work transition-colors inline-flex items-center gap-2 group ${bengaliClass}`}
                  >
                    <span className="w-0 group-hover:w-2 h-px bg-[#F79952] transition-all duration-300"></span>
                    {cat.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h4 className={`text-gray-800 dark:text-white font-semibold outfit mb-5 flex items-center gap-2 ${bengaliClass}`}>
              <span className="w-2 h-2 bg-[#E62D26] rounded-full"></span>
              {t("footer.contactUs")}
            </h4>
            <ul className="space-y-4">
              <li>
                <a href="tel:+8801829818616" className="group flex items-start gap-3">
                  <div className="w-9 h-9 rounded-md bg-[#E62D26]/10 dark:bg-[#E62D26]/20 flex items-center justify-center shrink-0 group-hover:bg-[#E62D26]/20 dark:group-hover:bg-[#E62D26]/30 transition-colors">
                    <IoCallOutline className="text-[#E62D26]" />
                  </div>
                  <div>
                    <p className={`text-xs text-gray-400 dark:text-gray-500 work ${bengaliClass}`}>{t("footer.phone")}</p>
                    <p className="text-gray-700 dark:text-gray-300 text-sm work group-hover:text-[#E62D26] transition-colors">+880 1829-818616</p>
                  </div>
                </a>
              </li>
              <li>
                <a href="mailto:info@hiictpark.com" className="group flex items-start gap-3">
                  <div className="w-9 h-9 rounded-md bg-[#F79952]/10 dark:bg-[#F79952]/20 flex items-center justify-center shrink-0 group-hover:bg-[#F79952]/20 dark:group-hover:bg-[#F79952]/30 transition-colors">
                    <IoMailOutline className="text-[#F79952]" />
                  </div>
                  <div>
                    <p className={`text-xs text-gray-400 dark:text-gray-500 work ${bengaliClass}`}>{t("footer.email")}</p>
                    <p className="text-gray-700 dark:text-gray-300 text-sm work group-hover:text-[#F79952] transition-colors break-all">info@hiictpark.com</p>
                  </div>
                </a>
              </li>
              <li>
                <div className="group flex items-start gap-3">
                  <div className="w-9 h-9 rounded-md bg-[#E62D26]/10 dark:bg-[#E62D26]/20 flex items-center justify-center shrink-0">
                    <IoLocationOutline className="text-[#E62D26]" />
                  </div>
                  <div>
                    <p className={`text-xs text-gray-400 dark:text-gray-500 work ${bengaliClass}`}>{t("footer.address")}</p>
                    <p className={`text-gray-700 dark:text-gray-300 text-sm work ${bengaliClass}`}>{t("footer.addressValue")}</p>
                  </div>
                </div>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="relative border-t border-gray-200 dark:border-gray-700/50 bg-white/50 dark:bg-[#0F172A]/80">
        <div className="container mx-auto px-4 lg:px-16 py-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <p className={`text-gray-500 dark:text-gray-400 text-sm work text-center md:text-left ${bengaliClass}`}>
              {t("footer.copyright")}
            </p>
            <div className="flex items-center gap-6">
              <span className="text-gray-400 dark:text-gray-500 text-xs work">
                {t("footer.tradeLicense")}
              </span>
              <span className={`text-gray-500 dark:text-gray-400 text-sm work flex items-center gap-1 ${bengaliClass}`}>
                {t("footer.madeWith")} <LuHeart className="text-red-500 text-xs" /> {t("footer.inBangladesh")}
              </span>
              <span className={`text-gray-500 dark:text-gray-400 text-sm work flex items-center gap-1 ${bengaliClass}`}>
                Developed by <a href="https://extrainweb.com" target="_blank" rel="noopener noreferrer" className="font-bold hover:text-[#E62D26] transition-colors">Extrain Web</a>
              </span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
