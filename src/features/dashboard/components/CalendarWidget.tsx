"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

interface CalendarEvent {
    id: string;
    scheduledDate: string;
    booking: {
        bookingNumber: string;
        category: string;
    };
}

interface CalendarWidgetProps {
    events?: CalendarEvent[];
    currentMonth: number;
    currentYear: number;
    onNavigate: (month: number, year: number) => void;
}

export function CalendarWidget({ 
    events = [], 
    currentMonth, 
    currentYear, 
    onNavigate 
}: CalendarWidgetProps) {
    const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
    
    // Get month name for display
    const monthName = new Date(currentYear, currentMonth - 1).toLocaleString('default', { month: 'long' });
    const today = new Date().getDate();
    const isTodayInView = new Date().getMonth() + 1 === currentMonth && new Date().getFullYear() === currentYear;

    // Generate dates for the specific month/year
    const daysInMonth = new Date(currentYear, currentMonth, 0).getDate();
    const dates = Array.from({ length: daysInMonth }, (_, i) => i + 1);

    // Map events to dates (only for the current month being viewed)
    const eventDates = events.map(e => new Date(e.scheduledDate).getDate());

    const handlePrevMonth = () => {
        if (currentMonth === 1) {
            onNavigate(12, currentYear - 1);
        } else {
            onNavigate(currentMonth - 1, currentYear);
        }
    };

    const handleNextMonth = () => {
        if (currentMonth === 12) {
            onNavigate(1, currentYear + 1);
        } else {
            onNavigate(currentMonth + 1, currentYear);
        }
    };

    return (
        <div className="bg-white p-6 rounded-3xl border border-slate-100 h-full flex flex-col">
            <div className="flex items-center justify-between mb-6">
                <h3 className="font-semibold text-slate-700 tracking-tight">{monthName} {currentYear}</h3>
                <div className="flex items-center gap-1">
                    <button 
                        onClick={handlePrevMonth}
                        className="p-1.5 hover:bg-slate-50 rounded-lg text-slate-700 transition-colors"
                    >
                        <ChevronLeft className="w-4 h-4" />
                    </button>
                    <button 
                        onClick={handleNextMonth}
                        className="p-1.5 hover:bg-slate-50 rounded-lg text-slate-700 transition-colors"
                    >
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
                {dates.map(date => {
                    const hasEvent = eventDates.includes(date);
                    const isToday = isTodayInView && date === today;

                    return (
                        <div
                            key={date}
                            className={cn(
                                "aspect-square flex flex-col items-center justify-center text-xs font-medium rounded-xl transition-all cursor-pointer relative",
                                isToday
                                    ? "bg-primary text-white scale-110 shadow-sm"
                                    : "text-slate-700 hover:bg-slate-50"
                            )}
                        >
                            {date}
                            {hasEvent && !isToday && (
                                <div className="absolute bottom-1 w-1 h-1 bg-primary rounded-full"></div>
                            )}
                            {hasEvent && isToday && (
                                <div className="absolute bottom-1 w-1 h-1 bg-white rounded-full"></div>
                            )}
                        </div>
                    );
                })}
            </div>

            <div className="mt-6 pt-6 border-t border-slate-50 flex items-center justify-between">
                <div className="flex -space-x-2">
                    {events.slice(0, 3).map((event, i) => (
                        <div key={event.id} className="w-8 h-8 rounded-xl border-2 border-white bg-slate-100 overflow-hidden relative flex items-center justify-center text-[8px] font-bold text-slate-400">
                             {event.booking.category?.charAt(0) || "B"}
                        </div>
                    ))}
                    {events.length === 0 && Array.from({ length: 3 }).map((_, i) => (
                         <div key={i} className="w-8 h-8 rounded-xl border-2 border-white bg-slate-50 overflow-hidden relative"></div>
                    ))}
                </div>
                <p className="text-[11px] font-semibold text-primary">
                    {events.length > 0 ? `${events.length} Upcoming Sessions` : "No Upcoming Sessions"}
                </p>
            </div>
        </div>
    );
}
