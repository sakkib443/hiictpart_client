'use client';

import Footer from '@/components/sheard/Footer';
import Navbar from '@/components/sheard/Navbar';
import TopHeader from '@/components/sheard/TopHeader';
import ScrollToTop from '@/components/sheard/ScrollToTop';
// import FloatingSeminarButton from '@/components/sheard/FloatingSeminarButton';
import FloatingLanguageButton from '@/components/sheard/FloatingLanguageButton';
import FloatingWhatsAppButton from '@/components/sheard/FloatingWhatsAppButton';
import { AdminEditProvider } from '@/providers/AdminEditProvider';
import React from 'react';

const MainLayout = ({ children }) => {
    return (
        <AdminEditProvider>
            <div>
                <TopHeader />
                <Navbar />
                {children}
                <Footer />
                <ScrollToTop />
                {/* <FloatingSeminarButton /> */}
                <FloatingWhatsAppButton />
            </div>
        </AdminEditProvider>
    );
};

export default MainLayout;
