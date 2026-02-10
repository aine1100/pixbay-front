"use client";

import React from "react";
import { Search } from "lucide-react";

export function RecentReviews() {
    return (
        <div className="bg-white rounded-[32px] border border-slate-100 p-8 space-y-8 h-full">
            <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold text-slate-900">Reviews</h2>
            </div>

            <div className="flex flex-col items-center justify-center py-20 text-center space-y-5">
                <p className="text-[14px] font-semibold text-slate-500 max-w-[280px]">
                    No reviews yet! Start your first project to get reviews and ratings from clients
                </p>
                <button className="h-9 px-4 bg-slate-100 text-slate-600 rounded-full text-[11px] font-semibold tracking-wider  transition-colors">
                    Search Project
                </button>
            </div>
        </div>
    );
}
