"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  LuMail,
  LuPhone,
  LuMapPin,
  LuSend,
  LuClock,
  LuArrowRight,
  LuMessageCircle,
  LuCheck,
  LuHeadphones
} from "react-icons/lu";
import { FaFacebookF, FaYoutube, FaLinkedinIn, FaWhatsapp, FaInstagram } from "react-icons/fa";
import { useLanguage } from "@/context/LanguageContext";

import { API_BASE_URL as API_URL } from "@/config/api";

const ContactPage = () => {
  const { t, language } = useLanguage();
  const bengaliClass = language === "bn" ? "hind-siliguri" : "";
  const [isVisible, setIsVisible] = useState(false);
  const [loading, setLoading] = useState(true);

  const [messageSent, setMessageSent] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });

  // Dynamic content from API
  const [content, setContent] = useState({
    hero: {
      badge: 'Get In Touch',
      badgeBn: 'যোগাযোগ করুন',
      title1: "Let's ",
      title1Bn: 'আমাদের সাথে ',
      title2: 'Connect',
      title2Bn: 'যোগাযোগ করুন',
      subtitle: 'Have questions? We would love to hear from you. Send us a message and we will respond as soon as possible.',
      subtitleBn: 'কোন প্রশ্ন আছে? আমরা আপনার কথা শুনতে চাই। আমাদের একটি বার্তা পাঠান।'
    },
    contactInfo: {
      email: 'info@hiictpark.com',
      phone: '+880 1829-818616',
      address: 'Narail, Dhaka, Bangladesh',
      addressBn: 'নড়াইল, ঢাকা, বাংলাদেশ',
      officeHours: 'Sat - Thu: 10:00 AM - 6:00 PM',
      officeHoursBn: 'শনি - বৃহঃ: সকাল ১০টা - সন্ধ্যা ৬টা'
    },
    socialLinks: {
      facebook: 'https://www.facebook.com/hiictpark',
      youtube: 'https://www.youtube.com/@hiictpark',
      linkedin: 'https://www.linkedin.com/company/hiictpark',
      whatsapp: 'https://wa.me/8801829818616',
      instagram: 'https://www.instagram.com/hiictpark/'
    },
    whatsappSection: {
      title: 'Need Quick Help?',
      titleBn: 'দ্রুত সাহায্য দরকার?',
      description: 'Chat with us on WhatsApp for instant support and answers to your questions.',
      descriptionBn: 'হোয়াটসঅ্যাপে আমাদের সাথে চ্যাট করুন।',
      buttonText: 'Chat on WhatsApp',
      buttonTextBn: 'হোয়াটসঅ্যাপে চ্যাট করুন'
    },
    mapEmbedUrl: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3651.8986834879085!2d90.41723!3d23.7656976!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3755c754583dd209%3A0xdd0c5fcc7d2d3836!2sDaisy%20Garden!5e0!3m2!1sen!2sbd!4v1704532086149!5m2!1sen!2sbd'
  });

  // Fetch dynamic content
  useEffect(() => {
    const fetchContent = async () => {
      try {
        const res = await fetch(`${API_URL}/design/contact`);
        const data = await res.json();
        if (data.success && data.data?.contactContent) {
          setContent(data.data.contactContent);
        }
      } catch (error) {
        console.error('Error fetching contact content:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchContent();
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), 100);
    return () => clearTimeout(timer);
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    setMessageSent(true);
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  // Dynamic contact info cards
  const contactInfoCards = [
    {
      icon: LuMail,
      title: language === "bn" ? "ইমেইল করুন" : "Email Us",
      value: content.contactInfo.email,
      link: `mailto:${content.contactInfo.email}`,
      color: "#E62D26",
    },
    {
      icon: LuPhone,
      title: language === "bn" ? "কল করুন" : "Call Us",
      value: content.contactInfo.phone,
      link: `tel:${content.contactInfo.phone.replace(/\s/g, '')}`,
      color: "#F79952",
    },
    {
      icon: LuMapPin,
      title: language === "bn" ? "আমাদের অফিস" : "Visit Us",
      value: language === "bn" ? content.contactInfo.addressBn : content.contactInfo.address,
      link: "#map",
      color: "#8B5CF6",
    },
    {
      icon: LuClock,
      title: language === "bn" ? "অফিস সময়" : "Office Hours",
      value: language === "bn" ? content.contactInfo.officeHoursBn : content.contactInfo.officeHours,
      link: null,
      color: "#10B981",
    },
  ];

  const socialLinks = [
    { icon: FaFacebookF, href: content.socialLinks.facebook, label: "Facebook", bg: "bg-blue-500/10 hover:bg-blue-500" },
    { icon: FaYoutube, href: content.socialLinks.youtube, label: "YouTube", bg: "bg-red-500/10 hover:bg-red-500" },
    { icon: FaLinkedinIn, href: content.socialLinks.linkedin, label: "LinkedIn", bg: "bg-sky-500/10 hover:bg-sky-500" },
    { icon: FaWhatsapp, href: content.socialLinks.whatsapp, label: "WhatsApp", bg: "bg-green-500/10 hover:bg-green-500" },
    { icon: FaInstagram, href: content.socialLinks.instagram, label: "Instagram", bg: "bg-pink-500/10 hover:bg-pink-500" },
  ];

  return (
    <div className="min-h-screen bg-white dark:bg-[#0a0a0a]">
      {/* Success Modal */}
      {messageSent && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40"
            onClick={() => setMessageSent(false)}
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-50 w-11/12 max-w-md bg-white dark:bg-[#0d0d0d] rounded-2xl shadow-2xl p-8 text-center border border-slate-100 dark:border-white/10"
          >
            <div className="w-16 h-16 bg-gradient-to-br from-[#E62D26] to-[#F79952] rounded-full flex items-center justify-center mx-auto mb-5">
              <LuCheck className="text-white text-2xl" />
            </div>
            <h3 className={`text-xl font-bold text-slate-800 dark:text-white mb-2 ${bengaliClass}`}>
              {language === "bn" ? "বার্তা পাঠানো হয়েছে!" : "Message Sent!"}
            </h3>
            <p className={`text-slate-500 dark:text-slate-400 text-sm mb-6 ${bengaliClass}`}>
              {language === "bn" ? "আমরা শীঘ্রই আপনার সাথে যোগাযোগ করব।" : "We'll get back to you soon."}
            </p>
            <button
              onClick={() => setMessageSent(false)}
              className={`px-6 py-2.5 bg-gradient-to-r from-[#E62D26] to-[#F79952] text-white font-semibold text-sm rounded-lg transition-all hover:shadow-lg ${bengaliClass}`}
            >
              {language === "bn" ? "বন্ধ করুন" : "Close"}
            </button>
          </motion.div>
        </>
      )}

      {/* Hero Section - Clean, No Background Effects */}
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
                {language === "bn" ? content.hero.badgeBn : content.hero.badge}
              </span>
            </div>

            {/* Title */}
            <h1 className={`text-2xl md:text-3xl lg:text-4xl font-bold text-slate-800 dark:text-white mb-3 outfit leading-tight ${bengaliClass}`}>
              {language === "bn" ? content.hero.title1Bn : content.hero.title1}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#E62D26] to-[#F79952]">
                {language === "bn" ? content.hero.title2Bn : content.hero.title2}
              </span>
            </h1>

            {/* Description */}
            <p className={`text-slate-500 dark:text-slate-400 text-xs lg:text-sm max-w-xl mx-auto leading-relaxed ${bengaliClass}`}>
              {language === "bn" ? content.hero.subtitleBn : content.hero.subtitle}
            </p>
          </motion.div>
        </div>
      </section>

      {/* Contact Info Cards */}
      <section className="py-8 lg:py-10 bg-white dark:bg-[#0a0a0a]">
        <div className="container mx-auto px-4 lg:px-16">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {contactInfoCards.map((item, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: isVisible ? 1 : 0, y: isVisible ? 0 : 20 }}
                transition={{ duration: 0.5, delay: idx * 0.1 }}
                className="group bg-slate-50 dark:bg-white/5 rounded-xl p-5 border border-slate-100 dark:border-white/10 hover:border-[#E62D26]/30 hover:shadow-md transition-all"
              >
                <div
                  className="w-10 h-10 rounded-lg flex items-center justify-center mb-3 transition-transform group-hover:scale-110"
                  style={{ backgroundColor: `${item.color}15` }}
                >
                  <item.icon className="text-lg" style={{ color: item.color }} />
                </div>
                <h3 className={`text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1.5 ${bengaliClass}`}>
                  {item.title}
                </h3>
                {item.link ? (
                  <a
                    href={item.link}
                    className={`text-slate-800 dark:text-white font-medium text-sm hover:text-[#E62D26] transition-colors ${bengaliClass}`}
                  >
                    {item.value}
                  </a>
                ) : (
                  <p className={`text-slate-800 dark:text-white font-medium text-sm ${bengaliClass}`}>
                    {item.value}
                  </p>
                )}
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Main Content - Form & Map */}
      <section className="py-12 lg:py-16 bg-slate-50 dark:bg-[#0d0d0d]">
        <div className="container mx-auto px-4 lg:px-16">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Contact Form */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: isVisible ? 1 : 0, x: isVisible ? 0 : -20 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="bg-white dark:bg-white/5 rounded-2xl p-6 lg:p-8 border border-slate-100 dark:border-white/10 shadow-sm"
            >
              <div className="flex items-center gap-2 mb-5">
                <div className="w-8 h-8 bg-gradient-to-br from-[#E62D26]/10 to-[#F79952]/10 rounded-lg flex items-center justify-center">
                  <LuSend className="text-[#E62D26] text-sm" />
                </div>
                <h2 className={`text-lg lg:text-xl font-bold text-slate-800 dark:text-white ${bengaliClass}`}>
                  {language === "bn" ? "বার্তা পাঠান" : "Send a Message"}
                </h2>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="name" className={`block text-xs font-semibold text-slate-600 dark:text-slate-300 mb-1.5 ${bengaliClass}`}>
                      {language === "bn" ? "আপনার নাম" : "Your Name"}
                    </label>
                    <input
                      type="text"
                      id="name"
                      value={formData.name}
                      onChange={handleChange}
                      className="w-full px-4 py-3 bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-lg focus:ring-2 focus:ring-[#E62D26]/50 focus:border-[#E62D26] outline-none transition-all text-slate-800 dark:text-white text-sm placeholder-slate-400"
                      placeholder="John Doe"
                      required
                    />
                  </div>
                  <div>
                    <label htmlFor="email" className={`block text-xs font-semibold text-slate-600 dark:text-slate-300 mb-1.5 ${bengaliClass}`}>
                      {language === "bn" ? "ইমেইল ঠিকানা" : "Email Address"}
                    </label>
                    <input
                      type="email"
                      id="email"
                      value={formData.email}
                      onChange={handleChange}
                      className="w-full px-4 py-3 bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-lg focus:ring-2 focus:ring-[#E62D26]/50 focus:border-[#E62D26] outline-none transition-all text-slate-800 dark:text-white text-sm placeholder-slate-400"
                      placeholder="you@example.com"
                      required
                    />
                  </div>
                </div>
                <div>
                  <label htmlFor="subject" className={`block text-xs font-semibold text-slate-600 dark:text-slate-300 mb-1.5 ${bengaliClass}`}>
                    {language === "bn" ? "বিষয়" : "Subject"}
                  </label>
                  <input
                    type="text"
                    id="subject"
                    value={formData.subject}
                    onChange={handleChange}
                    className={`w-full px-4 py-3 bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-lg focus:ring-2 focus:ring-[#E62D26]/50 focus:border-[#E62D26] outline-none transition-all text-slate-800 dark:text-white text-sm placeholder-slate-400 ${bengaliClass}`}
                    placeholder={language === "bn" ? "আমরা কিভাবে সাহায্য করতে পারি?" : "How can we help?"}
                    required
                  />
                </div>
                <div>
                  <label htmlFor="message" className={`block text-xs font-semibold text-slate-600 dark:text-slate-300 mb-1.5 ${bengaliClass}`}>
                    {language === "bn" ? "বার্তা" : "Message"}
                  </label>
                  <textarea
                    id="message"
                    rows="5"
                    value={formData.message}
                    onChange={handleChange}
                    className={`w-full px-4 py-3 bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-lg focus:ring-2 focus:ring-[#E62D26]/50 focus:border-[#E62D26] outline-none transition-all text-slate-800 dark:text-white text-sm placeholder-slate-400 resize-none ${bengaliClass}`}
                    placeholder={language === "bn" ? "আপনার বার্তা লিখুন..." : "Write your message here..."}
                    required
                  ></textarea>
                </div>
                <button
                  type="submit"
                  className={`group w-full flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-[#E62D26] to-[#E62D26] hover:from-[#c41e18] hover:to-[#d42520] text-white font-semibold text-sm rounded-lg shadow-md shadow-[#E62D26]/20 hover:shadow-lg transition-all ${bengaliClass}`}
                >
                  <LuSend className="text-sm group-hover:translate-x-0.5 transition-transform" />
                  <span>{language === "bn" ? "বার্তা পাঠান" : "Send Message"}</span>
                </button>
              </form>
            </motion.div>

            {/* Right Side - Map & Social */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: isVisible ? 1 : 0, x: isVisible ? 0 : 20 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="space-y-5"
            >
              {/* Map */}
              <div id="map" className="bg-white dark:bg-white/5 border border-slate-100 dark:border-white/10 rounded-2xl overflow-hidden shadow-sm">
                <div className="p-4 border-b border-slate-100 dark:border-white/10">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 bg-gradient-to-br from-[#E62D26]/10 to-[#F79952]/10 rounded-lg flex items-center justify-center">
                      <LuMapPin className="text-[#E62D26] text-sm" />
                    </div>
                    <div>
                      <p className={`text-sm font-bold text-slate-800 dark:text-white ${bengaliClass}`}>
                        {language === 'bn' ? 'আমাদের অফিস' : 'Our Office'}
                      </p>
                      <p className={`text-[10px] text-slate-500 ${bengaliClass}`}>
                        {language === 'bn' ? 'সশরীরে দেখা করুন' : 'Visit us in person'}
                      </p>
                    </div>
                  </div>
                </div>
                <iframe
                  src={content.mapEmbedUrl}
                  width="100%"
                  height="250"
                  className="border-0"
                  allowFullScreen
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  title="Office Location"
                />
              </div>

              {/* Social Links */}
              <div className="bg-white dark:bg-white/5 rounded-2xl p-5 border border-slate-100 dark:border-white/10 shadow-sm">
                <h3 className={`text-sm font-bold text-slate-800 dark:text-white mb-4 ${bengaliClass}`}>
                  {language === "bn" ? "আমাদের অনুসরণ করুন" : "Follow Us"}
                </h3>
                <div className="flex flex-wrap gap-2">
                  {socialLinks.map((item, idx) => (
                    <Link
                      key={idx}
                      href={item.href}
                      target="_blank"
                      className={`group w-10 h-10 ${item.bg} rounded-xl flex items-center justify-center transition-all duration-300 hover:scale-110`}
                      aria-label={item.label}
                    >
                      <item.icon className="text-base text-slate-600 dark:text-slate-300 group-hover:text-white transition-colors" />
                    </Link>
                  ))}
                </div>
                <p className={`mt-4 text-[10px] text-slate-500 dark:text-slate-400 leading-relaxed ${bengaliClass}`}>
                  {language === "bn"
                    ? "সর্বশেষ আপডেট এবং কোর্সের খবর পেতে আমাদের সোশ্যাল মিডিয়ায় অনুসরণ করুন।"
                    : "Follow us on social media for the latest updates and course news."}
                </p>
              </div>

              {/* WhatsApp Quick Contact */}
              <div className="bg-gradient-to-br from-[#E62D26] to-[#F79952] rounded-2xl p-5 text-white shadow-md">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center">
                    <LuHeadphones className="text-xl" />
                  </div>
                  <div>
                    <h3 className={`text-sm font-bold ${bengaliClass}`}>
                      {language === 'bn' ? content.whatsappSection.titleBn : content.whatsappSection.title}
                    </h3>
                    <p className={`text-white/70 text-[10px] ${bengaliClass}`}>
                      {language === 'bn' ? 'তাৎক্ষণিক প্রতিক্রিয়া' : 'Get instant response'}
                    </p>
                  </div>
                </div>
                <p className={`text-white/80 text-xs mb-4 ${bengaliClass}`}>
                  {language === 'bn' ? content.whatsappSection.descriptionBn : content.whatsappSection.description}
                </p>
                <a
                  href={content.socialLinks.whatsapp}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`group inline-flex items-center gap-2 px-4 py-2 bg-white text-[#E62D26] font-semibold text-xs rounded-lg hover:shadow-lg transition-all ${bengaliClass}`}
                >
                  <FaWhatsapp className="text-base" />
                  <span>{language === 'bn' ? content.whatsappSection.buttonTextBn : content.whatsappSection.buttonText}</span>
                  <LuArrowRight className="text-sm group-hover:translate-x-0.5 transition-transform" />
                </a>
              </div>
            </motion.div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default ContactPage;
