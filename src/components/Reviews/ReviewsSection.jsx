"use client";

import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchProductReviews, markReviewHelpful } from "@/redux/reviewSlice";
import { FaStar, FaUserCircle, FaThumbsUp, FaCheckCircle } from "react-icons/fa";
import { LuMessageSquarePlus, LuLayoutGrid } from "react-icons/lu";
import WriteReviewModal from "./WriteReviewModal";
import { formatDistanceToNow } from "date-fns";
import Image from "next/image";
import { useLanguage } from "@/context/LanguageContext";
import { getTestimonials } from "@/components/Home/testimonialsData";

const ReviewsSection = ({ productId, productType, showTestimonials = false }) => {
    const dispatch = useDispatch();
    const { language, t } = useLanguage();
    const isBn = language === "bn";
    const bengaliClass = isBn ? "hind-siliguri" : "";
    const testimonials = showTestimonials ? getTestimonials(language, t) : [];
    const { reviews, avgRating, totalReviews, loading } = useSelector((state) => state.reviews);
    const [isModalOpen, setIsModalOpen] = useState(false);

    useEffect(() => {
        if (productId) {
            dispatch(fetchProductReviews({ productId }));
        }
    }, [productId, dispatch]);

    const handleHelpful = (reviewId) => {
        dispatch(markReviewHelpful(reviewId));
    };

    return (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 lg:p-8 mt-8">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-8 border-b border-gray-100 pb-8">
                <div>
                    <h2 className={`text-2xl font-bold text-gray-900 outfit mb-2 ${bengaliClass}`}>{isBn ? "গ্রাহকদের রিভিউ" : "Customer Reviews"}</h2>
                    <div className="flex items-center gap-4">
                        <div className="flex items-center gap-1 text-amber-400 text-lg">
                            {[1, 2, 3, 4, 5].map((star) => (
                                <FaStar key={star} className={star <= Math.round(avgRating) ? "fill-amber-400" : "text-gray-200"} />
                            ))}
                        </div>
                        <span className="text-gray-900 font-bold text-xl">{avgRating || 0}</span>
                        <span className={`text-gray-400 text-sm ${bengaliClass}`}>{isBn ? `${totalReviews}টি রিভিউর ভিত্তিতে` : `Based on ${totalReviews} reviews`}</span>
                    </div>
                </div>

                <div className="w-full md:w-auto">
                    <button
                        onClick={() => setIsModalOpen(true)}
                        className="w-full md:w-auto flex items-center justify-center gap-2 px-6 py-3 bg-gray-900 hover:bg-red-600 text-white font-semibold rounded-lg transition-colors shadow-lg shadow-gray-200"
                    >
                        <LuMessageSquarePlus size={18} />
                        {isBn ? "রিভিউ লিখুন" : "Write a Review"}
                    </button>
                    <p className="text-xs text-center md:text-right text-gray-400 mt-2">{isBn ? "শুধুমাত্র ভেরিফায়েড ক্রেতারা" : "Verified purchases only"}</p>
                </div>
            </div>

            {loading ? (
                <div className="grid gap-4">
                    {[1, 2, 3].map((i) => (
                        <div key={i} className="animate-pulse flex gap-4 p-4 border rounded-lg bg-gray-50">
                            <div className="w-12 h-12 bg-gray-200 rounded-full"></div>
                            <div className="flex-1 space-y-2">
                                <div className="h-4 bg-gray-200 rounded w-1/4"></div>
                                <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                            </div>
                        </div>
                    ))}
                </div>
            ) : (reviews.length > 0 || testimonials.length > 0) ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {reviews.map((review) => (
                        <div key={review._id} className="p-6 bg-gray-50/50 rounded-xl border border-gray-100 hover:bg-white hover:shadow-md transition-all">
                            <div className="flex justify-between items-start mb-4">
                                <div className="flex items-center gap-3">
                                    {review.user?.avatar ? (
                                        <img src={review.user.avatar} alt="User" className="w-10 h-10 rounded-full object-cover border border-gray-200" />
                                    ) : (
                                        <div className="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center text-red-600">
                                            <FaUserCircle size={24} />
                                        </div>
                                    )}
                                    <div>
                                        <h4 className="font-bold text-gray-900 text-sm">
                                            {review.user?.firstName} {review.user?.lastName}
                                        </h4>
                                        <span className="text-xs text-gray-400">
                                            {review.createdAt ? formatDistanceToNow(new Date(review.createdAt), { addSuffix: true }) : 'Recently'}
                                        </span>
                                    </div>
                                </div>
                                <div className="flex text-amber-400 text-xs gap-0.5">
                                    {[1, 2, 3, 4, 5].map((star) => (
                                        <FaStar key={star} className={star <= review.rating ? "fill-amber-400" : "text-gray-200"} />
                                    ))}
                                </div>
                            </div>

                            {review.title && <h5 className="font-bold text-gray-800 mb-2">{review.title}</h5>}
                            <p className="text-gray-600 text-sm leading-relaxed mb-4">{review.comment}</p>

                            <div className="flex items-center justify-between pt-4 border-t border-gray-200/50">
                                {review.isVerifiedPurchase && (
                                    <div className="flex items-center gap-1.5 text-xs font-semibold text-emerald-600 bg-emerald-50 px-2 py-1 rounded-full">
                                        <FaCheckCircle size={14} /> {isBn ? "ভেরিফায়েড" : "Verified Purchase"}
                                    </div>
                                )}

                                <button
                                    onClick={() => handleHelpful(review._id)}
                                    className="flex items-center gap-1.5 text-gray-400 hover:text-red-600 text-xs font-medium transition-colors ml-auto"
                                >
                                    <FaThumbsUp size={12} />
                                    {isBn ? "সহায়ক" : "Helpful"} ({review.helpfulCount || 0})
                                </button>
                            </div>
                        </div>
                    ))}

                    {testimonials.map((item) => (
                        <div key={`testimonial-${item.id}`} className="p-6 bg-gray-50/50 rounded-xl border border-gray-100 hover:bg-white hover:shadow-md transition-all flex flex-col">
                            <div className="flex text-amber-400 text-xs gap-0.5 mb-3">
                                {[1, 2, 3, 4, 5].map((star) => <FaStar key={star} />)}
                            </div>
                            <h5 className={`font-bold mb-2 ${item.titleColor} ${bengaliClass}`}>{item.title}</h5>
                            <p className={`text-gray-600 text-sm leading-relaxed mb-5 flex-1 ${bengaliClass}`}>{item.review}</p>
                            <div className="flex items-center gap-3 pt-4 border-t border-gray-200/50">
                                <div className="relative w-10 h-10 rounded-full overflow-hidden border border-gray-200">
                                    <Image src={item.avatar} alt={item.name} fill className="object-cover" />
                                </div>
                                <div>
                                    <p className={`font-bold text-gray-900 text-sm ${bengaliClass}`}>{item.name}</p>
                                    <p className={`text-gray-400 text-xs ${bengaliClass}`}>{item.designation}</p>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <div className="text-center py-12 bg-gray-50 rounded-xl border border-dashed border-gray-200">
                    <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mx-auto mb-4 shadow-sm text-gray-300">
                        <LuLayoutGrid size={24} />
                    </div>
                    <h3 className="text-lg font-bold text-gray-900 mb-2">{isBn ? "এখনো কোনো রিভিউ নেই" : "No Reviews Yet"}</h3>
                    <p className="text-gray-500 text-sm max-w-xs mx-auto">{isBn ? "আপনিই প্রথম আপনার অভিজ্ঞতা শেয়ার করুন।" : "Be the first to share your experience with this product."}</p>
                </div>
            )}

            <WriteReviewModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                productId={productId}
                productType={productType}
            />
        </div>
    );
};

export default ReviewsSection;
