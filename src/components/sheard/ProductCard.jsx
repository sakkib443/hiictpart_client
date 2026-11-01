'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useDispatch } from 'react-redux';
import { addToCart } from '@/redux/cartSlice';
import {
    LuShoppingCart,
    LuEye,
    LuCheck,
    LuClock,
    LuUsers,
    LuLayoutGrid,
    LuLayers,
    LuList,
    LuHeart
} from 'react-icons/lu';
import { FaStar } from "react-icons/fa";
import { useLanguage } from "@/context/LanguageContext";
import { useTheme } from "@/providers/ThemeProvider";

const ProductCard = ({ product, type, view = "grid" }) => {
    const dispatch = useDispatch();
    const [isAdded, setIsAdded] = useState(false);
    const { isDark } = useTheme();
    const { language } = useLanguage();
    const bengaliClass = language === "bn" ? "hind-siliguri" : "";

    const detailUrl = `/${type}/${product._id}`;

    // Get first image from images array or fallback
    const productImage = product.images?.[0] || product.image || "/images/placeholder.png";

    // Calculate discount percentage
    const hasDiscount = product.offerPrice && product.offerPrice > 0 && product.offerPrice < product.price;

    // Display Price logic
    const displayPrice = hasDiscount ? product.offerPrice : product.price;
    const originalPrice = product.price;

    const handleAddToCart = (e) => {
        e.preventDefault();
        e.stopPropagation();
        dispatch(addToCart({
            id: product._id,
            title: product.title || product.name,
            price: displayPrice,
            image: productImage,
            type: type
        }));
        setIsAdded(true);
        setTimeout(() => setIsAdded(false), 2000);
    };

    // Fields
    const title = product.title || product.name || "Untitled Product";
    const categoryName = product.category?.name || (type === 'website' ? 'Website' : 'Software');
    const version = product.version || 'v1.0';
    const sales = product.salesCount || product.totalSales || 10;
    const rating = product.rating || 5;
    const reviewsCount = product.reviews?.length || 0;
    const lastUpdated = product.updatedAt ? new Date(product.updatedAt).toLocaleDateString() : "Recently Updated";

    // List View Rendering
    if (view === "list") {
        return (
            <div className="group w-full flex flex-col md:flex-row bg-white dark:bg-[#0d0d0d] rounded-md border border-gray-100 dark:border-white/10 overflow-hidden hover:shadow-xl transition-all duration-300">
                {/* Left: Image (35%) */}
                <div className="relative w-full md:w-[35%] h-56 md:h-auto shrink-0 overflow-hidden p-3">
                    <Link href={detailUrl} className="block h-full w-full">
                        <img
                            src={productImage}
                            alt={title}
                            className="h-full w-full object-cover rounded-lg transition-transform duration-700 group-hover:scale-105"
                        />
                    </Link>
                    {/* Eye Overlay */}
                    <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-black/20 backdrop-blur-[1px]">
                        <Link href={detailUrl} className="w-12 h-12 bg-white/30 backdrop-blur-md rounded-full flex items-center justify-center text-white border border-white/50 hover:bg-[#E62D26] hover:border-[#E62D26] transition-colors">
                            <LuEye className="ml-1" size={20} />
                        </Link>
                    </div>
                </div>

                {/* Middle: Content (40%) */}
                <div className="flex-1 p-6 border-r border-gray-50 flex flex-col justify-center">
                    <Link href={detailUrl}>
                        <h3 className={`text-xl font-bold text-slate-800 leading-tight mb-2 hover:text-[#E62D26] transition-colors ${bengaliClass}`}>
                            {title}
                        </h3>
                    </Link>
                    <div className="flex items-center gap-2 mb-4 text-sm text-slate-500">
                        <span className="italic">in</span>
                        <span className="font-medium text-slate-700 bg-slate-100 px-2 py-0.5 rounded text-xs uppercase tracking-wide">
                            {categoryName}
                        </span>
                    </div>

                    <ul className="space-y-2 mb-4">
                        <li className="flex items-start gap-2 text-sm text-slate-600">
                            <LuLayers className="text-[#E62D26] mt-0.5 shrink-0" size={16} />
                            <span>Version: {version}</span>
                        </li>
                        <li className="flex items-start gap-2 text-sm text-slate-600">
                            <LuUsers className="text-[#E62D26] mt-0.5 shrink-0" size={16} />
                            <span>{sales}+ Sales</span>
                        </li>
                        <li className="flex items-start gap-2 text-sm text-slate-600">
                            <LuCheck className="text-[#E62D26] mt-0.5 shrink-0" size={16} />
                            <span>Lifetime Updates</span>
                        </li>
                    </ul>
                </div>

                {/* Right: Actions (25%) */}
                <div className="w-full md:w-[25%] p-6 bg-gray-50/50 flex flex-col items-center justify-center text-center gap-1 border-l border-gray-100">
                    {/* Icons Top Right */}
                    <div className="flex w-full justify-end gap-2 mb-2 text-slate-400">
                        <button className="hover:text-[#E62D26]"><LuList size={18} /></button>
                        <button className="hover:text-amber-500"><LuHeart size={18} /></button>
                    </div>

                    <div className="text-3xl font-bold text-[#E62D26] font-outfit mb-1">
                        ?{displayPrice?.toLocaleString()}
                    </div>

                    <div className="flex text-amber-500 gap-0.5 text-xs mb-1">
                        {[...Array(5)].map((_, i) => (
                            <FaStar key={i} className={i < Math.round(rating) ? "fill-current" : "text-slate-200"} />
                        ))}
                        <span className="text-slate-400 ml-1">({reviewsCount})</span>
                    </div>

                    <p className="text-xs text-slate-500 mb-1">{sales}+ Sales</p>
                    <p className="text-[10px] text-slate-400 mb-4">Last updated: {lastUpdated}</p>

                    <div className="flex items-center gap-3 w-full">
                        {/* Cart hidden */}
{false && (
<button
                            onClick={handleAddToCart}
                            disabled={isAdded}
                            className={`p-2.5 border rounded-md transition-colors shadow-sm ${isAdded ? 'bg-emerald-500 border-emerald-500 text-white' : 'bg-white border-slate-200 text-slate-600 hover:text-[#E62D26] hover:border-[#E62D26]'}`}
                        >
                            {isAdded ? <LuCheck size={20} /> : <LuShoppingCart size={20} />}
                        </button>
)}
                        <Link
                            href={detailUrl}
                            className="flex-1 py-2.5 bg-white border border-[#E62D26] text-[#E62D26] rounded-md text-sm font-normal hover:bg-[#E62D26] hover:text-white transition-all shadow-sm flex items-center justify-center gap-2"
                        >
                            Details
                        </Link>
                    </div>
                </div>
            </div>
        );
    }

    // Grid View Rendering
    return (
        <div className="group w-full h-full flex flex-col">
            <div className={`relative h-full bg-white dark:bg-[#0d0d0d] rounded-md border border-gray-100 dark:border-white/10 overflow-hidden hover:shadow-xl transition-all duration-300 flex flex-col`}>

                {/* Image Section */}
                <div className="relative h-48 w-full overflow-hidden shrink-0 p-3">
                    <Link href={detailUrl} className="block h-full w-full">
                        <img
                            src={productImage}
                            alt={title}
                            className="h-full w-full object-cover rounded-lg transition-transform duration-700 group-hover:scale-105"
                        />
                    </Link>

                    {/* Type Badge (Top Left) */}
                    <div className="absolute top-3 left-3">
                        <span className={`inline-block px-3 py-1 rounded-md text-xs font-bold text-white shadow-sm bg-[#F79952]`}>
                            {type}
                        </span>
                    </div>

                    {/* Rating Badge (Top Right) */}
                    <div className="absolute top-3 right-3 bg-white rounded-md px-2 py-1 flex items-center gap-1 shadow-sm">
                        <FaStar className="text-amber-500 text-xs" />
                        <span className="text-xs font-bold text-slate-800">{rating}</span>
                    </div>

                    {/* Eye Overlay */}
                    <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-black/20 backdrop-blur-[1px]">
                        <Link href={detailUrl} className="w-12 h-12 bg-white/30 backdrop-blur-md rounded-full flex items-center justify-center text-white border border-white/50 hover:bg-[#E62D26] hover:border-[#E62D26] transition-colors">
                            <LuEye className="ml-1" size={20} />
                        </Link>
                    </div>
                </div>

                {/* Content Section */}
                <div className="p-4 flex flex-col flex-1">
                    {/* Category */}
                    <div className="flex items-center gap-2 mb-2 text-slate-500">
                        <LuLayoutGrid className="text-[#E62D26]" />
                        <span className={`text-xs font-medium ${bengaliClass}`}>
                            {categoryName}
                        </span>
                    </div>

                    {/* Title */}
                    <Link href={detailUrl} className="mb-3 block">
                        <h3 className={`text-lg font-bold text-slate-800 leading-tight line-clamp-2 hover:text-[#E62D26] transition-colors ${bengaliClass}`}>
                            {title}
                        </h3>
                    </Link>

                    {/* Metadata */}
                    <div className="flex items-center gap-4 mb-4 text-xs text-slate-500 font-medium pb-4 border-b border-slate-50">
                        <div className="flex items-center gap-1.5">
                            <LuLayers className="text-[#E62D26]" />
                            <span>{version}</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                            <LuUsers className="text-[#E62D26]" />
                            <span>{sales}+ Sales</span>
                        </div>
                    </div>

                    {/* Price & Rating Row */}
                    <div className="flex items-center justify-between mb-4">
                        <div>
                            <p className="text-[10px] text-slate-400 font-medium mb-0.5">Price</p>
                            <div className="flex items-center gap-2">
                                <span className="text-xl font-bold text-[#E62D26] font-outfit">
                                    ?{displayPrice?.toLocaleString()}
                                </span>
                                {hasDiscount && (
                                    <span className="text-xs text-slate-300 line-through">?{originalPrice?.toLocaleString()}</span>
                                )}
                            </div>
                        </div>
                        <div className="flex text-amber-500 gap-0.5 text-xs">
                            {[...Array(5)].map((_, i) => (
                                <FaStar key={i} className={i < Math.round(rating) ? "fill-current" : "text-slate-200"} />
                            ))}
                        </div>
                    </div>

                    {/* Buttons */}
                    <div className="grid grid-cols-2 gap-3 mt-auto">
                        <Link
                            href={detailUrl}
                            className="flex items-center justify-center gap-2 py-2.5 bg-[#E62D26] text-white rounded-md text-sm font-normal hover:bg-[#c41e18] transition-colors"
                        >
                            <LuEye size={16} />
                            Details
                        </Link>
                        {/* Cart hidden */}
{false && (
<button
                            onClick={handleAddToCart}
                            disabled={isAdded}
                            className={`flex items-center justify-center gap-2 py-2.5 border rounded-md text-sm font-normal transition-colors ${isAdded
                                ? 'bg-emerald-500 border-emerald-500 text-white'
                                : 'bg-white border-[#E62D26] text-[#E62D26] hover:bg-red-50'
                                }`}
                        >
                            {isAdded ? <LuCheck size={16} /> : <LuShoppingCart size={16} />}
                            {isAdded ? 'Added' : 'Add To Cart'}
                        </button>
)}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProductCard;
