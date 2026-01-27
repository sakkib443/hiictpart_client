'use client';

import React, { useEffect, useState } from 'react';
import {
    FiUserCheck, FiSearch, FiRefreshCw,
    FiChevronLeft, FiChevronRight, FiBook, FiCalendar
} from 'react-icons/fi';

const API_URL = process.env.NEXT_PUBLIC_API_URL || (process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api');

export default function EnrollmentsPage() {
    const [enrollments, setEnrollments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [currentPage, setCurrentPage] = useState(1);

    const fetchEnrollments = async () => {
        try {
            setLoading(true);
            const token = localStorage.getItem('token');
            const res = await fetch(`${API_URL}/enrollments`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            const data = await res.json();
            setEnrollments(data.data || []);
        } catch (err) {
            console.error('Error fetching enrollments:', err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchEnrollments();
    }, []);

    const filteredEnrollments = enrollments.filter(enroll =>
        enroll.user?.firstName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        enroll.course?.title?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const itemsPerPage = 10;
    const totalPages = Math.ceil(filteredEnrollments.length / itemsPerPage);
    const paginatedEnrollments = filteredEnrollments.slice(
        (currentPage - 1) * itemsPerPage,
        currentPage * itemsPerPage
    );

    const getStatusBadge = (status) => {
        switch (status) {
            case 'active': return 'bg-emerald-100 dark:bg-emerald-500/20 text-emerald-600 dark:text-emerald-400';
            case 'completed': return 'bg-blue-100 dark:bg-blue-500/20 text-blue-600 dark:text-blue-400';
            case 'expired': return 'bg-rose-100 dark:bg-rose-500/20 text-rose-600 dark:text-rose-400';
            default: return 'bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300';
        }
    };

    const stats = {
        total: enrollments.length,
        active: enrollments.filter(e => e.status === 'active').length,
        completed: enrollments.filter(e => e.status === 'completed').length,
    };

    return (
        <div className="p-4 md:p-6 space-y-5 bg-slate-50 dark:bg-slate-900 min-h-screen">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-white dark:bg-slate-800 rounded-md border border-slate-200 dark:border-slate-700 p-4">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-md bg-indigo-500 flex items-center justify-center">
                        <FiUserCheck className="text-white" size={18} />
                    </div>
                    <div>
                        <h1 className="text-lg font-semibold text-slate-800 dark:text-white">Enrollments</h1>
                        <p className="text-xs text-slate-500 dark:text-slate-400">Manage course enrollments</p>
                    </div>
                </div>
                <button
                    onClick={fetchEnrollments}
                    disabled={loading}
                    className="flex items-center gap-2 px-3 py-2 bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600 text-slate-600 dark:text-slate-300 rounded-md text-sm font-medium transition-all disabled:opacity-50"
                >
                    <FiRefreshCw size={14} className={loading ? 'animate-spin' : ''} />
                    Refresh
                </button>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-3">
                <div className="bg-white dark:bg-slate-800 rounded-md border border-slate-200 dark:border-slate-700 p-4">
                    <div className="flex items-center justify-between mb-2">
                        <div className="w-8 h-8 bg-indigo-500 rounded-md flex items-center justify-center">
                            <FiUserCheck className="text-white" size={14} />
                        </div>
                        <span className="text-xl font-bold text-slate-800 dark:text-white">{stats.total}</span>
                    </div>
                    <p className="text-xs text-slate-500 dark:text-slate-400">Total</p>
                </div>
                <div className="bg-white dark:bg-slate-800 rounded-md border border-slate-200 dark:border-slate-700 p-4">
                    <div className="flex items-center justify-between mb-2">
                        <div className="w-8 h-8 bg-emerald-500 rounded-md flex items-center justify-center">
                            <FiUserCheck className="text-white" size={14} />
                        </div>
                        <span className="text-xl font-bold text-slate-800 dark:text-white">{stats.active}</span>
                    </div>
                    <p className="text-xs text-slate-500 dark:text-slate-400">Active</p>
                </div>
                <div className="bg-white dark:bg-slate-800 rounded-md border border-slate-200 dark:border-slate-700 p-4">
                    <div className="flex items-center justify-between mb-2">
                        <div className="w-8 h-8 bg-blue-500 rounded-md flex items-center justify-center">
                            <FiUserCheck className="text-white" size={14} />
                        </div>
                        <span className="text-xl font-bold text-slate-800 dark:text-white">{stats.completed}</span>
                    </div>
                    <p className="text-xs text-slate-500 dark:text-slate-400">Completed</p>
                </div>
            </div>

            {/* Search */}
            <div className="flex flex-col md:flex-row md:items-center gap-3 bg-white dark:bg-slate-800 p-4 rounded-md border border-slate-200 dark:border-slate-700">
                <div className="relative flex-1">
                    <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                    <input
                        type="text"
                        placeholder="Search enrollments..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-10 pr-4 py-2.5 rounded-md bg-slate-50 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 focus:border-indigo-400 outline-none text-sm transition-all"
                    />
                </div>
            </div>

            {/* Table */}
            <div className="bg-white dark:bg-slate-800 rounded-md border border-slate-200 dark:border-slate-700 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead className="bg-slate-50 dark:bg-slate-700/50 border-b border-slate-200 dark:border-slate-700">
                            <tr>
                                <th className="text-left px-4 py-3 text-xs font-medium text-slate-500 dark:text-slate-400">Student</th>
                                <th className="text-left px-4 py-3 text-xs font-medium text-slate-500 dark:text-slate-400">Course</th>
                                <th className="text-left px-4 py-3 text-xs font-medium text-slate-500 dark:text-slate-400">Enrolled</th>
                                <th className="text-left px-4 py-3 text-xs font-medium text-slate-500 dark:text-slate-400">Progress</th>
                                <th className="text-left px-4 py-3 text-xs font-medium text-slate-500 dark:text-slate-400">Status</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100 dark:divide-slate-700">
                            {loading ? (
                                <tr>
                                    <td colSpan={5} className="px-4 py-12 text-center">
                                        <FiRefreshCw className="animate-spin mx-auto mb-2 text-indigo-500" size={24} />
                                        <p className="text-sm text-slate-500">Loading...</p>
                                    </td>
                                </tr>
                            ) : paginatedEnrollments.length === 0 ? (
                                <tr>
                                    <td colSpan={5} className="px-4 py-12 text-center text-slate-500">
                                        <FiUserCheck className="mx-auto mb-2 text-slate-300" size={28} />
                                        <p className="text-sm">No enrollments found</p>
                                    </td>
                                </tr>
                            ) : (
                                paginatedEnrollments.map((enroll) => (
                                    <tr key={enroll._id} className="hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors">
                                        <td className="px-4 py-3">
                                            <div className="flex items-center gap-2">
                                                <div className="w-8 h-8 rounded-full bg-indigo-500 flex items-center justify-center text-white text-xs font-medium">
                                                    {enroll.user?.firstName?.charAt(0) || 'U'}
                                                </div>
                                                <div>
                                                    <p className="text-sm font-medium text-slate-800 dark:text-white">{enroll.user?.firstName} {enroll.user?.lastName}</p>
                                                    <p className="text-xs text-slate-500 dark:text-slate-400">{enroll.user?.email}</p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-4 py-3">
                                            <div className="flex items-center gap-2">
                                                <FiBook size={12} className="text-slate-400" />
                                                <span className="text-sm text-slate-700 dark:text-slate-300 truncate max-w-[200px]">{enroll.course?.title || 'N/A'}</span>
                                            </div>
                                        </td>
                                        <td className="px-4 py-3">
                                            <div className="flex items-center gap-1 text-xs text-slate-600 dark:text-slate-400">
                                                <FiCalendar size={12} />
                                                {enroll.enrolledAt ? new Date(enroll.enrolledAt).toLocaleDateString('en-GB', { day: '2-digit', month: 'short' }) : 'N/A'}
                                            </div>
                                        </td>
                                        <td className="px-4 py-3">
                                            <div className="flex items-center gap-2">
                                                <div className="w-20 h-2 bg-slate-200 dark:bg-slate-600 rounded-full overflow-hidden">
                                                    <div
                                                        className="h-full bg-indigo-500 rounded-full"
                                                        style={{ width: `${enroll.progress || 0}%` }}
                                                    />
                                                </div>
                                                <span className="text-xs text-slate-600 dark:text-slate-400">{enroll.progress || 0}%</span>
                                            </div>
                                        </td>
                                        <td className="px-4 py-3">
                                            <span className={`inline-flex px-2 py-0.5 rounded text-[10px] font-medium ${getStatusBadge(enroll.status)}`}>
                                                {enroll.status || 'active'}
                                            </span>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>

                {/* Pagination */}
                {totalPages > 1 && (
                    <div className="flex items-center justify-between px-4 py-3 border-t border-slate-100 dark:border-slate-700">
                        <p className="text-xs text-slate-500 dark:text-slate-400">
                            {(currentPage - 1) * itemsPerPage + 1} - {Math.min(currentPage * itemsPerPage, filteredEnrollments.length)} of {filteredEnrollments.length}
                        </p>
                        <div className="flex items-center gap-1">
                            <button
                                onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                                disabled={currentPage === 1}
                                className="p-2 rounded-md border border-slate-200 dark:border-slate-600 hover:bg-slate-50 dark:hover:bg-slate-700 disabled:opacity-50"
                            >
                                <FiChevronLeft size={14} />
                            </button>
                            <span className="px-3 py-1 text-xs font-medium text-slate-600 dark:text-slate-300">{currentPage}/{totalPages}</span>
                            <button
                                onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                                disabled={currentPage === totalPages}
                                className="p-2 rounded-md border border-slate-200 dark:border-slate-600 hover:bg-slate-50 dark:hover:bg-slate-700 disabled:opacity-50"
                            >
                                <FiChevronRight size={14} />
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}

