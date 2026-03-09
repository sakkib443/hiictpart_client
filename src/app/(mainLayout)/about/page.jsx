"use client";

import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import Image from 'next/image';
import { useLanguage } from "@/context/LanguageContext";
import {
  LuTarget,
  LuUsers,
  LuBookOpen,
  LuHeart,
  LuRocket,
  LuSparkles,
  LuPlay,
  LuArrowRight,
  LuCheck,
  LuGraduationCap,
  LuTrendingUp,
  LuShield,
  LuGlobe,
  LuAward
} from "react-icons/lu";
import Lenis from 'lenis';

// Stats Counter Component with new design
const StatCard = ({ number, label, icon: Icon, delay = 0 }) => (
  <motion.div
    initial={{ opacity: 0, scale: 0.9 }}
    whileInView={{ opacity: 1, scale: 1 }}
    viewport={{ once: true }}
    transition={{ delay, duration: 0.5 }}
    className="relative p-6 bg-white dark:bg-[#111] rounded-2xl border border-gray-100 dark:border-gray-800 shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:shadow-[0_8px_30px_rgb(230,45,38,0.1)] transition-all group"
  >
    <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
      <Icon className="w-16 h-16 text-[#E62D26]" />
    </div>
    <div className="relative z-10">
      <div className="w-12 h-12 mb-4 rounded-full bg-[#E62D26]/5 flex items-center justify-center group-hover:bg-[#E62D26] transition-colors duration-300">
        <Icon className="w-6 h-6 text-[#E62D26] group-hover:text-white transition-colors duration-300" />
      </div>
      <h3 className="text-3xl font-bold text-gray-900 dark:text-white mb-1">{number}</h3>
      <p className="text-sm text-gray-500 dark:text-gray-400 font-medium uppercase tracking-wide">{label}</p>
    </div>
  </motion.div>
);

const AboutPage = () => {
  const { language, t } = useLanguage();
  const bengaliClass = language === "bn" ? "hind-siliguri" : "";

  // Initialize Lenis Smooth Scroll
  useEffect(() => {
    if (typeof window !== 'undefined' && window.innerWidth > 768) {
      const lenis = new Lenis({
        duration: 1.0,
        easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
        smooth: true,
      });

      function raf(time) {
        lenis.raf(time);
        requestAnimationFrame(raf);
      }
      requestAnimationFrame(raf);

      return () => lenis.destroy();
    }
  }, []);

  const teamMembers = [
    {
      name: "Shohel Rana",
      role: language === 'bn' ? t("aboutPage.founder.designation") : "Founder & CEO",
      image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400",
      quote: language === 'bn' ? t("aboutPage.founder.quote1") : "Education for everyone."
    },
    {
      name: "Fatima Ahmed",
      role: "Head of Education",
      image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400",
      quote: "Learning never stops."
    },
    {
      name: "Karim Hassan",
      role: "Tech Lead",
      image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400",
      quote: "Tech empowers future."
    },
  ];

  return (
    <div className="min-h-screen bg-white dark:bg-black font-sans">

      {/* 1. Hero Section - Redesigned like Reference */}
      <section className="relative pt-20 pb-20 lg:pt-28 lg:pb-28 overflow-hidden bg-[#fafafa] dark:bg-[#050505]">
        {/* Grid Background */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(0,0,0,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(0,0,0,0.02)_1px,transparent_1px)] bg-[size:40px_40px] [mask-image:radial-gradient(ellipse_80%_50%_at_50%_0%,#000_70%,transparent_110%)] pointer-events-none" />

        <div className="container mx-auto px-4 lg:px-16 relative z-10">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-stretch">

            {/* Left Image Grid - 3 Image Mockup Formation */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              className="relative flex gap-4 h-[400px] lg:h-[536px] w-full"
            >
              {/* Large Left Image - Takes 50% width and full height */}
              <div className="relative w-1/2 h-full rounded-2xl overflow-hidden shadow-2xl shadow-black/10 dark:shadow-black/30 border-2 border-white/60 dark:border-white/10 group">
                <img
                  src="/images/57462951_2085649778223584_3709857119512559616_n.jpg"
                  alt="Hi ICT Park Classroom - Students Learning"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
                <div className="absolute bottom-4 left-4 bg-white/90 dark:bg-gray-900/90 backdrop-blur-sm rounded-xl px-4 py-2 shadow-lg">
                  <p className="text-[10px] font-bold text-[#E62D26] uppercase tracking-widest">Live Class</p>
                  <p className="text-xs font-semibold text-gray-700 dark:text-gray-300">50+ Students</p>
                </div>
              </div>

              {/* Right Column - Takes 50% width and contains 2 stacked images */}
              <div className="w-1/2 flex flex-col gap-4 h-full">
                {/* Top Right Image */}
                <div className="relative flex-1 rounded-2xl overflow-hidden shadow-xl shadow-black/10 dark:shadow-black/30 border-2 border-white/60 dark:border-white/10 group">
                  <img
                    src="/images/58068385_2070681143053781_5367478869567733760_n.jpg"
                    alt="Hi ICT Park Seminar - Knowledge Sharing"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent" />
                  <div className="absolute bottom-3 left-3 flex items-center gap-1.5">
                    <div className="w-6 h-6 bg-[#E62D26] rounded-full flex items-center justify-center">
                      <span className="text-white text-[10px]">🎓</span>
                    </div>
                    <span className="text-white text-[10px] font-bold drop-shadow-lg">Seminar</span>
                  </div>
                </div>

                {/* Bottom Right Image */}
                <div className="relative flex-1 rounded-2xl overflow-hidden shadow-xl shadow-black/10 dark:shadow-black/30 border-2 border-white/60 dark:border-white/10 group">
                  <img
                    src="/images/58383539_2073583652763530_1902712555562860544_n.jpg"
                    alt="Hi ICT Park Exam - Student Assessment"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent" />
                  <div className="absolute bottom-3 left-3 flex items-center gap-1.5">
                    <div className="w-6 h-6 bg-[#F79952] rounded-full flex items-center justify-center">
                      <span className="text-white text-[10px]">📝</span>
                    </div>
                    <span className="text-white text-[10px] font-bold drop-shadow-lg">Exam Hall</span>
                  </div>
                </div>
              </div>

              {/* Floating Success Rate Badge */}
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

              {/* Floating Enrolled Badge */}
              <motion.div
                className="absolute -bottom-3 left-[30%] bg-white dark:bg-gray-800 rounded-2xl px-4 py-3 shadow-xl border border-gray-100 dark:border-gray-700 z-20"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.5, duration: 0.5 }}
              >
                <div className="flex items-center gap-2">
                  <div className="flex -space-x-2">
                    <div className="w-7 h-7 rounded-full bg-[#E62D26] flex items-center justify-center text-white text-xs font-bold border-2 border-white dark:border-gray-800">S</div>
                    <div className="w-7 h-7 rounded-full bg-[#F79952] flex items-center justify-center text-white text-xs font-bold border-2 border-white dark:border-gray-800">A</div>
                    <div className="w-7 h-7 rounded-full bg-green-500 flex items-center justify-center text-white text-xs font-bold border-2 border-white dark:border-gray-800">R</div>
                  </div>
                  <div>
                    <p className="text-[10px] text-gray-400 font-medium">Students</p>
                    <p className="font-bold text-xs text-gray-800 dark:text-white">50k+ Enrolled</p>
                  </div>
                </div>
              </motion.div>
            </motion.div>

            {/* Right Content - Fixed Height with Centered Content */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="flex flex-col justify-center gap-6 h-[400px] lg:h-[536px] py-2"
            >
              <div>
                {/* Badge */}
                <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-white dark:bg-white/5 border border-orange-100 dark:border-white/10 rounded-full shadow-sm w-fit mb-6">
                  <LuSparkles className="text-orange-500 text-xs" />
                  <span className={`text-xs font-bold text-slate-600 dark:text-slate-300 ${bengaliClass}`}>
                    {language === 'bn' ? 'আমাদের সম্পর্কে' : 'Who We Are'}
                  </span>
                </div>

                {/* Title */}
                <h1 className={`text-3xl lg:text-5xl font-bold text-slate-900 dark:text-white mb-4 leading-tight ${bengaliClass}`}>
                  {language === 'bn' ? 'দক্ষতা বুনন,' : 'Building Skills,'} <span className="text-[#E62D26]">{language === 'bn' ? 'ভবিষ্যৎ গঠন' : 'Shaping Futures'}</span>
                </h1>

                {/* Subtitle */}
                <h3 className={`text-lg font-bold text-orange-500 mb-6 ${bengaliClass}`}>
                  {language === 'bn'
                    ? 'আপনার ডিজিটাল শ্রেষ্ঠত্বের প্রবেশদ্বার। আমরা সম্ভাবনাকে পেশাদার সাফল্যে রূপান্তর করি।'
                    : 'Your gateway to digital excellence. We turn potential into professional success across Bangladesh.'}
                </h3>

                {/* Description - Updated Text */}
                <div className={`space-y-4 text-slate-600 dark:text-slate-400 text-sm leading-relaxed mb-8 ${bengaliClass}`}>
                  <p>
                    {language === 'bn'
                      ? 'আমরা ওয়েb ডেভেলপমেন্ট, অ্যাপ তৈরি, সাইবার সিকিউরিটি এবং ডিজিটাল মার্কেটিং সহ একটি বিস্তৃত পাঠ্যক্রম অফার করি—যা বিশ্বব্যাপী শিল্পের মান পূরণের জন্য ডিজাইন করা হয়েছে।'
                      : 'We offer a comprehensive curriculum spanning Web Development, App Creation, Cyber Security, and Digital Marketing—designed to meet and exceed global industry standards.'}
                  </p>
                  <p>
                    {language === 'bn'
                      ? 'হাইসিটি পার্কে, আমরা হাতে-কলমে অভিজ্ঞতা এবং মেন্টরশিপের উপর ফোকাস করি। আমরা শুধু কোড শেখাই না; আমরা উদ্ভাবকদের একটি সম্প্রদায় গড়ে তুলি যারা পরবর্তী ডিজিটাল বিপ্লবের নেতৃত্ব দিতে প্রস্তুত।'
                      : 'At HiictPark, we focus on hands-on experience and real-world mentorship. We don\'t just teach code; we foster a community of innovators ready to lead the next digital revolution.'}
                  </p>
                </div>

                {/* Button Moved Up */}
                <div className="mt-2">
                  <Link href="/courses">
                    <button className="px-8 py-3.5 bg-[#E62D26] hover:bg-[#c41e18] text-white rounded-lg font-bold shadow-lg shadow-[#E62D26]/20 hover:shadow-[#E62D26]/30 transition-all flex items-center gap-2">
                      {language === 'bn' ? 'কোর্সগুলো দেখুন' : 'Disover Courses'}
                      <LuArrowRight />
                    </button>
                  </Link>
                </div>
              </div>
            </motion.div>

          </div>
        </div>
      </section>

      {/* 2. Stats Section - Floating Overlap */}
      <section className="relative -mt-20 z-20 px-4">
        <div className="container mx-auto px-4 lg:px-16">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <StatCard number="50k+" label="Active Students" icon={LuUsers} delay={0.1} />
            <StatCard number="120+" label="Expert Mentors" icon={LuGraduationCap} delay={0.2} />
            <StatCard number="500+" label="Premium Courses" icon={LuBookOpen} delay={0.3} />
            <StatCard number="4.9" label="Average Rating" icon={LuAward} delay={0.4} />
          </div>
        </div>
      </section>

      {/* 3. Story / Mission Section */}
      <section className="py-20 lg:py-32 bg-white dark:bg-black">
        <div className="container mx-auto px-4 lg:px-16">
          <div className="flex flex-col lg:flex-row items-center gap-16">
            <div className="w-full lg:w-1/2 relative">
              <motion.div
                initial={{ opacity: 0, x: -30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                className="relative rounded-2xl overflow-hidden shadow-2xl"
              >
                <Image
                  src="https://images.unsplash.com/photo-1531403009284-440f080d1e12?q=80&w=1000&auto=format&fit=crop"
                  alt="Our Mission"
                  width={800}
                  height={600}
                  className="object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-end p-8">
                  <p className="text-white font-medium text-lg italic">"Education is the most powerful weapon which you can use to change the world."</p>
                </div>
              </motion.div>
              {/* Decorative squares */}
              <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-[#E62D26]/10 rounded-3xl -z-10" />
              <div className="absolute -top-10 -right-10 w-40 h-40 bg-[#F79952]/10 rounded-full -z-10" />
            </div>

            <div className="w-full lg:w-1/2">
              <motion.div
                initial={{ opacity: 0, x: 30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
              >
                <span className="text-[#E62D26] font-bold tracking-wider uppercase text-sm mb-2 block">Our Story</span>
                <h2 className={`text-3xl lg:text-4xl font-bold text-gray-900 dark:text-white mb-6 ${bengaliClass}`}>
                  {language === 'bn' ? 'আমাদের লক্ষ্য ও উদ্দেশ্য' : 'Driven by Purpose, Fueled by Passion'}
                </h2>
                <p className="text-gray-600 dark:text-gray-400 text-lg leading-relaxed mb-6">
                  Founded in 2020, HiictPark started with a simple idea: quality education should be accessible to everyone, everywhere. What began as a small coding bootcamp has grown into a global learning community.
                </p>
                <p className="text-gray-600 dark:text-gray-400 text-lg leading-relaxed mb-8">
                  We believe in the transformative power of education. Our platform connects ambitious learners with industry experts, creating an ecosystem where knowledge flows freely and careers are built.
                </p>

                <div className="grid grid-cols-2 gap-6">
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center shrink-0">
                      <LuTarget className="text-green-600 dark:text-green-400" />
                    </div>
                    <div>
                      <h4 className="font-bold text-gray-900 dark:text-white">Our Mission</h4>
                      <p className="text-sm text-gray-500">To democratize tech education globally.</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center shrink-0">
                      <LuGlobe className="text-blue-600 dark:text-blue-400" />
                    </div>
                    <div>
                      <h4 className="font-bold text-gray-900 dark:text-white">Our Vision</h4>
                      <p className="text-sm text-gray-500">A world where anyone can build their dream career.</p>
                    </div>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </section>

      {/* 4. Values Section - Grid */}
      <section className="py-20 bg-gray-50 dark:bg-[#050505]">
        <div className="container mx-auto px-4 lg:px-16">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <span className="text-[#E62D26] font-bold tracking-wider uppercase text-sm mb-2 block">Core Values</span>
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 dark:text-white mb-4">What Defines Us</h2>
            <p className="text-gray-600 dark:text-gray-400">Our core values guide every decision we make and every course we create.</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              { icon: LuHeart, title: "Student Success", desc: "We don't just teach; we mentor. Your success is our ultimate KPI." },
              { icon: LuShield, title: "Quality First", desc: "We never compromise on content quality. Expert-led, industry-vetted." },
              { icon: LuRocket, title: "Innovation", desc: "We constantly evolve our curriculum to match the fast-paced tech world." }
            ].map((item, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="bg-white dark:bg-[#111] p-8 rounded-2xl border border-gray-100 dark:border-gray-800 hover:border-[#E62D26]/30 transition-colors group"
              >
                <div className="w-14 h-14 bg-gray-100 dark:bg-gray-800 rounded-xl flex items-center justify-center mb-6 group-hover:bg-[#E62D26] transition-colors">
                  <item.icon className="w-7 h-7 text-gray-600 dark:text-gray-300 group-hover:text-white" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3">{item.title}</h3>
                <p className="text-gray-600 dark:text-gray-400 leading-relaxed">{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* 5. CTA Section */}
      <section className="py-24 bg-gradient-to-r from-[#E62D26] to-[#F79952] text-center relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-full opacity-10 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')]"></div>
        <div className="container mx-auto px-4 relative z-10">
          <h2 className="text-3xl md:text-5xl font-bold text-white mb-8">Ready to Start Your Journey?</h2>
          <p className="text-white/80 max-w-2xl mx-auto text-lg mb-10">Join thousands of students who are building their careers with HiictPark today.</p>
          <Link href="/courses">
            <button className="px-10 py-4 bg-white text-[#E62D26] rounded-full font-bold text-lg shadow-xl hover:shadow-2xl hover:scale-105 transition-all">
              Get Started For Free
            </button>
          </Link>
        </div>
      </section>

    </div>
  );
};

export default AboutPage;
