'use client';
import { API_URL, API_BASE_URL } from '@/config/api';


import React, { useEffect, useState } from 'react';
import {
    FiShoppingBag, FiSearch, FiRefreshCw, FiEye,
    FiChevronLeft, FiChevronRight, FiDollarSign, FiPackage, FiCheck, FiClock, FiX,
    FiMail, FiEdit3, FiSave, FiCreditCard, FiHash, FiAlertCircle, FiCalendar, FiArrowRight, FiPhone, FiSmartphone
} from 'react-icons/fi';
import toast from 'react-hot-toast';



export default function OrdersPage() {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [selectedOrder, setSelectedOrder] = useState(null);
    const [statusFilter, setStatusFilter] = useState('all');
    const [dateFilter, setDateFilter] = useState('');
    const [editMode, setEditMode] = useState(false);
    const [editStatus, setEditStatus] = useState('');
    const [saving, setSaving] = useState(false);

    const fetchOrders = async () => {
        try {
            setLoading(true);
            const token = localStorage.getItem('token');
            const res = await fetch(`${API_URL}/orders/admin/all`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            const data = await res.json();
            setOrders(data.data || []);
        } catch (err) {
            console.error('Error fetching orders:', err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchOrders();
    }, []);

    const handleUpdateStatus = async (orderId, newStatus) => {
        try {
            setSaving(true);
            const token = localStorage.getItem('token');
            const res = await fetch(`${API_URL}/orders/admin/${orderId}/status`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ status: newStatus })
            });
            if (res.ok) {
                toast.success(`Order set to ${newStatus}!`);
                setEditMode(false);
                setSelectedOrder(null);
                fetchOrders();
            } else {
                toast.error('Failed to update status');
            }
        } catch (err) {
            toast.error('Update failed');
        } finally {
            setSaving(false);
        }
    };

    const filteredOrders = orders.filter(order => {
        const matchSearch =
            order.orderNumber?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            order.user?.firstName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            order.user?.email?.toLowerCase().includes(searchTerm.toLowerCase());

        const matchStatus = statusFilter === 'all' || order.paymentStatus === statusFilter;

        // Date filter logic
        let matchDate = true;
        if (dateFilter) {
            const orderDateStr = new Date(order.orderDate).toISOString().split('T')[0];
            matchDate = orderDateStr === dateFilter;
        }

        return matchSearch && matchStatus && matchDate;
    });

    const itemsPerPage = 10;
    const totalPages = Math.ceil(filteredOrders.length / itemsPerPage);
    const paginatedOrders = filteredOrders.slice(
        (currentPage - 1) * itemsPerPage,
        currentPage * itemsPerPage
    );

    const getStatusBadge = (status) => {
        switch (status) {
            case 'completed': return <span className="px-2 py-0.5 bg-emerald-100 dark:bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 rounded text-[10px] font-bold flex items-center gap-1"><FiCheck size={10} /> Completed</span>;
            case 'pending': return <span className="px-2 py-0.5 bg-amber-100 dark:bg-amber-500/20 text-amber-600 dark:text-amber-400 rounded text-[10px] font-bold flex items-center gap-1"><FiClock size={10} /> Pending</span>;
            case 'failed': return <span className="px-2 py-0.5 bg-rose-100 dark:bg-rose-500/20 text-rose-600 dark:text-rose-400 rounded text-[10px] font-bold flex items-center gap-1"><FiX size={10} /> Failed</span>;
            default: return <span className="px-2 py-0.5 bg-slate-100 dark:bg-slate-700 text-slate-500 rounded text-[10px] font-bold">{status}</span>;
        }
    };

    const totalRevenue = orders.filter(o => o.paymentStatus === 'completed').reduce((sum, o) => sum + (o.totalAmount || 0), 0);
    const pendingOrdersCount = orders.filter(o => o.paymentStatus === 'pending').length;
    const completedOrdersCount = orders.filter(o => o.paymentStatus === 'completed').length;

    const openOrderDetails = (order) => {
        setSelectedOrder(order);
        setEditStatus(order.paymentStatus);
        setEditMode(false);
    };

    return (
        <div className="p-4 md:p-6 space-y-5 bg-slate-50 dark:bg-slate-900 min-h-screen">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-white dark:bg-slate-800 rounded-md border border-slate-200 dark:border-slate-700 p-4 shadow-sm">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-md bg-indigo-500 flex items-center justify-center shadow-lg shadow-indigo-500/20">
                        <FiShoppingBag className="text-white" size={18} />
                    </div>
                    <div>
                        <h1 className="text-lg font-bold text-slate-800 dark:text-white outfit">All Orders</h1>
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{orders.length} total transactions</p>
                    </div>
                </div>
                <button
                    onClick={fetchOrders}
                    disabled={loading}
                    className="flex items-center gap-2 px-4 py-2 bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600 text-slate-600 dark:text-slate-300 rounded-md text-xs font-bold transition-all disabled:opacity-50 border border-slate-200 dark:border-slate-600"
                >
                    <FiRefreshCw size={14} className={loading ? 'animate-spin' : ''} />
                    Refresh Database
                </button>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="bg-white dark:bg-slate-800 rounded-md border border-slate-200 dark:border-slate-700 p-5 flex items-center gap-4 group">
                    <div className="w-12 h-12 bg-emerald-500 rounded-md flex items-center justify-center text-white shadow-lg shadow-emerald-500/20 group-hover:scale-110 transition-transform">
                        <FiDollarSign size={20} />
                    </div>
                    <div>
                        <p className="text-sm font-bold text-slate-400 uppercase tracking-tight">Revenue</p>
                        <p className="text-2xl font-black text-slate-800 dark:text-white outfit">৳{totalRevenue.toLocaleString()}</p>
                    </div>
                </div>
                <div className="bg-white dark:bg-slate-800 rounded-md border border-slate-200 dark:border-slate-700 p-5 flex items-center gap-4 group">
                    <div className="w-12 h-12 bg-amber-500 rounded-md flex items-center justify-center text-white shadow-lg shadow-amber-500/20 group-hover:scale-110 transition-transform">
                        <FiClock size={20} />
                    </div>
                    <div>
                        <p className="text-sm font-bold text-slate-400 uppercase tracking-tight">Waitlist</p>
                        <p className="text-2xl font-black text-slate-800 dark:text-white outfit">{pendingOrdersCount}</p>
                    </div>
                </div>
                <div className="bg-white dark:bg-slate-800 rounded-md border border-slate-200 dark:border-slate-700 p-5 flex items-center gap-4 group">
                    <div className="w-12 h-12 bg-indigo-500 rounded-md flex items-center justify-center text-white shadow-lg shadow-indigo-500/20 group-hover:scale-110 transition-transform">
                        <FiCheck size={20} />
                    </div>
                    <div>
                        <p className="text-sm font-bold text-slate-400 uppercase tracking-tight">Completed</p>
                        <p className="text-2xl font-black text-slate-800 dark:text-white outfit">{completedOrdersCount}</p>
                    </div>
                </div>
            </div>

            {/* Filters Bar */}
            <div className="flex flex-col xl:flex-row gap-4 bg-white dark:bg-slate-800 p-4 rounded-md border border-slate-200 dark:border-slate-700">
                <div className="relative flex-1">
                    <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                    <input
                        type="text"
                        placeholder="Search by ID, Name or Email..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-10 pr-4 py-2.5 rounded-md bg-slate-50 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 focus:border-indigo-500 outline-none text-sm transition-all font-medium"
                    />
                </div>
                <div className="flex flex-wrap items-center gap-2">
                    <div className="flex items-center gap-2 px-3 py-1.5 bg-slate-50 dark:bg-slate-700 rounded-md border border-slate-200 dark:border-slate-600">
                        <FiCalendar className="text-slate-400" size={14} />
                        <input
                            type="date"
                            value={dateFilter}
                            onChange={(e) => setDateFilter(e.target.value)}
                            className="bg-transparent text-xs font-bold text-slate-600 dark:text-slate-300 outline-none"
                        />
                        {dateFilter && (
                            <button onClick={() => setDateFilter('')} className="text-slate-400 hover:text-red-500 transition-colors">
                                <FiX size={14} />
                            </button>
                        )}
                    </div>
                    <div className="h-8 w-px bg-slate-200 dark:bg-slate-700 mx-1 hidden md:block"></div>
                    {['all', 'completed', 'pending', 'failed'].map(status => (
                        <button
                            key={status}
                            onClick={() => setStatusFilter(status)}
                            className={`px-4 py-2.5 rounded-md text-[10px] font-black uppercase tracking-widest transition-all ${statusFilter === status
                                ? 'bg-indigo-500 text-white shadow-md shadow-indigo-500/20'
                                : 'bg-slate-50 dark:bg-slate-700 text-slate-500 dark:text-slate-400 border border-slate-200 dark:border-slate-600 hover:bg-slate-100'
                                }`}
                        >
                            {status}
                        </button>
                    ))}
                </div>
            </div>

            {/* Table */}
            <div className="bg-white dark:bg-slate-800 rounded-md border border-slate-200 dark:border-slate-700 overflow-hidden shadow-sm">
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead className="bg-slate-50 dark:bg-slate-700/50 border-b border-slate-200 dark:border-slate-700">
                            <tr>
                                <th className="text-left px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Order ID</th>
                                <th className="text-left px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Customer</th>
                                <th className="text-left px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Items</th>
                                <th className="text-left px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Amount</th>
                                <th className="text-left px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Status</th>
                                <th className="text-left px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Date</th>
                                <th className="text-right px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Action</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100 dark:divide-slate-700">
                            {loading ? (
                                <tr>
                                    <td colSpan={7} className="px-6 py-20 text-center">
                                        <div className="flex flex-col items-center gap-3">
                                            <FiRefreshCw className="animate-spin text-indigo-500" size={32} />
                                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Synchronizing Records...</p>
                                        </div>
                                    </td>
                                </tr>
                            ) : paginatedOrders.length === 0 ? (
                                <tr>
                                    <td colSpan={7} className="px-6 py-20 text-center">
                                        <div className="flex flex-col items-center gap-3 opacity-30">
                                            <FiShoppingBag size={40} className="text-slate-400" />
                                            <p className="text-sm font-bold text-slate-500">No matching orders found</p>
                                        </div>
                                    </td>
                                </tr>
                            ) : (
                                paginatedOrders.map((order) => (
                                    <tr key={order._id} className="hover:bg-slate-50/50 dark:hover:bg-slate-700/20 transition-colors">
                                        <td className="px-6 py-4">
                                            <span className="text-xs font-mono font-bold text-slate-500 dark:text-slate-400 bg-slate-100 dark:bg-white/5 px-2 py-1 rounded border border-slate-200 dark:border-white/5">
                                                #{order.orderNumber || order._id?.slice(-6).toUpperCase()}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-3">
                                                <div className="w-10 h-10 rounded-md bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white text-sm font-black shadow-md shadow-indigo-500/10">
                                                    {order.user?.firstName?.charAt(0) || 'U'}
                                                </div>
                                                <div>
                                                    <p className="text-sm font-bold text-slate-800 dark:text-white leading-none mb-1">{order.user?.firstName} {order.user?.lastName}</p>
                                                    <p className="text-[10px] font-medium text-slate-400">{order.user?.email}</p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex flex-col">
                                                <span className="text-sm font-bold text-slate-600 dark:text-slate-300">{order.items?.length || 0} Products</span>
                                                <span className="text-[9px] font-bold text-slate-400 uppercase">{order.items?.[0]?.productType}</span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className="text-base font-black text-indigo-600 dark:text-indigo-400">৳{order.totalAmount?.toLocaleString()}</span>
                                        </td>
                                        <td className="px-6 py-4">
                                            {getStatusBadge(order.paymentStatus)}
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-tight">
                                                {order.orderDate ? new Date(order.orderDate).toLocaleDateString('en-GB', {
                                                    day: '2-digit', month: 'short', year: 'numeric'
                                                }) : 'Unknown'}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <div className="flex items-center justify-end gap-2">
                                                {order.paymentStatus === 'pending' && (
                                                    <button
                                                        onClick={() => handleUpdateStatus(order._id, 'completed')}
                                                        disabled={saving}
                                                        className="h-8 w-8 flex items-center justify-center rounded-md bg-emerald-500 text-white hover:bg-emerald-600 transition-all shadow-md shadow-emerald-500/10"
                                                        title="Quick Complete"
                                                    >
                                                        <FiCheck size={16} />
                                                    </button>
                                                )}
                                                <button
                                                    onClick={() => openOrderDetails(order)}
                                                    className="h-8 w-8 flex items-center justify-center rounded-md bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 text-slate-500 dark:text-slate-400 hover:text-indigo-500 hover:border-indigo-500 transition-all shadow-sm"
                                                >
                                                    <FiEye size={16} />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>

                {/* Pagination */}
                {totalPages > 1 && (
                    <div className="flex items-center justify-between px-6 py-4 border-t border-slate-100 dark:border-slate-700 bg-slate-50/30 dark:bg-white/[0.02]">
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                            Showing {(currentPage - 1) * itemsPerPage + 1} - {Math.min(currentPage * itemsPerPage, filteredOrders.length)} of {filteredOrders.length} records
                        </p>
                        <div className="flex items-center gap-1">
                            <button
                                onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                                disabled={currentPage === 1}
                                className="h-8 w-8 flex items-center justify-center rounded-md border border-slate-200 dark:border-slate-600 hover:bg-white dark:hover:bg-slate-700 disabled:opacity-50 transition-all shadow-sm"
                            >
                                <FiChevronLeft size={16} />
                            </button>
                            <div className="flex items-center gap-1.5 px-3">
                                <span className="text-xs font-black text-indigo-500">{currentPage}</span>
                                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">of {totalPages}</span>
                            </div>
                            <button
                                onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                                disabled={currentPage === totalPages}
                                className="h-8 w-8 flex items-center justify-center rounded-md border border-slate-200 dark:border-slate-600 hover:bg-white dark:hover:bg-slate-700 disabled:opacity-50 transition-all shadow-sm"
                            >
                                <FiChevronRight size={16} />
                            </button>
                        </div>
                    </div>
                )}
            </div>

            {/* Order Detail Modal */}
            {selectedOrder && (
                <div className="fixed inset-0 bg-black/60 backdrop-blur-[2px] flex items-center justify-center z-[100] p-4">
                    <div className="bg-white dark:bg-[#0f111a] rounded-xl w-full max-w-2xl max-h-[95vh] overflow-hidden shadow-2xl border border-slate-200 dark:border-white/5 animate-in fade-in zoom-in duration-300">
                        {/* Header */}
                        <div className="px-6 py-5 border-b border-slate-100 dark:border-white/5 bg-indigo-600 flex items-center justify-between">
                            <div>
                                <h3 className="text-lg font-black text-white outfit uppercase tracking-tight">Order Identification</h3>
                                <p className="text-indigo-100 text-[10px] font-bold flex items-center gap-1 mt-1 uppercase tracking-widest">
                                    <FiHash size={12} /> {selectedOrder.orderNumber || selectedOrder._id?.slice(-6).toUpperCase()}
                                </p>
                            </div>
                            <div className="flex items-center gap-2">
                                {!editMode ? (
                                    <button
                                        onClick={() => setEditMode(true)}
                                        className="h-9 px-4 bg-white/10 hover:bg-white/20 rounded-md text-white text-xs font-black uppercase tracking-widest transition-all flex items-center gap-2"
                                    >
                                        <FiEdit3 size={14} /> Update Status
                                    </button>
                                ) : (
                                    <button
                                        onClick={() => handleUpdateStatus(selectedOrder._id, editStatus)}
                                        disabled={saving}
                                        className="h-9 px-4 bg-white text-indigo-600 rounded-md text-xs font-black uppercase tracking-widest flex items-center gap-2 hover:shadow-lg transition-all disabled:opacity-50"
                                    >
                                        <FiSave size={14} /> {saving ? 'Applying...' : 'Save Changes'}
                                    </button>
                                )}
                                <button onClick={() => { setSelectedOrder(null); setEditMode(false); }} className="h-9 w-9 flex items-center justify-center bg-black/20 hover:bg-black/30 rounded-md text-white transition-all">
                                    <FiX size={18} />
                                </button>
                            </div>
                        </div>

                        <div className="p-6 space-y-6 overflow-y-auto max-h-[calc(95vh-80px)]">
                            {/* Metadata Grid */}
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                <div className="bg-slate-50 dark:bg-white/5 border border-slate-100 dark:border-white/10 rounded-xl p-4">
                                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.1em] mb-2">Order Date</p>
                                    <p className="text-sm font-bold text-slate-800 dark:text-white">
                                        {selectedOrder.orderDate ? new Date(selectedOrder.orderDate).toLocaleDateString('en-GB') : 'N/A'}
                                    </p>
                                </div>
                                <div className="bg-slate-50 dark:bg-white/5 border border-slate-100 dark:border-white/10 rounded-xl p-4">
                                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.1em] mb-2">Method</p>
                                    <p className="text-sm font-bold text-slate-800 dark:text-white capitalize flex items-center gap-2">
                                        <FiCreditCard size={14} className="text-indigo-500" />
                                        {selectedOrder.paymentMethod || 'Manual'}
                                    </p>
                                </div>
                                <div className="bg-slate-50 dark:bg-white/5 border border-slate-100 dark:border-white/10 rounded-xl p-4 col-span-2">
                                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.1em] mb-2">Current Status</p>
                                    {editMode ? (
                                        <select
                                            value={editStatus}
                                            onChange={(e) => setEditStatus(e.target.value)}
                                            className="w-full bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 px-3 py-1 text-sm font-bold rounded focus:ring-2 focus:ring-indigo-500/20 outline-none transition-all h-8"
                                        >
                                            <option value="pending">Pending</option>
                                            <option value="completed">Completed</option>
                                            <option value="failed">Failed</option>
                                            <option value="refunded">Refunded</option>
                                        </select>
                                    ) : (
                                        getStatusBadge(selectedOrder.paymentStatus)
                                    )}
                                </div>
                            </div>

                            {/* Customer Profile */}
                            <div className="bg-slate-50 dark:bg-white/5 border border-slate-100 dark:border-white/10 rounded-xl p-5">
                                <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-4">Customer Profile</h4>
                                <div className="flex items-start gap-4">
                                    <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white text-xl font-black shadow-lg shadow-indigo-500/10">
                                        {selectedOrder.user?.firstName?.charAt(0) || 'U'}
                                    </div>
                                    <div className="flex-1">
                                        <p className="text-lg font-black text-slate-800 dark:text-white leading-tight mb-1">{selectedOrder.user?.firstName} {selectedOrder.user?.lastName}</p>
                                        <div className="flex flex-wrap items-center gap-x-4 gap-y-1">
                                            <p className="text-xs font-medium text-slate-500 flex items-center gap-1.5">
                                                <FiMail size={12} className="text-indigo-400" /> {selectedOrder.user?.email}
                                            </p>
                                            {selectedOrder.user?.phone && (
                                                <p className="text-xs font-medium text-slate-500 flex items-center gap-1.5">
                                                    <FiPhone size={12} className="text-indigo-400" /> {selectedOrder.user?.phone}
                                                </p>
                                            )}
                                        </div>
                                    </div>
                                    <button className="h-8 px-3 rounded-md bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 text-[10px] font-black uppercase tracking-widest text-slate-500 hover:text-indigo-500 transition-all">View Full Identity</button>
                                </div>
                            </div>

                            {/* Itemized List */}
                            <div>
                                <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-3">Itemized Selection ({selectedOrder.items?.length || 0})</h4>
                                <div className="space-y-3">
                                    {selectedOrder.items?.map((item, idx) => (
                                        <div key={idx} className="flex items-center gap-4 p-4 bg-white dark:bg-white/5 border border-slate-100 dark:border-white/5 rounded-xl hover:shadow-sm transition-all">
                                            <div className="w-14 h-14 rounded-lg overflow-hidden bg-slate-100 dark:bg-slate-800 shrink-0 border border-slate-200 dark:border-white/5">
                                                {item.image ? (
                                                    <img src={item.image} alt={item.title} className="w-full h-full object-cover" />
                                                ) : (
                                                    <div className="w-full h-full flex items-center justify-center">
                                                        <FiPackage className="text-slate-300" size={24} />
                                                    </div>
                                                )}
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <p className="text-sm font-bold text-slate-800 dark:text-white truncate mb-1">{item.title}</p>
                                                <span className={`px-2 py-0.5 rounded text-[8px] font-black uppercase tracking-widest ${item.productType === 'course' ? 'bg-indigo-500/10 text-indigo-500' : 'bg-amber-500/10 text-amber-500'
                                                    }`}>
                                                    {item.productType}
                                                </span>
                                            </div>
                                            <span className="text-base font-black text-indigo-600 dark:text-indigo-400">৳{item.price?.toLocaleString()}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Financial Summary */}
                            <div className="p-5 bg-indigo-600 rounded-xl text-white shadow-xl shadow-indigo-600/20">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-[10px] font-black uppercase tracking-widest text-indigo-100/70">Total Acquisition Value</p>
                                        <p className="text-[9px] font-medium text-indigo-200/50 uppercase mt-0.5 italic">All applicable taxes & fees included</p>
                                    </div>
                                    <span className="text-3xl font-black outfit">৳{selectedOrder.totalAmount?.toLocaleString()}</span>
                                </div>
                            </div>

                            {/* Manual Payment Verification Details */}
                            {selectedOrder.paymentMethod === 'manual' || selectedOrder.manualPaymentDetails ? (
                                <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-xl p-5 space-y-4">
                                    <div className="flex items-center gap-2 mb-2">
                                        <div className="h-6 w-6 rounded-full bg-emerald-500 flex items-center justify-center text-white">
                                            <FiCheck size={14} />
                                        </div>
                                        <h4 className="text-[11px] font-black text-emerald-600 dark:text-emerald-400 uppercase tracking-[0.2em]">Transaction Verification</h4>
                                    </div>

                                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                        <div className="space-y-1">
                                            <p className="text-[9px] font-black text-emerald-600/50 uppercase tracking-widest">Method</p>
                                            <p className="text-xs font-bold text-slate-700 dark:text-white uppercase">{selectedOrder.manualPaymentDetails?.method || 'N/A'}</p>
                                        </div>
                                        <div className="space-y-1">
                                            <p className="text-[9px] font-black text-emerald-600/50 uppercase tracking-widest">Sender Number</p>
                                            <p className="text-xs font-bold text-slate-700 dark:text-white underline decoration-emerald-500/30">{selectedOrder.manualPaymentDetails?.senderNumber || 'N/A'}</p>
                                        </div>
                                        <div className="space-y-1">
                                            <p className="text-[9px] font-black text-emerald-600/50 uppercase tracking-widest">Transaction ID</p>
                                            <p className="text-xs font-mono font-bold text-slate-800 dark:text-white bg-white/50 dark:bg-white/5 px-1.5 py-0.5 rounded border border-emerald-500/20">
                                                {selectedOrder.manualPaymentDetails?.transactionId || selectedOrder.transactionId || 'N/A'}
                                            </p>
                                        </div>
                                        <div className="space-y-1 text-right">
                                            <p className="text-[9px] font-black text-emerald-600/50 uppercase tracking-widest">Payment Time</p>
                                            <p className="text-xs font-bold text-slate-700 dark:text-white">
                                                {selectedOrder.manualPaymentDetails?.date || 'N/A'} • {selectedOrder.manualPaymentDetails?.time || ''}
                                            </p>
                                        </div>
                                    </div>

                                    <div className="pt-3 border-t border-emerald-500/10 flex items-center gap-2">
                                        <FiSmartphone size={14} className="text-emerald-500" />
                                        <p className="text-[10px] font-bold text-emerald-700 dark:text-emerald-500 italic">Verify this transaction with your gateway statement before completing.</p>
                                    </div>
                                </div>
                            ) : selectedOrder.transactionId && (
                                <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-xl p-4 flex items-center justify-between gap-4">
                                    <div className="flex items-center gap-3">
                                        <FiCheck className="text-emerald-500" size={18} />
                                        <div>
                                            <p className="text-[9px] font-black text-emerald-600 uppercase tracking-widest">Digital Transaction Reference</p>
                                            <p className="text-sm font-mono font-bold text-slate-800 dark:text-white">{selectedOrder.transactionId}</p>
                                        </div>
                                    </div>
                                    <span className="px-2 py-0.5 bg-emerald-500 text-white rounded text-[8px] font-black uppercase tracking-widest">Verified Digital</span>
                                </div>
                            )}

                            {/* Refund/Alert Area if status is failed */}
                            {selectedOrder.paymentStatus === 'failed' && (
                                <div className="p-4 bg-rose-500/10 border border-rose-500/20 rounded-xl flex items-center gap-3">
                                    <FiAlertCircle className="text-rose-500" size={18} />
                                    <p className="text-xs font-medium text-rose-600 dark:text-rose-400">This transaction was marked as failed. Please perform a manual audit if necessary.</p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

