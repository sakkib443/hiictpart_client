'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { FiPlus, FiEdit2, FiTrash2, FiSearch, FiUser, FiInfo } from 'react-icons/fi';
import { useTheme } from '@/providers/ThemeProvider';
import { API_BASE_URL } from '@/config/api';

export default function InstructorListPage() {
    const { isDark } = useTheme();
    const [instructors, setInstructors] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        fetchInstructors();
    }, []);

    const fetchInstructors = async () => {
        try {
            setLoading(true);
            const token = localStorage.getItem('token');
            const res = await fetch(`${API_BASE_URL}/instructors`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            const data = await res.json();
            if (data.success) {
                setInstructors(data.data || []);
            }
        } catch (error) {
            console.error('Error fetching instructors:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id) => {
        if (!confirm('Are you sure you want to delete this instructor?')) return;
        try {
            const token = localStorage.getItem('token');
            const res = await fetch(`${API_BASE_URL}/instructors/${id}`, {
                method: 'DELETE',
                headers: { Authorization: `Bearer ${token}` },
            });
            const data = await res.json();
            if (data.success) {
                setInstructors(prev => prev.filter(inst => inst._id !== id));
                alert('Instructor deleted successfully');
            }
        } catch (error) {
            console.error('Error deleting instructor:', error);
        }
    };

    const filteredInstructors = instructors.filter(inst =>
        inst.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        inst.designation.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="p-6">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
                <div>
                    <h1 className={`text-2xl font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>Instructors</h1>
                    <p className={`text-sm mt-1 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>Manage your course instructors and mentors</p>
                </div>
                <Link
                    href="/dashboard/admin/instructor/create"
                    className="inline-flex items-center gap-2 px-5 py-2.5 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-600/20 font-semibold text-sm"
                >
                    <FiPlus size={18} />
                    Add Instructor
                </Link>
            </div>

            <div className={`p-4 rounded-2xl border mb-6 flex items-center gap-3 ${isDark ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200 shadow-sm'}`}>
                <FiSearch className="text-slate-400" size={20} />
                <input
                    type="text"
                    placeholder="Search instructors by name or designation..."
                    className="w-full bg-transparent border-none outline-none text-sm placeholder:text-slate-500"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
            </div>

            {loading ? (
                <div className="flex items-center justify-center py-20">
                    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-600"></div>
                </div>
            ) : filteredInstructors.length === 0 ? (
                <div className={`text-center py-20 rounded-2xl border ${isDark ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200 shadow-sm'}`}>
                    <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <FiUser className="text-slate-400" size={32} />
                    </div>
                    <h3 className={`text-lg font-semibold ${isDark ? 'text-white' : 'text-slate-900'}`}>No Instructors found</h3>
                    <p className={`text-sm mt-1 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>Start by adding your first instructor</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredInstructors.map((instructor) => (
                        <div
                            key={instructor._id}
                            className={`group relative p-6 rounded-2xl border transition-all hover:shadow-xl ${isDark
                                ? 'bg-slate-900 border-slate-800 hover:border-indigo-500/50'
                                : 'bg-white border-slate-200 hover:border-indigo-500/30'
                                }`}
                        >
                            <div className="flex items-center gap-4 mb-4">
                                <div className="w-16 h-16 rounded-2xl overflow-hidden bg-slate-100 flex-shrink-0">
                                    {instructor.image ? (
                                        <img src={instructor.image} alt={instructor.name} className="w-full h-full object-cover" />
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center text-indigo-500">
                                            <FiUser size={32} />
                                        </div>
                                    )}
                                </div>
                                <div className="min-w-0">
                                    <h3 className={`font-bold truncate ${isDark ? 'text-slate-100' : 'text-slate-800'}`}>{instructor.name}</h3>
                                    <p className="text-xs text-indigo-500 font-semibold">{instructor.designation}</p>
                                </div>
                            </div>

                            <p className={`text-sm line-clamp-3 mb-6 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                                {instructor.bio || 'No bio provided for this instructor.'}
                            </p>

                            <div className="flex items-center justify-between pt-4 border-t border-slate-100 dark:border-slate-800">
                                <span className={`flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-full ${instructor.isActive
                                    ? 'bg-emerald-100 text-emerald-600 dark:bg-emerald-900/30 dark:text-emerald-400'
                                    : 'bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400'
                                    }`}>
                                    <span className={`w-1.5 h-1.5 rounded-full ${instructor.isActive ? 'bg-emerald-500' : 'bg-red-500'}`}></span>
                                    {instructor.isActive ? 'Active' : 'Inactive'}
                                </span>

                                <div className="flex items-center gap-2">
                                    <Link
                                        href={`/dashboard/admin/instructor/${instructor._id}/edit`}
                                        className="p-2 rounded-lg bg-indigo-50 text-indigo-600 hover:bg-indigo-600 hover:text-white transition-all dark:bg-indigo-900/20 dark:text-indigo-400"
                                    >
                                        <FiEdit2 size={16} />
                                    </Link>
                                    <button
                                        onClick={() => handleDelete(instructor._id)}
                                        className="p-2 rounded-lg bg-red-50 text-red-600 hover:bg-red-600 hover:text-white transition-all dark:bg-red-900/20 dark:text-red-400"
                                    >
                                        <FiTrash2 size={16} />
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
