'use client';

import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import {
    FiSettings, FiSave, FiUser, FiBell, FiLock, FiGlobe,
    FiMail, FiDollarSign, FiDatabase, FiChevronRight, FiCheck
} from 'react-icons/fi';
import { useTheme } from '@/providers/ThemeProvider';

export default function SettingsPage() {
    const { isDark } = useTheme();
    const searchParams = useSearchParams();
    const tabFromUrl = searchParams.get('tab');
    const [activeTab, setActiveTab] = useState(tabFromUrl || 'general');

    // Update tab when URL changes
    useEffect(() => {
        if (tabFromUrl) {
            setActiveTab(tabFromUrl);
        }
    }, [tabFromUrl]);

    const [saving, setSaving] = useState(false);
    const [settings, setSettings] = useState({
        siteName: 'HIICT Park',
        siteEmail: 'admin@hiictpark.com',
        currency: 'BDT',
        currencySymbol: '৳',
        emailNotifications: true,
        orderNotifications: true,
        maintenanceMode: false,
    });

    const [passwordData, setPasswordData] = useState({
        currentPassword: '',
        newPassword: '',
        confirmNewPassword: ''
    });
    const [updatingPassword, setUpdatingPassword] = useState(false);
    const [passwordError, setPasswordError] = useState('');
    const [passwordSuccess, setPasswordSuccess] = useState('');
    const BASE_URL = process.env.NEXT_PUBLIC_API_URL || (process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api');

    const handleChange = (key, value) => {
        setSettings(prev => ({ ...prev, [key]: value }));
    };

    const handleSave = async () => {
        setSaving(true);
        // Simulating API call
        await new Promise(resolve => setTimeout(resolve, 1000));
        setSaving(false);
        alert('Settings saved successfully!');
    };

    const handlePasswordUpdate = async (e) => {
        e.preventDefault();
        setPasswordError('');
        setPasswordSuccess('');

        if (passwordData.newPassword !== passwordData.confirmNewPassword) {
            setPasswordError('New passwords do not match!');
            return;
        }

        if (passwordData.newPassword.length < 6) {
            setPasswordError('Password must be at least 6 characters long.');
            return;
        }

        setUpdatingPassword(true);
        try {
            const token = localStorage.getItem('token');
            const response = await fetch(`${BASE_URL}/auth/update-password`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({
                    currentPassword: passwordData.currentPassword,
                    newPassword: passwordData.newPassword,
                    confirmNewPassword: passwordData.confirmNewPassword
                })
            });

            const result = await response.json();

            if (response.ok) {
                setPasswordSuccess('Password updated successfully!');
                setPasswordData({ currentPassword: '', newPassword: '', confirmNewPassword: '' });
            } else {
                setPasswordError(result.message || 'Failed to update password.');
            }
        } catch (err) {
            setPasswordError('Something went wrong. Please try again.');
            console.error(err);
        } finally {
            setUpdatingPassword(false);
        }
    };

    const tabs = [
        { id: 'general', label: 'General', icon: FiSettings },
        { id: 'notifications', label: 'Notifications', icon: FiBell },
        { id: 'security', label: 'Security', icon: FiLock },
        { id: 'payment', label: 'Payment', icon: FiDollarSign },
    ];

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                    <h1 className={`text-2xl font-bold ${isDark ? 'text-white' : 'text-slate-800'}`}>Settings</h1>
                    <p className={`${isDark ? 'text-slate-400' : 'text-slate-500'} text-sm mt-1`}>Manage your platform settings</p>
                </div>
                <button
                    onClick={handleSave}
                    disabled={saving}
                    className="flex items-center gap-2 px-6 py-2.5 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl font-medium hover:shadow-lg hover:shadow-indigo-500/30 transition-all disabled:opacity-50"
                >
                    {saving ? <FiCheck size={18} /> : <FiSave size={18} />}
                    {saving ? 'Saved!' : 'Save Changes'}
                </button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
                {/* Sidebar Tabs */}
                <div className={`${isDark ? 'bg-black/40 border-slate-800' : 'bg-white border-slate-200'} rounded-2xl border p-4 h-fit backdrop-blur-sm`}>
                    <nav className="space-y-1">
                        {tabs.map(tab => {
                            const Icon = tab.icon;
                            return (
                                <button
                                    key={tab.id}
                                    onClick={() => setActiveTab(tab.id)}
                                    className={`w-full flex items-center justify-between px-4 py-3 rounded-xl text-sm font-medium transition-all ${activeTab === tab.id
                                        ? (isDark ? 'bg-indigo-500/10 text-indigo-400' : 'bg-indigo-50 text-indigo-600')
                                        : (isDark ? 'text-slate-400 hover:bg-slate-900' : 'text-slate-600 hover:bg-slate-50')
                                        }`}
                                >
                                    <span className="flex items-center gap-3">
                                        <Icon size={18} />
                                        {tab.label}
                                    </span>
                                    <FiChevronRight size={16} className={activeTab === tab.id ? 'text-indigo-400' : 'text-slate-300'} />
                                </button>
                            );
                        })}
                    </nav>
                </div>

                {/* Content */}
                <div className={`${isDark ? 'bg-black/40 border-slate-800' : 'bg-white border-slate-200'} lg:col-span-3 rounded-2xl border p-6 backdrop-blur-sm`}>
                    {activeTab === 'general' && (
                        <div className="space-y-6">
                            <h3 className={`text-lg font-bold pb-4 border-b ${isDark ? 'text-white border-slate-800' : 'text-slate-800 border-slate-100'}`}>General Settings</h3>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                                <div>
                                    <label className={`block text-sm font-medium mb-2 ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>Site Name</label>
                                    <input
                                        type="text"
                                        value={settings.siteName}
                                        onChange={(e) => handleChange('siteName', e.target.value)}
                                        className={`w-full px-4 py-3 rounded-xl border outline-none transition-all ${isDark ? 'bg-slate-950 border-slate-800 text-white focus:border-indigo-500' : 'bg-white border-slate-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20'
                                            }`}
                                    />
                                </div>
                                <div>
                                    <label className={`block text-sm font-medium mb-2 ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>Site Email</label>
                                    <input
                                        type="email"
                                        value={settings.siteEmail}
                                        onChange={(e) => handleChange('siteEmail', e.target.value)}
                                        className={`w-full px-4 py-3 rounded-xl border outline-none transition-all ${isDark ? 'bg-slate-950 border-slate-800 text-white focus:border-indigo-500' : 'bg-white border-slate-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20'
                                            }`}
                                    />
                                </div>
                                <div>
                                    <label className={`block text-sm font-medium mb-2 ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>Currency</label>
                                    <select
                                        value={settings.currency}
                                        onChange={(e) => handleChange('currency', e.target.value)}
                                        className={`w-full px-4 py-3 rounded-xl border outline-none transition-all ${isDark ? 'bg-slate-950 border-slate-800 text-white focus:border-indigo-500' : 'bg-white border-slate-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20'
                                            }`}
                                    >
                                        <option value="BDT">BDT - Bangladeshi Taka</option>
                                        <option value="USD">USD - US Dollar</option>
                                        <option value="EUR">EUR - Euro</option>
                                    </select>
                                </div>
                                <div>
                                    <label className={`block text-sm font-medium mb-2 ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>Currency Symbol</label>
                                    <input
                                        type="text"
                                        value={settings.currencySymbol}
                                        onChange={(e) => handleChange('currencySymbol', e.target.value)}
                                        className={`w-full px-4 py-3 rounded-xl border outline-none transition-all ${isDark ? 'bg-slate-950 border-slate-800 text-white focus:border-indigo-500' : 'bg-white border-slate-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20'
                                            }`}
                                    />
                                </div>
                            </div>

                            <div className={`flex items-center justify-between p-4 rounded-xl border ${isDark ? 'bg-amber-500/5 border-amber-500/20' : 'bg-amber-50 border-amber-100'}`}>
                                <div>
                                    <p className={`font-semibold ${isDark ? 'text-amber-400' : 'text-slate-800'}`}>Maintenance Mode</p>
                                    <p className={`text-sm ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>Put your site in maintenance mode</p>
                                </div>
                                <button
                                    onClick={() => handleChange('maintenanceMode', !settings.maintenanceMode)}
                                    className={`w-14 h-8 rounded-full transition-all flex items-center p-1 ${settings.maintenanceMode ? 'bg-amber-500 justify-end' : 'bg-slate-300 justify-start'
                                        }`}
                                >
                                    <div className="w-6 h-6 bg-white rounded-full shadow-lg" />
                                </button>
                            </div>
                        </div>
                    )}

                    {activeTab === 'notifications' && (
                        <div className="space-y-6">
                            <h3 className={`text-lg font-bold pb-4 border-b ${isDark ? 'text-white border-slate-800' : 'text-slate-800 border-slate-100'}`}>Notification Settings</h3>

                            <div className="space-y-4">
                                <div className={`flex items-center justify-between p-4 rounded-xl border ${isDark ? 'bg-slate-950/50 border-slate-800' : 'bg-slate-50'}`}>
                                    <div>
                                        <p className={`font-semibold ${isDark ? 'text-slate-200' : 'text-slate-800'}`}>Email Notifications</p>
                                        <p className="text-sm text-slate-500">Receive email alerts for important updates</p>
                                    </div>
                                    <button
                                        onClick={() => handleChange('emailNotifications', !settings.emailNotifications)}
                                        className={`w-14 h-8 rounded-full transition-all flex items-center p-1 ${settings.emailNotifications ? 'bg-emerald-500 justify-end' : 'bg-slate-300 justify-start'
                                            }`}
                                    >
                                        <div className="w-6 h-6 bg-white rounded-full shadow-lg" />
                                    </button>
                                </div>
                                <div className={`flex items-center justify-between p-4 rounded-xl border ${isDark ? 'bg-slate-950/50 border-slate-800' : 'bg-slate-50'}`}>
                                    <div>
                                        <p className={`font-semibold ${isDark ? 'text-slate-200' : 'text-slate-800'}`}>Order Notifications</p>
                                        <p className="text-sm text-slate-500">Get notified when new orders come in</p>
                                    </div>
                                    <button
                                        onClick={() => handleChange('orderNotifications', !settings.orderNotifications)}
                                        className={`w-14 h-8 rounded-full transition-all flex items-center p-1 ${settings.orderNotifications ? 'bg-emerald-500 justify-end' : 'bg-slate-300 justify-start'
                                            }`}
                                    >
                                        <div className="w-6 h-6 bg-white rounded-full shadow-lg" />
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}

                    {activeTab === 'security' && (
                        <div className="space-y-8">
                            <h3 className={`text-lg font-bold pb-4 border-b ${isDark ? 'text-white border-slate-800' : 'text-slate-800 border-slate-100'}`}>Security Settings</h3>

                            {/* Change Password Form */}
                            <form onSubmit={handlePasswordUpdate} className={`rounded-2xl p-6 border ${isDark ? 'bg-slate-950/50 border-slate-800' : 'bg-slate-50/50 border-slate-100'}`}>
                                <div className="flex items-center gap-3 mb-6">
                                    <div className="p-2 bg-indigo-500/10 rounded-lg">
                                        <FiLock className="text-indigo-600" size={20} />
                                    </div>
                                    <div>
                                        <p className={`font-bold ${isDark ? 'text-slate-200' : 'text-slate-800'}`}>Update Password</p>
                                        <p className="text-xs text-slate-500">Ensure your account is using a long, random password to stay secure.</p>
                                    </div>
                                </div>

                                {passwordError && (
                                    <div className="mb-6 p-4 bg-red-50 text-red-600 rounded-xl text-sm font-medium border border-red-100">
                                        {passwordError}
                                    </div>
                                )}
                                {passwordSuccess && (
                                    <div className="mb-6 p-4 bg-emerald-50 text-emerald-600 rounded-xl text-sm font-medium border border-emerald-100">
                                        {passwordSuccess}
                                    </div>
                                )}

                                <div className="space-y-4 max-w-md">
                                    <div>
                                        <label className={`block text-sm font-medium mb-1.5 ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>Current Password</label>
                                        <input
                                            type="password"
                                            required
                                            value={passwordData.currentPassword}
                                            onChange={(e) => setPasswordData(prev => ({ ...prev, currentPassword: e.target.value }))}
                                            placeholder="��������"
                                            className={`w-full px-4 py-3 rounded-xl border outline-none transition-all ${isDark ? 'bg-slate-900 border-slate-800 text-white focus:border-indigo-500' : 'bg-white border-slate-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20'
                                                }`}
                                        />
                                    </div>
                                    <div>
                                        <label className={`block text-sm font-medium mb-1.5 ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>New Password</label>
                                        <input
                                            type="password"
                                            required
                                            value={passwordData.newPassword}
                                            onChange={(e) => setPasswordData(prev => ({ ...prev, newPassword: e.target.value }))}
                                            placeholder="��������"
                                            className={`w-full px-4 py-3 rounded-xl border outline-none transition-all ${isDark ? 'bg-slate-900 border-slate-800 text-white focus:border-indigo-500' : 'bg-white border-slate-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20'
                                                }`}
                                        />
                                    </div>
                                    <div>
                                        <label className={`block text-sm font-medium mb-1.5 ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>Confirm New Password</label>
                                        <input
                                            type="password"
                                            required
                                            value={passwordData.confirmNewPassword}
                                            onChange={(e) => setPasswordData(prev => ({ ...prev, confirmNewPassword: e.target.value }))}
                                            placeholder="��������"
                                            className={`w-full px-4 py-3 rounded-xl border outline-none transition-all ${isDark ? 'bg-slate-900 border-slate-800 text-white focus:border-indigo-500' : 'bg-white border-slate-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20'
                                                }`}
                                        />
                                    </div>
                                    <button
                                        type="submit"
                                        disabled={updatingPassword}
                                        className={`w-full sm:w-auto px-8 py-3 rounded-xl text-sm font-bold shadow-lg transition-all active:scale-95 disabled:opacity-50 flex items-center justify-center gap-2 ${isDark ? 'bg-white text-slate-900 hover:bg-slate-100' : 'bg-slate-800 hover:bg-slate-900 text-white'
                                            }`}
                                    >
                                        {updatingPassword ? (
                                            <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                        ) : (
                                            <FiSave size={16} />
                                        )}
                                        {updatingPassword ? 'Updating...' : 'Update Password'}
                                    </button>
                                </div>
                            </form>

                            <div className={`p-4 rounded-xl border flex items-center justify-between gap-4 mt-6 ${isDark ? 'bg-indigo-500/10 border-indigo-500/20' : 'bg-indigo-50/50 border-indigo-100'}`}>
                                <div className="flex items-center gap-4">
                                    <div className={`w-12 h-12 rounded-xl shadow-sm flex items-center justify-center ${isDark ? 'bg-slate-950 text-indigo-400' : 'bg-white text-indigo-600'}`}>
                                        <FiGlobe size={24} />
                                    </div>
                                    <div>
                                        <p className={`font-bold ${isDark ? 'text-slate-200' : 'text-slate-800'}`}>Two-Factor Authentication</p>
                                        <p className="text-xs text-slate-500">Add an extra layer of security to your account.</p>
                                    </div>
                                </div>
                                <button className="px-5 py-2.5 bg-indigo-600 text-white rounded-xl text-sm font-bold hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-600/20">
                                    Enable 2FA
                                </button>
                            </div>
                        </div>
                    )}

                    {activeTab === 'payment' && (
                        <div className="space-y-6">
                            <h3 className={`text-lg font-bold pb-4 border-b ${isDark ? 'text-white border-slate-800' : 'text-slate-800 border-slate-100'}`}>Payment Settings</h3>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div className={`p-4 rounded-xl border-2 ${isDark ? 'bg-slate-900 border-emerald-500/30' : 'bg-slate-50 border-emerald-200'}`}>
                                    <div className="flex items-center gap-3 mb-3">
                                        <div className="w-10 h-10 rounded-lg bg-pink-500 flex items-center justify-center text-white font-bold">bK</div>
                                        <div>
                                            <p className={`font-bold ${isDark ? 'text-slate-200' : 'text-slate-800'}`}>bKash</p>
                                            <p className="text-xs text-emerald-600 font-semibold">Active</p>
                                        </div>
                                    </div>
                                    <button className={`text-sm font-medium ${isDark ? 'text-indigo-400' : 'text-indigo-600'}`}>Configure →</button>
                                </div>
                                <div className={`p-4 rounded-xl border-2 border-dashed ${isDark ? 'bg-black/20 border-slate-800' : 'bg-slate-50 border-slate-200'}`}>
                                    <div className="flex items-center gap-3 mb-3">
                                        <div className="w-10 h-10 rounded-lg bg-orange-500 flex items-center justify-center text-white font-bold">N</div>
                                        <div>
                                            <p className={`font-bold ${isDark ? 'text-slate-200' : 'text-slate-800'}`}>Nagad</p>
                                            <p className="text-xs text-slate-400 font-semibold">Inactive</p>
                                        </div>
                                    </div>
                                    <button className={`text-sm font-medium ${isDark ? 'text-indigo-400' : 'text-indigo-600'}`}>Setup →</button>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

