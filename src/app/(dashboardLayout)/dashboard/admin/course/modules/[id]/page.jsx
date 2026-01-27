'use client';

import React, { useEffect, useState, use } from 'react';
import Link from 'next/link';
import {
    FiPlus, FiEdit2, FiTrash2, FiChevronLeft,
    FiLayers, FiMove, FiCheck, FiX, FiRefreshCw
} from 'react-icons/fi';

export default function CourseModulesPage({ params: paramsPromise }) {
    const params = use(paramsPromise);
    const courseId = params.id;
    const [course, setCourse] = useState(null);
    const [modules, setModules] = useState([]);
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);

    // Modal state for Add/Edit
    const [modal, setModal] = useState({
        show: false,
        type: 'add', // 'add' or 'edit'
        data: { title: '', titleBn: '', description: '', order: 1 }
    });

    const BASE_URL = (process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api');

    const fetchData = async () => {
        setLoading(true);
        const token = localStorage.getItem('token');
        try {
            // Fetch Course
            const courseRes = await fetch(`${BASE_URL}/courses/${courseId}`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            const courseData = await courseRes.json();
            setCourse(courseData.data);

            // Fetch Modules
            const modulesRes = await fetch(`${BASE_URL}/modules/course/${courseId}`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            const modulesData = await modulesRes.json();
            setModules(modulesData.data || []);
        } catch (error) {
            console.error("Error fetching data:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, [courseId]);

    const handleOpenModal = (type, data = null) => {
        if (type === 'edit' && data) {
            setModal({
                show: true,
                type: 'edit',
                data: {
                    _id: data._id,
                    title: data.title || '',
                    titleBn: data.titleBn || '',
                    description: data.description || '',
                    order: data.order || modules.length + 1
                }
            });
        } else {
            setModal({
                show: true,
                type: 'add',
                data: { title: '', titleBn: '', description: '', order: modules.length + 1 }
            });
        }
    };

    const handleCloseModal = () => {
        setModal({ ...modal, show: false });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSubmitting(true);
        const token = localStorage.getItem('token');

        try {
            const url = modal.type === 'add'
                ? `${BASE_URL}/modules`
                : `${BASE_URL}/modules/${modal.data._id}`;

            const method = modal.type === 'add' ? 'POST' : 'PATCH';
            const body = modal.type === 'add'
                ? { ...modal.data, course: courseId }
                : modal.data;

            const res = await fetch(url, {
                method,
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(body)
            });

            const result = await res.json();

            if (res.ok) {
                handleCloseModal();
                fetchData();
            } else {
                alert(result.message || 'Operation failed');
            }
        } catch (error) {
            alert('Network error');
        } finally {
            setSubmitting(false);
        }
    };

    const handleDelete = async (id) => {
        if (!confirm('Are you sure? This won\'t delete lessons but they will lose their module reference.')) return;

        const token = localStorage.getItem('token');
        try {
            const res = await fetch(`${BASE_URL}/modules/${id}`, {
                method: 'DELETE',
                headers: { 'Authorization': `Bearer ${token}` }
            });

            if (res.ok) {
                fetchData();
            } else {
                const result = await res.json();
                alert(result.message || 'Delete failed');
            }
        } catch (error) {
            alert('Network error');
        }
    };

    if (loading && !modules.length) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <FiRefreshCw className="animate-spin text-slate-400" size={32} />
            </div>
        );
    }

    return (
        <div className="p-6 max-w-5xl mx-auto space-y-6">
            {/* Breadcrumbs & Header */}
            <div className="flex flex-col gap-4">
                <Link href="/dashboard/admin/course" className="flex items-center gap-2 text-slate-500 hover:text-slate-800 transition-colors text-sm font-medium">
                    <FiChevronLeft /> Back to Courses
                </Link>
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div>
                        <h1 className="text-2xl font-bold text-slate-800 outfit tracking-tight">
                            Module Management
                        </h1>
                        <p className="text-slate-500 text-sm work mt-1">
                            Course: <span className="font-semibold text-slate-700">{course?.title}</span>
                        </p>
                    </div>
                    <button
                        onClick={() => handleOpenModal('add')}
                        className="flex items-center gap-2 px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-sm rounded-xl shadow-lg shadow-indigo-200 transition-all hover:scale-105 active:scale-95"
                    >
                        <FiPlus size={18} /> Add Module
                    </button>
                </div>
            </div>

            {/* Modules List */}
            <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm">
                <div className="p-4 border-b border-slate-100 bg-slate-50/50 flex items-center gap-2">
                    <FiLayers className="text-indigo-500" />
                    <span className="text-sm font-bold text-slate-700 uppercase tracking-wider">Curriculum Structure</span>
                </div>

                <div className="divide-y divide-slate-100">
                    {modules.length === 0 ? (
                        <div className="p-20 text-center">
                            <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-4 border border-dashed border-slate-200">
                                <FiLayers className="text-slate-300 text-2xl" />
                            </div>
                            <h3 className="text-lg font-bold text-slate-800">No Modules Yet</h3>
                            <p className="text-slate-500 text-sm mt-1">Define your course sections before adding lessons</p>
                        </div>
                    ) : (
                        modules.map((mod, index) => (
                            <div key={mod._id} className="group flex items-center gap-6 p-5 hover:bg-slate-50 transition-colors">
                                <div className="flex flex-col items-center justify-center shrink-0 w-12 h-12 bg-indigo-50 text-indigo-600 rounded-xl font-black text-lg shadow-sm border border-indigo-100">
                                    {mod.order}
                                </div>
                                <div className="flex-1 space-y-1">
                                    <div className="flex items-center gap-3">
                                        <h3 className="font-bold text-slate-800">{mod.title}</h3>
                                        {!mod.isPublished && (
                                            <span className="px-2 py-0.5 bg-amber-100 text-amber-700 text-[10px] font-black rounded-lg uppercase tracking-tighter">Draft</span>
                                        )}
                                    </div>
                                    <p className="text-xs text-slate-500 font-medium">{mod.titleBn || 'No Bengali Title'}</p>
                                    {mod.description && <p className="text-xs text-slate-400 line-clamp-1 italic">{mod.description}</p>}
                                </div>
                                <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                    <button
                                        onClick={() => handleOpenModal('edit', mod)}
                                        className="p-3 bg-white hover:bg-indigo-50 text-slate-400 hover:text-indigo-600 border border-slate-200 rounded-xl transition-all shadow-sm"
                                        title="Edit Module"
                                    >
                                        <FiEdit2 size={16} />
                                    </button>
                                    <button
                                        onClick={() => handleDelete(mod._id)}
                                        className="p-3 bg-white hover:bg-rose-50 text-slate-400 hover:text-rose-600 border border-slate-200 rounded-xl transition-all shadow-sm"
                                        title="Delete Module"
                                    >
                                        <FiTrash2 size={16} />
                                    </button>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </div>

            {/* Modal */}
            {modal.show && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm animate-in fade-in duration-300">
                    <div className="bg-white rounded-3xl w-full max-w-lg shadow-2xl overflow-hidden animate-in zoom-in-95 duration-300">
                        <div className="p-8 border-b border-slate-100 flex items-center justify-between bg-gradient-to-r from-slate-50 to-white">
                            <div>
                                <h3 className="text-xl font-black text-slate-800 outfit">{modal.type === 'add' ? 'New Module' : 'Edit Module'}</h3>
                                <p className="text-sm text-slate-500 font-medium">Specify section details for the curriculum</p>
                            </div>
                            <button onClick={handleCloseModal} className="p-3 hover:bg-slate-100 rounded-2xl text-slate-400 transition-colors"><FiX size={20} /></button>
                        </div>

                        <form onSubmit={handleSubmit} className="p-8 space-y-6">
                            <div className="grid grid-cols-2 gap-4">
                                <div className="col-span-2 space-y-2">
                                    <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest px-1">Module Title (English)</label>
                                    <input
                                        required
                                        value={modal.data.title}
                                        onChange={(e) => setModal({ ...modal, data: { ...modal.data, title: e.target.value } })}
                                        className="w-full px-5 py-3.5 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 outline-none transition-all font-medium"
                                        placeholder="e.g. Getting Started"
                                    />
                                </div>
                                <div className="col-span-2 space-y-2">
                                    <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest px-1">Module Title (Bengali)</label>
                                    <input
                                        value={modal.data.titleBn}
                                        onChange={(e) => setModal({ ...modal, data: { ...modal.data, titleBn: e.target.value } })}
                                        className="w-full px-5 py-3.5 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 outline-none transition-all font-medium"
                                        placeholder="মডিউলের নাম (ঐচ্ছিক)"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest px-1">Order</label>
                                    <input
                                        type="number"
                                        required
                                        min="1"
                                        value={modal.data.order}
                                        onChange={(e) => setModal({ ...modal, data: { ...modal.data, order: Number(e.target.value) } })}
                                        className="w-full px-5 py-3.5 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 outline-none transition-all font-black"
                                    />
                                </div>
                                <div className="flex items-end pb-3 pl-4">
                                    <label className="flex items-center gap-3 cursor-pointer group">
                                        <div className="relative">
                                            <input
                                                type="checkbox"
                                                checked={modal.data.isPublished !== false}
                                                onChange={(e) => setModal({ ...modal, data: { ...modal.data, isPublished: e.target.checked } })}
                                                className="sr-only peer"
                                            />
                                            <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600"></div>
                                        </div>
                                        <span className="text-xs font-bold text-slate-600 group-hover:text-indigo-600 transition-colors">Visible to students</span>
                                    </label>
                                </div>
                                <div className="col-span-2 space-y-2">
                                    <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest px-1">Description</label>
                                    <textarea
                                        rows="3"
                                        value={modal.data.description}
                                        onChange={(e) => setModal({ ...modal, data: { ...modal.data, description: e.target.value } })}
                                        className="w-full px-5 py-3.5 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 outline-none transition-all font-medium resize-none"
                                        placeholder="Short summary of this section..."
                                    />
                                </div>
                            </div>

                            <div className="flex gap-3 pt-4">
                                <button
                                    type="button"
                                    onClick={handleCloseModal}
                                    className="flex-1 px-6 py-4 bg-slate-100 hover:bg-slate-200 text-slate-600 font-bold rounded-2xl transition-all"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    disabled={submitting}
                                    className="flex-[2] flex items-center justify-center gap-2 px-6 py-4 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white font-bold rounded-2xl shadow-xl shadow-indigo-100 transition-all active:scale-95"
                                >
                                    {submitting ? <FiRefreshCw className="animate-spin" /> : <FiCheck />}
                                    {modal.type === 'add' ? 'Create Module' : 'Update Module'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
