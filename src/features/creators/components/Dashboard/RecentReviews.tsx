"use client";

import React from "react";
import { Star, ArrowRight, User } from "lucide-react";
import { useCreatorReviews } from "@/features/reviews/hooks/useReviews";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { format } from "date-fns";

export function RecentReviews() {
    const { data: reviews, isLoading } = useCreatorReviews();

    const latestReviews = reviews?.slice(0, 2) || [];

    return (
        <div className="bg-white rounded-[32px] border border-slate-100 p-8 space-y-8 h-full flex flex-col">
            <div className="flex items-center justify-between">
                <div className="space-y-1">
                    <h2 className="text-xl font-semibold text-slate-900 tracking-tight">Reviews</h2>
                    <p className="text-[13px] text-slate-500 font-medium">Recent client feedback</p>
                </div>
                {reviews && reviews.length > 0 && (
                    <Link href="/creator/reviews">
                        <button className="text-[13px] font-semibold text-primary hover:underline flex items-center gap-1.5 transition-all">
                            View all
                            <ArrowRight className="w-3.5 h-3.5" />
                        </button>
                    </Link>
                )}
            </div>

            {isLoading ? (
                <div className="flex-1 flex flex-col items-center justify-center py-12 space-y-3">
                    <div className="w-8 h-8 border-2 border-primary/20 border-t-primary rounded-full animate-spin" />
                    <p className="text-[13px] text-slate-400 font-medium">Loading reviews...</p>
                </div>
            ) : latestReviews.length === 0 ? (
                <div className="flex-1 flex flex-col items-center justify-center py-12 text-center space-y-5">
                    <div className="w-12 h-12 bg-slate-50 rounded-full flex items-center justify-center">
                        <Star className="w-6 h-6 text-slate-300" />
                    </div>
                    <div className="space-y-1">
                        <p className="text-[14px] font-semibold text-slate-600">No reviews yet!</p>
                        <p className="text-[12px] text-slate-400 font-medium max-w-[240px]">
                            Complete bookings to start receiving feedback from your clients.
                        </p>
                    </div>
                </div>
            ) : (
                <div className="space-y-6 flex-1">
                    {latestReviews.map((review: any) => (
                        <div key={review.id} className="p-6 bg-slate-50 rounded-3xl border border-slate-100 space-y-4">
                            <div className="flex items-center justify-between gap-4">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-xl bg-white border border-slate-100 flex items-center justify-center text-slate-400 overflow-hidden shrink-0">
                                        {review.reviewer.profilePicture ? (
                                            <img src={review.reviewer.profilePicture} alt="" className="w-full h-full object-cover" />
                                        ) : (
                                            <User className="w-5 h-5" />
                                        )}
                                    </div>
                                    <div className="space-y-0.5">
                                        <h4 className="text-[13px] font-semibold text-slate-900">
                                            {review.reviewer.firstName} {review.reviewer.lastName}
                                        </h4>
                                        <div className="flex items-center gap-1">
                                            {[...Array(5)].map((_, i) => (
                                                <Star 
                                                    key={i} 
                                                    className={cn(
                                                        "w-2.5 h-2.5",
                                                        i < review.rating ? "text-yellow-400 fill-yellow-400" : "text-slate-200"
                                                    )} 
                                                />
                                            ))}
                                        </div>
                                    </div>
                                </div>
                                <span className="text-[11px] font-semibold text-slate-400">
                                    {format(new Date(review.createdAt), "MMM d, yyyy")}
                                </span>
                            </div>
                            <p className="text-[13px] text-slate-600 font-medium line-clamp-2 italic">
                                "{review.comment || "No comment provided."}"
                            </p>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
