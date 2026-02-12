"use client";

import React from "react";
import { Star, MessageCircle, Calendar, User, Search } from "lucide-react";
import { useCreatorReviews } from "@/features/reviews/hooks/useReviews";
import { cn } from "@/lib/utils";
import { format } from "date-fns";

export default function CreatorReviewsPage() {
    const { data: reviews, isLoading } = useCreatorReviews();

    if (isLoading) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[400px] text-center space-y-4">
                <div className="w-12 h-12 border-4 border-primary/20 border-t-primary rounded-full animate-spin" />
                <p className="text-slate-500 font-medium">Loading your reviews...</p>
            </div>
        );
    }

    const averageRating = reviews?.length
        ? (reviews.reduce((acc: number, rev: any) => acc + rev.rating, 0) / reviews.length).toFixed(1)
        : "0.0";

    return (
        <div className="max-w-[1200px] mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700 pb-20">
            {/* Header / Stats Overlay */}
            <div className="bg-white rounded-[32px] border border-slate-100 p-8 py-12 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full -mr-32 -mt-32 blur-3xl" />
                <div className="absolute bottom-0 left-0 w-64 h-64 bg-primary/5 rounded-full -ml-32 -mb-32 blur-3xl" />

                <div className="relative flex flex-col md:flex-row items-center justify-between gap-8 text-center md:text-left">
                    <div className="space-y-2">
                        <h1 className="text-3xl font-semibold text-slate-900 tracking-tight">Reviews & Ratings</h1>
                        <p className="text-[14px] text-slate-500 font-medium max-w-md">
                            See what your clients are saying about your work and professionalism.
                        </p>
                    </div>

                    <div className="flex items-center gap-12 shrink-0">
                        <div className="text-center md:text-right">
                            <div className="flex items-center gap-2 justify-center md:justify-end">
                                <span className="text-4xl font-semibold text-slate-900">{averageRating}</span>
                                <Star className="w-6 h-6 text-yellow-400 fill-yellow-400" />
                            </div>
                            <p className="text-[12px] font-semibold text-slate-400 uppercase tracking-wider mt-1">Average Rating</p>
                        </div>
                        <div className="text-center md:text-right">
                            <span className="text-4xl font-semibold text-slate-900">{reviews?.length || 0}</span>
                            <p className="text-[12px] font-semibold text-slate-400 uppercase tracking-wider mt-1">Total Reviews</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Reviews List */}
            <div className="space-y-6">
                {!reviews || reviews.length === 0 ? (
                    <div className="bg-white rounded-[32px] border border-slate-100 p-20 text-center flex flex-col items-center space-y-4">
                        <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center">
                            <Star className="w-8 h-8 text-slate-300" />
                        </div>
                        <div className="space-y-1">
                            <h3 className="text-lg font-semibold text-slate-900">No reviews yet</h3>
                            <p className="text-[14px] text-slate-500 font-medium">Complete bookings to start receiving feedback from your clients.</p>
                        </div>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 gap-6">
                        {reviews.map((review: any) => (
                            <div key={review.id} className="bg-white rounded-[32px] border border-slate-100 p-8 space-y-6 transition-all hover:border-slate-200">
                                <div className="flex flex-wrap items-start justify-between gap-6">
                                    <div className="flex items-center gap-4">
                                        <div className="w-14 h-14 rounded-2xl bg-slate-50 overflow-hidden border border-slate-100 flex items-center justify-center text-slate-400">
                                            {review.reviewer.profilePicture ? (
                                                <img src={review.reviewer.profilePicture} alt="" className="w-full h-full object-cover" />
                                            ) : (
                                                <User className="w-6 h-6" />
                                            )}
                                        </div>
                                        <div className="space-y-1">
                                            <h4 className="text-[15px] font-semibold text-slate-900">
                                                {review.reviewer.firstName} {review.reviewer.lastName}
                                            </h4>
                                            <div className="flex items-center gap-1.5">
                                                {[...Array(5)].map((_, i) => (
                                                    <Star 
                                                        key={i} 
                                                        className={cn(
                                                            "w-3.5 h-3.5",
                                                            i < review.rating ? "text-yellow-400 fill-yellow-400" : "text-slate-200"
                                                        )} 
                                                    />
                                                ))}
                                            </div>
                                        </div>
                                    </div>

                                    <div className="flex flex-col items-end gap-1 text-right">
                                        <div className="flex items-center gap-2 text-[12px] font-semibold text-slate-400">
                                            <Calendar className="w-4 h-4" />
                                            {format(new Date(review.createdAt), "MMMM d, yyyy")}
                                        </div>
                                        <p className="text-[12px] font-semibold text-primary uppercase tracking-wider">
                                            {review.booking.category} • {review.booking.bookingNumber}
                                        </p>
                                    </div>
                                </div>

                                <div className="pl-18">
                                    <p className="text-[15px] text-slate-600 font-medium leading-relaxed italic">
                                        "{review.comment || "No comment provided."}"
                                    </p>
                                </div>

                                {review.response && (
                                    <div className="ml-12 p-6 bg-slate-50 rounded-2xl border border-slate-100 space-y-2">
                                        <p className="text-[12px] font-semibold text-slate-400 uppercase tracking-wider">Your Response</p>
                                        <p className="text-[14px] text-slate-600 font-medium italic">
                                            "{review.response.comment}"
                                        </p>
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
