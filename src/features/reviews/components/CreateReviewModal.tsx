"use client";
import React, { useState } from "react";
import { X, Star, MessageSquare, Send } from "lucide-react";
import { cn } from "@/lib/utils";
import { useCreateReview } from "../hooks/useReviews";
import { Button } from "@/components/ui/button";

interface CreateReviewModalProps {
    isOpen: boolean;
    onClose: () => void;
    bookingId: string;
    creatorName: string;
}

export function CreateReviewModal({ isOpen, onClose, bookingId, creatorName }: CreateReviewModalProps) {
    const [rating, setRating] = useState(0);
    const [hoverRating, setHoverRating] = useState(0);
    const [comment, setComment] = useState("");
    
    const createReviewMutation = useCreateReview();

    if (!isOpen) return null;

    const handleSubmit = async () => {
        if (rating === 0) {
            return;
        }

        try {
            await createReviewMutation.mutateAsync({
                bookingId,
                rating,
                comment
            });
            onClose();
        } catch (error) {
            // Error is handled by the hook
        }
    };

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
            <div 
                className="relative w-full max-w-md bg-white rounded-[32px] overflow-hidden border border-slate-100 animate-in zoom-in-95 duration-200 shadow-2xl"
                onClick={(e) => e.stopPropagation()}
            >
                {/* Header */}
                <div className="px-8 py-6 border-b border-slate-50 flex items-center justify-between">
                    <div className="space-y-1">
                        <h2 className="text-xl font-semibold text-slate-900 leading-tight">Rate your experience</h2>
                        <p className="text-[13px] text-slate-500 font-medium">How was your session with {creatorName}?</p>
                    </div>
                    <button 
                        onClick={onClose}
                        className="p-2 hover:bg-slate-50 rounded-full text-slate-400 hover:text-slate-600 transition-colors"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>

                <div className="p-8 space-y-8">
                    {/* Star Rating Section */}
                    <div className="flex flex-col items-center space-y-4">
                        <div className="flex items-center gap-2">
                            {[1, 2, 3, 4, 5].map((star) => (
                                <button
                                    key={star}
                                    type="button"
                                    onClick={() => setRating(star)}
                                    onMouseEnter={() => setHoverRating(star)}
                                    onMouseLeave={() => setHoverRating(0)}
                                    className="p-1 transition-transform active:scale-90"
                                >
                                    <Star 
                                        className={cn(
                                            "w-10 h-10 transition-all duration-200",
                                            (hoverRating || rating) >= star 
                                                ? "text-yellow-400 fill-yellow-400 drop-shadow-[0_0_8px_rgba(250,204,21,0.4)]" 
                                                : "text-slate-200"
                                        )}
                                    />
                                </button>
                            ))}
                        </div>
                        <p className="text-[14px] font-semibold text-slate-900">
                            {rating === 1 ? "Disappointing" :
                             rating === 2 ? "Below Average" :
                             rating === 3 ? "Satisfactory" :
                             rating === 4 ? "Excellent" :
                             rating === 5 ? "Exceptional" : "Choose a rating"}
                        </p>
                    </div>

                    {/* Comment Section */}
                    <div className="space-y-3">
                        <div className="flex items-center gap-2 text-xs font-bold text-slate-400 uppercase tracking-widest ml-1">
                            <MessageSquare className="w-3.5 h-3.5" />
                            <span>Share your thoughts</span>
                        </div>
                        <textarea 
                            placeholder="What did you like about the service? Was there anything that could be better?"
                            rows={4}
                            value={comment}
                            onChange={(e) => setComment(e.target.value)}
                            className="w-full p-5 bg-slate-50 border-none rounded-2xl text-[14px] font-medium placeholder:text-slate-300 focus:ring-1 focus:ring-primary/20 outline-none transition-all resize-none leading-relaxed"
                        />
                    </div>

                    {/* Submit Button */}
                    <button
                        onClick={handleSubmit}
                        disabled={rating === 0 || createReviewMutation.isPending}
                        className={cn(
                            "w-full h-14 rounded-2xl font-bold text-sm uppercase tracking-widest transition-all active:scale-[0.98] flex items-center justify-center gap-3",
                            rating > 0 
                                ? "bg-primary text-white shadow-lg shadow-primary/20 hover:bg-primary/90" 
                                : "bg-slate-100 text-slate-400 cursor-not-allowed"
                        )}
                    >
                        {createReviewMutation.isPending ? (
                            <div className="w-5 h-5 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                        ) : (
                            <>
                                <span>Submit Review</span>
                                <Send className="w-4 h-4" />
                            </>
                        )}
                    </button>
                </div>
            </div>
        </div>
    );
}
