'use client';

import React, { useEffect, useState } from 'react';
import {
    FiPlus, FiEdit3, FiTrash2, FiLoader, FiCheck, FiSearch,
    FiRefreshCw, FiCode, FiStar, FiDownload, FiEye,
    FiExternalLink, FiPackage, FiGrid, FiList
} from 'react-icons/fi';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

const API_URL = process.env.NEXT_PUBLIC_API_URL || (process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api');

const PLATFORM_OPTIONS = [
    'WordPress', 'PHP', 'JavaScript', 'Python', 'React', 'Next.js', 'Vue.js',
    'Angular', 'Node.js', 'Laravel', 'Django', 'Flutter', 'React Native',
    'Android', 'iOS', 'Unity', 'HTML/CSS', 'jQuery', 'Bootstrap', 'Tailwind CSS', 'Other'
];

const SoftwarePage = () => {
    const [software, setSoftware] = useState([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');
    const [statusFilter, setStatusFilter] = useState('all');
    const [platformFilter, setPlatformFilter] = useState('all');
    const [viewMode, setViewMode] = useState('grid');
    const router = useRouter();

    const fetchSoftware = async () => {
        const token = localStorage.getItem('token');
        try {
            setLoading(true);
            const res = await fetch(`${API_URL}/software/admin/all`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            const result = await res.json();
            setSoftware(result.data || []);
        } catch (err) {
            console.error("Fetch Error:", err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchSoftware();
    }, []);

    const handleDelete = async (id) => {
        if (!confirm("Are you sure you want to delete this software?")) return;
        const token = localStorage.getItem('token');
        try {
            const res = await fetch(`${API_URL}/software/admin/${id}`, {
                method: 'DELETE',
                headers: { 'Authorization': `Bearer ${token}` }
            });
            if (res.ok) {
                fetchSoftware();
            } else {
                const data = await res.json();
                alert(data.message || 'Delete failed');
            }
        } catch (err) { alert("Delete failed"); }
    };

    const handleEdit = (id) => {
        router.push(`/dashboard/admin/software/create?edit=${id}`);
    };

    const getStatusBadge = (status) => {
        switch (status) {
            case 'approved': return <span className="px-2 py-0.5 bg-emerald-100 dark:bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 rounded text-[10px] font-medium flex items-center gap-1"><FiCheck size={10} /> Live</span>;
            case 'pending': return <span className="px-2 py-0.5 bg-amber-100 dark:bg-amber-500/20 text-amber-600 dark:text-amber-400 rounded text-[10px] font-medium">Pending</span>;
            case 'draft': return <span className="px-2 py-0.5 bg-slate-100 dark:bg-slate-700 text-slate-500 rounded text-[10px] font-medium">Draft</span>;
            default: return <span className="px-2 py-0.5 bg-rose-100 dark:bg-rose-500/20 text-rose-500 rounded text-[10px] font-medium">{status}</span>;
        }
    };

    const getPlatformBadgeColor = (platform) => {
        const colors = {
            'WordPress': 'bg-blue-100 dark:bg-blue-500/20 text-blue-600 dark:text-blue-400',
            'PHP': 'bg-indigo-100 dark:bg-indigo-500/20 text-indigo-600 dark:text-indigo-400',
            'JavaScript': 'bg-yellow-100 dark:bg-yellow-500/20 text-yellow-700 dark:text-yellow-400',
            'React': 'bg-cyan-100 dark:bg-cyan-500/20 text-cyan-600 dark:text-cyan-400',
            'Next.js': 'bg-slate-800 text-white',
            'Vue.js': 'bg-emerald-100 dark:bg-emerald-500/20 text-emerald-600 dark:text-emerald-400',
            'Node.js': 'bg-green-100 dark:bg-green-500/20 text-green-600 dark:text-green-400',
            'Laravel': 'bg-rose-100 dark:bg-rose-500/20 text-rose-600 dark:text-rose-400',
        };
        return colors[platform] || 'bg-violet-100 dark:bg-violet-500/20 text-violet-600 dark:text-violet-400';
    };

    const stats = {
        total: software.length,
        approved: software.filter(s => s.status === 'approved').length,
        pending: software.filter(s => s.status === 'pending').length,
        featured: software.filter(s => s.isFeatured).length,
    };

    const filtered = software.filter(s => {
        const matchSearch = s.title?.toLowerCase().includes(search.toLowerCase());
        const matchStatus = statusFilter === 'all' || s.status === statusFilter;
        const matchPlatform = platformFilter === 'all' || s.platform === platformFilter;
        return matchSearch && matchStatus && matchPlatform;
    });

    return (
        <div className="p-4 md:p-6 space-y-5 bg-slate-50 dark:bg-slate-900 min-h-screen">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-white dark:bg-slate-800 rounded-md border border-slate-200 dark:border-slate-700 p-4">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-md bg-violet-500 flex items-center justify-center">
                        <FiCode className="text-white" size={18} />
                    </div>
                    <div>
                        <h1 className="text-lg font-semibold text-slate-800 dark:text-white">Software</h1>
                        <p className="text-xs text-slate-500 dark:text-slate-400">Manage software & plugins</p>
                    </div>
                </div>
                <div className="flex items-center gap-2">
                    <button
                        onClick={fetchSoftware}
                        disabled={loading}
                        className="flex items-center gap-2 px-3 py-2 bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600 text-slate-600 dark:text-slate-300 rounded-md text-sm font-medium transition-all disabled:opacity-50"
                    >
                        <FiRefreshCw size={14} className={loading ? 'animate-spin' : ''} />
                        Reload
                    </button>
                    <Link href="/dashboard/admin/software/create">
                        <button className="flex items-center gap-2 px-4 py-2 bg-violet-500 hover:bg-violet-600 text-white rounded-md text-sm font-medium transition-all">
                            <FiPlus size={14} />
                            Add Software
                        </button>
                    </Link>
                </div>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
                <div className="bg-white dark:bg-slate-800 rounded-md border border-slate-200 dark:border-slate-700 p-4">
                    <div className="flex items-center justify-between mb-2">
                        <div className="w-8 h-8 bg-slate-700 rounded-md flex items-center justify-center">
                            <FiPackage className="text-white" size={14} />
                        </div>
                        <span className="text-xl font-bold text-slate-800 dark:text-white">{stats.total}</span>
                    </div>
                    <p className="text-xs text-slate-500 dark:text-slate-400">Total</p>
                </div>
                <div className="bg-white dark:bg-slate-800 rounded-md border border-slate-200 dark:border-slate-700 p-4">
                    <div className="flex items-center justify-between mb-2">
                        <div className="w-8 h-8 bg-emerald-500 rounded-md flex items-center justify-center">
                            <FiCheck className="text-white" size={14} />
                        </div>
                        <span className="text-xl font-bold text-slate-800 dark:text-white">{stats.approved}</span>
                    </div>
                    <p className="text-xs text-slate-500 dark:text-slate-400">Approved</p>
                </div>
                <div className="bg-white dark:bg-slate-800 rounded-md border border-slate-200 dark:border-slate-700 p-4">
                    <div className="flex items-center justify-between mb-2">
                        <div className="w-8 h-8 bg-amber-500 rounded-md flex items-center justify-center">
                            <FiLoader className="text-white" size={14} />
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
            <div className="flex flex-col lg:flex-row lg:items-center gap-3 bg-white dark:bg-slate-800 p-4 rounded-md border border-slate-200 dark:border-slate-700">
                <div className="relative flex-1">
                    <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                    <input
                        placeholder="Search software..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="w-full pl-10 pr-4 py-2.5 rounded-md bg-slate-50 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 focus:border-violet-400 outline-none text-sm transition-all"
                    />
                </div>
                <div className="flex items-center gap-2 overflow-x-auto">
                    {['all', 'approved', 'pending', 'draft'].map(status => (
                        <button
                            key={status}
                            onClick={() => setStatusFilter(status)}
                            className={`px-3 py-2 rounded-md text-xs font-medium transition-all whitespace-nowrap ${statusFilter === status
                                ? 'bg-violet-500 text-white'
                                : 'bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-600'
                                }`}
                        >
                            {status === 'all' ? 'All' : status.charAt(0).toUpperCase() + status.slice(1)}
                        </button>
                    ))}
                </div>
                <select
                    value={platformFilter}
                    onChange={(e) => setPlatformFilter(e.target.value)}
                    className="px-3 py-2.5 rounded-md text-sm bg-slate-100 dark:bg-slate-700 border-none outline-none text-slate-700 dark:text-slate-300"
                >
                    <option value="all">All Platforms</option>
                    {PLATFORM_OPTIONS.map(p => (
                        <option key={p} value={p}>{p}</option>
                    ))}
                </select>
                <div className="flex items-center gap-1 p-1 bg-slate-100 dark:bg-slate-700 rounded-md">
                    <button
                        onClick={() => setViewMode('grid')}
                        className={`p-2 rounded transition-all ${viewMode === 'grid' ? 'bg-white dark:bg-slate-600 text-slate-800 dark:text-white shadow-sm' : 'text-slate-500'}`}
                    >
                        <FiGrid size={16} />
                    </button>
                    <button
                        onClick={() => setViewMode('list')}
                        className={`p-2 rounded transition-all ${viewMode === 'list' ? 'bg-white dark:bg-slate-600 text-slate-800 dark:text-white shadow-sm' : 'text-slate-500'}`}
                    >
                        <FiList size={16} />
                    </button>
                </div>
            </div>

            {/* Content */}
            {loading ? (
                <div className="flex flex-col items-center justify-center py-16 gap-3">
                    <FiLoader className="animate-spin text-violet-500" size={32} />
                    <p className="text-sm text-slate-500">Loading...</p>
                </div>
            ) : filtered.length === 0 ? (
                <div className="text-center py-16 bg-white dark:bg-slate-800 rounded-md border border-dashed border-slate-300 dark:border-slate-600">
                    <div className="w-14 h-14 bg-slate-100 dark:bg-slate-700 rounded-full flex items-center justify-center mx-auto mb-3">
                        <FiCode className="text-xl text-slate-400" />
                    </div>
                    <h3 className="text-base font-semibold text-slate-800 dark:text-white">No Software Found</h3>
                    <p className="text-sm text-slate-500 mt-1">Add your first software</p>
                    <Link href="/dashboard/admin/software/create">
                        <button className="mt-4 flex items-center gap-2 px-4 py-2 bg-violet-500 text-white text-sm font-medium rounded-md mx-auto">
                            <FiPlus size={14} /> Add Software
                        </button>
                    </Link>
                </div>
            ) : viewMode === 'grid' ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {filtered.map((sw) => (
                        <div key={sw._id} className="bg-white dark:bg-slate-800 rounded-md border border-slate-200 dark:border-slate-700 overflow-hidden hover:shadow-md transition-all">
                            {/* Image */}
                            <div className="relative h-40 bg-slate-100 dark:bg-slate-700 overflow-hidden">
                                {sw.images?.[0] ? (
                                    <img src={sw.images[0]} alt={sw.title} className="w-full h-full object-cover" />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center">
                                        <FiCode className="text-slate-300" size={40} />
                                    </div>
                                )}
                                {/* Badges */}
                                <div className="absolute top-2 left-2 flex gap-1">
                                    {sw.isFeatured && (
                                        <span className="px-2 py-0.5 bg-amber-500 text-white rounded text-[10px] font-medium flex items-center gap-1">
                                            <FiStar size={10} /> Featured
                                        </span>
                                    )}
                                    <span className={`px-2 py-0.5 rounded text-[10px] font-medium ${getPlatformBadgeColor(sw.platform)}`}>
                                        {sw.platform}
                                    </span>
                                </div>
                                <div className="absolute top-2 right-2">
                                    {getStatusBadge(sw.status)}
                                </div>
                            </div>

                            {/* Content */}
                            <div className="p-4">
                                <h3 className="text-sm font-medium text-slate-800 dark:text-white line-clamp-1 mb-2">{sw.title}</h3>
                                <div className="flex items-center gap-2 mb-3">
                                    <span className="text-[10px] font-medium text-slate-400 bg-slate-100 dark:bg-slate-700 px-2 py-0.5 rounded">v{sw.version}</span>
                                    <span className="text-[10px] font-medium text-violet-500">{sw.softwareType}</span>
                                </div>
                                <div className="flex items-center gap-3 text-xs text-slate-400 mb-3">
                                    <span className="flex items-center gap-1">
                                        <FiStar className="text-amber-500" size={12} /> {sw.rating?.toFixed(1) || '0.0'}
                                    </span>
                                    <span className="flex items-center gap-1">
                                        <FiDownload size={12} /> {sw.salesCount || 0}
                                    </span>
                                </div>
                                <div className="flex items-center justify-between pt-3 border-t border-slate-100 dark:border-slate-700">
                                    <div>
                                        {sw.accessType === 'free' ? (
                                            <span className="text-base font-semibold text-emerald-600">FREE</span>
                                        ) : (
                                            <div className="flex items-center gap-2">
                                                <span className="text-base font-semibold text-violet-600">৳{sw.offerPrice || sw.price}</span>
                                                {sw.offerPrice && sw.offerPrice < sw.price && (
                                                    <span className="text-xs text-slate-400 line-through">৳{sw.price}</span>
                                                )}
                                            </div>
                                        )}
                                    </div>
                                    <div className="flex gap-1">
                                        {sw.previewUrl && (
                                            <a href={sw.previewUrl} target="_blank" className="p-2 bg-slate-100 dark:bg-slate-700 text-slate-500 hover:bg-slate-200 dark:hover:bg-slate-600 rounded-md transition-all">
                                                <FiExternalLink size={14} />
                                            </a>
                                        )}
                                        <button onClick={() => handleEdit(sw._id)} className="p-2 bg-violet-100 dark:bg-violet-500/20 text-violet-600 hover:bg-violet-200 dark:hover:bg-violet-500/30 rounded-md transition-all">
                                            <FiEdit3 size={14} />
                                        </button>
                                        <button onClick={() => handleDelete(sw._id)} className="p-2 bg-rose-50 dark:bg-rose-500/20 text-rose-500 hover:bg-rose-100 dark:hover:bg-rose-500/30 rounded-md transition-all">
                                            <FiTrash2 size={14} />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                /* List View */
                <div className="bg-white dark:bg-slate-800 rounded-md border border-slate-200 dark:border-slate-700 overflow-hidden divide-y divide-slate-100 dark:divide-slate-700">
                    {filtered.map((sw) => (
                        <div key={sw._id} className="flex items-center gap-4 p-4 hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors">
                            <div className="w-16 h-12 rounded-md bg-slate-100 dark:bg-slate-700 overflow-hidden shrink-0">
                                {sw.images?.[0] ? (
                                    <img src={sw.images[0]} className="w-full h-full object-cover" alt="" />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center">
                                        <FiCode className="text-slate-300" size={20} />
                                    </div>
                                )}
                            </div>
                            <div className="flex-1 min-w-0">
                                <h3 className="text-sm font-medium text-slate-800 dark:text-white truncate">{sw.title}</h3>
                                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 flex items-center gap-2">
                                    <span className={`px-1.5 py-0.5 rounded text-[10px] font-medium ${getPlatformBadgeColor(sw.platform)}`}>{sw.platform}</span>
                                    <span>{sw.softwareType}</span>
                                    <span>v{sw.version}</span>
                                </p>
                            </div>
                            <div className="text-right shrink-0">
                                {sw.accessType === 'free' ? (
                                    <p className="text-sm font-semibold text-emerald-600">FREE</p>
                                ) : (
                                    <p className="text-sm font-semibold text-slate-800 dark:text-white">৳{sw.offerPrice || sw.price}</p>
                                )}
                                <p className="text-xs text-slate-400">{sw.salesCount || 0} sales</p>
                            </div>
                            <div>{getStatusBadge(sw.status)}</div>
                            <div className="flex gap-1">
                                {sw.previewUrl && (
                                    <a href={sw.previewUrl} target="_blank" className="p-2 bg-slate-100 dark:bg-slate-700 text-slate-500 hover:bg-slate-200 dark:hover:bg-slate-600 rounded-md transition-all">
                                        <FiEye size={14} />
                                    </a>
                                )}
                                <button onClick={() => handleEdit(sw._id)} className="p-2 bg-violet-100 dark:bg-violet-500/20 text-violet-600 hover:bg-violet-200 dark:hover:bg-violet-500/30 rounded-md transition-all">
                                    <FiEdit3 size={14} />
                                </button>
                                <button onClick={() => handleDelete(sw._id)} className="p-2 bg-rose-50 dark:bg-rose-500/20 text-rose-500 hover:bg-rose-100 dark:hover:bg-rose-500/30 rounded-md transition-all">
                                    <FiTrash2 size={14} />
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default SoftwarePage;

