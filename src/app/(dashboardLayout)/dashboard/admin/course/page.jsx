'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import {
  FiEdit2, FiTrash2, FiPlus, FiSearch, FiBook, FiStar,
  FiGrid, FiList, FiUsers, FiLayers, FiRefreshCw, FiCheckCircle, FiClock,
  FiPlay, FiX
} from 'react-icons/fi';
import { useTheme } from '@/providers/ThemeProvider';
import { API_BASE_URL } from '@/config/api';

export default function CoursesPage() {
  const { isDark } = useTheme();
  const [courses, setCourses] = useState([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState('grid');

  // Modal state
  const [modalCourse, setModalCourse] = useState(null);

  // Curriculum data cache: { courseId: { loadingModules, modules: [{...mod, lessons:[], loadingLessons}] } }
  const [curriculumData, setCurriculumData] = useState({});

  const loadCourses = async () => {
    const token = localStorage.getItem('token');
    setLoading(true);
    try {
      const res = await fetch(`${API_BASE_URL}/courses`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await res.json();
      setCourses(data.data || []);
    } catch (error) {
      console.error("Error fetching courses:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCourses();
  }, []);

  const handleDelete = async (id) => {
    if (!confirm('Are you sure you want to delete this course?')) return;
    const token = localStorage.getItem('token');
    try {
      const res = await fetch(`${API_BASE_URL}/courses/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (res.ok) {
        setCourses((prev) => prev.filter((course) => course._id !== id));
        setCurriculumData(prev => { const n = { ...prev }; delete n[id]; return n; });
      } else {
        alert('Failed to delete course');
      }
    } catch {
      alert('Network error!');
    }
  };

  const fetchLessonsForModule = async (courseId, moduleId) => {
    setCurriculumData(prev => ({
      ...prev,
      [courseId]: {
        ...prev[courseId],
        modules: prev[courseId].modules.map(m =>
          m._id === moduleId ? { ...m, loadingLessons: true } : m
        )
      }
    }));
    const token = localStorage.getItem('token');
    try {
      const res = await fetch(`${API_BASE_URL}/lessons?module=${moduleId}`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await res.json();
      const lessons = data.data || [];
      setCurriculumData(prev => ({
        ...prev,
        [courseId]: {
          ...prev[courseId],
          modules: prev[courseId].modules.map(m =>
            m._id === moduleId ? { ...m, lessons, loadingLessons: false } : m
          )
        }
      }));
    } catch {
      setCurriculumData(prev => ({
        ...prev,
        [courseId]: {
          ...prev[courseId],
          modules: prev[courseId].modules.map(m =>
            m._id === moduleId ? { ...m, lessons: [], loadingLessons: false } : m
          )
        }
      }));
    }
  };

  const openCurriculumModal = async (course) => {
    setModalCourse(course);

    // Use cached data if available
    if (curriculumData[course._id]?.modules) return;

    // Fetch modules
    setCurriculumData(prev => ({ ...prev, [course._id]: { loadingModules: true, modules: [] } }));
    const token = localStorage.getItem('token');
    try {
      const res = await fetch(`${API_BASE_URL}/modules/course/${course._id}?includeUnpublished=true`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await res.json();
      const modules = (data.data || []).map(m => ({ ...m, lessons: null, loadingLessons: false }));

      setCurriculumData(prev => ({
        ...prev,
        [course._id]: { loadingModules: false, modules }
      }));

      // Fetch lessons for each module in parallel
      modules.forEach(mod => fetchLessonsForModule(course._id, mod._id));
    } catch {
      setCurriculumData(prev => ({ ...prev, [course._id]: { loadingModules: false, modules: [] } }));
    }
  };

  const closeCurriculumModal = () => setModalCourse(null);

  const filtered = courses.filter((c) =>
    c.title?.toLowerCase().includes(search.toLowerCase()) ||
    c.instructorName?.toLowerCase().includes(search.toLowerCase())
  );

  const stats = {
    total: courses.length,
    published: courses.filter(c => c.status === 'published').length,
    draft: courses.filter(c => c.status === 'draft').length,
    totalEnrollments: courses.reduce((sum, c) => sum + (c.totalEnrollments || 0), 0),
  };

  // Curriculum Modal
  const CurriculumModal = () => {
    if (!modalCourse) return null;
    const state = curriculumData[modalCourse._id];

    const totalLessons = state?.modules?.reduce((sum, m) => sum + (m.lessons?.length || 0), 0) || 0;

    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        {/* Backdrop */}
        <div
          className="absolute inset-0 bg-black/70 backdrop-blur-sm"
          onClick={closeCurriculumModal}
        />

        {/* Modal Card */}
        <div className={`relative w-full max-w-2xl max-h-[88vh] flex flex-col rounded-2xl shadow-2xl overflow-hidden ${isDark ? 'bg-slate-900 border border-slate-700' : 'bg-white border border-gray-200'}`}>

          {/* Header */}
          <div className={`flex items-center gap-4 px-6 py-4 shrink-0 ${isDark ? 'bg-slate-800 border-b border-slate-700' : 'bg-gray-50 border-b border-gray-200'}`}>
            <div className="w-12 h-12 rounded-xl overflow-hidden shrink-0 bg-gray-100">
              {modalCourse.thumbnail ? (
                <img src={modalCourse.thumbnail} alt="" className="w-full h-full object-cover" />
              ) : (
                <div className={`w-full h-full flex items-center justify-center ${isDark ? 'bg-slate-700' : 'bg-amber-100'}`}>
                  <FiBook className={isDark ? 'text-slate-400' : 'text-amber-500'} size={20} />
                </div>
              )}
            </div>
            <div className="flex-1 min-w-0">
              <h2 className={`text-base font-semibold truncate ${isDark ? 'text-white' : 'text-gray-900'}`}>
                {modalCourse.title}
              </h2>
              <div className="flex items-center gap-2 mt-0.5">
                <span className={`text-xs ${isDark ? 'text-slate-400' : 'text-gray-500'}`}>Curriculum</span>
                {state?.modules && (
                  <>
                    <span className={`text-xs ${isDark ? 'text-slate-600' : 'text-gray-300'}`}>•</span>
                    <span className="text-xs text-indigo-500 font-medium">{state.modules.length} Modules</span>
                    <span className={`text-xs ${isDark ? 'text-slate-600' : 'text-gray-300'}`}>•</span>
                    <span className="text-xs text-rose-500 font-medium">{totalLessons} Lessons</span>
                  </>
                )}
              </div>
            </div>
            <button
              onClick={closeCurriculumModal}
              className={`p-2 rounded-xl transition-colors shrink-0 ${isDark ? 'hover:bg-slate-700 text-slate-400' : 'hover:bg-gray-200 text-gray-500'}`}
            >
              <FiX size={18} />
            </button>
          </div>

          {/* Body */}
          <div className="flex-1 overflow-y-auto px-6 py-5">
            {state?.loadingModules ? (
              <div className="flex flex-col items-center justify-center py-16 gap-3">
                <FiRefreshCw size={28} className="animate-spin text-indigo-500" />
                <p className={`text-sm ${isDark ? 'text-slate-400' : 'text-gray-500'}`}>Loading curriculum...</p>
              </div>
            ) : !state?.modules?.length ? (
              <div className="text-center py-16">
                <div className={`w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4 ${isDark ? 'bg-slate-800' : 'bg-gray-100'}`}>
                  <FiLayers size={28} className={isDark ? 'text-slate-500' : 'text-gray-300'} />
                </div>
                <p className={`text-sm font-medium ${isDark ? 'text-slate-300' : 'text-gray-600'}`}>No modules found</p>
                <p className={`text-xs mt-1 ${isDark ? 'text-slate-500' : 'text-gray-400'}`}>This course has no curriculum yet.</p>
              </div>
            ) : (
              <div className="space-y-4">
                {state.modules.map((mod) => (
                  <div
                    key={mod._id}
                    className={`rounded-xl overflow-hidden border ${isDark ? 'border-slate-700 bg-slate-800/50' : 'border-gray-200 bg-white'}`}
                  >
                    {/* Module header */}
                    <div className={`flex items-center gap-3 px-4 py-3 ${isDark ? 'bg-slate-800 border-b border-slate-700' : 'bg-indigo-50/70 border-b border-indigo-100'}`}>
                      <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center text-white text-xs font-bold shrink-0">
                        {mod.order}
                      </div>
                      <FiLayers size={14} className="text-indigo-500 shrink-0" />
                      <span className={`flex-1 text-sm font-semibold ${isDark ? 'text-white' : 'text-gray-800'}`}>{mod.title}</span>
                      {mod.lessons && (
                        <span className={`text-xs mr-2 ${isDark ? 'text-slate-400' : 'text-gray-500'}`}>
                          {mod.lessons.length} lessons
                        </span>
                      )}
                      <span className={`text-xs px-2.5 py-0.5 rounded-full font-medium ${mod.isPublished !== false
                        ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-500/20 dark:text-emerald-400'
                        : 'bg-amber-100 text-amber-700 dark:bg-amber-500/20 dark:text-amber-400'}`}>
                        {mod.isPublished !== false ? 'Published' : 'Draft'}
                      </span>
                    </div>

                    {/* Lessons */}
                    {mod.loadingLessons ? (
                      <div className="flex items-center gap-2 px-4 py-4 text-xs text-gray-400">
                        <FiRefreshCw size={11} className="animate-spin text-indigo-400" />
                        Loading lessons...
                      </div>
                    ) : mod.lessons === null ? (
                      <div className="px-4 py-3 text-xs text-gray-400">Fetching...</div>
                    ) : mod.lessons.length === 0 ? (
                      <div className={`flex items-center gap-2 px-4 py-4 text-sm ${isDark ? 'text-slate-500' : 'text-gray-400'}`}>
                        <FiPlay size={12} className="text-gray-300" />
                        No lessons in this module yet.
                      </div>
                    ) : (
                      <div className={`divide-y ${isDark ? 'divide-slate-700/60' : 'divide-gray-100'}`}>
                        {mod.lessons.map((lesson, idx) => (
                          <div
                            key={lesson._id}
                            className={`flex items-center gap-3 px-4 py-3 transition-colors ${isDark ? 'hover:bg-slate-800' : 'hover:bg-gray-50'}`}
                          >
                            {/* Order */}
                            <span className={`w-6 h-6 rounded-md flex items-center justify-center text-[10px] font-semibold shrink-0 ${isDark ? 'bg-slate-700 text-slate-400' : 'bg-gray-100 text-gray-500'}`}>
                              {lesson.order || idx + 1}
                            </span>
                            {/* Play icon */}
                            <div className="w-7 h-7 rounded-lg bg-rose-50 dark:bg-rose-500/10 flex items-center justify-center shrink-0">
                              <FiPlay size={11} className="text-rose-500" />
                            </div>
                            {/* Title */}
                            <span className={`flex-1 text-sm truncate ${isDark ? 'text-slate-300' : 'text-gray-700'}`}>{lesson.title}</span>
                            {/* Badges */}
                            {lesson.isFree && (
                              <span className="px-2 py-0.5 bg-blue-100 text-blue-600 dark:bg-blue-500/20 dark:text-blue-400 rounded-full text-[10px] font-medium shrink-0">Free</span>
                            )}
                            <span className={`px-2 py-0.5 rounded-full text-[10px] font-medium shrink-0 ${lesson.isPublished
                              ? 'bg-emerald-100 text-emerald-600 dark:bg-emerald-500/20 dark:text-emerald-400'
                              : 'bg-gray-100 text-gray-500 dark:bg-slate-700 dark:text-gray-400'}`}>
                              {lesson.isPublished ? 'Live' : 'Draft'}
                            </span>
                            {/* Edit */}
                            <Link
                              href={`/dashboard/admin/lesson/edit/${lesson._id}`}
                              onClick={closeCurriculumModal}
                              className={`p-1.5 rounded-lg transition-colors shrink-0 ${isDark ? 'hover:bg-slate-700 text-slate-500 hover:text-indigo-400' : 'hover:bg-indigo-50 text-gray-400 hover:text-indigo-600'}`}
                              title="Edit lesson"
                            >
                              <FiEdit2 size={12} />
                            </Link>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Footer */}
          <div className={`px-6 py-3 flex items-center justify-between shrink-0 ${isDark ? 'border-t border-slate-700 bg-slate-800/50' : 'border-t border-gray-200 bg-gray-50'}`}>
            <p className={`text-xs ${isDark ? 'text-slate-500' : 'text-gray-400'}`}>
              {state?.modules?.length || 0} modules · {totalLessons} lessons total
            </p>
            <Link
              href={`/dashboard/admin/course/modules/${modalCourse._id}`}
              onClick={closeCurriculumModal}
              className="text-xs text-indigo-600 hover:text-indigo-700 font-medium flex items-center gap-1 transition-colors"
            >
              Manage Curriculum →
            </Link>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-5 pb-8">
      {/* Curriculum Modal */}
      <CurriculumModal />

      {/* Header */}
      <div className={`flex flex-col md:flex-row md:items-center justify-between gap-4 p-4 rounded-md border ${isDark ? 'bg-slate-800 border-slate-700' : 'bg-white border-gray-200'}`}>
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-md bg-amber-500 flex items-center justify-center">
            <FiBook className="text-white" size={18} />
          </div>
          <div>
            <h1 className={`text-lg font-semibold ${isDark ? 'text-white' : 'text-gray-800'}`}>Courses</h1>
            <p className={`text-sm font-normal ${isDark ? 'text-slate-400' : 'text-gray-500'}`}>Manage all courses</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={loadCourses}
            disabled={loading}
            className={`flex items-center gap-2 px-3 py-2 rounded-md text-sm font-normal border transition-all ${isDark
              ? 'bg-slate-700 border-slate-600 text-slate-300 hover:bg-slate-600'
              : 'bg-white border-gray-200 hover:bg-gray-50 text-gray-600'
              }`}
          >
            <FiRefreshCw size={14} className={loading ? 'animate-spin' : ''} />
            Refresh
          </button>
          <Link href="/dashboard/admin/course/create">
            <button className="flex items-center gap-2 px-4 py-2 bg-amber-500 hover:bg-amber-600 text-white rounded-md text-sm font-normal transition-all">
              <FiPlus size={14} />
              Add Course
            </button>
          </Link>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className={`p-4 rounded-md border ${isDark ? 'bg-slate-800 border-slate-700' : 'bg-white border-gray-200'}`}>
          <div className="flex items-center justify-between mb-2">
            <div className="w-9 h-9 bg-amber-500 rounded-md flex items-center justify-center">
              <FiBook className="text-white" size={16} />
            </div>
            <span className={`text-xl font-semibold ${isDark ? 'text-white' : 'text-gray-800'}`}>{stats.total}</span>
          </div>
          <p className={`text-xs font-normal ${isDark ? 'text-slate-400' : 'text-gray-500'}`}>Total Courses</p>
        </div>
        <div className={`p-4 rounded-md border ${isDark ? 'bg-slate-800 border-slate-700' : 'bg-white border-gray-200'}`}>
          <div className="flex items-center justify-between mb-2">
            <div className="w-9 h-9 bg-emerald-600 rounded-md flex items-center justify-center">
              <FiCheckCircle className="text-white" size={16} />
            </div>
            <span className={`text-xl font-semibold ${isDark ? 'text-white' : 'text-gray-800'}`}>{stats.published}</span>
          </div>
          <p className={`text-xs font-normal ${isDark ? 'text-slate-400' : 'text-gray-500'}`}>Published</p>
        </div>
        <div className={`p-4 rounded-md border ${isDark ? 'bg-slate-800 border-slate-700' : 'bg-white border-gray-200'}`}>
          <div className="flex items-center justify-between mb-2">
            <div className="w-9 h-9 bg-blue-600 rounded-md flex items-center justify-center">
              <FiUsers className="text-white" size={16} />
            </div>
            <span className={`text-xl font-semibold ${isDark ? 'text-white' : 'text-gray-800'}`}>{stats.totalEnrollments.toLocaleString()}</span>
          </div>
          <p className={`text-xs font-normal ${isDark ? 'text-slate-400' : 'text-gray-500'}`}>Enrollments</p>
        </div>
        <div className={`p-4 rounded-md border ${isDark ? 'bg-slate-800 border-slate-700' : 'bg-white border-gray-200'}`}>
          <div className="flex items-center justify-between mb-2">
            <div className="w-9 h-9 bg-gray-500 rounded-md flex items-center justify-center">
              <FiClock className="text-white" size={16} />
            </div>
            <span className={`text-xl font-semibold ${isDark ? 'text-white' : 'text-gray-800'}`}>{stats.draft}</span>
          </div>
          <p className={`text-xs font-normal ${isDark ? 'text-slate-400' : 'text-gray-500'}`}>Drafts</p>
        </div>
      </div>

      {/* Search & View Toggle */}
      <div className={`flex flex-col md:flex-row md:items-center gap-3 p-4 rounded-md border ${isDark ? 'bg-slate-800 border-slate-700' : 'bg-white border-gray-200'}`}>
        <div className="relative flex-1">
          <FiSearch className={`absolute left-3 top-1/2 -translate-y-1/2 ${isDark ? 'text-slate-500' : 'text-gray-400'}`} size={16} />
          <input
            placeholder="Search courses..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className={`w-full pl-9 pr-4 py-2 rounded-md border text-sm font-normal ${isDark
              ? 'bg-slate-700 border-slate-600 text-white placeholder-slate-500'
              : 'bg-white border-gray-200 text-gray-800 placeholder-gray-400'
              } focus:outline-none focus:border-amber-500`}
          />
        </div>
        <div className={`flex items-center gap-1 p-1 rounded-md ${isDark ? 'bg-slate-700' : 'bg-gray-100'}`}>
          <button
            onClick={() => setViewMode('grid')}
            className={`p-2 rounded-md transition-all ${viewMode === 'grid'
              ? (isDark ? 'bg-slate-600 text-white' : 'bg-white text-gray-800 shadow-sm')
              : (isDark ? 'text-slate-400' : 'text-gray-500')
              }`}
          >
            <FiGrid size={16} />
          </button>
          <button
            onClick={() => setViewMode('list')}
            className={`p-2 rounded-md transition-all ${viewMode === 'list'
              ? (isDark ? 'bg-slate-600 text-white' : 'bg-white text-gray-800 shadow-sm')
              : (isDark ? 'text-slate-400' : 'text-gray-500')
              }`}
          >
            <FiList size={16} />
          </button>
        </div>
      </div>

      {/* Course List */}
      {loading ? (
        <div className={`flex items-center justify-center py-16 rounded-md border ${isDark ? 'bg-slate-800 border-slate-700' : 'bg-white border-gray-200'}`}>
          <div className="w-8 h-8 border-2 border-amber-500/30 border-t-amber-500 rounded-full animate-spin"></div>
        </div>
      ) : filtered.length === 0 ? (
        <div className={`text-center py-16 rounded-md border ${isDark ? 'bg-slate-800 border-slate-700' : 'bg-white border-gray-200'}`}>
          <FiBook className={`mx-auto mb-3 ${isDark ? 'text-slate-600' : 'text-gray-300'}`} size={40} />
          <h3 className={`text-base font-semibold ${isDark ? 'text-white' : 'text-gray-800'}`}>No courses found</h3>
          <p className={`mt-1 text-sm ${isDark ? 'text-slate-400' : 'text-gray-500'}`}>Create your first course</p>
          <Link href="/dashboard/admin/course/create">
            <button className="mt-4 flex items-center gap-2 px-4 py-2 bg-amber-500 text-white rounded-md text-sm font-normal mx-auto">
              <FiPlus size={14} /> Add Course
            </button>
          </Link>
        </div>
      ) : viewMode === 'grid' ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {filtered.map((course) => (
            <div key={course._id} className={`rounded-md border overflow-hidden transition-all ${isDark ? 'bg-slate-800 border-slate-700 hover:border-slate-600' : 'bg-white border-gray-200 hover:border-gray-300 hover:shadow-sm'}`}>
              <div className="relative h-40 overflow-hidden bg-gray-100">
                {course.thumbnail ? (
                  <img src={course.thumbnail} alt={course.title} className="w-full h-full object-cover" />
                ) : (
                  <div className={`w-full h-full flex items-center justify-center ${isDark ? 'bg-slate-700' : 'bg-gray-100'}`}>
                    <FiBook className={isDark ? 'text-slate-500' : 'text-gray-300'} size={40} />
                  </div>
                )}
                <div className="absolute top-2 left-2 flex flex-col gap-1">
                  <span className={`px-2 py-0.5 text-xs font-medium rounded ${isDark ? 'bg-slate-900/80 text-white' : 'bg-white/90 text-gray-800'}`}>
                    {course.courseType}
                  </span>
                  <span className={`px-2 py-0.5 text-xs font-medium rounded ${course.status === 'published' ? 'bg-emerald-500 text-white' : 'bg-gray-400 text-white'}`}>
                    {course.status}
                  </span>
                </div>
                <div className="absolute bottom-2 right-2 px-2 py-1 bg-gray-900/80 text-amber-400 text-sm font-medium rounded">
                  ৳{(course.discountPrice || course.price || 0).toLocaleString()}
                </div>
              </div>

              <div className="p-4">
                <h3 className={`text-sm font-semibold line-clamp-2 mb-3 min-h-10 ${isDark ? 'text-white' : 'text-gray-800'}`}>{course.title}</h3>

                <div className="flex items-center gap-2 mb-3">
                  <span className={`px-2 py-0.5 text-xs rounded ${isDark ? 'bg-amber-500/20 text-amber-400' : 'bg-amber-100 text-amber-700'}`}>{course.level}</span>
                  <span className={`px-2 py-0.5 text-xs rounded ${isDark ? 'bg-slate-700 text-slate-300' : 'bg-gray-100 text-gray-600'}`}>{course.language}</span>
                </div>

                <div className={`flex items-center justify-between py-3 border-t ${isDark ? 'border-slate-700' : 'border-gray-200'}`}>
                  <div className={`flex items-center gap-1 text-xs ${isDark ? 'text-slate-400' : 'text-gray-500'}`}>
                    <FiUsers size={12} /> {course.totalEnrollments || 0}
                  </div>
                  <div className="flex items-center gap-1 text-amber-500 text-xs font-medium">
                    <FiStar size={12} fill="currentColor" /> {course.averageRating || '5.0'}
                  </div>
                </div>
              </div>

              <div className={`flex p-2 gap-2 ${isDark ? 'bg-slate-700/50' : 'bg-gray-50'}`}>
                {/* Curriculum button → opens modal */}
                <button
                  onClick={() => openCurriculumModal(course)}
                  className={`flex-1 py-2 text-center rounded-md text-xs font-medium transition-all flex items-center justify-center gap-1.5 ${isDark
                    ? 'bg-slate-600 text-indigo-400 hover:bg-indigo-600 hover:text-white'
                    : 'bg-white border border-gray-200 text-indigo-600 hover:bg-indigo-600 hover:text-white'
                    }`}
                >
                  <FiLayers size={12} />
                  Curriculum
                </button>
                <Link
                  href={`/dashboard/admin/course/edit/${course._id}`}
                  className={`flex-1 py-2 text-center rounded-md text-xs font-medium transition-all ${isDark ? 'bg-slate-600 text-slate-300 hover:bg-slate-500' : 'bg-white border border-gray-200 text-gray-600 hover:bg-gray-100'}`}
                >
                  Edit
                </Link>
                <button
                  onClick={() => handleDelete(course._id)}
                  className="px-3 py-2 bg-red-500/10 text-red-500 rounded-md hover:bg-red-500 hover:text-white transition-all"
                >
                  <FiTrash2 size={14} />
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className={`rounded-md border overflow-hidden ${isDark ? 'bg-slate-800 border-slate-700' : 'bg-white border-gray-200'}`}>
          <div className={`divide-y ${isDark ? 'divide-slate-700' : 'divide-gray-200'}`}>
            {filtered.map((course) => (
              <div key={course._id} className={`flex flex-col md:flex-row md:items-center gap-4 p-4 transition-colors ${isDark ? 'hover:bg-slate-700/50' : 'hover:bg-gray-50'}`}>
                <div className={`w-28 h-20 rounded-md overflow-hidden shrink-0 ${isDark ? 'bg-slate-700' : 'bg-gray-100'}`}>
                  {course.thumbnail ? (
                    <img src={course.thumbnail} className="w-full h-full object-cover" alt="" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <FiBook className={isDark ? 'text-slate-500' : 'text-gray-300'} size={24} />
                    </div>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className={`text-sm font-semibold truncate ${isDark ? 'text-white' : 'text-gray-800'}`}>{course.title}</h3>
                  <div className={`text-xs mt-1 flex flex-wrap items-center gap-3 ${isDark ? 'text-slate-400' : 'text-gray-500'}`}>
                    <span className={`px-2 py-0.5 rounded ${isDark ? 'bg-slate-700' : 'bg-gray-100'}`}>{course.level}</span>
                    <span className={`px-2 py-0.5 rounded ${isDark ? 'bg-slate-700' : 'bg-gray-100'}`}>{course.courseType}</span>
                    <span className="flex items-center gap-1"><FiUsers size={12} /> {course.totalEnrollments || 0}</span>
                  </div>
                </div>
                <div className="text-right shrink-0">
                  <p className={`text-base font-semibold ${isDark ? 'text-white' : 'text-gray-800'}`}>৳{(course.price || 0).toLocaleString()}</p>
                  <span className={`text-xs px-2 py-0.5 rounded ${course.status === 'published' ? 'bg-emerald-100 text-emerald-700' : 'bg-gray-100 text-gray-600'}`}>{course.status}</span>
                </div>
                <div className="flex gap-2 shrink-0">
                  {/* Curriculum button → opens modal */}
                  <button
                    onClick={() => openCurriculumModal(course)}
                    title="Show Curriculum"
                    className={`p-2 rounded-md transition-all flex items-center gap-1 text-xs font-medium ${isDark
                      ? 'bg-slate-700 text-indigo-400 hover:bg-indigo-600 hover:text-white'
                      : 'bg-gray-100 text-indigo-600 hover:bg-indigo-600 hover:text-white'
                      }`}
                  >
                    <FiLayers size={14} />
                  </button>
                  <Link href={`/dashboard/admin/course/edit/${course._id}`} className={`p-2 rounded-md transition-all ${isDark ? 'bg-slate-700 text-slate-300 hover:bg-slate-600' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}>
                    <FiEdit2 size={16} />
                  </Link>
                  <button onClick={() => handleDelete(course._id)} className="p-2 bg-red-500/10 text-red-500 rounded-md hover:bg-red-500 hover:text-white transition-all">
                    <FiTrash2 size={16} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
