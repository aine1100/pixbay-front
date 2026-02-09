"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";

export function CalendarWidget() {
    const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
    const dates = Array.from({ length: 30 }, (_, i) => i + 1);

    return (
        <div className="bg-white p-6 rounded-3xl border border-slate-100 h-full flex flex-col">
            <div className="flex items-center justify-between mb-6">
                <h3 className="font-semibold text-slate-700 tracking-tight">June 2025</h3>
                <div className="flex items-center gap-1">
                    <button className="p-1.5 hover:bg-slate-50 rounded-lg text-slate-700 transition-colors">
                        <ChevronLeft className="w-4 h-4" />
                    </button>
                    <button className="p-1.5 hover:bg-slate-50 rounded-lg text-slate-700 transition-colors">
                        <ChevronRight className="w-4 h-4" />
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-7 gap-1 flex-1">
                {days.map(day => (
                    <div key={day} className="text-[10px] font-semibold text-slate-700 uppercase text-center mb-4 tracking-wider">
                        {day}
                    </div>
                ))}
                {dates.map(date => (
                    <div
                        key={date}
                        className={cn(
                            "aspect-square flex items-center justify-center text-xs font-medium rounded-xl transition-all cursor-pointer",
                            date === 19
                                ? "bg-primary text-white scale-110"
                                : "text-slate-700 hover:bg-slate-50"
                        )}
                    >
                        {date}
                    </div>
                ))}
            </div>

            <div className="mt-6 pt-6 border-t border-slate-50 flex items-center justify-between">
                <div className="flex -space-x-2">
                    {[1, 2, 3].map(i => (
                        <div key={i} className="w-8 h-8 rounded-xl border-2 border-white bg-slate-100 overflow-hidden relative">
                            <div className="w-full h-full bg-slate-200"></div>
                        </div>
                    ))}
                </div>
                <p className="text-[11px] font-bold text-primary">3 New Bookings</p>
            </div>
        </div>
    );
}

import { cn } from "@/lib/utils";
