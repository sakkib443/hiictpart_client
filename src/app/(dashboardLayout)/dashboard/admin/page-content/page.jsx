"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
    FiHome,
    FiInfo,
    FiPhone,
    FiBook,
    FiCode,
    FiAward,
    FiChevronRight,
    FiRefreshCw,
    FiCheck,
    FiSettings,
    FiLoader
} from 'react-icons/fi';
import { useTheme } from '@/providers/ThemeProvider';

const API_URL = process.env.NEXT_PUBLIC_API_URL || (process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api');

// Icon mapping
const iconMap = {
    FiHome: FiHome,
    FiInfo: FiInfo,
    FiMail: FiPhone,
    FiBook: FiBook,
    FiCode: FiCode,
    FiAward: FiAward,
};

// Gradient colors for each page
const pageGradients = {
    home: 'from-red-500 to-emerald-500',
    about: 'from-indigo-500 to-purple-500',
    contact: 'from-amber-500 to-orange-500',
    training: 'from-blue-500 to-cyan-500',
    software: 'from-pink-500 to-rose-500',
    successStory: 'from-violet-500 to-fuchsia-500',
};

const PageContentDashboard = () => {
    const { isDark } = useTheme();
    const [loading, setLoading] = useState(true);
    const [pages, setPages] = useState([]);

    useEffect(() => {
        fetchPagesOverview();
    }, []);

    const fetchPagesOverview = async () => {
        try {
            setLoading(true);
            console.log('Fetching overview from:', `${API_URL}/page-content/overview`);

            const res = await fetch(`${API_URL}/page-content/overview`);
            const data = await res.json();

            console.log('Overview API Response:', data);

            if (data.success && data.data) {
                setPages(data.data);
            } else {
                console.error('Overview API returned unsuccessful:', data);
            }
        } catch (error) {
            console.error('Error fetching pages overview:', error);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[60vh]">
                <div className="text-center">
                    <FiLoader className="w-12 h-12 text-red-500 animate-spin mx-auto" />
                    <p className="mt-4 text-gray-500">Loading page content...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-8">
            {/* Header */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div>
                    <h1 className={`text-3xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                        ?? Page Content Manager
                    </h1>
                    <p className={`text-sm mt-1 ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                        Manage dynamic content for all website pages
                    </p>
                </div>
                <button
                    onClick={fetchPagesOverview}
                    className={`flex items-center gap-2 px-4 py-2.5 rounded-xl ${isDark ? 'bg-slate-800 text-white hover:bg-slate-700' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'} transition-colors`}
                >
                    <FiRefreshCw size={18} />
                    Refresh
                </button>
            </div>

            {/* Quick Info */}
            <div className={`p-5 rounded-2xl ${isDark ? 'bg-slate-800/50 border border-slate-700' : 'bg-gradient-to-r from-red-50 to-emerald-50 border border-red-100'}`}>
                <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-red-500 to-emerald-500 rounded-xl flex items-center justify-center shrink-0">
                        <FiSettings className="text-white" size={24} />
                    </div>
                    <div>
                        <h3 className={`font-bold mb-1 ${isDark ? 'text-white' : 'text-gray-900'}`}>
                            How it works
                        </h3>
                        <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                            Click on any page below to edit its sections. Each section has editable fields for both English and Bengali content.
                            Changes are saved to the database and reflected on the live website.
                        </p>
                    </div>
                </div>
            </div>

            {/* Pages Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {pages.map((page) => {
                    const Icon = iconMap[page.icon] || FiHome;
                    const gradient = pageGradients[page.pageKey] || 'from-gray-500 to-gray-600';
                    const progressColor = page.progress >= 80
                        ? 'bg-emerald-500'
                        : page.progress >= 50
                            ? 'bg-amber-500'
                            : 'bg-gray-400';

                    return (
                        <Link
                            key={page.pageKey}
                            href={`/dashboard/admin/page-content/${page.pageKey}`}
                            className={`group relative overflow-hidden rounded-2xl transition-all duration-300 hover:scale-[1.02] hover:shadow-xl ${isDark
                                ? 'bg-slate-800/80 border border-slate-700 hover:border-slate-600'
                                : 'bg-white border border-gray-200 hover:border-gray-300 shadow-sm'
                                }`}
                        >
                            {/* Gradient Accent */}
                            <div className={`absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r ${gradient}`} />

                            <div className="p-6">
                                {/* Icon & Title */}
                                <div className="flex items-start justify-between mb-4">
                                    <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${gradient} flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform`}>
                                        <Icon className="text-white" size={28} />
                                    </div>
                                    <FiChevronRight
                                        className={`${isDark ? 'text-gray-600' : 'text-gray-300'} group-hover:text-red-500 group-hover:translate-x-1 transition-all`}
                                        size={24}
                                    />
                                </div>

                                {/* Page Info */}
                                <h3 className={`text-xl font-bold mb-1 ${isDark ? 'text-white' : 'text-gray-900'}`}>
                                    {page.pageName}
                                </h3>
                                <p className={`text-sm mb-4 hind-siliguri ${isDark ? 'text-gray-500' : 'text-gray-500'}`}>
                                    {page.pageNameBn}
                                </p>

                                {/* Progress */}
                                <div className="space-y-2">
                                    <div className="flex items-center justify-between text-sm">
                                        <span className={isDark ? 'text-gray-400' : 'text-gray-600'}>
                                            {page.completedSections} / {page.totalSections} sections
                                        </span>
                                        <span className={`font-semibold ${page.progress >= 80
                                            ? 'text-emerald-500'
                                            : page.progress >= 50
                                                ? 'text-amber-500'
                                                : isDark ? 'text-gray-400' : 'text-gray-500'
                                            }`}>
                                            {page.progress}%
                                        </span>
                                    </div>
                                    <div className={`h-2 rounded-full overflow-hidden ${isDark ? 'bg-slate-700' : 'bg-gray-100'}`}>
                                        <div
                                            className={`h-full rounded-full transition-all duration-500 ${progressColor}`}
                                            style={{ width: `${page.progress}%` }}
                                        />
                                    </div>
                                </div>

                                {/* Route Badge */}
                                {page.route && (
                                    <div className={`mt-4 inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium ${isDark
                                        ? 'bg-slate-700 text-gray-300'
                                        : 'bg-gray-100 text-gray-600'
                                        }`}>
                                        <span className="w-1.5 h-1.5 rounded-full bg-red-500" />
                                        {page.route}
                                    </div>
                                )}
                            </div>
                        </Link>
                    );
                })}
            </div>

            {/* Empty State */}
            {pages.length === 0 && !loading && (
                <div className={`text-center py-16 rounded-2xl ${isDark ? 'bg-slate-800/50' : 'bg-gray-50'}`}>
                    <FiSettings className={`mx-auto w-16 h-16 ${isDark ? 'text-gray-600' : 'text-gray-300'}`} />
                    <h3 className={`mt-4 text-lg font-semibold ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                        No pages configured
                    </h3>
                    <p className={`mt-1 text-sm ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>
                        Page definitions will appear here once the backend is connected
                    </p>
                </div>
            )}
        </div>
    );
};

export default PageContentDashboard;

