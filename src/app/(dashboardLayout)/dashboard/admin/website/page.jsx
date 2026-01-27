'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import {
    FiPlus, FiSearch, FiGlobe, FiCheckCircle, FiClock,
    FiTrash2, FiEdit2, FiEye, FiRefreshCw, FiLayout, FiStar
} from 'react-icons/fi';

const API_URL = process.env.NEXT_PUBLIC_API_URL || (process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api');

export default function WebsiteAdminPage() {
    const [websites, setWebsites] = useState([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');
    const [statusFilter, setStatusFilter] = useState('all');

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
        if (!confirm("Remove this website?")) return;
        const token = localStorage.getItem('token');
        try {
            const res = await fetch(`${API_URL}/websites/admin/${id}`, {
                method: 'DELETE',
                headers: { 'Authorization': `Bearer ${token}` }
            });
            if (res.ok) fetchWebsites();
        } catch (err) { alert("Delete failed"); }
    };

    const filtered = websites.filter(w => {
        const matchSearch = w.title?.toLowerCase().includes(search.toLowerCase());
        const matchStatus = statusFilter === 'all' || w.status === statusFilter;
        return matchSearch && matchStatus;
    });

    const getStatusBadge = (status) => {
        switch (status) {
            case 'approved': return <span className="px-2 py-0.5 bg-emerald-100 dark:bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 rounded text-[10px] font-medium flex items-center gap-1"><FiCheckCircle size={10} /> Live</span>;
            case 'pending': return <span className="px-2 py-0.5 bg-amber-100 dark:bg-amber-500/20 text-amber-600 dark:text-amber-400 rounded text-[10px] font-medium flex items-center gap-1"><FiClock size={10} /> Pending</span>;
            case 'draft': return <span className="px-2 py-0.5 bg-slate-100 dark:bg-slate-700 text-slate-500 rounded text-[10px] font-medium">Draft</span>;
            default: return <span className="px-2 py-0.5 bg-rose-100 dark:bg-rose-500/20 text-rose-500 rounded text-[10px] font-medium">{status}</span>;
        }
    };

    const stats = {
        total: websites.length,
        live: websites.filter(w => w.status === 'approved').length,
        pending: websites.filter(w => w.status === 'pending').length,
        featured: websites.filter(w => w.isFeatured).length,
    };

    return (
        <div className="p-4 md:p-6 space-y-5 bg-slate-50 dark:bg-slate-900 min-h-screen">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-white dark:bg-slate-800 rounded-md border border-slate-200 dark:border-slate-700 p-4">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-md bg-emerald-500 flex items-center justify-center">
                        <FiGlobe className="text-white" size={18} />
                    </div>
                    <div>
                        <h1 className="text-lg font-semibold text-slate-800 dark:text-white">Websites</h1>
                        <p className="text-xs text-slate-500 dark:text-slate-400">Manage website templates</p>
                    </div>
                </div>
                <div className="flex items-center gap-2">
                    <button
                        onClick={fetchWebsites}
                        disabled={loading}
                        className="flex items-center gap-2 px-3 py-2 bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600 text-slate-600 dark:text-slate-300 rounded-md text-sm font-medium transition-all disabled:opacity-50"
                    >
                        <FiRefreshCw size={14} className={loading ? 'animate-spin' : ''} />
                        Reload
                    </button>
                    <Link href="/dashboard/admin/website/create">
                        <button className="flex items-center gap-2 px-4 py-2 bg-emerald-500 hover:bg-emerald-600 text-white rounded-md text-sm font-medium transition-all">
                            <FiPlus size={14} />
                            Add Website
                        </button>
                    </Link>
                </div>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
                <div className="bg-white dark:bg-slate-800 rounded-md border border-slate-200 dark:border-slate-700 p-4">
                    <div className="flex items-center justify-between mb-2">
                        <div className="w-8 h-8 bg-slate-700 rounded-md flex items-center justify-center">
                            <FiLayout className="text-white" size={14} />
                        </div>
                        <span className="text-xl font-bold text-slate-800 dark:text-white">{stats.total}</span>
                    </div>
                    <p className="text-xs text-slate-500 dark:text-slate-400">Total</p>
                </div>
                <div className="bg-white dark:bg-slate-800 rounded-md border border-slate-200 dark:border-slate-700 p-4">
                    <div className="flex items-center justify-between mb-2">
                        <div className="w-8 h-8 bg-emerald-500 rounded-md flex items-center justify-center">
                            <FiCheckCircle className="text-white" size={14} />
                        </div>
                        <span className="text-xl font-bold text-slate-800 dark:text-white">{stats.live}</span>
                    </div>
                    <p className="text-xs text-slate-500 dark:text-slate-400">Published</p>
                </div>
                <div className="bg-white dark:bg-slate-800 rounded-md border border-slate-200 dark:border-slate-700 p-4">
                    <div className="flex items-center justify-between mb-2">
                        <div className="w-8 h-8 bg-amber-500 rounded-md flex items-center justify-center">
                            <FiClock className="text-white" size={14} />
                        </div>
                        <span className="text-xl font-bold text-slate-800 dark:text-white">{stats.pending}</span>
                    </div>
                    <p className="text-xs text-slate-500 dark:text-slate-400">Pending</p>
                </div>
                <div className="bg-white dark:bg-slate-800 rounded-md border border-slate-200 dark:border-slate-700 p-4">
                    <div className="flex items-center justify-between mb-2">
                        <div className="w-8 h-8 bg-yellow-500 rounded-md flex items-center justify-center">
                            <FiStar className="text-white" size={14} />
                        </div>
                        <span className="text-xl font-bold text-slate-800 dark:text-white">{stats.featured}</span>
                    </div>
                    <p className="text-xs text-slate-500 dark:text-slate-400">Featured</p>
                </div>
            </div>

            {/* Filters Bar */}
            <div className="flex flex-col md:flex-row md:items-center gap-3 bg-white dark:bg-slate-800 p-4 rounded-md border border-slate-200 dark:border-slate-700">
                <div className="relative flex-1">
                    <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                    <input
                        placeholder="Search websites..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="w-full pl-10 pr-4 py-2.5 rounded-md bg-slate-50 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 focus:border-emerald-400 outline-none text-sm transition-all"
                    />
                </div>
                <div className="flex items-center gap-2">
                    {['all', 'approved', 'pending', 'draft'].map(status => (
                        <button
                            key={status}
                            onClick={() => setStatusFilter(status)}
                            className={`px-3 py-2 rounded-md text-xs font-medium transition-all ${statusFilter === status
                                ? 'bg-emerald-500 text-white'
                                : 'bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-600'
                                }`}
                        >
                            {status === 'all' ? 'All' : status.charAt(0).toUpperCase() + status.slice(1)}
                        </button>
                    ))}
                </div>
            </div>

            {/* Content */}
            {loading ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                    {[1, 2, 3, 4].map(i => (
                        <div key={i} className="bg-white dark:bg-slate-800 rounded-md border border-slate-200 dark:border-slate-700 overflow-hidden animate-pulse">
                            <div className="h-36 bg-slate-100 dark:bg-slate-700"></div>
                            <div className="p-4 space-y-3">
                                <div className="h-4 bg-slate-100 dark:bg-slate-700 rounded w-3/4"></div>
                                <div className="h-3 bg-slate-100 dark:bg-slate-700 rounded w-1/2"></div>
                            </div>
                        </div>
                    ))}
                </div>
            ) : filtered.length === 0 ? (
                <div className="text-center py-16 bg-white dark:bg-slate-800 rounded-md border border-dashed border-slate-300 dark:border-slate-600">
                    <div className="w-14 h-14 bg-slate-100 dark:bg-slate-700 rounded-full flex items-center justify-center mx-auto mb-3">
                        <FiGlobe className="text-xl text-slate-400" />
                    </div>
                    <h3 className="text-base font-semibold text-slate-800 dark:text-white">No Websites Found</h3>
                    <p className="text-sm text-slate-500 mt-1">Add your first website template</p>
                    <Link href="/dashboard/admin/website/create">
                        <button className="mt-4 flex items-center gap-2 px-4 py-2 bg-emerald-500 text-white text-sm font-medium rounded-md mx-auto">
                            <FiPlus size={14} /> Add Website
                        </button>
                    </Link>
                </div>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                    {filtered.map(w => (
                        <div key={w._id} className="bg-white dark:bg-slate-800 rounded-md border border-slate-200 dark:border-slate-700 overflow-hidden hover:shadow-md transition-all">
                            {/* Image */}
                            <div className="relative h-36 overflow-hidden bg-slate-100 dark:bg-slate-700">
                                {w.images?.[0] ? (
                                    <img src={w.images[0]} alt={w.title} className="w-full h-full object-cover" />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center">
                                        <FiGlobe className="text-3xl text-slate-300" />
                                    </div>
                                )}
                                {/* Badges */}
                                <div className="absolute top-2 left-2 flex gap-1">
                                    {w.isFeatured && (
                                        <span className="px-2 py-0.5 bg-amber-500 text-white text-[10px] font-medium rounded flex items-center gap-1">
                                            <FiStar size={10} /> Featured
                                        </span>
                                    )}
                                </div>
                                <div className="absolute top-2 right-2">
                                    {getStatusBadge(w.status)}
                                </div>
                            </div>

                            {/* Content */}
                            <div className="p-4">
                                <h3 className="text-sm font-medium text-slate-800 dark:text-white line-clamp-1 mb-2">{w.title}</h3>
                                <div className="flex items-center gap-2 mb-3">
                                    <span className="px-2 py-0.5 bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 rounded text-[10px] font-medium">{w.category?.name || 'Uncategorized'}</span>
                                    <span className="px-2 py-0.5 bg-emerald-100 dark:bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 rounded text-[10px] font-medium">{w.platform || 'HTML'}</span>
                                </div>
                                <div className="flex items-center justify-between pt-3 border-t border-slate-100 dark:border-slate-700">
                                    <div>
                                        {w.offerPrice && w.offerPrice > 0 ? (
                                            <>
                                                <p className="text-base font-semibold text-emerald-600">৳{w.offerPrice?.toLocaleString()}</p>
                                                <p className="text-xs text-slate-400 line-through">৳{w.price?.toLocaleString()}</p>
                                            </>
                                        ) : (
                                            <p className="text-base font-semibold text-slate-800 dark:text-white">৳{w.price?.toLocaleString()}</p>
                                        )}
                                    </div>
                                    <div className="flex gap-1">
                                        {w.previewUrl && (
                                            <Link href={w.previewUrl} target="_blank" className="p-2 bg-slate-100 dark:bg-slate-700 text-slate-500 hover:bg-slate-200 dark:hover:bg-slate-600 rounded-md transition-all">
                                                <FiEye size={14} />
                                            </Link>
                                        )}
                                        <Link href={`/dashboard/admin/website/edit/${w._id}`} className="p-2 bg-emerald-100 dark:bg-emerald-500/20 text-emerald-600 hover:bg-emerald-200 dark:hover:bg-emerald-500/30 rounded-md transition-all">
                                            <FiEdit2 size={14} />
                                        </Link>
                                        <button onClick={() => handleDelete(w._id)} className="p-2 bg-rose-50 dark:bg-rose-500/20 text-rose-500 hover:bg-rose-100 dark:hover:bg-rose-500/30 rounded-md transition-all">
                                            <FiTrash2 size={14} />
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

