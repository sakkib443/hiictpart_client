"use client";

import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";

import { fetchCategories } from "@/redux/categorySlice";
import Hero from "@/components/Home/Hero";
import FeaturesBar from "@/components/Home/FeaturesBar";
import TopCategories from "@/components/Home/TopCategories";
import PopularCourse from "@/components/Home/PopularCourse";
import Testimonials from "@/components/Home/Testimonials";
import CTASection from "@/components/Home/CTASection";
import { fetchCoursesData } from "@/redux/CourseSlice";
import Lenis from 'lenis';

const HomePage = () => {
  const dispatch = useDispatch();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);

    // Initialize Lenis Smooth Scroll - Only on desktop
    if (window.innerWidth > 768) {
      const lenis = new Lenis({
        duration: 1.0,
        easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
        direction: 'vertical',
        gestureDirection: 'vertical',
        smooth: true,
        mouseMultiplier: 0.8,
        smoothTouch: false,
        touchMultiplier: 2,
      });

      function raf(time) {
        lenis.raf(time);
        requestAnimationFrame(raf);
      }

      requestAnimationFrame(raf);

      return () => {
        lenis.destroy();
      };
    }
  }, []);

  useEffect(() => {
    if (mounted) {
      dispatch(fetchCoursesData());
      dispatch(fetchCategories());
    }
  }, [dispatch, mounted]);

  return (
    <div className="relative min-h-screen bg-white dark:bg-black selection:bg-red-500 selection:text-black font-poppins antialiased">
      <main className="relative">
        {/* Hero Section */}
        <section className="relative w-full overflow-hidden z-0 bg-white dark:bg-black">
          <Hero />
        </section>



        {/* Top Categories */}
        <TopCategories />

        {/* Other Sections */}
        <section className="relative z-10 bg-white dark:bg-[#020202]">
          <PopularCourse />
          <Testimonials />
          <CTASection />
        </section>
      </main>
    </div>
  );
};

export default HomePage;
