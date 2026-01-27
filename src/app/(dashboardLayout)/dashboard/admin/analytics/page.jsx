'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import {
    FiBarChart2, FiTrendingUp, FiTrendingDown, FiDollarSign, FiUsers,
    FiShoppingBag, FiBook, FiRefreshCw, FiGlobe, FiCode,
    FiCalendar, FiPackage, FiActivity, FiPieChart, FiLayers,
    FiArrowUpRight, FiArrowDownRight
} from 'react-icons/fi';
import {
    AreaChart,
    Area,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
} from 'recharts';
import { useTheme } from '@/providers/ThemeProvider';

// Animated counter component
const AnimatedCounter = ({ value, prefix = '', suffix = '' }) => {
    const [count, setCount] = useState(0);

    useEffect(() => {
        const numValue = typeof value === 'number' ? value : parseInt(String(value).replace(/[^0-9]/g, '')) || 0;
        const duration = 1500;
        const increment = numValue / (duration / 16);
        let current = 0;

        const timer = setInterval(() => {
            current += increment;
            if (current >= numValue) {
                setCount(numValue);
                clearInterval(timer);
            } else {
                setCount(Math.floor(current));
            }
        }, 16);

        return () => clearInterval(timer);
    }, [value]);

    return <span>{prefix}{count.toLocaleString()}{suffix}</span>;
};

// Stats Card Component
const StatsCard = ({ title, value, icon: Icon, trend, trendValue, color, loading }) => {
    const { isDark } = useTheme();
    const isPositive = trend === "up";
    return (
        <div className={`rounded-2xl p-6 shadow-lg border hover:shadow-xl transition-all duration-300 group overflow-hidden relative ${isDark ? 'bg-black/40 backdrop-blur-md border-slate-800 shadow-none' : 'bg-white/80 backdrop-blur-sm border-gray-100/50 shadow-gray-200/50'
            }`}>
            {/* Background Accent */}
            <div className={`absolute -right-6 -top-6 w-24 h-24 rounded-full blur-3xl opacity-10 ${color}`} />

            <div className="relative flex items-start justify-between">
                <div>
                    <p className="text-sm font-medium text-slate-500 mb-1 font-poppins">{title}</p>
                    <h3 className={`text-2xl font-bold font-outfit ${isDark ? 'text-white' : 'text-slate-900'}`}>
                        {loading ? (
                            <div className="h-8 w-24 bg-slate-200 animate-pulse rounded-lg" />
                        ) : (
                            <AnimatedCounter value={value} prefix={title.includes('Revenue') ? '৳' : ''} />
                        )}
                    </h3>
                    {trendValue && (
                        <div className={`flex items-center mt-2 text-sm font-poppins ${isPositive ? "text-emerald-600" : "text-red-500"}`}>
                            {isPositive ? <FiArrowUpRight className="w-4 h-4" /> : <FiArrowDownRight className="w-4 h-4" />}
                            <span className="font-medium">{trendValue}</span>
                            <span className="text-slate-400 ml-1">vs last month</span>
                        </div>
                    )}
                </div>
                <div className={`p-3 rounded-xl shadow-lg transition-transform duration-300 group-hover:scale-110 group-hover:rotate-3 ${color} flex items-center justify-center`}>
                    <Icon className="w-6 h-6 text-white" />
                </div>
            </div>
        </div>
    );
};

export default function AnalyticsPage() {
    const { isDark } = useTheme();
    const router = useRouter();
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [dateRange, setDateRange] = useState('30');
    const [recentPurchases, setRecentPurchases] = useState([]);
    const [topProducts, setTopProducts] = useState([]);
    const [categoryRevenue, setCategoryRevenue] = useState({
        labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
        courses: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        websites: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        software: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    });

    const BASE_URL = process.env.NEXT_PUBLIC_API_URL || (process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api');

    const fetchAnalytics = async () => {
        try {
            setLoading(true);
            const token = localStorage.getItem('token');

            // Fetch all necessary analytics data
            const [dashboardRes, categoryRes, recentRes, topRes] = await Promise.all([
                fetch(`${BASE_URL}/analytics/dashboard`, {
                    headers: { 'Authorization': `Bearer ${token}` }
                }),
                fetch(`${BASE_URL}/analytics/category-revenue`, {
                    headers: { 'Authorization': `Bearer ${token}` }
                }),
                fetch(`${BASE_URL}/analytics/recent-purchases?limit=10`, {
                    headers: { 'Authorization': `Bearer ${token}` }
                }),
                fetch(`${BASE_URL}/analytics/top-products?limit=5`, {
                    headers: { 'Authorization': `Bearer ${token}` }
                })
            ]);

            const dashboardResult = await dashboardRes.json();
            const categoryResult = await categoryRes.json();
            const recentResult = await recentRes.json();
            const topResult = await topRes.json();

            setData(dashboardResult.data);
            if (categoryResult.data) setCategoryRevenue(categoryResult.data);
            if (recentResult.data) setRecentPurchases(recentResult.data);
            if (topResult.data) setTopProducts(topResult.data);
        } catch (err) {
            console.error('Error fetching analytics:', err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchAnalytics();
    }, []);

    // Main stats
    const totalProducts = (data?.totalCourses || 0) + (data?.totalSoftware || 0) + (data?.totalWebsites || 0);

    const mainStats = [
        {
            title: 'Total Revenue',
            value: data?.totalRevenue || 0,
            icon: FiDollarSign,
            trend: 'up',
            trendValue: '12%',
            color: 'bg-gradient-to-br from-emerald-500 to-red-600'
        },
        {
            title: 'Total Orders',
            value: data?.totalOrders || 0,
            icon: FiShoppingBag,
            trend: 'up',
            trendValue: '8%',
            color: 'bg-gradient-to-br from-amber-500 to-orange-600'
        },
        {
            title: 'Total Users',
            value: data?.totalUsers || 0,
            icon: FiUsers,
            trend: 'up',
            trendValue: '15%',
            color: 'bg-gradient-to-br from-blue-500 to-indigo-600'
        },
        {
            title: 'Total Products',
            value: totalProducts,
            icon: FiPackage,
            trend: 'up',
            trendValue: '+5',
            color: 'bg-gradient-to-br from-violet-500 to-purple-600'
        },
    ];

    // Format data for Recharts
    const chartData = categoryRevenue.labels.map((label, index) => ({
        name: label,
        courses: categoryRevenue.courses[index] || 0,
        websites: categoryRevenue.websites[index] || 0,
        software: categoryRevenue.software[index] || 0,
    }));

    return (
        <div className="space-y-6 pb-10">
            {/* Page Header */}
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div>
                    <h1 className={`text-2xl lg:text-3xl font-bold font-outfit ${isDark ? 'text-white' : 'text-slate-800'}`}>Analytics Overview</h1>
                    <p className={`${isDark ? 'text-slate-400' : 'text-slate-500'} mt-1 font-poppins text-sm`}>Real-time performance metrics and sales data.</p>
                </div>
                <div className="flex items-center gap-3">
                    <button
                        onClick={fetchAnalytics}
                        disabled={loading}
                        className={`flex items-center gap-2 px-4 py-2.5 border rounded-xl text-sm font-semibold transition-all shadow-sm disabled:opacity-50 ${isDark ? 'bg-slate-900 border-slate-800 text-slate-300 hover:bg-slate-800' : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
                            }`}
                    >
                        <FiRefreshCw size={16} className={loading ? 'animate-spin' : ''} />
                        Refresh
                    </button>
                    <button
                        onClick={() => router.push('/dashboard/admin/reports')}
                        className="px-4 py-2.5 bg-gradient-to-r from-indigo-500 to-purple-600 text-white rounded-xl text-sm font-semibold hover:opacity-90 transition-all shadow-lg shadow-indigo-500/25"
                    >
                        Download Report
                    </button>
                </div>
            </div>

            {/* Main Stats Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
                {mainStats.map((stat) => (
                    <StatsCard key={stat.title} {...stat} loading={loading} />
                ))}
            </div>


            {/* Revenue & Summary Section */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Revenue Breakdown */}
                <div className={`lg:col-span-2 backdrop-blur-sm rounded-2xl border overflow-hidden ${isDark ? 'bg-black/40 border-slate-800 shadow-none' : 'bg-white/80 shadow-lg shadow-gray-200/50 border-gray-100/50'
                    }`}>
                    <div className={`flex items-center justify-between p-6 border-b ${isDark ? 'border-slate-800' : 'border-slate-100'}`}>
                        <div>
                            <h3 className={`text-lg font-bold font-outfit ${isDark ? 'text-white' : 'text-slate-800'}`}>Revenue by Category</h3>
                            <p className="text-sm text-slate-500 font-poppins">Monthly comparison across products</p>
                        </div>
                        <div className="flex items-center gap-4 text-xs font-poppins">
                            <div className="flex items-center gap-1.5">
                                <div className="w-2.5 h-2.5 rounded-full bg-indigo-500"></div>
                                <span className="text-slate-500">Courses</span>
                            </div>
                            <div className="flex items-center gap-1.5">
                                <div className="w-2.5 h-2.5 rounded-full bg-emerald-500"></div>
                                <span className="text-slate-500">Websites</span>
                            </div>
                            <div className="flex items-center gap-1.5">
                                <div className="w-2.5 h-2.5 rounded-full bg-amber-500"></div>
                                <span className="text-slate-500">Software</span>
                            </div>
                        </div>
                    </div>

                    <div className="p-6">
                        <div className="h-[300px] w-full">
                            <ResponsiveContainer width="100%" height="100%">
                                <AreaChart data={chartData}>
                                    <defs>
                                        <linearGradient id="colorCourses" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="5%" stopColor="#6366F1" stopOpacity={0.3} />
                                            <stop offset="95%" stopColor="#6366F1" stopOpacity={0} />
                                        </linearGradient>
                                        <linearGradient id="colorWebsites" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="5%" stopColor="#10B981" stopOpacity={0.3} />
                                            <stop offset="95%" stopColor="#10B981" stopOpacity={0} />
                                        </linearGradient>
                                        <linearGradient id="colorSoftware" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="5%" stopColor="#F59E0B" stopOpacity={0.3} />
                                            <stop offset="95%" stopColor="#F59E0B" stopOpacity={0} />
                                        </linearGradient>
                                    </defs>
                                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={isDark ? '#1e293b' : '#f1f5f9'} />
                                    <XAxis
                                        dataKey="name"
                                        axisLine={false}
                                        tickLine={false}
                                        tick={{ fill: '#94a3b8', fontSize: 11 }}
                                        dy={10}
                                    />
                                    <YAxis
                                        axisLine={false}
                                        tickLine={false}
                                        tick={{ fill: '#94a3b8', fontSize: 11 }}
                                        tickFormatter={(value) => `৳${value >= 1000 ? (value / 1000).toFixed(0) + 'k' : value}`}
                                    />
                                    <Tooltip
                                        contentStyle={{
                                            backgroundColor: isDark ? "#020617" : "#fff",
                                            border: isDark ? "1px solid #1e293b" : "1px solid #e1e8f0",
                                            borderRadius: "12px",
                                            boxShadow: "0 10px 15px -1px rgba(0, 0, 0, 0.1)",
                                            padding: '12px',
                                            color: isDark ? '#fff' : '#000'
                                        }}
                                        itemStyle={{ fontSize: '11px', fontWeight: '600' }}
                                        formatter={(value) => [`৳${value.toLocaleString()}`, '']}
                                    />
                                    <Area
                                        type="monotone"
                                        dataKey="courses"
                                        stroke="#6366F1"
                                        strokeWidth={3}
                                        fillOpacity={1}
                                        fill="url(#colorCourses)"
                                    />
                                    <Area
                                        type="monotone"
                                        dataKey="websites"
                                        stroke="#10B981"
                                        strokeWidth={3}
                                        fillOpacity={1}
                                        fill="url(#colorWebsites)"
                                    />
                                    <Area
                                        type="monotone"
                                        dataKey="software"
                                        stroke="#F59E0B"
                                        strokeWidth={3}
                                        fillOpacity={1}
                                        fill="url(#colorSoftware)"
                                    />
                                </AreaChart>
                            </ResponsiveContainer>
                        </div>

                        <div className={`flex items-center justify-between mt-6 pt-4 border-t flex-wrap gap-4 ${isDark ? 'border-slate-800' : 'border-slate-100'}`}>
                            <div className="flex items-center gap-6">
                                <div className="flex flex-col">
                                    <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Courses</span>
                                    <span className="text-sm font-bold text-indigo-600">৳{(categoryRevenue.courses[categoryRevenue.courses.length - 1] || 0).toLocaleString()}</span>
                                </div>
                                <div className="flex flex-col">
                                    <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Websites</span>
                                    <span className="text-sm font-bold text-emerald-600">৳{(categoryRevenue.websites[categoryRevenue.websites.length - 1] || 0).toLocaleString()}</span>
                                </div>
                                <div className="flex flex-col">
                                    <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Software</span>
                                    <span className="text-sm font-bold text-amber-600">৳{(categoryRevenue.software[categoryRevenue.software.length - 1] || 0).toLocaleString()}</span>
                                </div>
                            </div>
                            <div className="text-right">
                                <p className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Total Revenue</p>
                                <p className={`text-xl font-bold ${isDark ? 'text-white' : 'text-slate-800'}`}>৳{(data?.totalRevenue || 0).toLocaleString()}</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Quick Summary / Platform Status */}
                <div className={`${isDark ? 'bg-black/60 border-slate-800 shadow-none' : 'bg-white/80 border-gray-100/50 shadow-xl'} backdrop-blur-sm rounded-3xl p-6 relative overflow-hidden group border transition-all duration-300`}>
                    <div className={`absolute top-0 right-0 w-32 h-32 ${isDark ? 'bg-indigo-500/5' : 'bg-indigo-500/10'} rounded-full blur-3xl group-hover:opacity-100 opacity-50 transition-all duration-500`} />

                    <div className="flex items-center gap-2 mb-8 relative">
                        <div className={`p-2 ${isDark ? 'bg-slate-800' : 'bg-indigo-50'} rounded-lg`}>
                            <FiActivity className="text-indigo-400" size={18} />
                        </div>
                        <h3 className={`text-lg font-bold font-outfit ${isDark ? 'text-white' : 'text-slate-800'}`}>Platform Status</h3>
                    </div>

                    <div className="space-y-4 relative">
                        <div className={`p-4 ${isDark ? 'bg-slate-800/50 border-slate-700' : 'bg-slate-50/50 border-slate-100'} border rounded-2xl hover:bg-indigo-50/10 transition-colors`}>
                            <p className="text-slate-400 text-xs font-poppins mb-1">Monthly Revenue</p>
                            <h4 className={`text-2xl font-bold font-outfit ${isDark ? 'text-white' : 'text-slate-900'}`}>৳{(data?.monthlyRevenue || 0).toLocaleString()}</h4>
                        </div>

                        <div className="grid grid-cols-2 gap-3">
                            <div className={`p-4 ${isDark ? 'bg-slate-800/50 border-slate-700' : 'bg-slate-50/50 border-slate-100'} border rounded-2xl`}>
                                <p className="text-slate-400 text-[10px] font-bold uppercase tracking-wider mb-1">Students</p>
                                <h4 className="text-lg font-bold text-emerald-400 font-outfit">{data?.totalStudents || 0}</h4>
                            </div>
                            <div className={`p-4 ${isDark ? 'bg-slate-800/50 border-slate-700' : 'bg-slate-50/50 border-slate-100'} border rounded-2xl`}>
                                <p className="text-slate-400 text-[10px] font-bold uppercase tracking-wider mb-1">New Users</p>
                                <h4 className="text-lg font-bold text-blue-400 font-outfit">+{data?.newUsersThisMonth || 0}</h4>
                            </div>
                        </div>

                        <div className={`p-4 ${isDark ? 'bg-slate-800/50 border-slate-700' : 'bg-slate-50/50 border-slate-100'} border rounded-2xl`}>
                            <div className="flex items-center justify-between mb-2">
                                <span className="text-slate-400 text-xs text-uppercase font-bold tracking-wider">Active Enrollments</span>
                                <span className="px-2 py-0.5 bg-indigo-500/20 text-indigo-400 text-[10px] font-bold rounded-full">LIVE</span>
                            </div>
                            <h4 className={`text-xl font-bold font-outfit ${isDark ? 'text-white' : 'text-slate-900'}`}>{data?.activeEnrollments || 0}</h4>
                        </div>

                        <div className={`p-4 ${isDark ? 'bg-slate-800/50 border-slate-700' : 'bg-slate-50/50 border-slate-100'} border rounded-2xl`}>
                            <div className="flex items-center justify-between mb-2">
                                <span className="text-slate-400 text-xs font-bold tracking-wider uppercase">Pending Orders</span>
                                <span className="px-2 py-0.5 bg-amber-500/20 text-amber-400 text-[10px] font-bold rounded-full uppercase">Action</span>
                            </div>
                            <h4 className="text-xl font-bold text-amber-500 font-outfit">{data?.pendingOrders || 0}</h4>
                        </div>
                    </div>
                </div>
            </div>

            {/* Metrics Grid: Products & Insights */}
            <div className="grid grid-cols-2 lg:grid-cols-6 gap-4 mt-6">
                {[
                    { title: 'Websites', value: data?.totalWebsites || 0, icon: FiGlobe, color: 'bg-emerald-500' },
                    { title: 'Software', value: data?.totalSoftware || 0, icon: FiCode, color: 'bg-indigo-500' },
                    { title: 'Courses', value: data?.totalCourses || 0, icon: FiBook, color: 'bg-amber-500' },
                    { title: 'Students', value: data?.totalStudents || 0, icon: FiUsers, color: 'bg-blue-500' },
                    { title: 'Enrollments', value: data?.totalEnrollments || 0, icon: FiActivity, color: 'bg-rose-500' },
                    { title: 'Lessons', value: data?.totalLessons || 0, icon: FiLayers, color: 'bg-violet-500' },
                ].map((item) => (
                    <div key={item.title} className={`${isDark ? 'bg-black/40 border-slate-800 hover:bg-slate-900/50' : 'bg-white/60 border-slate-200/50 hover:bg-white hover:shadow-md'} backdrop-blur-sm p-4 rounded-2xl border flex flex-col items-center justify-center text-center group transition-all`}>
                        <div className={`w-8 h-8 rounded-lg ${item.color} flex items-center justify-center text-white mb-2 shadow-sm group-hover:scale-110 transition-transform`}>
                            <item.icon size={14} />
                        </div>
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">{item.title}</p>
                        <p className={`text-lg font-bold ${isDark ? 'text-white' : 'text-slate-800'}`}>{loading ? '...' : item.value}</p>
                    </div>
                ))}
            </div>

            {/* Recent Purchases & Top Products */}
            <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 mt-6">
                {/* Recent Purchases */}
                <div className={`xl:col-span-2 backdrop-blur-sm rounded-2xl border overflow-hidden ${isDark ? 'bg-black/40 border-slate-800 shadow-none' : 'bg-white/80 shadow-lg shadow-gray-200/50 border-gray-100/50'
                    }`}>
                    <div className={`flex items-center justify-between p-6 border-b ${isDark ? 'border-slate-800' : 'border-slate-100'}`}>
                        <div>
                            <h3 className={`text-lg font-bold font-outfit ${isDark ? 'text-white' : 'text-slate-800'}`}>Recent Purchases</h3>
                            <p className="text-sm text-slate-500 font-poppins">Latest transactions from your customers</p>
                        </div>
                        <button className="text-indigo-600 hover:text-indigo-700 text-sm font-semibold hover:underline transition-all">
                            View All Orders
                        </button>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead className={isDark ? 'bg-slate-900/50' : 'bg-slate-50/50'}>
                                <tr>
                                    <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-wider">Customer</th>
                                    <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-wider">Product</th>
                                    <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-wider">Amount</th>
                                    <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-wider">Status</th>
                                </tr>
                            </thead>
                            <tbody className={`divide-y ${isDark ? 'divide-slate-800' : 'divide-slate-100'}`}>
                                {recentPurchases.length > 0 ? (
                                    recentPurchases.map((purchase) => (
                                        <tr key={purchase._id} className={`${isDark ? 'hover:bg-slate-900/30' : 'hover:bg-slate-50/80'} transition-colors group`}>
                                            <td className="px-6 py-4">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-[10px] font-bold text-white">
                                                        {(purchase.user?.firstName || 'U')[0]}
                                                    </div>
                                                    <div>
                                                        <p className={`text-sm font-bold ${isDark ? 'text-slate-200' : 'text-slate-700'}`}>{purchase.user?.firstName}</p>
                                                        <p className="text-[10px] text-slate-400">{purchase.user?.email}</p>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className={`px-6 py-4 text-sm truncate max-w-[200px] ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                                                {purchase.items?.[0]?.title || 'Product'}
                                            </td>
                                            <td className={`px-6 py-4 font-bold text-sm ${isDark ? 'text-slate-200' : 'text-slate-700'}`}>৳{purchase.totalAmount?.toLocaleString()}</td>
                                            <td className="px-6 py-4">
                                                <span className={`px-2 py-1 rounded-lg text-[10px] font-bold uppercase ${purchase.paymentStatus === 'completed'
                                                    ? (isDark ? 'bg-emerald-500/10 text-emerald-400' : 'bg-emerald-100/50 text-emerald-600')
                                                    : (isDark ? 'bg-amber-500/10 text-amber-400' : 'bg-amber-100/50 text-amber-600')
                                                    }`}>
                                                    {purchase.paymentStatus}
                                                </span>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan="4" className="px-6 py-10 text-center text-slate-400 text-sm">No recent transactions.</td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Top Products */}
                <div className={`backdrop-blur-sm rounded-2xl border flex flex-col ${isDark ? 'bg-black/40 border-slate-800 shadow-none' : 'bg-white/80 shadow-lg shadow-gray-200/50 border-gray-100/50'
                    }`}>
                    <div className={`p-6 border-b ${isDark ? 'border-slate-800' : 'border-slate-100'}`}>
                        <h3 className={`text-lg font-bold font-outfit ${isDark ? 'text-white' : 'text-slate-800'}`}>Top Products</h3>
                        <p className="text-sm text-slate-500 font-poppins">Most popular items</p>
                    </div>
                    <div className="p-6 space-y-5 flex-1 line-clamp-1">
                        {topProducts.length > 0 ? (
                            topProducts.map((product, idx) => (
                                <div key={product._id} className="flex items-center gap-4 group">
                                    <div className="relative">
                                        <div className={`w-12 h-12 rounded-xl border flex items-center justify-center overflow-hidden ${isDark ? 'bg-slate-900 border-slate-800' : 'bg-slate-100 border-slate-200'
                                            }`}>
                                            {product.images?.[0] ? (
                                                <img src={product.images[0]} alt="" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                                            ) : (
                                                <FiPackage className="text-indigo-200 text-xl" />
                                            )}
                                        </div>
                                        <div className="absolute -top-1 -left-1 w-5 h-5 rounded-full bg-white shadow-sm border border-slate-100 flex items-center justify-center text-[8px] font-bold text-indigo-600">
                                            #{idx + 1}
                                        </div>
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <h4 className={`text-sm font-bold truncate uppercase tracking-tight ${isDark ? 'text-white' : 'text-slate-800'}`}>{product.title}</h4>
                                        <div className="flex items-center gap-2 mt-0.5">
                                            <span className="text-[10px] text-slate-400 font-medium">{product.salesCount || 0} sales</span>
                                            <span className="w-1 h-1 rounded-full bg-slate-200"></span>
                                            <span className="text-[10px] text-emerald-600 font-bold">৳{((product.salesCount || 0) * (product.price || 0)).toLocaleString()}</span>
                                        </div>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <p className="text-center text-slate-400 text-sm py-10">No data available.</p>
                        )}
                    </div>
                    <div className="p-4 border-t border-slate-100">
                        <button className="w-full py-2 text-indigo-600 text-[11px] font-bold hover:bg-indigo-50 rounded-lg transition-all uppercase tracking-wider">
                            View Detailed Analysis
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}

