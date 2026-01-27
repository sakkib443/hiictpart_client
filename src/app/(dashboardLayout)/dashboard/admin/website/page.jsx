'use client';
import { API_URL, API_BASE_URL } from '@/config/api';


import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import {
    FiPlus, FiSearch, FiGlobe, FiCheckCircle, FiClock,
    FiTrash2, FiEdit2, FiEye, FiRefreshCw, FiLayout, FiStar,
    FiExternalLink, FiBarChart2, FiUsers, FiDollarSign, FiFilter,
    FiMoreVertical, FiAlertCircle
} from 'react-icons/fi';



export default function WebsiteAdminPage() {
    const [websites, setWebsites] = useState([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');
    const [statusFilter, setStatusFilter] = useState('all');
    const [platformFilter, setPlatformFilter] = useState('all');

    const fetchWebsites = async () => {
        const token = localStorage.getItem('token');
        try {
            setLoading(true);
            const res = await fetch(`${API_URL}/websites/admin/all`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            const data = await res.json();
            setWebsites(data.data || []);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { fetchWebsites(); }, []);

    const handleDelete = async (id) => {
        if (!confirm("Are you sure you want to permanently remove this website asset?")) return;
        const token = localStorage.getItem('token');
        try {
            const res = await fetch(`${API_URL}/websites/admin/${id}`, {
                method: 'DELETE',
                headers: { 'Authorization': `Bearer ${token}` }
            });
            if (res.ok) {
                setWebsites(prev => prev.filter(w => w._id !== id));
            } else {
                alert("Failed to delete asset.");
            }
        } catch (err) { alert("Network error during deletion"); }
    };

    const platforms = Array.from(new Set(websites.map(w => w.platform))).filter(Boolean);

    const filtered = websites.filter(w => {
        const matchSearch = w.title?.toLowerCase().includes(search.toLowerCase()) ||
            w.platform?.toLowerCase().includes(search.toLowerCase());
        const matchStatus = statusFilter === 'all' || w.status === statusFilter;
        const matchPlatform = platformFilter === 'all' || w.platform === platformFilter;
        return matchSearch && matchStatus && matchPlatform;
    });

    const getStatusBadge = (status) => {
        switch (status) {
            case 'approved': return <span className="px-2.5 py-1 bg-emerald-500/10 text-emerald-500 rounded-lg text-[10px] font-bold uppercase tracking-wider flex items-center gap-1"><FiCheckCircle size={10} /> Active</span>;
            case 'pending': return <span className="px-2.5 py-1 bg-amber-500/10 text-amber-500 rounded-lg text-[10px] font-bold uppercase tracking-wider flex items-center gap-1"><FiClock size={10} /> Pending</span>;
            case 'draft': return <span className="px-2.5 py-1 bg-slate-500/10 text-slate-500 rounded-lg text-[10px] font-bold uppercase tracking-wider">Draft</span>;
            case 'rejected': return <span className="px-2.5 py-1 bg-rose-500/10 text-rose-500 rounded-lg text-[10px] font-bold uppercase tracking-wider">Rejected</span>;
            default: return <span className="px-2.5 py-1 bg-slate-500/10 text-slate-500 rounded-lg text-[10px] font-bold uppercase tracking-wider">{status}</span>;
        }
    };

    const stats = {
        total: websites.length,
        live: websites.filter(w => w.status === 'approved').length,
        pending: websites.filter(w => w.status === 'pending').length,
        totalSales: websites.reduce((acc, curr) => acc + (curr.salesCount || 0), 0),
    };

    return (
        <div className="max-w-[1400px] mx-auto space-y-6 pb-20">
            {/* Header section with glass effect */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 bg-white dark:bg-slate-900/50 backdrop-blur-xl border border-slate-200 dark:border-slate-800 p-6 rounded-3xl shadow-sm">
                <div className="flex items-center gap-4">
                    <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center shadow-lg shadow-emerald-500/20">
                        <FiGlobe className="text-white text-2xl" />
                    </div>
                    <div>
                        <h1 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">Website Inventory</h1>
                        <p className="text-sm font-medium text-slate-500 dark:text-slate-400">Total {stats.total} assets managed in marketplace</p>
                    </div>
                </div>
                <div className="flex items-center gap-3">
                    <button
                        onClick={fetchWebsites}
                        className="p-3 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-400 rounded-2xl transition-all active:scale-95"
                        title="Refresh Data"
                    >
                        <FiRefreshCw size={20} className={loading ? 'animate-spin' : ''} />
                    </button>
                    <Link href="/dashboard/admin/website/create">
                        <button className="flex items-center gap-2 bg-slate-900 dark:bg-emerald-600 hover:bg-slate-800 dark:hover:bg-emerald-700 text-white px-6 py-3 rounded-2xl font-bold text-sm shadow-xl transition-all active:scale-95">
                            <FiPlus size={18} /> Add New Asset
                        </button>
                    </Link>
                </div>
            </div>

            {/* Premium Stats Strip */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {[
                    { label: 'Total Listing', val: stats.total, icon: <FiLayout />, color: 'slate' },
                    { label: 'Live Templates', val: stats.live, icon: <FiCheckCircle />, color: 'emerald' },
                    { label: 'Review Pending', val: stats.pending, icon: <FiClock />, color: 'amber' },
                    { label: 'Total Units Sold', val: stats.totalSales, icon: <FiBarChart2 />, color: 'indigo' },
                ].map((s, i) => (
                    <div key={i} className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-5 rounded-3xl flex items-center gap-4 shadow-sm hover:border-emerald-500/30 transition-all group">
                        <div className={`w-12 h-12 rounded-2xl flex items-center justify-center text-lg bg-${s.color}-500/10 text-${s.color}-500 group-hover:scale-110 transition-transform`}>
                            {s.icon}
                        </div>
                        <div>
                            <p className="text-[10px] uppercase font-bold tracking-widest text-slate-400 mb-0.5">{s.label}</p>
                            <h3 className="text-xl font-black text-slate-800 dark:text-white leading-none">{s.val}</h3>
                        </div>
                    </div>
                ))}
            </div>

            {/* Filter & Search Toolbar */}
            <div className="flex flex-col lg:flex-row gap-4">
                <div className="relative flex-grow">
                    <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                    <input
                        placeholder="Search by title, category or platform..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="w-full pl-12 pr-6 py-4 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-800 dark:text-slate-200 focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all outline-none text-sm font-medium"
                    />
                </div>

                <div className="flex items-center gap-2 overflow-x-auto pb-2 lg:pb-0 px-1">
                    <div className="flex items-center gap-1 bg-white dark:bg-slate-900 p-1.5 rounded-2xl border border-slate-200 dark:border-slate-800">
                        {['all', 'approved', 'pending', 'draft'].map(s => (
                            <button
                                key={s}
                                onClick={() => setStatusFilter(s)}
                                className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-wider transition-all ${statusFilter === s ? 'bg-slate-900 dark:bg-emerald-600 text-white shadow-lg' : 'text-slate-500 hover:bg-slate-50 dark:hover:bg-slate-800'}`}
                            >
                                {s}
                            </button>
                        ))}
                    </div>

                    <select
                        value={platformFilter}
                        onChange={(e) => setPlatformFilter(e.target.value)}
                        className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl px-4 py-3 text-xs font-bold text-slate-700 dark:text-slate-300 outline-none focus:border-emerald-500 cursor-pointer"
                    >
                        <option value="all">Platforms: All</option>
                        {platforms.map(p => <option key={p} value={p}>{p}</option>)}
                    </select>
                </div>
            </div>

            {/* Main Content Area */}
            {loading ? (
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-6">
                    {[1, 2, 3, 4, 5, 6, 7, 8].map(i => (
                        <div key={i} className="aspect-[4/5] bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 animate-pulse overflow-hidden">
                            <div className="h-44 bg-slate-100 dark:bg-slate-800"></div>
                            <div className="p-6 space-y-4">
                                <div className="h-4 bg-slate-100 dark:bg-slate-800 rounded w-3/4"></div>
                                <div className="h-3 bg-slate-100 dark:bg-slate-800 rounded w-1/2"></div>
                            </div>
                        </div>
                    ))}
                </div>
            ) : filtered.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-32 bg-white dark:bg-slate-900 border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-[3rem] text-center px-6">
                    <div className="w-24 h-24 bg-slate-50 dark:bg-slate-800 flex items-center justify-center rounded-full mb-6 text-slate-300">
                        <FiAlertCircle size={48} />
                    </div>
                    <h3 className="text-xl font-bold text-slate-800 dark:text-white">No Assets Found</h3>
                    <p className="text-sm text-slate-500 dark:text-slate-400 mt-2 max-w-xs mx-auto">Try adjusting your filters or add a new website template to start selling.</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-6">
                    {filtered.map((w, idx) => (
                        <div key={w._id} className="group bg-white dark:bg-slate-900 rounded-[2rem] border border-slate-200 dark:border-slate-800 overflow-hidden hover:shadow-2xl hover:shadow-emerald-500/10 transition-all duration-300 flex flex-col h-full animate-in slide-in-from-bottom-4 fade-in duration-500" style={{ animationDelay: `${idx * 50}ms` }}>
                            {/* Visual Header */}
                            <div className="relative h-48 overflow-hidden bg-slate-100 dark:bg-slate-800">
                                {w.images?.[0] ? (
                                    <img src={w.images[0]} alt={w.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center opacity-20">
                                        <FiGlobe size={64} />
                                    </div>
                                )}

                                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-4">
                                    <div className="flex gap-2 w-full">
                                        {w.previewUrl && (
                                            <Link href={w.previewUrl} target="_blank" className="flex-1 bg-white hover:bg-emerald-50 text-slate-900 py-2 rounded-xl text-xs font-bold flex items-center justify-center gap-2 shadow-lg transition-all">
                                                <FiEye /> Preview
                                            </Link>
                                        )}
                                    </div>
                                </div>

                                <div className="absolute top-4 left-4 right-4 flex justify-between items-start">
                                    {getStatusBadge(w.status)}
                                    {w.isFeatured && (
                                        <span className="p-2 bg-yellow-400 text-slate-900 rounded-xl shadow-lg animate-pulse" title="Featured Asset">
                                            <FiStar size={12} fill="currentColor" />
                                        </span>
                                    )}
                                </div>
                            </div>

                            {/* Info Block */}
                            <div className="p-6 space-y-4 flex-grow flex flex-col">
                                <div className="flex-grow">
                                    <div className="flex items-center gap-2 text-[9px] uppercase font-black tracking-widest text-emerald-500 mb-2">
                                        <span>{w.platform}</span>
                                        <span className="w-1 h-1 bg-slate-300 dark:bg-slate-700 rounded-full"></span>
                                        <span className="text-slate-500">{w.category?.name || 'Uncategorized'}</span>
                                    </div>
                                    <h3 className="text-base font-extrabold text-slate-800 dark:text-white leading-tight line-clamp-2 min-h-[3rem] group-hover:text-emerald-500 transition-colors">
                                        {w.title}
                                    </h3>
                                </div>

                                <div className="flex items-center justify-between text-xs py-3 border-y border-slate-50 dark:border-slate-800/50">
                                    <div className="flex items-center gap-1.5 text-slate-500 font-bold">
                                        <FiUsers />
                                        <span>{w.salesCount || 0} Sales</span>
                                    </div>
                                    <div className="flex items-center gap-1.5 text-emerald-500 font-bold">
                                        <FiStar />
                                        <span>{w.rating || '4.5'}</span>
                                    </div>
                                </div>

                                <div className="flex items-center justify-between">
                                    <div>
                                        {w.offerPrice ? (
                                            <div className="flex flex-col">
                                                <span className="text-xs text-slate-400 font-bold line-through ml-1 leading-none">৳{w.price?.toLocaleString()}</span>
                                                <span className="text-xl font-black text-slate-800 dark:text-white leading-none mt-1 group-hover:scale-105 origin-left transition-transform">৳{w.offerPrice?.toLocaleString()}</span>
                                            </div>
                                        ) : (
                                            <span className="text-xl font-black text-slate-800 dark:text-white leading-none group-hover:shadow-lg transition-all tracking-tighter">৳{w.price?.toLocaleString() || 'Free'}</span>
                                        )}
                                    </div>

                                    <div className="flex gap-2">
                                        <Link
                                            href={`/dashboard/admin/website/edit/${w._id}`}
                                            className="p-3 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-900 dark:hover:bg-emerald-600 hover:text-white rounded-2xl transition-all"
                                            title="Edit Asset"
                                        >
                                            <FiEdit2 size={16} />
                                        </Link>
                                        <button
                                            onClick={() => handleDelete(w._id)}
                                            className="p-3 bg-rose-500/5 text-rose-500 hover:bg-rose-500 hover:text-white rounded-2xl transition-all"
                                            title="Delete Asset"
                                        >
                                            <FiTrash2 size={16} />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
