'use client';
import { API_URL, API_BASE_URL, API_URL as BASE_URL } from '@/config/api';


import React, { useState, useEffect } from 'react';
import {
    FiDownload, FiFileText, FiPieChart, FiShoppingBag,
    FiUsers, FiCalendar, FiFilter, FiCheckCircle, FiActivity,
    FiTrendingUp, FiDollarSign, FiBook, FiGlobe, FiCode,
    FiSettings, FiRefreshCw, FiX, FiCheck, FiClipboard
} from 'react-icons/fi';
import { useTheme } from '@/providers/ThemeProvider';
import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';

const ReportsPage = () => {
    const { isDark } = useTheme();
    const [loading, setLoading] = useState(false);
    const [downloadingId, setDownloadingId] = useState(null);
    const [stats, setStats] = useState(null);
    const [showCustomModal, setShowCustomModal] = useState(false);

    // Custom report options
    const [customReport, setCustomReport] = useState({
        dateFrom: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        dateTo: new Date().toISOString().split('T')[0],
        includeRevenue: true,
        includeOrders: true,
        includeUsers: false,
        includeCourses: false,
        includeWebsites: false,
        includeSoftware: false,
        includeTopProducts: true,
        reportTitle: 'Custom Business Report'
    });

    

    useEffect(() => {
        fetchStats();
    }, []);

    const fetchStats = async () => {
        setLoading(true);
        try {
            const token = localStorage.getItem('token');
            const [dashboardRes, recentRes, topRes, coursesRes, websitesRes, softwareRes] = await Promise.all([
                fetch(`${BASE_URL}/analytics/dashboard`, { headers: { 'Authorization': `Bearer ${token}` } }),
                fetch(`${BASE_URL}/analytics/recent-purchases?limit=100`, { headers: { 'Authorization': `Bearer ${token}` } }),
                fetch(`${BASE_URL}/analytics/top-products?limit=30`, { headers: { 'Authorization': `Bearer ${token}` } }),
                fetch(`${BASE_URL}/courses?limit=100`, { headers: { 'Authorization': `Bearer ${token}` } }),
                fetch(`${BASE_URL}/websites?limit=100`, { headers: { 'Authorization': `Bearer ${token}` } }),
                fetch(`${BASE_URL}/softwares?limit=100`, { headers: { 'Authorization': `Bearer ${token}` } })
            ]);

            const dashboardData = await dashboardRes.json();
            const recentData = await recentRes.json();
            const topData = await topRes.json();
            const coursesData = await coursesRes.json();
            const websitesData = await websitesRes.json();
            const softwareData = await softwareRes.json();

            setStats({
                summary: dashboardData.data,
                recent: recentData.data || [],
                top: topData.data || [],
                courses: coursesData.data || [],
                websites: websitesData.data || [],
                software: softwareData.data || []
            });
        } catch (err) {
            console.error('Error fetching data for reports:', err);
        } finally {
            setLoading(false);
        }
    };

    const reportTypes = [
        {
            id: 'revenue',
            title: 'Revenue Analysis',
            titleBn: '??? ????????',
            description: 'Complete financial overview with revenue breakdown, monthly comparison and profit analysis.',
            icon: FiPieChart,
            color: 'from-indigo-500 to-purple-600',
            bgColor: 'bg-indigo-500'
        },
        {
            id: 'orders',
            title: 'Sales & Orders',
            titleBn: '??????? ? ??????',
            description: 'Detailed transaction history with customer info, payment status and order timeline.',
            icon: FiShoppingBag,
            color: 'from-emerald-500 to-red-600',
            bgColor: 'bg-emerald-500'
        },
        {
            id: 'users',
            title: 'User Analytics',
            titleBn: '??????????? ????????',
            description: 'User growth metrics, enrollment statistics and student engagement data.',
            icon: FiUsers,
            color: 'from-blue-500 to-cyan-600',
            bgColor: 'bg-blue-500'
        },
        {
            id: 'inventory',
            title: 'Product Portfolio',
            titleBn: '????????? ??????????',
            description: 'Complete inventory of courses, websites and software with performance metrics.',
            icon: FiFileText,
            color: 'from-amber-500 to-orange-600',
            bgColor: 'bg-amber-500'
        }
    ];

    const generatePDF = (type, customOptions = null) => {
        if (!stats) return;
        setDownloadingId(type);

        try {
            const doc = new jsPDF();
            const timestamp = new Date().toLocaleString('en-GB', {
                day: '2-digit', month: 'short', year: 'numeric',
                hour: '2-digit', minute: '2-digit'
            });

            const options = customOptions || customReport;
            const pageWidth = doc.internal.pageSize.getWidth();

            // Header - Professional gradient style
            doc.setFillColor(79, 70, 229);
            doc.rect(0, 0, pageWidth, 45, 'F');

            // Logo area
            doc.setFillColor(255, 255, 255);
            doc.roundedRect(15, 10, 40, 25, 3, 3, 'F');
            doc.setTextColor(79, 70, 229);
            doc.setFontSize(12);
            doc.setFont('helvetica', 'bold');
            doc.text('eJobs IT', 35, 25, { align: 'center' });

            // Title
            doc.setTextColor(255, 255, 255);
            doc.setFontSize(22);
            doc.setFont('helvetica', 'bold');
            doc.text(type === 'custom' ? options.reportTitle : `${type.toUpperCase()} REPORT`, 65, 22);

            // Subtitle
            doc.setFontSize(9);
            doc.setFont('helvetica', 'normal');
            doc.text(`Generated: ${timestamp}`, 65, 30);

            if (options.dateFrom && options.dateTo) {
                doc.text(`Period: ${options.dateFrom} to ${options.dateTo}`, 65, 36);
            }

            // Summary Box
            let currentY = 55;

            if (type === 'revenue' || (type === 'custom' && options.includeRevenue)) {
                doc.setFillColor(249, 250, 251);
                doc.roundedRect(10, currentY, pageWidth - 20, 35, 3, 3, 'F');

                doc.setTextColor(79, 70, 229);
                doc.setFontSize(11);
                doc.setFont('helvetica', 'bold');
                doc.text('FINANCIAL OVERVIEW', 15, currentY + 10);

                doc.setDrawColor(79, 70, 229);
                doc.setLineWidth(0.5);
                doc.line(15, currentY + 14, pageWidth - 15, currentY + 14);

                // Stats in boxes
                const statsBoxWidth = (pageWidth - 40) / 4;
                const statsData = [
                    { label: 'Total Revenue', value: `BDT ${stats.summary?.totalRevenue?.toLocaleString() || '0'}` },
                    { label: 'This Month', value: `BDT ${stats.summary?.monthlyRevenue?.toLocaleString() || '0'}` },
                    { label: 'Today', value: `BDT ${stats.summary?.todayRevenue?.toLocaleString() || '0'}` },
                    { label: 'Total Orders', value: stats.summary?.totalOrdersCount?.toString() || '0' }
                ];

                statsData.forEach((stat, i) => {
                    doc.setTextColor(100, 116, 139);
                    doc.setFontSize(8);
                    doc.text(stat.label, 15 + (i * statsBoxWidth), currentY + 22);
                    doc.setTextColor(15, 23, 42);
                    doc.setFontSize(11);
                    doc.setFont('helvetica', 'bold');
                    doc.text(stat.value, 15 + (i * statsBoxWidth), currentY + 30);
                });

                currentY += 45;
            }

            if (type === 'orders' || (type === 'custom' && options.includeOrders)) {
                doc.setTextColor(15, 23, 42);
                doc.setFontSize(14);
                doc.setFont('helvetica', 'bold');
                doc.text('Recent Orders', 15, currentY);
                currentY += 5;

                const safeOrders = (stats.recent || []).filter(order => order && order.orderDate);

                const filteredOrders = safeOrders.filter(order => {
                    try {
                        if (!options.dateFrom || !options.dateTo) return true;
                        const orderDate = new Date(order.orderDate);
                        if (isNaN(orderDate.getTime())) return true;
                        const dateStr = orderDate.toISOString().split('T')[0];
                        return dateStr >= options.dateFrom && dateStr <= options.dateTo;
                    } catch {
                        return true;
                    }
                });

                const orderRows = filteredOrders.length > 0 ? filteredOrders.slice(0, 25).map((order, i) => {
                    let dateStr = 'N/A';
                    try {
                        dateStr = new Date(order.orderDate).toLocaleDateString('en-GB');
                    } catch { }
                    return [
                        (i + 1).toString(),
                        dateStr,
                        `${order.user?.firstName || ''} ${order.user?.lastName || ''}`.trim() || 'N/A',
                        (order.items?.[0]?.title || 'Product').substring(0, 25),
                        `BDT ${order.totalAmount?.toLocaleString() || '0'}`,
                        order.paymentStatus?.toUpperCase() || 'PENDING'
                    ];
                }) : [['1', 'No orders found', '-', '-', '-', '-']];

                let tableEndY = currentY;
                autoTable(doc, {
                    startY: currentY,
                    head: [['#', 'Date', 'Customer', 'Product', 'Amount', 'Status']],
                    body: orderRows,
                    theme: 'striped',
                    headStyles: {
                        fillColor: [16, 185, 129],
                        fontSize: 9,
                        fontStyle: 'bold'
                    },
                    bodyStyles: { fontSize: 8 },
                    alternateRowStyles: { fillColor: [249, 250, 251] },
                    didDrawPage: (data) => { tableEndY = data.cursor.y; }
                });

                currentY = tableEndY + 15;
            }

            if (type === 'inventory' || (type === 'custom' && options.includeTopProducts)) {
                if (currentY > 230) {
                    doc.addPage();
                    currentY = 20;
                }

                doc.setTextColor(15, 23, 42);
                doc.setFontSize(14);
                doc.setFont('helvetica', 'bold');
                doc.text('Top Performing Products', 15, currentY);
                currentY += 5;

                const topProducts = stats.top || [];
                const productRows = topProducts.length > 0 ? topProducts.slice(0, 15).map((p, i) => [
                    (i + 1).toString(),
                    (p.title || 'Product').substring(0, 30) + (p.title?.length > 30 ? '...' : ''),
                    p.category?.name || 'Uncategorized',
                    p.salesCount?.toString() || '0',
                    `BDT ${p.price?.toLocaleString() || '0'}`,
                    `BDT ${((p.salesCount || 0) * (p.price || 0)).toLocaleString()}`
                ]) : [['', 'No products found', '', '', '', '']];

                let tableEndY2 = currentY;
                autoTable(doc, {
                    startY: currentY,
                    head: [['#', 'Product Name', 'Category', 'Sales', 'Unit Price', 'Total Revenue']],
                    body: productRows,
                    theme: 'striped',
                    headStyles: {
                        fillColor: [245, 158, 11],
                        fontSize: 9,
                        fontStyle: 'bold'
                    },
                    bodyStyles: { fontSize: 8 },
                    alternateRowStyles: { fillColor: [255, 251, 235] },
                    didDrawPage: (data) => { tableEndY2 = data.cursor.y; }
                });

                currentY = tableEndY2 + 15;
            }

            if (type === 'users' || (type === 'custom' && options.includeUsers)) {
                if (currentY > 230) {
                    doc.addPage();
                    currentY = 20;
                }

                doc.setTextColor(15, 23, 42);
                doc.setFontSize(14);
                doc.setFont('helvetica', 'bold');
                doc.text('User Statistics', 15, currentY);
                currentY += 5;

                const userData = [
                    ['Total Students', stats.summary?.totalStudents?.toString() || '0', 'Registered learners on platform'],
                    ['Total Users', stats.summary?.totalUsers?.toString() || '0', 'All registered accounts'],
                    ['New Users (This Month)', stats.summary?.newUsersThisMonth?.toString() || '0', 'Recent registrations'],
                    ['Active Enrollments', stats.summary?.activeEnrollments?.toString() || '0', 'Currently active courses'],
                    ['Completed Enrollments', stats.summary?.completedEnrollments?.toString() || '0', 'Finished courses']
                ];

                let tableEndY3 = currentY;
                autoTable(doc, {
                    startY: currentY,
                    head: [['Metric', 'Count', 'Description']],
                    body: userData,
                    theme: 'grid',
                    headStyles: {
                        fillColor: [59, 130, 246],
                        fontSize: 9,
                        fontStyle: 'bold'
                    },
                    bodyStyles: { fontSize: 9 },
                    columnStyles: {
                        0: { fontStyle: 'bold' },
                        1: { halign: 'center' },
                        2: { textColor: [100, 116, 139], fontSize: 8 }
                    },
                    didDrawPage: (data) => { tableEndY3 = data.cursor.y; }
                });

                currentY = tableEndY3 + 15;
            }

            // Courses section
            if (type === 'custom' && options.includeCourses && stats.courses.length > 0) {
                if (currentY > 200) {
                    doc.addPage();
                    currentY = 20;
                }

                doc.setTextColor(15, 23, 42);
                doc.setFontSize(14);
                doc.setFont('helvetica', 'bold');
                doc.text('All Courses', 15, currentY);
                currentY += 5;

                const courseRows = stats.courses.slice(0, 20).map((c, i) => [
                    (i + 1).toString(),
                    (c.title || 'Course').substring(0, 35),
                    c.category?.name || 'N/A',
                    `BDT ${c.price?.toLocaleString() || '0'}`,
                    c.level || 'N/A',
                    c.status || 'draft'
                ]);

                let tableEndY4 = currentY;
                autoTable(doc, {
                    startY: currentY,
                    head: [['#', 'Course Title', 'Category', 'Price', 'Level', 'Status']],
                    body: courseRows,
                    theme: 'striped',
                    headStyles: { fillColor: [139, 92, 246], fontSize: 9 },
                    bodyStyles: { fontSize: 8 },
                    didDrawPage: (data) => { tableEndY4 = data.cursor.y; }
                });

                currentY = tableEndY4 + 15;
            }

            // Websites section
            if (type === 'custom' && options.includeWebsites && stats.websites.length > 0) {
                if (currentY > 200) {
                    doc.addPage();
                    currentY = 20;
                }

                doc.setTextColor(15, 23, 42);
                doc.setFontSize(14);
                doc.setFont('helvetica', 'bold');
                doc.text('All Websites', 15, currentY);
                currentY += 5;

                const websiteRows = stats.websites.slice(0, 20).map((w, i) => [
                    (i + 1).toString(),
                    (w.title || 'Website').substring(0, 35),
                    w.category?.name || 'N/A',
                    `BDT ${w.price?.toLocaleString() || '0'}`,
                    w.status || 'active'
                ]);

                let tableEndY5 = currentY;
                autoTable(doc, {
                    startY: currentY,
                    head: [['#', 'Website Title', 'Category', 'Price', 'Status']],
                    body: websiteRows,
                    theme: 'striped',
                    headStyles: { fillColor: [236, 72, 153], fontSize: 9 },
                    bodyStyles: { fontSize: 8 },
                    didDrawPage: (data) => { tableEndY5 = data.cursor.y; }
                });

                currentY = tableEndY5 + 15;
            }

            // Software section
            if (type === 'custom' && options.includeSoftware && stats.software.length > 0) {
                if (currentY > 200) {
                    doc.addPage();
                    currentY = 20;
                }

                doc.setTextColor(15, 23, 42);
                doc.setFontSize(14);
                doc.setFont('helvetica', 'bold');
                doc.text('All Software', 15, currentY);
                currentY += 5;

                const softwareRows = stats.software.slice(0, 20).map((s, i) => [
                    (i + 1).toString(),
                    (s.title || 'Software').substring(0, 35),
                    s.category?.name || 'N/A',
                    `BDT ${s.price?.toLocaleString() || '0'}`,
                    s.status || 'active'
                ]);

                autoTable(doc, {
                    startY: currentY,
                    head: [['#', 'Software Title', 'Category', 'Price', 'Status']],
                    body: softwareRows,
                    theme: 'striped',
                    headStyles: { fillColor: [6, 182, 212], fontSize: 9 },
                    bodyStyles: { fontSize: 8 }
                });
            }

            // Footer on every page
            const pageCount = doc.internal.getNumberOfPages();
            for (let i = 1; i <= pageCount; i++) {
                doc.setPage(i);
                doc.setFillColor(249, 250, 251);
                doc.rect(0, doc.internal.pageSize.getHeight() - 15, pageWidth, 15, 'F');
                doc.setTextColor(100, 116, 139);
                doc.setFontSize(8);
                doc.text(`eJobs IT Platform - Confidential Business Report`, 15, doc.internal.pageSize.getHeight() - 6);
                doc.text(`Page ${i} of ${pageCount}`, pageWidth - 15, doc.internal.pageSize.getHeight() - 6, { align: 'right' });
            }

            const fileName = type === 'custom'
                ? `EjobsIT_Custom_Report_${options.dateFrom}_to_${options.dateTo}.pdf`
                : `EjobsIT_${type}_Report_${new Date().toISOString().split('T')[0]}.pdf`;

            doc.save(fileName);

            if (type === 'custom') {
                setShowCustomModal(false);
            }
        } catch (error) {
            console.error('PDF Generation Error:', error);
            alert('Failed to generate PDF. Please check console for details.');
        } finally {
            setDownloadingId(null);
        }
    };

    const handleDownload = (id) => {
        generatePDF(id);
    };

    const handleCustomReportGenerate = () => {
        generatePDF('custom', customReport);
    };

    const toggleOption = (key) => {
        setCustomReport(prev => ({ ...prev, [key]: !prev[key] }));
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className={`flex flex-col md:flex-row md:items-center justify-between gap-4 p-6 rounded-2xl border ${isDark ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-200'}`}>
                <div className="flex items-center gap-4">
                    <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-lg shadow-indigo-500/25">
                        <FiClipboard className="text-white text-2xl" />
                    </div>
                    <div>
                        <h1 className={`text-2xl font-bold ${isDark ? 'text-white' : 'text-slate-800'}`}>Reports Center</h1>
                        <p className={`text-sm ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>Generate and download professional business reports</p>
                    </div>
                </div>
                <div className="flex items-center gap-3">
                    <button
                        onClick={fetchStats}
                        disabled={loading}
                        className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium transition-all ${isDark
                            ? 'bg-slate-700 text-slate-300 hover:bg-slate-600'
                            : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                            }`}
                    >
                        <FiRefreshCw size={16} className={loading ? 'animate-spin' : ''} />
                        {loading ? 'Loading...' : 'Refresh Data'}
                    </button>
                    <button
                        onClick={() => setShowCustomModal(true)}
                        className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white rounded-xl text-sm font-semibold shadow-lg shadow-indigo-500/25 transition-all"
                    >
                        <FiSettings size={16} />
                        Custom Report
                    </button>
                </div>
            </div>

            {/* Quick Summary */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {[
                    { label: 'Total Revenue', value: `?${stats?.summary?.totalRevenue?.toLocaleString() || '0'}`, icon: FiDollarSign, color: 'from-emerald-500 to-red-600' },
                    { label: 'Total Orders', value: stats?.summary?.totalOrdersCount || '0', icon: FiShoppingBag, color: 'from-blue-500 to-indigo-600' },
                    { label: 'Total Courses', value: stats?.summary?.totalCourses || '0', icon: FiBook, color: 'from-purple-500 to-pink-600' },
                    { label: 'Total Users', value: stats?.summary?.totalUsers || '0', icon: FiUsers, color: 'from-amber-500 to-orange-600' }
                ].map((stat, i) => (
                    <div key={i} className={`p-4 rounded-2xl border ${isDark ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-200'}`}>
                        <div className="flex items-center gap-3">
                            <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${stat.color} flex items-center justify-center`}>
                                <stat.icon className="text-white" size={18} />
                            </div>
                            <div>
                                <p className={`text-xs ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>{stat.label}</p>
                                <p className={`text-lg font-bold ${isDark ? 'text-white' : 'text-slate-800'}`}>{stat.value}</p>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Report Types Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                {reportTypes.map((report) => (
                    <div key={report.id} className={`rounded-2xl border overflow-hidden transition-all group hover:shadow-lg ${isDark ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-200'}`}>
                        <div className={`h-2 bg-gradient-to-r ${report.color}`} />
                        <div className="p-6">
                            <div className="flex items-start justify-between mb-4">
                                <div className={`p-3 rounded-xl ${report.bgColor} text-white shadow-lg transition-transform group-hover:scale-110`}>
                                    <report.icon size={24} />
                                </div>
                                <span className={`px-3 py-1 text-[10px] font-bold rounded-full ${isDark ? 'bg-slate-700 text-slate-300' : 'bg-slate-100 text-slate-600'}`}>
                                    PDF
                                </span>
                            </div>

                            <h3 className={`text-lg font-bold mb-1 ${isDark ? 'text-white' : 'text-slate-800'}`}>{report.title}</h3>
                            <p className={`text-xs mb-1 ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>{report.titleBn}</p>
                            <p className={`text-sm mb-5 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>{report.description}</p>

                            <div className={`flex items-center justify-between pt-4 border-t ${isDark ? 'border-slate-700' : 'border-slate-100'}`}>
                                <div className="flex items-center gap-2 text-emerald-500">
                                    <FiCheckCircle size={14} />
                                    <span className="text-xs font-medium">Ready</span>
                                </div>
                                <button
                                    onClick={() => handleDownload(report.id)}
                                    disabled={downloadingId !== null || !stats}
                                    className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold transition-all ${downloadingId === report.id
                                        ? (isDark ? 'bg-slate-700 text-slate-500' : 'bg-slate-100 text-slate-400')
                                        : 'bg-gradient-to-r from-slate-800 to-slate-900 text-white hover:from-slate-700 hover:to-slate-800 shadow-md'
                                        }`}
                                >
                                    {downloadingId === report.id ? (
                                        <div className="w-4 h-4 border-2 border-slate-400 border-t-white rounded-full animate-spin" />
                                    ) : (
                                        <FiDownload size={14} />
                                    )}
                                    Download
                                </button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Custom Report Modal */}
            {showCustomModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                    <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setShowCustomModal(false)} />
                    <div className={`relative w-full max-w-2xl rounded-3xl p-6 shadow-2xl ${isDark ? 'bg-slate-900 border border-slate-800' : 'bg-white'}`}>
                        {/* Modal Header */}
                        <div className="flex items-center justify-between mb-6">
                            <div className="flex items-center gap-3">
                                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center">
                                    <FiSettings className="text-white text-xl" />
                                </div>
                                <div>
                                    <h2 className={`text-xl font-bold ${isDark ? 'text-white' : 'text-slate-800'}`}>Custom Report Builder</h2>
                                    <p className={`text-sm ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>Select date range and data to include</p>
                                </div>
                            </div>
                            <button onClick={() => setShowCustomModal(false)} className={`p-2 rounded-lg ${isDark ? 'hover:bg-slate-800' : 'hover:bg-slate-100'}`}>
                                <FiX size={20} className={isDark ? 'text-slate-400' : 'text-slate-500'} />
                            </button>
                        </div>

                        {/* Report Title */}
                        <div className="mb-5">
                            <label className={`block text-sm font-medium mb-2 ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>Report Title</label>
                            <input
                                type="text"
                                value={customReport.reportTitle}
                                onChange={(e) => setCustomReport(prev => ({ ...prev, reportTitle: e.target.value }))}
                                className={`w-full px-4 py-3 rounded-xl border text-sm ${isDark
                                    ? 'bg-slate-800 border-slate-700 text-white placeholder:text-slate-500'
                                    : 'bg-slate-50 border-slate-200 text-slate-800 placeholder:text-slate-400'
                                    }`}
                                placeholder="Enter report title"
                            />
                        </div>

                        {/* Date Range */}
                        <div className="grid grid-cols-2 gap-4 mb-6">
                            <div>
                                <label className={`block text-sm font-medium mb-2 ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
                                    <FiCalendar className="inline mr-2" size={14} />
                                    From Date
                                </label>
                                <input
                                    type="date"
                                    value={customReport.dateFrom}
                                    onChange={(e) => setCustomReport(prev => ({ ...prev, dateFrom: e.target.value }))}
                                    className={`w-full px-4 py-3 rounded-xl border text-sm ${isDark
                                        ? 'bg-slate-800 border-slate-700 text-white'
                                        : 'bg-slate-50 border-slate-200 text-slate-800'
                                        }`}
                                />
                            </div>
                            <div>
                                <label className={`block text-sm font-medium mb-2 ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
                                    <FiCalendar className="inline mr-2" size={14} />
                                    To Date
                                </label>
                                <input
                                    type="date"
                                    value={customReport.dateTo}
                                    onChange={(e) => setCustomReport(prev => ({ ...prev, dateTo: e.target.value }))}
                                    className={`w-full px-4 py-3 rounded-xl border text-sm ${isDark
                                        ? 'bg-slate-800 border-slate-700 text-white'
                                        : 'bg-slate-50 border-slate-200 text-slate-800'
                                        }`}
                                />
                            </div>
                        </div>

                        {/* Data Options */}
                        <div className="mb-6">
                            <label className={`block text-sm font-medium mb-3 ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>Include in Report</label>
                            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                                {[
                                    { key: 'includeRevenue', label: 'Revenue Summary', icon: FiDollarSign },
                                    { key: 'includeOrders', label: 'Orders List', icon: FiShoppingBag },
                                    { key: 'includeUsers', label: 'User Stats', icon: FiUsers },
                                    { key: 'includeTopProducts', label: 'Top Products', icon: FiTrendingUp },
                                    { key: 'includeCourses', label: 'All Courses', icon: FiBook },
                                    { key: 'includeWebsites', label: 'All Websites', icon: FiGlobe },
                                    { key: 'includeSoftware', label: 'All Software', icon: FiCode }
                                ].map((option) => (
                                    <button
                                        key={option.key}
                                        onClick={() => toggleOption(option.key)}
                                        className={`flex items-center gap-3 p-3 rounded-xl border text-left transition-all ${customReport[option.key]
                                            ? 'bg-indigo-500/10 border-indigo-500 text-indigo-600'
                                            : isDark
                                                ? 'bg-slate-800 border-slate-700 text-slate-400 hover:border-slate-600'
                                                : 'bg-slate-50 border-slate-200 text-slate-600 hover:border-slate-300'
                                            }`}
                                    >
                                        <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${customReport[option.key] ? 'bg-indigo-500 text-white' : isDark ? 'bg-slate-700' : 'bg-slate-200'
                                            }`}>
                                            {customReport[option.key] ? <FiCheck size={14} /> : <option.icon size={14} />}
                                        </div>
                                        <span className="text-sm font-medium">{option.label}</span>
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Generate Button */}
                        <div className="flex justify-end gap-3">
                            <button
                                onClick={() => setShowCustomModal(false)}
                                className={`px-5 py-3 rounded-xl text-sm font-medium ${isDark ? 'bg-slate-800 text-slate-300 hover:bg-slate-700' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleCustomReportGenerate}
                                disabled={downloadingId === 'custom'}
                                className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white rounded-xl text-sm font-semibold shadow-lg shadow-indigo-500/25 transition-all"
                            >
                                {downloadingId === 'custom' ? (
                                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                ) : (
                                    <FiDownload size={16} />
                                )}
                                Generate PDF Report
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ReportsPage;

