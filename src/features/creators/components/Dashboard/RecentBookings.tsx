"use client";

import React from "react";
import { Calendar } from "lucide-react";

export function RecentBookings() {
    return (
        <div className="bg-white rounded-[32px] border border-slate-100 p-8 space-y-8 h-full">
            <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold text-slate-900">Recent Bookings</h2>
            </div>

            <div className="flex flex-col items-center justify-center py-12 text-center space-y-4">
                <div className="w-16 h-16 rounded-full bg-slate-50 flex items-center justify-center text-slate-200">
                    <Calendar className="w-8 h-8" />
                </div>
                <div className="space-y-1">
                    <p className="text-[14px] font-semibold text-slate-600">You have no recent bookings!</p>
                    <p className="text-[12px] text-slate-400 font-medium">When you get booked, they will appear here.</p>
                </div>
            </div>
        </div>
    );
}
