'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import {
    FiPlay, FiArrowLeft, FiSave, FiClock,
    FiHelpCircle, FiFile, FiType, FiSettings,
    FiRefreshCw, FiFileText, FiLayers, FiBook,
} from 'react-icons/fi';

import QuestionBuilder from '@/components/Admin/lesson/QuestionBuilder';
import DocumentManager from '@/components/Admin/lesson/DocumentManager';
import TextContentManager from '@/components/Admin/lesson/TextContentManager';
import { API_BASE_URL } from '@/config/api';

export default function CreateLessonPage() {
    const router = useRouter();
    const [courses, setCourses] = useState([]);
    const [loading, setLoading] = useState(false);
    const [activeTab, setActiveTab] = useState('video');
    const [formData, setFormData] = useState({
        title: '',
        titleBn: '',
        description: '',
        descriptionBn: '',
        course: '',
        module: '',
        lessonType: 'video',
        videoUrl: '',
        videoDuration: 0,
        videoProvider: 'youtube',
        videoThumbnail: '',
        textContent: '',
        textContentBn: '',
        textBlocks: [],
        documents: [],
        questions: [],
        quizSettings: {
            passingScore: 70,
            maxAttempts: 0,
            showCorrectAnswers: true,
            shuffleQuestions: false,
            timeLimit: 0,
        },
        order: 1,
        isPublished: false,
        isFree: false,
    });
    const [modules, setModules] = useState([]);
    const [fetchingModules, setFetchingModules] = useState(false);

    useEffect(() => {
        const fetchCourses = async () => {
            try {
                const token = localStorage.getItem('token');
                const res = await fetch(`${API_BASE_URL}/courses`, {
                    headers: { 'Authorization': `Bearer ${token}` }
                });
                const data = await res.json();
                setCourses(data.data || []);
            } catch (err) {
                console.error('Error fetching courses:', err);
            }
        };
        fetchCourses();
    }, []);

    const fetchModules = async (courseId) => {
        if (!courseId) { setModules([]); return; }
        setFetchingModules(true);
        try {
            const token = localStorage.getItem('token');
            const res = await fetch(`${API_BASE_URL}/modules/course/${courseId}?includeUnpublished=true`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            const data = await res.json();
            setModules(data.data || []);
        } catch (err) {
            console.error('Error fetching modules:', err);
        } finally {
            setFetchingModules(false);
        }
    };

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : (name === 'videoDuration' || name === 'order' ? Number(value) : value)
        }));
        if (name === 'course') {
            fetchModules(value);
            setFormData(prev => ({ ...prev, course: value, module: '' }));
        }
    };

    const handleNestedChange = (field, value) => {
        setFormData(prev => ({ ...prev, [field]: value }));
    };

    const handleQuizSettingsChange = (field, value) => {
        setFormData(prev => ({
            ...prev,
            quizSettings: { ...prev.quizSettings, [field]: value }
        }));
    };

    const handleSubmit = async (e) => {
        if (e) e.preventDefault();
        setLoading(true);
        try {
            const token = localStorage.getItem('token');
            const payload = { ...formData };
            if (!payload.videoUrl) delete payload.videoUrl;
            if (!payload.textContent) delete payload.textContent;
            if (payload.documents?.length === 0) delete payload.documents;
            if (payload.questions?.length === 0) delete payload.questions;
            if (payload.textBlocks?.length === 0) delete payload.textBlocks;

            const res = await fetch(`${API_BASE_URL}/lessons`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(payload)
            });

            const result = await res.json();

            if (res.ok) {
                alert('Lesson created successfully!');
                router.push('/dashboard/admin/lesson');
            } else {
                const errorMsg = result.errorMessages
                    ? result.errorMessages.map(err => `${err.path.split('.').pop()}: ${err.message}`).join('\n')
                    : result.message;
                alert(`Error:\n\n${errorMsg}`);
            }
        } catch (err) {
            console.error('Create error:', err);
            alert('Network error!');
        } finally {
            setLoading(false);
        }
    };

    const inputClass = "w-full px-4 py-2.5 rounded-lg border border-gray-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 outline-none text-sm transition-all bg-white text-gray-700 placeholder:text-gray-400";
    const labelClass = "block text-sm font-medium text-gray-700 mb-1.5";

    const tabs = [
        { id: 'video', label: 'Video', icon: FiPlay },
        { id: 'text', label: 'Text', icon: FiType },
        { id: 'documents', label: 'Documents', icon: FiFile, badge: formData.documents?.length },
        { id: 'questions', label: 'Quiz', icon: FiHelpCircle, badge: formData.questions?.length },
        { id: 'settings', label: 'Settings', icon: FiSettings },
    ];

    return (
        <div className="min-h-screen bg-gray-50 p-4 md:p-6">
            <div className="max-w-4xl mx-auto space-y-5">

                {/* Header */}
                <div className="flex items-center justify-between gap-4">
                    <div className="flex items-center gap-3">
                        <Link
                            href="/dashboard/admin/lesson"
                            className="p-2 bg-white border border-gray-200 rounded-lg text-gray-500 hover:text-gray-800 hover:border-gray-300 shadow-sm transition-all"
                        >
                            <FiArrowLeft size={18} />
                        </Link>
                        <div>
                            <h1 className="text-xl font-semibold text-gray-900">Create Lesson</h1>
                            <p className="text-sm text-gray-500 mt-0.5">Add a new lesson to your course</p>
                        </div>
                    </div>
                    <button
                        onClick={handleSubmit}
                        disabled={loading}
                        className="flex items-center gap-2 px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-sm font-medium transition-colors shadow-sm disabled:opacity-60"
                    >
                        {loading ? <FiRefreshCw size={15} className="animate-spin" /> : <FiSave size={15} />}
                        {loading ? 'Saving...' : 'Save Lesson'}
                    </button>
                </div>

                {/* Basic Info */}
                <div className="bg-white border border-gray-200 rounded-xl p-5 space-y-4">
                    <div className="flex items-center gap-3 pb-3 border-b border-gray-100">
                        <div className="w-8 h-8 rounded-lg bg-indigo-50 flex items-center justify-center">
                            <FiFileText className="text-indigo-600" size={16} />
                        </div>
                        <h2 className="font-semibold text-gray-800">Basic Information</h2>
                    </div>

                    {/* Titles */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className={labelClass}>Lesson Title (English) *</label>
                            <input
                                type="text"
                                name="title"
                                value={formData.title}
                                onChange={handleChange}
                                required
                                placeholder="e.g. Introduction to React"
                                className={inputClass}
                            />
                        </div>
                        <div>
                            <label className={labelClass}>Lesson Title (Bengali)</label>
                            <input
                                type="text"
                                name="titleBn"
                                value={formData.titleBn}
                                onChange={handleChange}
                                placeholder="বাংলায় শিরোনাম (ঐচ্ছিক)"
                                className={inputClass}
                            />
                        </div>
                    </div>

                    {/* Descriptions */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className={labelClass}>Description (English)</label>
                            <textarea
                                name="description"
                                value={formData.description}
                                onChange={handleChange}
                                rows={3}
                                placeholder="Brief description of the lesson..."
                                className={`${inputClass} resize-none`}
                            />
                        </div>
                        <div>
                            <label className={labelClass}>Description (Bengali)</label>
                            <textarea
                                name="descriptionBn"
                                value={formData.descriptionBn}
                                onChange={handleChange}
                                rows={3}
                                placeholder="পাঠের সংক্ষিপ্ত বিবরণ..."
                                className={`${inputClass} resize-none`}
                            />
                        </div>
                    </div>

                    {/* Course & Module */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className={labelClass}>
                                <FiBook className="inline mr-1.5 text-gray-400" size={13} />
                                Select Course *
                            </label>
                            <select
                                name="course"
                                value={formData.course}
                                onChange={handleChange}
                                required
                                className={inputClass}
                            >
                                <option value="">Choose a course</option>
                                {courses.map(course => (
                                    <option key={course._id} value={course._id}>{course.title}</option>
                                ))}
                            </select>
                        </div>
                        <div>
                            <label className={labelClass}>
                                <FiLayers className="inline mr-1.5 text-gray-400" size={13} />
                                Select Module *
                            </label>
                            <select
                                name="module"
                                value={formData.module}
                                onChange={handleChange}
                                required
                                disabled={!formData.course || fetchingModules}
                                className={`${inputClass} disabled:bg-gray-50 disabled:text-gray-400`}
                            >
                                <option value="">
                                    {fetchingModules ? 'Loading modules...' : (formData.course ? 'Choose a module' : 'Select course first')}
                                </option>
                                {modules.map(mod => (
                                    <option key={mod._id} value={mod._id}>{mod.order}. {mod.title}</option>
                                ))}
                            </select>
                        </div>
                    </div>

                    {/* Lesson Type + Order + Status */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div>
                            <label className={labelClass}>Lesson Type</label>
                            <select
                                name="lessonType"
                                value={formData.lessonType}
                                onChange={handleChange}
                                className={inputClass}
                            >
                                <option value="video">Video</option>
                                <option value="text">Text</option>
                                <option value="quiz">Quiz</option>
                                <option value="mixed">Mixed</option>
                            </select>
                        </div>
                        <div>
                            <label className={labelClass}>Order in Module</label>
                            <input
                                type="number"
                                name="order"
                                value={formData.order}
                                onChange={handleChange}
                                min="1"
                                className={inputClass}
                            />
                        </div>
                        <div>
                            <label className={labelClass}>Status</label>
                            <div className="flex gap-2">
                                <button
                                    type="button"
                                    onClick={() => setFormData(prev => ({ ...prev, isPublished: true }))}
                                    className={`flex-1 py-2.5 rounded-lg border text-sm font-medium transition-all ${formData.isPublished ? 'bg-emerald-500 border-emerald-500 text-white' : 'border-gray-200 text-gray-500 hover:border-gray-300'}`}
                                >
                                    Published
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setFormData(prev => ({ ...prev, isPublished: false }))}
                                    className={`flex-1 py-2.5 rounded-lg border text-sm font-medium transition-all ${!formData.isPublished ? 'bg-amber-500 border-amber-500 text-white' : 'border-gray-200 text-gray-500 hover:border-gray-300'}`}
                                >
                                    Draft
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Free Preview */}
                    <div className="flex items-center gap-2 pt-1">
                        <input
                            type="checkbox"
                            id="isFree"
                            name="isFree"
                            checked={formData.isFree}
                            onChange={handleChange}
                            className="w-4 h-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                        />
                        <label htmlFor="isFree" className="text-sm text-gray-600 cursor-pointer">
                            Free Preview — Allow students to watch without enrollment
                        </label>
                    </div>
                </div>

                {/* Content Tabs */}
                <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
                    {/* Tab Navigation */}
                    <div className="flex border-b border-gray-200 overflow-x-auto">
                        {tabs.map(tab => (
                            <button
                                key={tab.id}
                                type="button"
                                onClick={() => setActiveTab(tab.id)}
                                className={`flex items-center gap-1.5 px-5 py-3.5 font-medium text-sm border-b-2 transition-all whitespace-nowrap ${activeTab === tab.id
                                    ? 'border-indigo-600 text-indigo-600 bg-indigo-50/50'
                                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:bg-gray-50'
                                    }`}
                            >
                                <tab.icon size={14} />
                                {tab.label}
                                {tab.badge > 0 && (
                                    <span className="ml-1 px-1.5 py-0.5 rounded-full text-xs font-semibold bg-indigo-100 text-indigo-600">
                                        {tab.badge}
                                    </span>
                                )}
                            </button>
                        ))}
                    </div>

                    {/* Tab Content */}
                    <div className="p-5">

                        {/* Video Tab */}
                        {activeTab === 'video' && (
                            <div className="space-y-4">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <label className={labelClass}>
                                            <FiPlay className="inline mr-1.5 text-gray-400" size={13} />
                                            Video URL
                                        </label>
                                        <input
                                            type="url"
                                            name="videoUrl"
                                            value={formData.videoUrl}
                                            onChange={handleChange}
                                            placeholder="https://youtube.com/watch?v=..."
                                            className={inputClass}
                                        />
                                    </div>
                                    <div>
                                        <label className={labelClass}>Video Provider</label>
                                        <select
                                            name="videoProvider"
                                            value={formData.videoProvider}
                                            onChange={handleChange}
                                            className={inputClass}
                                        >
                                            <option value="youtube">YouTube</option>
                                            <option value="vimeo">Vimeo</option>
                                            <option value="bunny">Bunny Stream</option>
                                            <option value="cloudinary">Cloudinary</option>
                                            <option value="custom">Custom</option>
                                        </select>
                                    </div>
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <label className={labelClass}>
                                            <FiClock className="inline mr-1.5 text-gray-400" size={13} />
                                            Duration (seconds)
                                        </label>
                                        <input
                                            type="number"
                                            name="videoDuration"
                                            value={formData.videoDuration}
                                            onChange={handleChange}
                                            placeholder="e.g. 900 for 15 minutes"
                                            className={inputClass}
                                        />
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Text Content Tab */}
                        {activeTab === 'text' && (
                            <TextContentManager
                                textBlocks={formData.textBlocks}
                                mainContent={formData.textContent}
                                mainContentBn={formData.textContentBn}
                                onChangeBlocks={(blocks) => handleNestedChange('textBlocks', blocks)}
                                onChangeMain={handleNestedChange}
                            />
                        )}

                        {/* Documents Tab */}
                        {activeTab === 'documents' && (
                            <DocumentManager
                                documents={formData.documents}
                                onChange={(docs) => handleNestedChange('documents', docs)}
                            />
                        )}

                        {/* Questions Tab */}
                        {activeTab === 'questions' && (
                            <div className="space-y-4">
                                <QuestionBuilder
                                    questions={formData.questions}
                                    onChange={(qs) => handleNestedChange('questions', qs)}
                                />

                                {formData.questions?.length > 0 && (
                                    <div className="mt-4 p-4 bg-indigo-50 rounded-xl border border-indigo-100 space-y-3">
                                        <h4 className="font-semibold text-gray-800 text-sm flex items-center gap-2">
                                            <FiSettings className="text-indigo-600" size={15} />
                                            Quiz Settings
                                        </h4>
                                        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                                            <div>
                                                <label className="text-xs font-medium text-gray-500 mb-1 block">Passing Score (%)</label>
                                                <input
                                                    type="number"
                                                    value={formData.quizSettings.passingScore}
                                                    onChange={(e) => handleQuizSettingsChange('passingScore', Number(e.target.value))}
                                                    min="0" max="100"
                                                    className={inputClass}
                                                />
                                            </div>
                                            <div>
                                                <label className="text-xs font-medium text-gray-500 mb-1 block">Max Attempts</label>
                                                <input
                                                    type="number"
                                                    value={formData.quizSettings.maxAttempts}
                                                    onChange={(e) => handleQuizSettingsChange('maxAttempts', Number(e.target.value))}
                                                    min="0"
                                                    className={inputClass}
                                                />
                                            </div>
                                            <div>
                                                <label className="text-xs font-medium text-gray-500 mb-1 block">Time Limit (min)</label>
                                                <input
                                                    type="number"
                                                    value={formData.quizSettings.timeLimit}
                                                    onChange={(e) => handleQuizSettingsChange('timeLimit', Number(e.target.value))}
                                                    min="0"
                                                    className={inputClass}
                                                />
                                            </div>
                                            <div className="flex flex-col justify-center gap-2">
                                                <label className="flex items-center gap-2 text-xs text-gray-600 cursor-pointer">
                                                    <input
                                                        type="checkbox"
                                                        checked={formData.quizSettings.showCorrectAnswers}
                                                        onChange={(e) => handleQuizSettingsChange('showCorrectAnswers', e.target.checked)}
                                                        className="w-3.5 h-3.5 rounded border-gray-300 text-indigo-600"
                                                    />
                                                    Show Correct Answers
                                                </label>
                                                <label className="flex items-center gap-2 text-xs text-gray-600 cursor-pointer">
                                                    <input
                                                        type="checkbox"
                                                        checked={formData.quizSettings.shuffleQuestions}
                                                        onChange={(e) => handleQuizSettingsChange('shuffleQuestions', e.target.checked)}
                                                        className="w-3.5 h-3.5 rounded border-gray-300 text-indigo-600"
                                                    />
                                                    Shuffle Questions
                                                </label>
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>
                        )}

                        {/* Settings Tab */}
                        {activeTab === 'settings' && (
                            <div className="space-y-4">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                    <label className="flex items-center gap-3 cursor-pointer p-4 bg-gray-50 rounded-xl border border-gray-200 hover:border-emerald-300 transition-colors">
                                        <input
                                            type="checkbox"
                                            name="isPublished"
                                            checked={formData.isPublished}
                                            onChange={handleChange}
                                            className="w-4 h-4 rounded border-gray-300 text-emerald-600 focus:ring-emerald-500"
                                        />
                                        <div>
                                            <span className="text-sm font-medium text-gray-700 block">Publish Lesson</span>
                                            <span className="text-xs text-gray-500">Make this lesson visible to students</span>
                                        </div>
                                    </label>
                                    <label className="flex items-center gap-3 cursor-pointer p-4 bg-gray-50 rounded-xl border border-gray-200 hover:border-indigo-300 transition-colors">
                                        <input
                                            type="checkbox"
                                            name="isFree"
                                            checked={formData.isFree}
                                            onChange={handleChange}
                                            className="w-4 h-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                                        />
                                        <div>
                                            <span className="text-sm font-medium text-gray-700 block">Free Preview</span>
                                            <span className="text-xs text-gray-500">Allow access without enrollment</span>
                                        </div>
                                    </label>
                                </div>

                                {/* Content Summary */}
                                <div className="p-4 bg-gray-50 rounded-xl border border-gray-200">
                                    <h4 className="font-semibold text-gray-800 text-sm mb-3">Content Summary</h4>
                                    <div className="grid grid-cols-4 gap-3 text-center">
                                        <div className="p-3 bg-white rounded-lg border border-gray-100">
                                            <p className="text-xl font-bold text-indigo-600">{formData.videoUrl ? '1' : '0'}</p>
                                            <p className="text-xs text-gray-500 mt-0.5">Video</p>
                                        </div>
                                        <div className="p-3 bg-white rounded-lg border border-gray-100">
                                            <p className="text-xl font-bold text-emerald-600">{formData.documents?.length || 0}</p>
                                            <p className="text-xs text-gray-500 mt-0.5">Documents</p>
                                        </div>
                                        <div className="p-3 bg-white rounded-lg border border-gray-100">
                                            <p className="text-xl font-bold text-amber-600">{formData.questions?.length || 0}</p>
                                            <p className="text-xs text-gray-500 mt-0.5">Questions</p>
                                        </div>
                                        <div className="p-3 bg-white rounded-lg border border-gray-100">
                                            <p className="text-xl font-bold text-rose-600">{formData.textBlocks?.length || 0}</p>
                                            <p className="text-xs text-gray-500 mt-0.5">Text Blocks</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                {/* Footer Actions */}
                <div className="flex items-center justify-end gap-3 py-2">
                    <button
                        type="button"
                        onClick={() => router.back()}
                        className="px-5 py-2.5 rounded-lg border border-gray-200 text-gray-600 hover:text-gray-800 hover:border-gray-300 font-medium text-sm transition-all bg-white"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={handleSubmit}
                        disabled={loading}
                        className="flex items-center gap-2 px-6 py-2.5 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white font-medium text-sm transition-colors shadow-sm disabled:opacity-60"
                    >
                        {loading ? <FiRefreshCw size={15} className="animate-spin" /> : <FiSave size={15} />}
                        {loading ? 'Saving...' : 'Save Lesson'}
                    </button>
                </div>

            </div>
        </div>
    );
}
