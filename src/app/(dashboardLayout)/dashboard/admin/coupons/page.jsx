"use client";
import { API_URL, API_BASE_URL } from '@/config/api';


import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { LuPlus, LuPencil, LuTrash2, LuSearch, LuTag, LuPercent, LuCalendar, LuUsers, LuCheck, LuX, LuCopy, LuRefreshCw } from 'react-icons/lu';
import { useTheme } from '@/providers/ThemeProvider';



const CouponsPage = () => {
    const { isDark } = useTheme();
    const [coupons, setCoupons] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [showModal, setShowModal] = useState(false);
    const [editingCoupon, setEditingCoupon] = useState(null);
    const [formData, setFormData] = useState({
        code: '',
        name: '',
        description: '',
        discountType: 'percentage',
        discountValue: 10,
        maxDiscount: '',
        minPurchase: 0,
        startDate: new Date().toISOString().split('T')[0],
        endDate: '',
        usageLimit: '',
        usagePerUser: 1,
        applicableTo: 'all',
        isActive: true
    });

    useEffect(() => {
        fetchCoupons();
    }, []);

    const fetchCoupons = async () => {
        try {
            setLoading(true);
            const res = await fetch(`${API_URL}/coupons`);
            const data = await res.json();
            if (data.success) {
                setCoupons(data.data || []);
            }
        } catch (error) {
            console.error('Error fetching coupons:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const url = editingCoupon
                ? `${API_URL}/coupons/${editingCoupon._id}`
                : `${API_URL}/coupons`;

            const res = await fetch(url, {
                method: editingCoupon ? 'PATCH' : 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    ...formData,
                    discountValue: Number(formData.discountValue),
                    maxDiscount: formData.maxDiscount ? Number(formData.maxDiscount) : null,
                    minPurchase: Number(formData.minPurchase) || 0,
                    usageLimit: formData.usageLimit ? Number(formData.usageLimit) : null,
                    usagePerUser: Number(formData.usagePerUser) || 1
                })
            });

            const data = await res.json();
            if (data.success) {
                fetchCoupons();
                closeModal();
                alert(editingCoupon ? 'Coupon updated!' : 'Coupon created!');
            } else {
                alert(data.message || 'Failed to save coupon');
            }
        } catch (error) {
            console.error('Error saving coupon:', error);
            alert('Error saving coupon');
        }
    };

    const handleDelete = async (id) => {
        if (!confirm('Are you sure you want to delete this coupon?')) return;

        try {
            const res = await fetch(`${API_URL}/coupons/${id}`, { method: 'DELETE' });
            const data = await res.json();
            if (data.success) {
                fetchCoupons();
            }
        } catch (error) {
            console.error('Error deleting coupon:', error);
        }
    };

    const handleEdit = (coupon) => {
        setEditingCoupon(coupon);
        setFormData({
            code: coupon.code,
            name: coupon.name,
            description: coupon.description || '',
            discountType: coupon.discountType,
            discountValue: coupon.discountValue,
            maxDiscount: coupon.maxDiscount || '',
            minPurchase: coupon.minPurchase || 0,
            startDate: coupon.startDate?.split('T')[0] || '',
            endDate: coupon.endDate?.split('T')[0] || '',
            usageLimit: coupon.usageLimit || '',
            usagePerUser: coupon.usagePerUser || 1,
            applicableTo: coupon.applicableTo || 'all',
            isActive: coupon.isActive
        });
        setShowModal(true);
    };

    const closeModal = () => {
        setShowModal(false);
        setEditingCoupon(null);
        setFormData({
            code: '',
            name: '',
            description: '',
            discountType: 'percentage',
            discountValue: 10,
            maxDiscount: '',
            minPurchase: 0,
            startDate: new Date().toISOString().split('T')[0],
            endDate: '',
            usageLimit: '',
            usagePerUser: 1,
            applicableTo: 'all',
            isActive: true
        });
    };

    const copyCode = (code) => {
        navigator.clipboard.writeText(code);
        alert('Code copied!');
    };

    const generateCode = () => {
        const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
        let code = '';
        for (let i = 0; i < 8; i++) {
            code += chars.charAt(Math.floor(Math.random() * chars.length));
        }
        setFormData(prev => ({ ...prev, code }));
    };

    const filteredCoupons = coupons.filter(c =>
        c.code?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        c.name?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const isExpired = (endDate) => new Date(endDate) < new Date();

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div>
                    <h1 className={`text-2xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                        Coupon Management
                    </h1>
                    <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                        Create and manage discount coupons
                    </p>
                </div>
                <div className="flex gap-3">
                    <button
                        onClick={fetchCoupons}
                        className={`flex items-center gap-2 px-4 py-2.5 rounded-xl ${isDark ? 'bg-slate-800 text-white hover:bg-slate-700' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'} transition-colors`}
                    >
                        <LuRefreshCw size={18} />
                        Refresh
                    </button>
                    <button
                        onClick={() => setShowModal(true)}
                        className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-red-500 to-emerald-500 text-white rounded-xl font-semibold shadow-lg shadow-red-500/25 hover:shadow-xl transition-all"
                    >
                        <LuPlus size={18} />
                        Create Coupon
                    </button>
                </div>
            </div>

            {/* Search */}
            <div className={`relative max-w-md ${isDark ? 'text-white' : 'text-gray-900'}`}>
                <LuSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                <input
                    type="text"
                    placeholder="Search coupons..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className={`w-full pl-11 pr-4 py-3 rounded-xl border ${isDark ? 'bg-slate-800 border-slate-700' : 'bg-white border-gray-200'} focus:ring-2 focus:ring-red-500`}
                />
            </div>

            {/* Coupons Grid */}
            {loading ? (
                <div className="flex justify-center py-20">
                    <div className="w-10 h-10 border-4 border-red-500/30 border-t-red-500 rounded-full animate-spin"></div>
                </div>
            ) : filteredCoupons.length === 0 ? (
                <div className={`text-center py-20 ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                    <LuTag size={48} className="mx-auto mb-4 opacity-30" />
                    <p className="text-lg font-medium">No coupons found</p>
                    <p className="text-sm">Create your first coupon to get started</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                    {filteredCoupons.map((coupon) => (
                        <div
                            key={coupon._id}
                            className={`relative p-5 rounded-2xl border ${isDark ? 'bg-slate-800/50 border-slate-700' : 'bg-white border-gray-200'} hover:shadow-lg transition-all`}
                        >
                            {/* Status Badge */}
                            <div className={`absolute top-4 right-4 px-2.5 py-1 rounded-full text-xs font-bold ${!coupon.isActive
                                ? 'bg-gray-100 text-gray-500'
                                : isExpired(coupon.endDate)
                                    ? 'bg-red-100 text-red-600'
                                    : 'bg-green-100 text-green-600'
                                }`}>
                                {!coupon.isActive ? 'Inactive' : isExpired(coupon.endDate) ? 'Expired' : 'Active'}
                            </div>

                            {/* Code */}
                            <div className="flex items-center gap-3 mb-4">
                                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-red-500 to-emerald-500 flex items-center justify-center text-white">
                                    {coupon.discountType === 'percentage' ? <LuPercent size={22} /> : <LuTag size={22} />}
                                </div>
                                <div>
                                    <div className="flex items-center gap-2">
                                        <span className={`font-mono text-lg font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                                            {coupon.code}
                                        </span>
                                        <button onClick={() => copyCode(coupon.code)} className="text-gray-400 hover:text-red-500">
                                            <LuCopy size={14} />
                                        </button>
                                    </div>
                                    <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>{coupon.name}</p>
                                </div>
                            </div>

                            {/* Discount Value */}
                            <div className={`text-2xl font-bold mb-3 ${isDark ? 'text-red-400' : 'text-red-600'}`}>
                                {coupon.discountType === 'percentage' ? `${coupon.discountValue}% OFF` : `৳${coupon.discountValue} OFF`}
                            </div>

                            {/* Details */}
                            <div className={`space-y-2 text-sm ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                                {coupon.minPurchase > 0 && (
                                    <p>Min. Purchase: ৳{coupon.minPurchase}</p>
                                )}
                                {coupon.maxDiscount && (
                                    <p>Max Discount: ৳{coupon.maxDiscount}</p>
                                )}
                                <div className="flex items-center gap-2">
                                    <LuCalendar size={14} />
                                    <span>Valid till: {new Date(coupon.endDate).toLocaleDateString()}</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <LuUsers size={14} />
                                    <span>Used: {coupon.usedCount || 0}{coupon.usageLimit ? ` / ${coupon.usageLimit}` : ''}</span>
                                </div>
                            </div>

                            {/* Actions */}
                            <div className="flex gap-2 mt-4 pt-4 border-t border-gray-100 dark:border-slate-700">
                                <button
                                    onClick={() => handleEdit(coupon)}
                                    className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-lg ${isDark ? 'bg-slate-700 hover:bg-slate-600 text-white' : 'bg-gray-100 hover:bg-gray-200 text-gray-700'} transition-colors`}
                                >
                                    <LuPencil size={16} />
                                    Edit
                                </button>
                                <button
                                    onClick={() => handleDelete(coupon._id)}
                                    className="flex items-center justify-center gap-2 px-4 py-2 rounded-lg bg-red-50 text-red-600 hover:bg-red-100 transition-colors"
                                >
                                    <LuTrash2 size={16} />
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Create/Edit Modal */}
            {showModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                    <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={closeModal}></div>
                    <div className={`relative w-full max-w-xl max-h-[90vh] overflow-y-auto rounded-3xl ${isDark ? 'bg-slate-900' : 'bg-white'} p-6 shadow-2xl`}>
                        <h2 className={`text-xl font-bold mb-6 ${isDark ? 'text-white' : 'text-gray-900'}`}>
                            {editingCoupon ? 'Edit Coupon' : 'Create New Coupon'}
                        </h2>

                        <form onSubmit={handleSubmit} className="space-y-4">
                            {/* Code */}
                            <div>
                                <label className={`block text-sm font-medium mb-1 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                                    Coupon Code *
                                </label>
                                <div className="flex gap-2">
                                    <input
                                        type="text"
                                        value={formData.code}
                                        onChange={(e) => setFormData(prev => ({ ...prev, code: e.target.value.toUpperCase() }))}
                                        placeholder="SAVE20"
                                        required
                                        className={`flex-1 px-4 py-3 rounded-xl border ${isDark ? 'bg-slate-800 border-slate-700 text-white' : 'bg-gray-50 border-gray-200'} font-mono uppercase`}
                                    />
                                    <button
                                        type="button"
                                        onClick={generateCode}
                                        className="px-4 py-3 rounded-xl bg-red-500 text-white font-medium hover:bg-red-600"
                                    >
                                        Generate
                                    </button>
                                </div>
                            </div>

                            {/* Name */}
                            <div>
                                <label className={`block text-sm font-medium mb-1 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                                    Coupon Name *
                                </label>
                                <input
                                    type="text"
                                    value={formData.name}
                                    onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                                    placeholder="Summer Sale 20%"
                                    required
                                    className={`w-full px-4 py-3 rounded-xl border ${isDark ? 'bg-slate-800 border-slate-700 text-white' : 'bg-gray-50 border-gray-200'}`}
                                />
                            </div>

                            {/* Discount Type & Value */}
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className={`block text-sm font-medium mb-1 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                                        Discount Type
                                    </label>
                                    <select
                                        value={formData.discountType}
                                        onChange={(e) => setFormData(prev => ({ ...prev, discountType: e.target.value }))}
                                        className={`w-full px-4 py-3 rounded-xl border ${isDark ? 'bg-slate-800 border-slate-700 text-white' : 'bg-gray-50 border-gray-200'}`}
                                    >
                                        <option value="percentage">Percentage (%)</option>
                                        <option value="fixed">Fixed Amount (৳)</option>
                                    </select>
                                </div>
                                <div>
                                    <label className={`block text-sm font-medium mb-1 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                                        Discount Value *
                                    </label>
                                    <input
                                        type="number"
                                        value={formData.discountValue}
                                        onChange={(e) => setFormData(prev => ({ ...prev, discountValue: e.target.value }))}
                                        min="0"
                                        required
                                        className={`w-full px-4 py-3 rounded-xl border ${isDark ? 'bg-slate-800 border-slate-700 text-white' : 'bg-gray-50 border-gray-200'}`}
                                    />
                                </div>
                            </div>

                            {/* Min/Max Purchase */}
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className={`block text-sm font-medium mb-1 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                                        Min. Purchase (৳)
                                    </label>
                                    <input
                                        type="number"
                                        value={formData.minPurchase}
                                        onChange={(e) => setFormData(prev => ({ ...prev, minPurchase: e.target.value }))}
                                        min="0"
                                        className={`w-full px-4 py-3 rounded-xl border ${isDark ? 'bg-slate-800 border-slate-700 text-white' : 'bg-gray-50 border-gray-200'}`}
                                    />
                                </div>
                                <div>
                                    <label className={`block text-sm font-medium mb-1 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                                        Max Discount (৳)
                                    </label>
                                    <input
                                        type="number"
                                        value={formData.maxDiscount}
                                        onChange={(e) => setFormData(prev => ({ ...prev, maxDiscount: e.target.value }))}
                                        placeholder="Optional"
                                        min="0"
                                        className={`w-full px-4 py-3 rounded-xl border ${isDark ? 'bg-slate-800 border-slate-700 text-white' : 'bg-gray-50 border-gray-200'}`}
                                    />
                                </div>
                            </div>

                            {/* Dates */}
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className={`block text-sm font-medium mb-1 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                                        Start Date *
                                    </label>
                                    <input
                                        type="date"
                                        value={formData.startDate}
                                        onChange={(e) => setFormData(prev => ({ ...prev, startDate: e.target.value }))}
                                        required
                                        className={`w-full px-4 py-3 rounded-xl border ${isDark ? 'bg-slate-800 border-slate-700 text-white' : 'bg-gray-50 border-gray-200'}`}
                                    />
                                </div>
                                <div>
                                    <label className={`block text-sm font-medium mb-1 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                                        End Date *
                                    </label>
                                    <input
                                        type="date"
                                        value={formData.endDate}
                                        onChange={(e) => setFormData(prev => ({ ...prev, endDate: e.target.value }))}
                                        required
                                        className={`w-full px-4 py-3 rounded-xl border ${isDark ? 'bg-slate-800 border-slate-700 text-white' : 'bg-gray-50 border-gray-200'}`}
                                    />
                                </div>
                            </div>

                            {/* Usage Limits */}
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className={`block text-sm font-medium mb-1 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                                        Total Usage Limit
                                    </label>
                                    <input
                                        type="number"
                                        value={formData.usageLimit}
                                        onChange={(e) => setFormData(prev => ({ ...prev, usageLimit: e.target.value }))}
                                        placeholder="Unlimited"
                                        min="1"
                                        className={`w-full px-4 py-3 rounded-xl border ${isDark ? 'bg-slate-800 border-slate-700 text-white' : 'bg-gray-50 border-gray-200'}`}
                                    />
                                </div>
                                <div>
                                    <label className={`block text-sm font-medium mb-1 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                                        Per User Limit
                                    </label>
                                    <input
                                        type="number"
                                        value={formData.usagePerUser}
                                        onChange={(e) => setFormData(prev => ({ ...prev, usagePerUser: e.target.value }))}
                                        min="1"
                                        className={`w-full px-4 py-3 rounded-xl border ${isDark ? 'bg-slate-800 border-slate-700 text-white' : 'bg-gray-50 border-gray-200'}`}
                                    />
                                </div>
                            </div>

                            {/* Applicable To */}
                            <div>
                                <label className={`block text-sm font-medium mb-1 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                                    Applicable To
                                </label>
                                <select
                                    value={formData.applicableTo}
                                    onChange={(e) => setFormData(prev => ({ ...prev, applicableTo: e.target.value }))}
                                    className={`w-full px-4 py-3 rounded-xl border ${isDark ? 'bg-slate-800 border-slate-700 text-white' : 'bg-gray-50 border-gray-200'}`}
                                >
                                    <option value="all">All Products</option>
                                    <option value="course">Courses Only</option>
                                    <option value="website">Websites Only</option>
                                    <option value="software">Software Only</option>
                                </select>
                            </div>

                            {/* Active Status */}
                            <div className="flex items-center gap-3">
                                <button
                                    type="button"
                                    onClick={() => setFormData(prev => ({ ...prev, isActive: !prev.isActive }))}
                                    className={`w-12 h-6 rounded-full transition-all ${formData.isActive ? 'bg-red-500' : isDark ? 'bg-slate-700' : 'bg-gray-300'}`}
                                >
                                    <div className={`w-5 h-5 rounded-full bg-white shadow-sm transition-transform ${formData.isActive ? 'translate-x-6' : 'translate-x-0.5'}`}></div>
                                </button>
                                <span className={isDark ? 'text-gray-300' : 'text-gray-700'}>Active</span>
                            </div>

                            {/* Buttons */}
                            <div className="flex gap-3 pt-4">
                                <button
                                    type="button"
                                    onClick={closeModal}
                                    className={`flex-1 py-3 rounded-xl font-medium ${isDark ? 'bg-slate-800 text-white hover:bg-slate-700' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="flex-1 py-3 rounded-xl font-medium bg-gradient-to-r from-red-500 to-emerald-500 text-white hover:shadow-lg"
                                >
                                    {editingCoupon ? 'Update Coupon' : 'Create Coupon'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default CouponsPage;

