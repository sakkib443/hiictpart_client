'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import {
    FiBarChart2, FiTrendingUp, FiTrendingDown, FiDollarSign, FiUsers,
    FiShoppingBag, FiBook, FiRefreshCw, FiGlobe, FiCode,
    FiCalendar, FiPackage, FiActivity, FiPieChart, FiLayers,
    FiArrowUpRight, FiArrowDownRight, FiMonitor
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
import { API_BASE_URL } from '@/config/api';

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
        <div className={`rounded-3xl p-8 shadow-2xl transition-all duration-500 group overflow-hidden relative border ${isDark ? 'bg-slate-900/50 border-slate-800 hover:border-indigo-500/50' : 'bg-white border-slate-100 hover:shadow-indigo-500/10'
            }`}>
            <div className={`absolute -right-10 -top-10 w-40 h-40 rounded-full blur-[80px] opacity-10 transition-opacity group-hover:opacity-20 ${color}`} />

            <div className="relative flex items-start justify-between">
                <div className="space-y-4">
                    <div className="space-y-1">
                        <p className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em]">{title}</p>
                        <h3 className={`text-4xl font-black font-outfit tracking-tighter ${isDark ? 'text-white' : 'text-slate-900'}`}>
                            {loading ? (
                                <div className="h-10 w-32 bg-slate-200 dark:bg-slate-800 animate-pulse rounded-2xl" />
                            ) : (
                                <AnimatedCounter value={value} prefix={title.includes('Revenue') ? '৳' : ''} />
                            )}
                        </h3>
                    </div>
                    {trendValue && (
                        <div className={`flex items-center gap-2 px-3 py-1.5 rounded-full w-fit text-[10px] font-black uppercase tracking-wider ${isPositive ? "bg-emerald-500/10 text-emerald-500" : "bg-rose-500/10 text-rose-500"}`}>
                            {isPositive ? <FiArrowUpRight className="w-3 h-3" /> : <FiArrowDownRight className="w-3 h-3" />}
                            <span>{trendValue} Growth</span>
                        </div>
                    )}
                </div>
                <div className={`w-16 h-16 rounded-[2rem] shadow-2xl transition-all duration-500 group-hover:scale-110 group-hover:rotate-6 ${color} flex items-center justify-center text-white ring-8 ring-white/10`}>
                    <Icon size={28} />
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
    const [recentPurchases, setRecentPurchases] = useState([]);
    const [topProducts, setTopProducts] = useState([]);
    const [categoryRevenue, setCategoryRevenue] = useState({
        labels: [],
        courses: [],
        websites: [],
        designTemplates: [],
    });

    const fetchAnalytics = async () => {
        try {
            setLoading(true);
            const token = localStorage.getItem('token');

            const [dashboardRes, categoryRes, recentRes, topRes] = await Promise.all([
                fetch(`${API_BASE_URL}/analytics/dashboard`, {
                    headers: { 'Authorization': `Bearer ${token}` }
                }),
                fetch(`${API_BASE_URL}/analytics/category-revenue`, {
                    headers: { 'Authorization': `Bearer ${token}` }
                }),
                fetch(`${API_BASE_URL}/analytics/recent-purchases?limit=10`, {
                    headers: { 'Authorization': `Bearer ${token}` }
                }),
                fetch(`${API_BASE_URL}/analytics/top-products?limit=5`, {
                    headers: { 'Authorization': `Bearer ${token}` }
                })
            ]);

            const dashboardResult = await dashboardRes.json();
            const categoryResult = await categoryRes.json();
            const recentResult = await recentRes.json();
            const topResult = await topRes.json();

            if (dashboardResult.data) setData(dashboardResult.data);
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

    const totalProducts = (data?.totalCourses || 0) + (data?.totalDesignTemplates || 0) + (data?.totalWebsites || 0);

    const mainStats = [
        {
            title: 'Global Revenue',
            value: data?.totalRevenue || 0,
            icon: FiDollarSign,
            trend: 'up',
            trendValue: '12%',
            color: 'bg-indigo-600'
        },
        {
            title: 'Successful Orders',
            value: data?.totalOrders || 0,
            icon: FiShoppingBag,
            trend: 'up',
            trendValue: '8%',
            color: 'bg-rose-500'
        },
        {
            title: 'Active Accounts',
            value: data?.totalUsers || 0,
            icon: FiUsers,
            trend: 'up',
            trendValue: '15%',
            color: 'bg-emerald-500'
        },
        {
            title: 'Inventory Scope',
            value: totalProducts,
            icon: FiPackage,
            trend: 'up',
            trendValue: '+5',
            color: 'bg-amber-500'
        },
    ];

    const chartData = (categoryRevenue?.labels || []).map((label, index) => ({
        name: label,
        courses: (categoryRevenue?.courses?.[index]) || 0,
        websites: (categoryRevenue?.websites?.[index]) || 0,
        designTemplates: (categoryRevenue?.designTemplates?.[index]) || 0,
    }));

    return (
        <div className="space-y-8 pb-10 animate-in fade-in duration-700">
            {/* Page Header */}
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-8">
                <div>
                    <h1 className="text-4xl font-black text-slate-900 dark:text-white tracking-tighter">Command Center</h1>
                    <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 mt-1 italic flex items-center gap-2">
                        <span className="w-8 h-px bg-slate-200"></span> Live Telemetry & System Analytics
                    </p>
                </div>
                <div className="flex items-center gap-4">
                    <button
                        onClick={fetchAnalytics}
                        disabled={loading}
                        className="flex items-center gap-3 px-6 py-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl text-[10px] font-black uppercase tracking-widest text-slate-500 hover:text-indigo-500 transition-all shadow-xl active:scale-95"
                    >
                        <FiRefreshCw size={14} className={loading ? 'animate-spin' : ''} />
                        Sync Data
                    </button>
                    <button
                        onClick={() => router.push('/dashboard/admin/reports')}
                        className="px-8 py-4 bg-slate-900 dark:bg-indigo-600 text-white rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] hover:scale-105 active:scale-95 transition-all shadow-2xl shadow-indigo-500/20"
                    >
                        Export Intel
                    </button>
                </div>
            </div>

            {/* Main Stats Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {mainStats.map((stat) => (
                    <StatsCard key={stat.title} {...stat} loading={loading} />
                ))}
            </div>

            {/* Revenue & Summary Section */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                {/* Revenue Breakdown */}
                <div className={`lg:col-span-8 rounded-[3rem] border overflow-hidden shadow-2xl ${isDark ? 'bg-slate-900/40 border-slate-800' : 'bg-white border-slate-100'
                    }`}>
                    <div className="flex flex-col md:flex-row md:items-center justify-between p-10 gap-6">
                        <div className="space-y-1">
                            <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em]">Revenue Flux</h3>
                            <p className="text-xl font-black text-slate-900 dark:text-white tracking-tight">Cross-Category Performance</p>
                        </div>
                        <div className="flex items-center gap-6 px-6 py-3 bg-slate-50 dark:bg-slate-800/50 rounded-2xl">
                            <div className="flex items-center gap-2">
                                <div className="w-2.5 h-2.5 rounded-full bg-indigo-500 shadow-lg shadow-indigo-500/40"></div>
                                <span className="text-[9px] font-black uppercase text-slate-500">Academic</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 shadow-lg shadow-emerald-500/40"></div>
                                <span className="text-[9px] font-black uppercase text-slate-500">Website</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <div className="w-2.5 h-2.5 rounded-full bg-amber-500 shadow-lg shadow-amber-500/40"></div>
                                <span className="text-[9px] font-black uppercase text-slate-500">Design</span>
                            </div>
                        </div>
                    </div>

                    <div className="px-10 pb-10">
                        <div className="h-[400px] w-full">
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
                                        <linearGradient id="colorDesign" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="5%" stopColor="#F59E0B" stopOpacity={0.3} />
                                            <stop offset="95%" stopColor="#F59E0B" stopOpacity={0} />
                                        </linearGradient>
                                    </defs>
                                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={isDark ? '#1e293b' : '#f1f5f9'} />
                                    <XAxis
                                        dataKey="name"
                                        axisLine={false}
                                        tickLine={false}
                                        tick={{ fill: '#94a3b8', fontSize: 10, fontWeight: 800 }}
                                        dy={20}
                                    />
                                    <YAxis
                                        axisLine={false}
                                        tickLine={false}
                                        tick={{ fill: '#94a3b8', fontSize: 10, fontWeight: 800 }}
                                        tickFormatter={(value) => `৳${value >= 1000 ? (value / 1000).toFixed(0) + 'K' : value}`}
                                        dx={-10}
                                    />
                                    <Tooltip
                                        contentStyle={{
                                            backgroundColor: isDark ? "#0f172a" : "#fff",
                                            border: "none",
                                            borderRadius: "24px",
                                            boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.25)",
                                            padding: '24px',
                                        }}
                                        itemStyle={{ fontSize: '10px', fontWeight: '900', textTransform: 'uppercase' }}
                                        formatter={(value) => [`৳${value.toLocaleString()}`, '']}
                                    />
                                    <Area type="monotone" dataKey="courses" stroke="#6366F1" strokeWidth={4} fillOpacity={1} fill="url(#colorCourses)" />
                                    <Area type="monotone" dataKey="websites" stroke="#10B981" strokeWidth={4} fillOpacity={1} fill="url(#colorWebsites)" />
                                    <Area type="monotone" dataKey="designTemplates" stroke="#F59E0B" strokeWidth={4} fillOpacity={1} fill="url(#colorDesign)" />
                                </AreaChart>
                            </ResponsiveContainer>
                        </div>

                        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 mt-12 pt-10 border-t border-slate-50 dark:border-slate-800">
                            <div className="space-y-1">
                                <span className="text-[9px] font-black uppercase text-slate-400 tracking-widest">Academic Revenue</span>
                                <p className="text-xl font-black text-indigo-500">৳{(categoryRevenue?.courses?.[categoryRevenue?.courses?.length - 1] || 0).toLocaleString()}</p>
                            </div>
                            <div className="space-y-1">
                                <span className="text-[9px] font-black uppercase text-slate-400 tracking-widest">Website Revenue</span>
                                <p className="text-xl font-black text-emerald-500">৳{(categoryRevenue?.websites?.[categoryRevenue?.websites?.length - 1] || 0).toLocaleString()}</p>
                            </div>
                            <div className="space-y-1">
                                <span className="text-[9px] font-black uppercase text-slate-400 tracking-widest">Design Revenue</span>
                                <p className="text-xl font-black text-amber-500">৳{(categoryRevenue?.designTemplates?.[categoryRevenue?.designTemplates?.length - 1] || 0).toLocaleString()}</p>
                            </div>
                            <div className="lg:text-right space-y-1">
                                <span className="text-[9px] font-black uppercase text-slate-400 tracking-widest">Net Conversion</span>
                                <p className="text-2xl font-black text-slate-900 dark:text-white">৳{(data?.totalRevenue || 0).toLocaleString()}</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Node Health / Platform Status */}
                <div className={`lg:col-span-4 rounded-[3rem] p-10 border relative overflow-hidden group shadow-2xl flex flex-col justify-between ${isDark ? 'bg-slate-900/60 border-slate-800' : 'bg-slate-900/5 border-slate-100'}`}>
                    <div className="space-y-8 relative z-10">
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 rounded-2xl bg-indigo-500/10 text-indigo-500 flex items-center justify-center">
                                <FiActivity size={24} />
                            </div>
                            <div>
                                <h3 className="text-[10px] font-black text-slate-500 uppercase tracking-[0.3em]">System Health</h3>
                                <p className="text-lg font-black text-slate-900 dark:text-white tracking-tight">Active Pulse</p>
                            </div>
                        </div>

                        <div className="space-y-4">
                            <div className="p-6 bg-white dark:bg-slate-800 rounded-3xl shadow-xl shadow-slate-500/5">
                                <p className="text-[9px] font-black uppercase text-slate-400 tracking-widest mb-1">Monthly Yield</p>
                                <h4 className="text-2xl font-black text-slate-900 dark:text-white font-outfit">৳{(data?.monthlyRevenue || 0).toLocaleString()}</h4>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="p-6 bg-indigo-500 text-white rounded-3xl shadow-2xl shadow-indigo-500/30">
                                    <p className="text-[8px] font-black uppercase tracking-widest mb-1 opacity-70">Enrolled</p>
                                    <h4 className="text-xl font-black font-outfit">{data?.totalStudents || 0}</h4>
                                </div>
                                <div className="p-6 bg-emerald-500 text-white rounded-3xl shadow-2xl shadow-emerald-500/30">
                                    <p className="text-[8px] font-black uppercase tracking-widest mb-1 opacity-70">Inflow</p>
                                    <h4 className="text-xl font-black font-outfit">+{data?.newUsersThisMonth || 0}</h4>
                                </div>
                            </div>

                            <div className="p-6 border border-slate-200 dark:border-slate-800 rounded-3xl flex items-center justify-between">
                                <div>
                                    <p className="text-[9px] font-black uppercase text-slate-400 tracking-widest mb-1">Active Connections</p>
                                    <h4 className="text-xl font-black text-slate-900 dark:text-white">{data?.activeEnrollments || 0}</h4>
                                </div>
                                <div className="w-10 h-10 rounded-full border-4 border-indigo-500 border-t-transparent animate-spin"></div>
                            </div>
                        </div>
                    </div>

                    <div className="mt-8 pt-8 border-t border-slate-200 dark:border-slate-800">
                        <div className="flex items-center justify-between px-2">
                            <span className="text-[9px] font-black uppercase text-slate-400 tracking-widest">Pending Ops</span>
                            <span className="px-3 py-1 bg-amber-500 text-white rounded-full text-[8px] font-black tracking-widest uppercase">Action Required</span>
                        </div>
                        <p className="text-3xl font-black text-amber-500 mt-2 px-2">{data?.pendingOrders || 0}</p>
                    </div>
                </div>
            </div>

            {/* Metrics Cluster */}
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
                {[
                    { title: 'Websites', value: data?.totalWebsites || 0, icon: FiGlobe, color: 'bg-emerald-500' },
                    { title: 'Templates', value: data?.totalDesignTemplates || 0, icon: FiCode, color: 'bg-indigo-500' },
                    { title: 'Academic', value: data?.totalCourses || 0, icon: FiBook, color: 'bg-amber-500' },
                    { title: 'Accounts', value: data?.totalUsers || 0, icon: FiUsers, color: 'bg-blue-500' },
                    { title: 'Enrollments', value: data?.totalEnrollments || 0, icon: FiActivity, color: 'bg-rose-500' },
                    { title: 'Lessons', value: data?.totalLessons || 0, icon: FiLayers, color: 'bg-violet-500' },
                ].map((item) => (
                    <div key={item.title} className={`p-8 rounded-[2.5rem] border flex flex-col items-center justify-center text-center transition-all duration-500 group relative ${isDark ? 'bg-slate-900/40 border-slate-800 hover:border-indigo-500' : 'bg-white border-slate-100 hover:shadow-2xl'}`}>
                        <div className={`w-12 h-12 rounded-2xl ${item.color} flex items-center justify-center text-white mb-4 shadow-2xl shadow-indigo-500/20 group-hover:scale-125 transition-transform`}>
                            <item.icon size={20} />
                        </div>
                        <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">{item.title}</p>
                        <p className={`text-2xl font-black tracking-tighter ${isDark ? 'text-white' : 'text-slate-900'}`}>{loading ? '...' : item.value}</p>
                    </div>
                ))}
            </div>

            {/* Tactical Grid: Purchases & Popularity */}
            <div className="grid grid-cols-1 xl:grid-cols-12 gap-8">
                {/* Deployment Buffer (Recent Purchases) */}
                <div className={`xl:col-span-8 rounded-[3rem] border overflow-hidden shadow-2xl ${isDark ? 'bg-slate-900/40 border-slate-800' : 'bg-white border-slate-100'
                    }`}>
                    <div className="flex flex-col md:flex-row md:items-center justify-between p-10 gap-6">
                        <div className="space-y-1">
                            <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em]">Traffic Stream</h3>
                            <p className="text-xl font-black text-slate-900 dark:text-white tracking-tight">Recent Acquisitions</p>
                        </div>
                        <button className="text-[10px] font-black text-indigo-500 uppercase tracking-widest hover:tracking-[0.2em] transition-all">View Full Log</button>
                    </div>
                    <div className="overflow-x-auto px-10 pb-10">
                        <table className="w-full text-left">
                            <thead>
                                <tr className="border-b border-slate-50 dark:border-slate-800">
                                    <th className="pb-6 text-[10px] font-black text-slate-500 uppercase tracking-widest">Asset Node</th>
                                    <th className="pb-6 text-[10px] font-black text-slate-500 uppercase tracking-widest">Inflow</th>
                                    <th className="pb-6 text-[10px] font-black text-slate-500 uppercase tracking-widest">Node Status</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-50 dark:divide-slate-800">
                                {recentPurchases.length > 0 ? (
                                    recentPurchases.map((purchase) => (
                                        <tr key={purchase._id} className="group hover:bg-slate-50 dark:hover:bg-slate-800/30 transition-all">
                                            <td className="py-6">
                                                <div className="flex items-center gap-4">
                                                    <div className="w-12 h-12 rounded-2xl bg-slate-900 text-white flex items-center justify-center text-xs font-black ring-4 ring-slate-100 dark:ring-slate-800">
                                                        {(purchase.user?.firstName || 'U')[0]}
                                                    </div>
                                                    <div>
                                                        <p className="text-sm font-black text-slate-900 dark:text-white">{purchase.user?.firstName} {purchase.user?.lastName}</p>
                                                        <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">{purchase.items?.[0]?.title || 'System Asset'}</p>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="py-6 font-black text-slate-900 dark:text-white text-sm">৳{purchase.totalAmount?.toLocaleString()}</td>
                                            <td className="py-6">
                                                <span className={`px-4 py-2 rounded-xl text-[9px] font-black tracking-widest uppercase ${purchase.paymentStatus === 'completed'
                                                    ? 'bg-emerald-500/10 text-emerald-500'
                                                    : 'bg-amber-500/10 text-amber-500'
                                                    }`}>
                                                    {purchase.paymentStatus}
                                                </span>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan="3" className="py-20 text-center">
                                            <p className="text-[10px] font-black uppercase text-slate-400 tracking-[0.2em] italic">Awaiting Buffer Inflow...</p>
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Performance Leaders (Top Products) */}
                <div className={`xl:col-span-4 rounded-[3rem] border flex flex-col shadow-2xl ${isDark ? 'bg-slate-900/40 border-slate-800' : 'bg-white border-slate-100'
                    }`}>
                    <div className="p-10 border-b border-slate-50 dark:border-slate-800">
                        <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] mb-1">Asset Rankings</h3>
                        <p className="text-lg font-black text-slate-900 dark:text-white tracking-tight">Performance Leaders</p>
                    </div>
                    <div className="p-10 space-y-8 flex-1">
                        {topProducts.length > 0 ? (
                            topProducts.map((product, idx) => (
                                <div key={product._id} className="flex items-center gap-6 group cursor-pointer">
                                    <div className="relative">
                                        <div className="w-16 h-16 rounded-2xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 p-1 overflow-hidden">
                                            {product.images?.[0] ? (
                                                <img src={product.images[0]} alt="" className="w-full h-full object-cover rounded-xl group-hover:scale-110 transition-transform duration-700" />
                                            ) : (
                                                <div className="w-full h-full flex items-center justify-center text-slate-400"><FiPackage size={24} /></div>
                                            )}
                                        </div>
                                        <div className="absolute -top-3 -left-3 w-8 h-8 rounded-2xl bg-slate-900 text-white flex items-center justify-center text-[10px] font-black ring-4 ring-white dark:ring-slate-900 rotate-[-12deg] group-hover:rotate-0 transition-transform">
                                            0{idx + 1}
                                        </div>
                                    </div>
                                    <div className="flex-1 min-w-0 space-y-1">
                                        <h4 className="text-[11px] font-black text-slate-900 dark:text-white tracking-tight uppercase truncate">{product.title}</h4>
                                        <div className="flex items-center gap-3">
                                            <span className="text-[9px] font-black text-slate-400 uppercase tracking-[0.1em]">{product.salesCount || 0} Nodes</span>
                                            <span className="text-[10px] font-black text-emerald-500">৳{((product.salesCount || 0) * (product.price || 0)).toLocaleString()}</span>
                                        </div>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div className="h-full flex flex-col items-center justify-center text-center space-y-4 opacity-40 py-20">
                                <FiMonitor size={48} />
                                <p className="text-[10px] font-black uppercase tracking-widest">No Node Hierarchy Identified</p>
                            </div>
                        )}
                    </div>
                    <div className="p-8">
                        <button className="w-full py-5 bg-slate-50 dark:bg-slate-800/50 rounded-2xl text-[9px] font-black text-slate-500 uppercase tracking-[0.3em] hover:bg-indigo-500 hover:text-white transition-all active:scale-95">
                            Extract Data Stream
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
