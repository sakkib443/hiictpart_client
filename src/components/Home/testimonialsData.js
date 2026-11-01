// Shared testimonial content (used by the home page and the course reviews tab)
export const getTestimonials = (language, t) => [
    {
        id: 1,
        title: language === 'bn' ? t("home_sections.testimonials.greatQuality") : 'Great quality!',
        titleColor: 'text-orange-500',
        review: language === 'bn'
            ? t("home_sections.testimonials.testimonial1")
            : 'I wanted to place a review since their support helped me within a day or so, which is nice! Thanks and 5 stars!',
        name: language === 'bn' ? 'রাকিব হাসান' : 'Rakib Hasan',
        designation: language === 'bn' ? 'ডেভেলপার, ঢাকা' : 'Developer, Dhaka',
        avatar: '/images/testimonials/rakib.png',
    },
    {
        id: 2,
        title: language === 'bn' ? t("home_sections.testimonials.codeQuality") : 'Code Quality',
        titleColor: 'text-blue-600',
        review: language === 'bn'
            ? t("home_sections.testimonials.testimonial2")
            : "HiictPark deserves 5 star for course features, design quality, flexibility, and support service!",
        name: language === 'bn' ? 'ফাতেমা আক্তার' : 'Fatema Akter',
        designation: language === 'bn' ? 'ডিজাইনার, চট্টগ্রাম' : 'Designer, Chattogram',
        avatar: '/images/testimonials/fatema.png',
    },
    {
        id: 3,
        title: language === 'bn' ? t("home_sections.testimonials.customerSupport") : 'Customer Support',
        titleColor: 'text-blue-600',
        review: language === 'bn'
            ? t("home_sections.testimonials.testimonial3")
            : 'Very good and fast support during the week. They know what you need, exactly when you need it.',
        name: language === 'bn' ? 'আরিফ রহমান' : 'Arif Rahman',
        designation: language === 'bn' ? 'ফ্রিল্যান্সার, রাজশাহী' : 'Freelancer, Rajshahi',
        avatar: '/images/testimonials/arif.png',
    },
    {
        id: 4,
        title: language === 'bn' ? 'অসাধারণ অভিজ্ঞতা!' : 'Amazing Experience!',
        titleColor: 'text-orange-500',
        review: language === 'bn'
            ? 'কোর্সগুলো অনেক সুন্দরভাবে সাজানো। প্রতিটি লেসন সহজ এবং বাস্তবমুখী।'
            : 'The courses are beautifully crafted. Every lesson is easy to understand and practical.',
        name: language === 'bn' ? 'নুসরাত জাহান' : 'Nusrat Jahan',
        designation: language === 'bn' ? 'শিক্ষার্থী, সিলেট' : 'Student, Sylhet',
        avatar: '/images/testimonials/nusrat.png',
    },
    {
        id: 5,
        title: language === 'bn' ? 'সেরা প্ল্যাটফর্ম' : 'Best Platform',
        titleColor: 'text-blue-600',
        review: language === 'bn'
            ? 'অনলাইন শিক্ষার জন্য এটাই সেরা প্ল্যাটফর্ম। সব কোর্স আপডেটেড এবং প্রফেশনাল।'
            : 'Best platform for online learning. All courses are updated and professional.',
        name: language === 'bn' ? 'তানভীর আহমেদ' : 'Tanvir Ahmed',
        designation: language === 'bn' ? 'প্রোগ্রামার, খুলনা' : 'Programmer, Khulna',
        avatar: '/images/testimonials/tanvir.png',
    },
    {
        id: 6,
        title: language === 'bn' ? 'দ্রুত সার্টিফিকেট' : 'Quick Certificate',
        titleColor: 'text-orange-500',
        review: language === 'bn'
            ? 'কোর্স শেষ করার সাথে সাথে সার্টিফিকেট পেয়ে গেছি। এটা আমার ক্যারিয়ারে অনেক কাজে লেগেছে।'
            : 'Got certificate right after completing the course. It helped a lot in my career.',
        name: language === 'bn' ? 'শারমিন সুলতানা' : 'Sharmin Sultana',
        designation: language === 'bn' ? 'গ্রাফিক ডিজাইনার, বরিশাল' : 'Graphic Designer, Barishal',
        avatar: '/images/testimonials/sharmin.png',
    },
];
