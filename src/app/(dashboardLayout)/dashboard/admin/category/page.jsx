'use client';

import React, { useEffect, useState } from 'react';
import { FiPlus, FiEdit3, FiTrash2, FiLoader, FiCheck, FiX, FiGrid, FiSearch, FiRefreshCw, FiBook, FiCode, FiLayout, FiFolder, FiChevronRight, FiChevronDown } from 'react-icons/fi';
import Link from 'next/link';
import { API_BASE_URL } from '@/config/api';


const API_URL = API_BASE_URL;

const CategoryPage = () => {
  const [categories, setCategories] = useState([]);
  const [hierarchicalData, setHierarchicalData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editData, setEditData] = useState(null);
  const [search, setSearch] = useState('');
  const [typeFilter, setTypeFilter] = useState('all');
  const [viewMode, setViewMode] = useState('tree');
  const [expandedParents, setExpandedParents] = useState([]);
  const [parentCategories, setParentCategories] = useState([]);

  const fetchCategories = async () => {
    const token = localStorage.getItem('token');
    try {
      setLoading(true);
      const res = await fetch(`${API_URL}/categories/admin/all`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const result = await res.json();
      setCategories(result.data || []);

      const hierRes = await fetch(`${API_URL}/categories/hierarchical${typeFilter !== 'all' ? `?type=${typeFilter}` : ''}`);
      const hierData = await hierRes.json();
      setHierarchicalData(hierData.data || []);

      const parentsRes = await fetch(`${API_URL}/categories/admin/parents`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const parentsData = await parentsRes.json();
      setParentCategories(parentsData.data || []);

      setExpandedParents((hierData.data || []).map(p => p._id));
    } catch (err) {
      console.error("Fetch Error:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchCategories(); }, [typeFilter]);

  const handleDelete = async (id) => {
    if (!confirm("Are you sure you want to remove this category?")) return;
    const token = localStorage.getItem('token');
    try {
      const res = await fetch(`${API_URL}/categories/admin/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (res.ok) {
        fetchCategories();
      } else {
        const data = await res.json();
        alert(data.message || 'Delete failed');
      }
    } catch (err) { alert("Delete failed"); }
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('token');
    try {
      const res = await fetch(`${API_URL}/categories/admin/${editData._id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          name: editData.name,
          slug: editData.slug,
          description: editData.description,
          image: editData.image,
          status: editData.status,
          type: editData.type,
          isParent: editData.isParent,
          parentCategory: editData.isParent ? null : editData.parentCategory
        }),
      });
      if (res.ok) {
        setEditData(null);
        fetchCategories();
      } else {
        const err = await res.json();
        alert(`Update failed: ${err.message}`);
      }
    } catch (err) { alert("Network error"); }
  };

  const toggleExpand = (id) => {
    setExpandedParents(prev =>
      prev.includes(id) ? prev.filter(p => p !== id) : [...prev, id]
    );
  };

  const getTypeColor = (type) => {
    switch (type) {
      case 'course': return 'bg-indigo-500';
      case 'website': return 'bg-emerald-500';
      case 'software': return 'bg-violet-500';
      default: return 'bg-slate-500';
    }
  };

  const getTypeBadgeColor = (type) => {
    switch (type) {
      case 'course': return 'bg-indigo-100 text-indigo-600';
      case 'website': return 'bg-emerald-100 text-emerald-600';
      case 'software': return 'bg-violet-100 text-violet-600';
      default: return 'bg-slate-100 text-slate-600';
    }
  };

  const getTypeIcon = (type) => {
    switch (type) {
      case 'course': return <FiBook size={14} />;
      case 'website': return <FiLayout size={14} />;
      case 'software': return <FiCode size={14} />;
      default: return <FiGrid size={14} />;
    }
  };

  const stats = {
    total: categories.length,
    course: categories.filter(c => c.type === 'course').length,
    website: categories.filter(c => c.type === 'website').length,
    software: categories.filter(c => c.type === 'software').length,
    parents: categories.filter(c => c.isParent).length,
  };

  const filtered = categories.filter(c => {
    const matchSearch = c.name?.toLowerCase().includes(search.toLowerCase());
    const matchType = typeFilter === 'all' || c.type === typeFilter;
    return matchSearch && matchType;
  });

  return (
    <div className="p-4 md:p-6 space-y-5 bg-slate-50 dark:bg-slate-900 min-h-screen">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 bg-white dark:bg-slate-800 p-4 rounded-md border border-slate-200 dark:border-slate-700">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-indigo-500 rounded-md flex items-center justify-center">
            <FiFolder className="text-white" size={18} />
          </div>
          <div>
            <h1 className="text-lg font-semibold text-slate-800 dark:text-white">Categories</h1>
            <p className="text-xs text-slate-500 dark:text-slate-400">Manage all categories</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button onClick={fetchCategories} className="p-2.5 bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600 text-slate-600 dark:text-slate-300 rounded-md transition-all">
            <FiRefreshCw size={16} className={loading ? 'animate-spin' : ''} />
          </button>
          <Link href="/dashboard/admin/category/create">
            <button className="flex items-center gap-2 px-4 py-2.5 bg-indigo-500 hover:bg-indigo-600 text-white text-sm font-medium rounded-md transition-all">
              <FiPlus size={16} /> Add Category
            </button>
          </Link>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
        <div className="bg-white dark:bg-slate-800 p-4 rounded-md border border-slate-200 dark:border-slate-700">
          <div className="flex items-center justify-between mb-2">
            <div className="w-8 h-8 bg-slate-800 dark:bg-slate-600 rounded-md flex items-center justify-center">
              <FiGrid className="text-white" size={14} />
            </div>
            <span className="text-xl font-bold text-slate-800 dark:text-white">{stats.total}</span>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400">Total</p>
        </div>
        <div className="bg-white dark:bg-slate-800 p-4 rounded-md border border-slate-200 dark:border-slate-700">
          <div className="flex items-center justify-between mb-2">
            <div className="w-8 h-8 bg-indigo-500 rounded-md flex items-center justify-center">
              <FiBook className="text-white" size={14} />
            </div>
            <span className="text-xl font-bold text-slate-800 dark:text-white">{stats.course}</span>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400">Course</p>
        </div>
        <div className="bg-white dark:bg-slate-800 p-4 rounded-md border border-slate-200 dark:border-slate-700">
          <div className="flex items-center justify-between mb-2">
            <div className="w-8 h-8 bg-emerald-500 rounded-md flex items-center justify-center">
              <FiLayout className="text-white" size={14} />
            </div>
            <span className="text-xl font-bold text-slate-800 dark:text-white">{stats.website}</span>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400">Website</p>
        </div>
        <div className="bg-white dark:bg-slate-800 p-4 rounded-md border border-slate-200 dark:border-slate-700">
          <div className="flex items-center justify-between mb-2">
            <div className="w-8 h-8 bg-violet-500 rounded-md flex items-center justify-center">
              <FiCode className="text-white" size={14} />
            </div>
            <span className="text-xl font-bold text-slate-800 dark:text-white">{stats.software}</span>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400">Software</p>
        </div>
        <div className="bg-white dark:bg-slate-800 p-4 rounded-md border border-slate-200 dark:border-slate-700">
          <div className="flex items-center justify-between mb-2">
            <div className="w-8 h-8 bg-amber-500 rounded-md flex items-center justify-center">
              <FiFolder className="text-white" size={14} />
            </div>
            <span className="text-xl font-bold text-slate-800 dark:text-white">{stats.parents}</span>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400">Parents</p>
        </div>
      </div>

      {/* Filters Bar */}
      <div className="flex flex-col md:flex-row md:items-center gap-3 bg-white dark:bg-slate-800 p-4 rounded-md border border-slate-200 dark:border-slate-700">
        <div className="relative flex-1">
          <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
          <input
            placeholder="Search categories..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 rounded-md bg-slate-50 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 focus:border-indigo-400 outline-none text-sm transition-all"
          />
        </div>
        <div className="flex items-center gap-2">
          {['all', 'course', 'website', 'software'].map(type => (
            <button
              key={type}
              onClick={() => setTypeFilter(type)}
              className={`px-3 py-2 rounded-md text-xs font-medium transition-all ${typeFilter === type
                ? 'bg-indigo-500 text-white'
                : 'bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-600'
                }`}
            >
              {type === 'all' ? 'All' : type.charAt(0).toUpperCase() + type.slice(1)}
            </button>
          ))}
        </div>
        <div className="flex items-center gap-1 p-1 bg-slate-100 dark:bg-slate-700 rounded-md">
          <button
            onClick={() => setViewMode('tree')}
            className={`px-3 py-1.5 rounded text-xs font-medium transition-all ${viewMode === 'tree' ? 'bg-white dark:bg-slate-600 text-slate-800 dark:text-white shadow-sm' : 'text-slate-500'}`}
          >
            Tree
          </button>
          <button
            onClick={() => setViewMode('flat')}
            className={`px-3 py-1.5 rounded text-xs font-medium transition-all ${viewMode === 'flat' ? 'bg-white dark:bg-slate-600 text-slate-800 dark:text-white shadow-sm' : 'text-slate-500'}`}
          >
            Grid
          </button>
        </div>
      </div>

      {/* Content */}
      {loading ? (
        <div className="flex flex-col items-center justify-center py-16 gap-3">
          <FiLoader className="animate-spin text-indigo-500" size={32} />
          <p className="text-sm text-slate-500">Loading...</p>
        </div>
      ) : viewMode === 'tree' ? (
        /* Tree View */
        <div className="space-y-3">
          {hierarchicalData.length === 0 ? (
            <div className="text-center py-16 bg-white dark:bg-slate-800 rounded-md border border-dashed border-slate-300 dark:border-slate-600">
              <FiFolder className="text-3xl text-slate-300 mx-auto mb-3" />
              <p className="text-sm font-medium text-slate-600 dark:text-slate-300">No Parent Categories</p>
              <p className="text-xs text-slate-400 mt-1">Create a parent category to get started</p>
              <Link href="/dashboard/admin/category/create">
                <button className="mt-4 flex items-center gap-2 px-4 py-2 bg-indigo-500 text-white text-xs font-medium rounded-md mx-auto">
                  <FiPlus size={14} /> Create Category
                </button>
              </Link>
            </div>
          ) : (
            hierarchicalData.map(parent => (
              <div key={parent._id} className="bg-white dark:bg-slate-800 rounded-md border border-slate-200 dark:border-slate-700 overflow-hidden">
                {/* Parent Row */}
                <div className="flex items-center gap-3 p-4 hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-all">
                  <button
                    onClick={() => toggleExpand(parent._id)}
                    className="w-8 h-8 bg-slate-100 dark:bg-slate-700 rounded-md flex items-center justify-center text-slate-500 hover:bg-slate-200 dark:hover:bg-slate-600 transition-all"
                  >
                    {expandedParents.includes(parent._id) ? <FiChevronDown size={16} /> : <FiChevronRight size={16} />}
                  </button>
                  <div className={`w-10 h-10 rounded-md ${getTypeColor(parent.type)} flex items-center justify-center text-white overflow-hidden`}>
                    {parent.image ? <img src={parent.image} className="w-full h-full object-cover" /> : <FiFolder size={16} />}
                  </div>
                  <div className="flex-1">
                    <h3 className="text-sm font-medium text-slate-800 dark:text-white">{parent.name}</h3>
                    <div className="flex items-center gap-2 mt-1">
                      <span className={`px-2 py-0.5 ${getTypeBadgeColor(parent.type)} rounded text-[10px] font-medium`}>{parent.type}</span>
                      <span className="text-xs text-slate-400">{parent.children?.length || 0} sub-categories</span>
                    </div>
                  </div>
                  <span className={`px-2 py-1 rounded text-xs font-medium ${parent.status === 'active' ? 'bg-emerald-100 text-emerald-600' : 'bg-slate-100 text-slate-500'}`}>
                    {parent.status}
                  </span>
                  <div className="flex gap-1">
                    <button onClick={() => setEditData(parent)} className="p-2 bg-slate-100 dark:bg-slate-700 hover:bg-indigo-500 hover:text-white text-slate-500 rounded-md transition-all">
                      <FiEdit3 size={14} />
                    </button>
                    <button onClick={() => handleDelete(parent._id)} className="p-2 bg-rose-50 dark:bg-rose-500/20 hover:bg-rose-500 hover:text-white text-rose-400 rounded-md transition-all">
                      <FiTrash2 size={14} />
                    </button>
                  </div>
                </div>

                {/* Children */}
                {expandedParents.includes(parent._id) && parent.children?.length > 0 && (
                  <div className="border-t border-slate-100 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50">
                    {parent.children.map((child, idx) => (
                      <div key={child._id} className={`flex items-center gap-3 py-3 px-4 pl-16 hover:bg-white dark:hover:bg-slate-700/50 transition-all ${idx < parent.children.length - 1 ? 'border-b border-slate-100 dark:border-slate-700' : ''}`}>
                        <div className="w-7 h-7 bg-white dark:bg-slate-700 rounded-md border border-slate-200 dark:border-slate-600 flex items-center justify-center text-slate-400">
                          {getTypeIcon(child.type)}
                        </div>
                        <div className="flex-1">
                          <p className="text-sm font-medium text-slate-700 dark:text-slate-200">{child.name}</p>
                          <p className="text-xs text-slate-400 font-mono">{child.slug}</p>
                        </div>
                        <span className={`px-2 py-0.5 rounded text-[10px] font-medium ${child.status === 'active' ? 'bg-emerald-100 text-emerald-600' : 'bg-slate-100 text-slate-500'}`}>
                          {child.status}
                        </span>
                        <div className="flex gap-1">
                          <button onClick={() => setEditData(child)} className="p-1.5 bg-white dark:bg-slate-700 hover:bg-indigo-500 hover:text-white text-slate-400 rounded border border-slate-200 dark:border-slate-600 transition-all">
                            <FiEdit3 size={12} />
                          </button>
                          <button onClick={() => handleDelete(child._id)} className="p-1.5 bg-white dark:bg-slate-700 hover:bg-rose-500 hover:text-white text-rose-300 rounded border border-slate-200 dark:border-slate-600 transition-all">
                            <FiTrash2 size={12} />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      ) : (
        /* Grid View */
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {filtered.length === 0 ? (
            <div className="col-span-full text-center py-16 bg-white dark:bg-slate-800 rounded-md border border-dashed border-slate-300 dark:border-slate-600">
              <FiGrid className="text-3xl text-slate-300 mx-auto mb-3" />
              <p className="text-sm font-medium text-slate-600 dark:text-slate-300">No Categories Found</p>
            </div>
          ) : (
            filtered.map((cat) => (
              <div key={cat._id} className="bg-white dark:bg-slate-800 p-4 rounded-md border border-slate-200 dark:border-slate-700 hover:shadow-md transition-all">
                <div className="flex items-center gap-3 mb-3">
                  <div className={`w-10 h-10 rounded-md ${getTypeColor(cat.type)} flex items-center justify-center text-white overflow-hidden`}>
                    {cat.image ? <img src={cat.image} className="w-full h-full object-cover" /> : (cat.isParent ? <FiFolder size={16} /> : getTypeIcon(cat.type))}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="text-sm font-medium text-slate-800 dark:text-white line-clamp-1">{cat.name}</h3>
                    <p className="text-xs text-slate-400 font-mono">{cat.slug}</p>
                  </div>
                </div>
                <div className="flex flex-wrap items-center gap-1.5 mb-3">
                  <span className={`px-2 py-0.5 ${getTypeBadgeColor(cat.type)} rounded text-[10px] font-medium`}>{cat.type}</span>
                  <span className={`px-2 py-0.5 rounded text-[10px] font-medium ${cat.isParent ? 'bg-amber-100 text-amber-600' : 'bg-slate-100 text-slate-500'}`}>
                    {cat.isParent ? 'Parent' : 'Child'}
                  </span>
                  <span className={`px-2 py-0.5 rounded text-[10px] font-medium ${cat.status === 'active' ? 'bg-emerald-100 text-emerald-600' : 'bg-slate-100 text-slate-500'}`}>
                    {cat.status}
                  </span>
                </div>
                {cat.parentCategory && (
                  <p className="text-xs text-slate-400 mb-3">
                    Under: <span className="font-medium text-slate-600 dark:text-slate-300">{cat.parentCategory.name}</span>
                  </p>
                )}
                <div className="flex gap-2 pt-3 border-t border-slate-100 dark:border-slate-700">
                  <button onClick={() => setEditData(cat)} className="flex-1 py-2 bg-slate-100 dark:bg-slate-700 hover:bg-indigo-500 hover:text-white text-slate-600 dark:text-slate-300 rounded-md text-xs font-medium transition-all flex items-center justify-center gap-1">
                    <FiEdit3 size={12} /> Edit
                  </button>
                  <button onClick={() => handleDelete(cat._id)} className="p-2 bg-rose-50 dark:bg-rose-500/20 hover:bg-rose-500 hover:text-white text-rose-400 rounded-md transition-all">
                    <FiTrash2 size={14} />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {/* Edit Modal */}
      {editData && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-end z-50 p-4">
          <div className="bg-white dark:bg-slate-800 h-full w-full max-w-md rounded-md shadow-xl relative overflow-hidden flex flex-col">
            <div className="p-5 border-b border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800">
              <div className="flex justify-between items-center">
                <div>
                  <h3 className="text-base font-semibold text-slate-800 dark:text-white">Edit Category</h3>
                  <p className="text-xs text-slate-500 mt-0.5">
                    {editData.isParent ? 'Parent Category' : 'Sub-Category'}
                  </p>
                </div>
                <button onClick={() => setEditData(null)} className="w-8 h-8 flex items-center justify-center bg-white dark:bg-slate-700 hover:bg-slate-100 dark:hover:bg-slate-600 rounded-md transition-all">
                  <FiX size={16} />
                </button>
              </div>
            </div>

            <form onSubmit={handleUpdate} className="p-5 space-y-4 overflow-y-auto flex-1">
              <div>
                <label className="text-xs font-medium text-slate-600 dark:text-slate-400 block mb-1.5">Category Name</label>
                <input
                  type="text"
                  value={editData.name || ''}
                  onChange={(e) => setEditData({ ...editData, name: e.target.value })}
                  className="w-full px-3 py-2.5 bg-slate-50 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-md text-sm focus:border-indigo-400 outline-none transition-all"
                />
              </div>

              <div>
                <label className="text-xs font-medium text-slate-600 dark:text-slate-400 block mb-1.5">URL Slug</label>
                <input
                  type="text"
                  value={editData.slug || ''}
                  onChange={(e) => setEditData({ ...editData, slug: e.target.value })}
                  className="w-full px-3 py-2.5 bg-slate-50 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-md text-sm font-mono focus:border-indigo-400 outline-none transition-all"
                />
              </div>

              <div>
                <label className="text-xs font-medium text-slate-600 dark:text-slate-400 block mb-1.5">Image URL</label>
                <input
                  type="text"
                  value={editData.image || ''}
                  onChange={(e) => setEditData({ ...editData, image: e.target.value })}
                  className="w-full px-3 py-2.5 bg-slate-50 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-md text-sm focus:border-indigo-400 outline-none transition-all"
                />
              </div>

              <div>
                <label className="text-xs font-medium text-slate-600 dark:text-slate-400 block mb-1.5">Description</label>
                <textarea
                  value={editData.description || ''}
                  onChange={(e) => setEditData({ ...editData, description: e.target.value })}
                  rows={2}
                  className="w-full px-3 py-2.5 bg-slate-50 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-md text-sm focus:border-indigo-400 outline-none transition-all resize-none"
                ></textarea>
              </div>

              <div>
                <label className="text-xs font-medium text-slate-600 dark:text-slate-400 block mb-1.5">Category Type</label>
                <div className="grid grid-cols-3 gap-2">
                  {['course', 'website', 'software'].map(type => (
                    <button
                      key={type}
                      type="button"
                      onClick={() => setEditData({ ...editData, type })}
                      className={`py-2 rounded-md text-xs font-medium transition-all ${editData.type === type
                        ? `${getTypeColor(type)} text-white`
                        : 'bg-slate-100 dark:bg-slate-700 text-slate-500 hover:bg-slate-200'
                        }`}
                    >
                      {type.charAt(0).toUpperCase() + type.slice(1)}
                    </button>
                  ))}
                </div>
              </div>

              {!editData.isParent && (
                <div>
                  <label className="text-xs font-medium text-slate-600 dark:text-slate-400 block mb-1.5">Parent Category</label>
                  <select
                    value={editData.parentCategory?._id || editData.parentCategory || ''}
                    onChange={(e) => setEditData({ ...editData, parentCategory: e.target.value })}
                    className="w-full px-3 py-2.5 bg-slate-50 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-md text-sm focus:border-indigo-400 outline-none transition-all"
                  >
                    <option value="">Select Parent</option>
                    {parentCategories
                      .filter(p => p.type === editData.type)
                      .map(p => (
                        <option key={p._id} value={p._id}>{p.name}</option>
                      ))
                    }
                  </select>
                </div>
              )}

              <div className="flex items-center justify-between bg-slate-50 dark:bg-slate-700 p-3 rounded-md border border-slate-200 dark:border-slate-600">
                <div>
                  <p className="text-sm font-medium text-slate-800 dark:text-white">Status</p>
                  <p className="text-xs text-slate-400">Toggle visibility</p>
                </div>
                <button
                  type="button"
                  onClick={() => setEditData({ ...editData, status: editData.status === 'active' ? 'inactive' : 'active' })}
                  className={`w-12 h-6 rounded-full transition-all flex items-center p-0.5 ${editData.status === 'active' ? 'bg-emerald-500 justify-end' : 'bg-slate-300 justify-start'}`}
                >
                  <div className="w-5 h-5 bg-white rounded-full shadow"></div>
                </button>
              </div>

              <button
                type="submit"
                className="w-full bg-indigo-500 hover:bg-indigo-600 text-white py-2.5 rounded-md font-medium text-sm flex items-center justify-center gap-2 transition-all"
              >
                <FiCheck size={16} /> Save Changes
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default CategoryPage;
