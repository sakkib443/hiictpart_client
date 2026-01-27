'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
    FiBell, FiShoppingBag, FiUser, FiStar, FiBookOpen,
    FiCheck, FiCheckCircle, FiTrash2, FiExternalLink, FiRefreshCw,
    FiChevronLeft, FiChevronRight
} from 'react-icons/fi';
import { useTheme } from '@/providers/ThemeProvider';

const API_URL = process.env.NEXT_PUBLIC_API_URL || (process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api');

export default function NotificationsPage() {
    const [notifications, setNotifications] = useState([]);
    const [loading, setLoading] = useState(true);
    const [page, setPage] = useState(1);
    const [meta, setMeta] = useState({ total: 0, totalPages: 1, unreadCount: 0 });
    const { isDark } = useTheme();

    // Fetch notifications
    const fetchNotifications = async () => {
        try {
            setLoading(true);
            const token = localStorage.getItem('token');
            const response = await fetch(`${API_URL}/notifications?page=${page}&limit=15`, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                },
            });
            const data = await response.json();
            if (data.success) {
                setNotifications(data.data || []);
                setMeta(data.meta || { total: 0, totalPages: 1, unreadCount: 0 });
            }
        } catch (error) {
            console.error('Failed to fetch notifications:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchNotifications();
    }, [page]);

    // Mark as read
    const markAsRead = async (id) => {
        try {
            const token = localStorage.getItem('token');
            await fetch(`${API_URL}/notifications/${id}/read`, {
                method: 'PATCH',
                headers: { 'Authorization': `Bearer ${token}` },
            });
            setNotifications(prev =>
                prev.map(n => n._id === id ? { ...n, isRead: true } : n)
            );
            setMeta(prev => ({ ...prev, unreadCount: Math.max(0, prev.unreadCount - 1) }));
        } catch (error) {
            console.error('Failed to mark as read:', error);
        }
    };

    // Mark all as read
    const markAllAsRead = async () => {
        try {
            const token = localStorage.getItem('token');
            await fetch(`${API_URL}/notifications/mark-all-read`, {
                method: 'PATCH',
                headers: { 'Authorization': `Bearer ${token}` },
            });
            setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
            setMeta(prev => ({ ...prev, unreadCount: 0 }));
        } catch (error) {
            console.error('Failed to mark all as read:', error);
        }
    };

    // Delete notification
    const deleteNotification = async (id) => {
        try {
            const token = localStorage.getItem('token');
            await fetch(`${API_URL}/notifications/${id}`, {
                method: 'DELETE',
                headers: { 'Authorization': `Bearer ${token}` },
            });
            setNotifications(prev => prev.filter(n => n._id !== id));
            setMeta(prev => ({ ...prev, total: prev.total - 1 }));
        } catch (error) {
            console.error('Failed to delete notification:', error);
        }
    };

    // Get icon by notification type
    const getIcon = (type) => {
        switch (type) {
            case 'order': return <FiShoppingBag className="text-green-500" size={20} />;
            case 'enrollment': return <FiBookOpen className="text-blue-500" size={20} />;
            case 'user': return <FiUser className="text-purple-500" size={20} />;
            case 'review': return <FiStar className="text-yellow-500" size={20} />;
            default: return <FiBell className="text-gray-500" size={20} />;
        }
    };

    // Get background by type
    const getBgColor = (type, isDark) => {
        const colors = {
            order: isDark ? 'bg-green-500/10' : 'bg-green-50',
            enrollment: isDark ? 'bg-blue-500/10' : 'bg-blue-50',
            user: isDark ? 'bg-purple-500/10' : 'bg-purple-50',
            review: isDark ? 'bg-yellow-500/10' : 'bg-yellow-50',
        };
        return colors[type] || (isDark ? 'bg-gray-500/10' : 'bg-gray-50');
    };

    // Format time
    const formatTime = (date) => {
        const now = new Date();
        const diff = now - new Date(date);
        const minutes = Math.floor(diff / 60000);
        const hours = Math.floor(diff / 3600000);
        const days = Math.floor(diff / 86400000);

        if (minutes < 1) return 'Just now';
        if (minutes < 60) return `${minutes} minutes ago`;
        if (hours < 24) return `${hours} hours ago`;
        if (days < 7) return `${days} days ago`;
        return new Date(date).toLocaleDateString('en-US', {
            year: 'numeric', month: 'short', day: 'numeric'
        });
    };

    return (
        <div className="max-w-4xl mx-auto">
            {/* Header */}
            <div className={`flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 p-6 rounded-2xl ${isDark ? 'bg-slate-800/50' : 'bg-white'
                } border ${isDark ? 'border-slate-700' : 'border-slate-200'}`}>
                <div className="flex items-center gap-4">
                    <div className={`w-14 h-14 rounded-2xl flex items-center justify-center ${isDark ? 'bg-gradient-to-br from-[#E62D26]/20 to-[#f79952]/20' : 'bg-gradient-to-br from-[#E62D26]/10 to-[#f79952]/10'
                        }`}>
                        <FiBell size={24} className="text-[#E62D26]" />
                    </div>
                    <div>
                        <h1 className={`text-2xl font-bold ${isDark ? 'text-white' : 'text-slate-800'}`}>
                            Notifications
                        </h1>
                        <p className={`text-sm ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                            {meta.total} total � {meta.unreadCount} unread
                        </p>
                    </div>
                </div>

                <div className="flex items-center gap-2">
                    <button
                        onClick={fetchNotifications}
                        className={`p-2.5 rounded-xl transition-colors ${isDark ? 'bg-slate-700 hover:bg-slate-600 text-slate-300' : 'bg-slate-100 hover:bg-slate-200 text-slate-600'
                            }`}
                        title="Refresh"
                    >
                        <FiRefreshCw size={18} className={loading ? 'animate-spin' : ''} />
                    </button>
                    {meta.unreadCount > 0 && (
                        <button
                            onClick={markAllAsRead}
                            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-[#E62D26] to-[#f79952] text-white font-medium text-sm hover:opacity-90 transition-opacity"
                        >
                            <FiCheckCircle size={16} />
                            Mark all as read
                        </button>
                    )}
                </div>
            </div>

            {/* Notifications List */}
            <div className={`rounded-2xl overflow-hidden border ${isDark ? 'bg-slate-800/50 border-slate-700' : 'bg-white border-slate-200'
                }`}>
                {loading ? (
                    <div className="flex items-center justify-center py-20">
                        <div className="w-8 h-8 border-3 border-[#E62D26] border-t-transparent rounded-full animate-spin"></div>
                    </div>
                ) : notifications.length === 0 ? (
                    <div className="py-20 text-center">
                        <div className={`w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4 ${isDark ? 'bg-slate-700' : 'bg-slate-100'
                            }`}>
                            <FiBell size={32} className={isDark ? 'text-slate-500' : 'text-slate-400'} />
                        </div>
                        <p className={`text-lg font-medium ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                            No notifications yet
                        </p>
                        <p className={`text-sm mt-1 ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>
                            When you receive notifications, they will appear here
                        </p>
                    </div>
                ) : (
                    <div className={`divide-y ${isDark ? 'divide-slate-700' : 'divide-slate-100'}`}>
                        {notifications.map((notification) => (
                            <div
                                key={notification._id}
                                className={`p-5 transition-colors ${!notification.isRead
                                        ? isDark ? 'bg-[#E62D26]/5' : 'bg-[#E62D26]/5'
                                        : ''
                                    } ${isDark ? 'hover:bg-slate-700/50' : 'hover:bg-slate-50'}`}
                            >
                                <div className="flex gap-4">
                                    {/* Icon */}
                                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 ${getBgColor(notification.type, isDark)}`}>
                                        {getIcon(notification.type)}
                                    </div>

                                    {/* Content */}
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-start justify-between gap-3">
                                            <div className="flex-1">
                                                <div className="flex items-center gap-2">
                                                    <p className={`font-semibold ${isDark ? 'text-white' : 'text-slate-800'}`}>
                                                        {notification.title}
                                                    </p>
                                                    {!notification.isRead && (
                                                        <span className="w-2 h-2 bg-[#E62D26] rounded-full"></span>
                                                    )}
                                                </div>
                                                <p className={`text-sm mt-1 ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                                                    {notification.message}
                                                </p>
                                                <div className="flex items-center gap-3 mt-2">
                                                    <span className={`text-xs ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>
                                                        {formatTime(notification.createdAt)}
                                                    </span>
                                                    {notification.data?.amount && (
                                                        <span className="text-xs text-green-500 font-semibold">
                                                            ?{notification.data.amount.toLocaleString()}
                                                        </span>
                                                    )}
                                                </div>
                                            </div>

                                            {/* Actions */}
                                            <div className="flex items-center gap-1">
                                                {notification.data?.link && (
                                                    <Link
                                                        href={notification.data.link}
                                                        onClick={() => !notification.isRead && markAsRead(notification._id)}
                                                        className={`p-2 rounded-lg transition-colors ${isDark ? 'hover:bg-slate-600 text-slate-400' : 'hover:bg-slate-100 text-slate-500'
                                                            }`}
                                                        title="View details"
                                                    >
                                                        <FiExternalLink size={16} />
                                                    </Link>
                                                )}
                                                {!notification.isRead && (
                                                    <button
                                                        onClick={() => markAsRead(notification._id)}
                                                        className={`p-2 rounded-lg transition-colors ${isDark ? 'hover:bg-slate-600 text-slate-400' : 'hover:bg-slate-100 text-slate-500'
                                                            }`}
                                                        title="Mark as read"
                                                    >
                                                        <FiCheck size={16} />
                                                    </button>
                                                )}
                                                <button
                                                    onClick={() => deleteNotification(notification._id)}
                                                    className={`p-2 rounded-lg transition-colors ${isDark ? 'hover:bg-red-500/20 text-slate-400 hover:text-red-400' : 'hover:bg-red-50 text-slate-500 hover:text-red-500'
                                                        }`}
                                                    title="Delete"
                                                >
                                                    <FiTrash2 size={16} />
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                {/* Pagination */}
                {meta.totalPages > 1 && (
                    <div className={`flex items-center justify-between px-5 py-4 border-t ${isDark ? 'border-slate-700 bg-slate-800/30' : 'border-slate-100 bg-slate-50'
                        }`}>
                        <p className={`text-sm ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                            Page {page} of {meta.totalPages}
                        </p>
                        <div className="flex items-center gap-2">
                            <button
                                onClick={() => setPage(p => Math.max(1, p - 1))}
                                disabled={page === 1}
                                className={`p-2 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed ${isDark ? 'bg-slate-700 hover:bg-slate-600 text-slate-300' : 'bg-white hover:bg-slate-100 text-slate-600 border border-slate-200'
                                    }`}
                            >
                                <FiChevronLeft size={18} />
                            </button>
                            <button
                                onClick={() => setPage(p => Math.min(meta.totalPages, p + 1))}
                                disabled={page === meta.totalPages}
                                className={`p-2 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed ${isDark ? 'bg-slate-700 hover:bg-slate-600 text-slate-300' : 'bg-white hover:bg-slate-100 text-slate-600 border border-slate-200'
                                    }`}
                            >
                                <FiChevronRight size={18} />
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}

