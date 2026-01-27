'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { useForm, useFieldArray } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import {
    FiArrowLeft, FiSave, FiLoader, FiTerminal, FiZap,
    FiPackage, FiSettings, FiTrash2, FiFileText, FiCpu
} from 'react-icons/fi';
import Link from 'next/link';

const softwareSchema = z.object({
    title: z.string().min(1, "Title is required"),
    platform: z.string().min(1, "Platform is required"),
    category: z.string().min(1, "Category is required"),
    softwareType: z.string().min(1, "Software type is required"),
    version: z.string().min(1, "Version is required"),
    price: z.coerce.number().min(0),
    regularLicensePrice: z.coerce.number().min(0),
    extendedLicensePrice: z.coerce.number().min(0).optional(),
    offerPrice: z.coerce.number().min(0).optional(),
    description: z.string().min(1, "Description is required"),
    images: z.array(z.string().url()).min(1),
    downloadFile: z.string().min(1, "Binary download path required"),
    documentationUrl: z.string().url().optional().or(z.literal('')),
    features: z.array(z.string()).optional(),
    requirements: z.array(z.string()).optional(),
    technologies: z.array(z.string()).optional(),
    status: z.enum(['pending', 'approved', 'rejected', 'draft']),
});

export default function EditSoftwarePage() {
    const [loading, setLoading] = useState(false);
    const [fetching, setFetching] = useState(true);
    const [categories, setCategories] = useState([]);
    const [platforms, setPlatforms] = useState([]);
    const router = useRouter();
    const { id } = useParams();

    const { register, control, handleSubmit, reset, formState: { errors } } = useForm({
        resolver: zodResolver(softwareSchema)
    });

    const featureFields = useFieldArray({ control, name: 'features' });
    const requirementFields = useFieldArray({ control, name: 'requirements' });
    const techFields = useFieldArray({ control, name: 'technologies' });
    const imageFields = useFieldArray({ control, name: 'images' });

    const fetchData = useCallback(async () => {
        const BASE_URL = (process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api');
        const token = localStorage.getItem('token');
        try {
            setFetching(true);
            const [catRes, platRes, assetRes] = await Promise.all([
                fetch(`${BASE_URL}/categories`),
                fetch(`${BASE_URL}/platforms`),
                fetch(`${BASE_URL}/software/${id}`, {
                    headers: { 'Authorization': `Bearer ${token}` }
                })
            ]);
            const catData = await catRes.json();
            const platData = await platRes.json();
            const assetData = await assetRes.json();

            setCategories(catData.data || []);
            setPlatforms(platData.data || []);

            const asset = assetData.data;
            if (asset) {
                reset({
                    ...asset,
                    category: asset.category?._id || asset.category,
                    platform: asset.platform?._id || asset.platform,
                    images: asset.images?.length ? asset.images : [''],
                    features: asset.features?.length ? asset.features : [''],
                    requirements: asset.requirements?.length ? asset.requirements : [''],
                    technologies: asset.technologies?.length ? asset.technologies : [''],
                });
            }
        } catch (err) { console.error(err); }
        finally { setFetching(false); }
    }, [id, reset]);

    useEffect(() => { fetchData(); }, [fetchData]);

    const onSubmit = async (values) => {
        setLoading(true);
        const BASE_URL = (process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api');
        const token = localStorage.getItem('token');

        try {
            const response = await fetch(`${BASE_URL}/software/admin/managed/${id}`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(values),
            });

            if (response.ok) {
                alert('Software artifact updated! ✅');
                router.push('/dashboard/admin/software');
            } else {
                const err = await response.json();
                alert(`Error: ${err.message}`);
            }
        } catch (error) { alert('Network error'); }
        finally { setLoading(false); }
    };

    const inputClass = "w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:ring-4 focus:ring-slate-100 focus:border-slate-400 outline-none text-sm transition-all bg-white font-medium text-slate-700";
    const labelClass = "block text-[10px] font-black text-slate-500 mb-1.5 uppercase tracking-widest";
    const cardClass = "bg-white p-8 rounded-[2rem] border border-slate-200 shadow-sm space-y-6";

    if (fetching) return (
        <div className="h-screen flex items-center justify-center bg-slate-50">
            <div className="flex flex-col items-center gap-4">
                <FiLoader className="animate-spin text-slate-800" size={40} />
                <p className="text-xs font-black text-slate-400 uppercase tracking-widest">Accessing Binary Metadata...</p>
            </div>
        </div>
    );

    return (
        <div className="min-h-screen bg-slate-50 p-4 md:p-10">
            <div className="max-w-6xl mx-auto pb-20">

                {/* Header */}
                <div className="flex flex-col md:flex-row md:items-center justify-between mb-10 gap-4">
                    <div className="flex items-center gap-4">
                        <Link href="/dashboard/admin/software" className="p-3 bg-white border border-slate-200 rounded-2xl text-slate-400 hover:text-slate-800 transition-all shadow-sm">
                            <FiArrowLeft size={20} />
                        </Link>
                        <div>
                            <h1 className="text-2xl font-black text-slate-800 outfit tracking-tight">Recalibrate Artifact</h1>
                            <p className="text-slate-500 text-sm italic tracking-tight">Syncing changes for: <span className="font-mono text-slate-400 uppercase">{id?.slice(-8)}</span></p>
                        </div>
                    </div>
                    <button onClick={handleSubmit(onSubmit)} disabled={loading} className="flex items-center gap-2 bg-slate-900 hover:bg-black text-white px-10 py-4 rounded-2xl font-black text-xs uppercase tracking-widest shadow-2xl transition-all active:scale-95 disabled:opacity-50">
                        {loading ? 'Re-Deploying...' : <><FiSave /> Commit Changes</>}
                    </button>
                </div>

                <form className="grid grid-cols-1 lg:grid-cols-12 gap-8">

                    <div className="lg:col-span-8 space-y-8">
                        <div className={cardClass}>
                            <h2 className="text-xs font-black text-slate-400 uppercase tracking-[0.2em] border-b pb-4 mb-2 flex items-center gap-2"><FiPackage /> Core Repository Data</h2>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="md:col-span-2">
                                    <label className={labelClass}>Artifact Title</label>
                                    <input {...register('title')} className={inputClass} />
                                </div>
                                <div>
                                    <label className={labelClass}>Build Version</label>
                                    <div className="relative">
                                        <FiSettings className="absolute left-4 top-3.5 text-slate-300" />
                                        <input {...register('version')} className={`${inputClass} pl-10 font-mono`} />
                                    </div>
                                </div>
                                <div>
                                    <label className={labelClass}>Product Classification</label>
                                    <input {...register('softwareType')} className={inputClass} />
                                </div>
                            </div>
                        </div>

                        <div className={cardClass}>
                            <h2 className="text-xs font-black text-slate-400 uppercase tracking-[0.2em] border-b pb-4 mb-2 flex items-center gap-2"><FiCpu /> Runtime Parameters</h2>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                <div>
                                    <div className="flex justify-between items-center mb-4">
                                        <label className={labelClass}>Standard Requirements</label>
                                        <button type="button" onClick={() => requirementFields.append('')} className="text-[9px] font-black text-indigo-600 uppercase tracking-tighter underline hover:text-indigo-800">+ NEW SPEC</button>
                                    </div>
                                    <div className="space-y-2">
                                        {requirementFields.fields.map((f, i) => (
                                            <div key={f.id} className="flex gap-2">
                                                <input {...register(`requirements.${i}`)} className={inputClass} />
                                                <button type="button" onClick={() => requirementFields.remove(i)} className="text-rose-400 p-2"><FiTrash2 /></button>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                                <div>
                                    <div className="flex justify-between items-center mb-4">
                                        <label className={labelClass}>Library Ecosystem</label>
                                        <button type="button" onClick={() => techFields.append('')} className="text-[9px] font-black text-indigo-600 uppercase tracking-tighter underline hover:text-indigo-800">+ NEW STACK</button>
                                    </div>
                                    <div className="flex flex-wrap gap-2">
                                        {techFields.fields.map((f, i) => (
                                            <div key={f.id} className="relative group">
                                                <input {...register(`technologies.${i}`)} className="px-3 py-1.5 bg-slate-50 border border-slate-100 rounded-xl text-[11px] font-bold w-24 outline-none focus:bg-white focus:border-slate-300 transition-all shadow-inner" />
                                                <button type="button" onClick={() => techFields.remove(i)} className="absolute -top-1 -right-1 opacity-0 group-hover:opacity-100 transition-all bg-rose-500 text-white rounded-full p-0.5"><FiTrash2 size={8} /></button>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className={cardClass}>
                            <h2 className="text-xs font-black text-slate-400 uppercase tracking-[0.2em] border-b pb-4 mb-2 flex items-center gap-2"><FiFileText /> Operational Overview</h2>
                            <div className="space-y-6">
                                <div>
                                    <label className={labelClass}>Feature Catalog</label>
                                    <div className="space-y-2">
                                        {featureFields.fields.map((f, i) => (
                                            <div key={f.id} className="flex gap-2">
                                                <input {...register(`features.${i}`)} className={inputClass} />
                                                <button type="button" onClick={() => featureFields.remove(i)} className="text-rose-400 p-2"><FiTrash2 /></button>
                                            </div>
                                        ))}
                                        <button type="button" onClick={() => featureFields.append('')} className="w-full py-3 bg-slate-50 border border-dashed border-slate-200 rounded-xl text-[10px] font-black uppercase text-slate-400 tracking-widest hover:bg-slate-100 transition-all tracking-tighter">+ PUSH TO STAGING</button>
                                    </div>
                                </div>
                                <div>
                                    <label className={labelClass}>Narrative / Product Copy</label>
                                    <textarea {...register('description')} rows={10} className={`${inputClass} resize-none leading-relaxed font-italic`}></textarea>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Sidebar */}
                    <div className="lg:col-span-4 space-y-8">
                        <div className="bg-slate-900 p-8 rounded-[2.5rem] shadow-2xl space-y-8 text-white relative overflow-hidden">
                            <div className="absolute bottom-0 right-0 p-6 opacity-5"><FiZap size={120} /></div>
                            <h2 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] font-outfit border-b border-slate-800 pb-4">Revenue Dashboard</h2>
                            <div className="space-y-6 relative z-10">
                                <div>
                                    <label className="text-[9px] font-black text-slate-500 uppercase block mb-1.5">Baseline Pricing (BDT)</label>
                                    <input type="number" {...register('price')} className="w-full bg-slate-800 border-none rounded-2xl py-4 px-5 text-xl font-mono font-black" />
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="text-[9px] font-black text-slate-500 uppercase block mb-1.5">Reg. License</label>
                                        <input type="number" {...register('regularLicensePrice')} className="w-full bg-slate-800 border-none rounded-xl py-3 px-4 text-sm font-mono font-bold" />
                                    </div>
                                    <div>
                                        <label className="text-[9px] font-black text-slate-500 uppercase block mb-1.5">Ext. License</label>
                                        <input type="number" {...register('extendedLicensePrice')} className="w-full bg-slate-800 border-none rounded-xl py-3 px-4 text-sm font-mono font-bold" />
                                    </div>
                                </div>
                                <div className="pt-4 border-t border-slate-800 flex items-center justify-between">
                                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Visibility</span>
                                    <select {...register('status')} className="bg-slate-800 border-none rounded-xl px-4 py-2 text-xs font-bold text-sky-400">
                                        <option value="approved">Approved</option>
                                        <option value="pending">Review</option>
                                        <option value="rejected">Halt</option>
                                        <option value="draft">Draft</option>
                                    </select>
                                </div>
                            </div>
                        </div>

                        <div className={cardClass}>
                            <h2 className="text-[10px] font-black text-slate-400 uppercase tracking-widest border-b pb-4 mb-2">Build Artifacts</h2>
                            <div className="space-y-4">
                                <div>
                                    <label className={labelClass}>Binary Remote (Drive/S3)</label>
                                    <input {...register('downloadFile')} className={inputClass} />
                                </div>
                                <div>
                                    <label className={labelClass}>Image Stack (URL)</label>
                                    <div className="space-y-2">
                                        {imageFields.fields.map((f, i) => (
                                            <div key={f.id} className="flex gap-2 relative">
                                                <input {...register(`images.${i}`)} className={inputClass} />
                                                <button type="button" onClick={() => imageFields.remove(i)} className="text-rose-400 p-2"><FiTrash2 /></button>
                                            </div>
                                        ))}
                                        <button type="button" onClick={() => imageFields.append('')} className="text-[9px] font-black text-sky-600 underline tracking-tighter uppercase">+ PUSH VISUAL</button>
                                    </div>
                                </div>
                                <div>
                                    <label className={labelClass}>Documentation URI</label>
                                    <input {...register('documentationUrl')} className={inputClass} />
                                </div>
                            </div>
                        </div>

                        <div className={cardClass}>
                            <h2 className="text-[10px] font-black text-slate-400 uppercase tracking-widest border-b pb-4 mb-2">Hierarchies</h2>
                            <div className="space-y-4">
                                <div>
                                    <label className={labelClass}>Runtime Platform</label>
                                    <select {...register('platform')} className={inputClass}>
                                        <option value="">Select Platform</option>
                                        {platforms.map(p => <option key={p._id} value={p._id}>{p.name}</option>)}
                                    </select>
                                </div>
                                <div>
                                    <label className={labelClass}>Content Segment</label>
                                    <select {...register('category')} className={inputClass}>
                                        <option value="">Select Genre</option>
                                        {categories.map(c => <option key={c._id} value={c._id}>{c.name}</option>)}
                                    </select>
                                </div>
                            </div>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    );
}
