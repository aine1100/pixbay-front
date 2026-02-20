"use client";

import React from "react";
import { Calendar, User } from "lucide-react";
import { format } from "date-fns";

interface Booking {
    id: string;
    bookingNumber: string;
    status: string;
    createdAt: string;
    client: {
        firstName: true;
        lastName: true;
        profilePicture: true;
    };
}

interface RecentBookingsProps {
    bookings?: any[];
    isLoading?: boolean;
}

export function RecentBookings({ bookings = [], isLoading = false }: RecentBookingsProps) {
    return (
        <div className="bg-white rounded-[32px] border border-slate-100 p-8 flex flex-col h-full overflow-hidden">
            <div className="flex items-center justify-between mb-8">
                <div className="space-y-1">
                    <h2 className="text-xl font-semibold text-slate-900 tracking-tight">Recent Bookings</h2>
                    <p className="text-[13px] text-slate-500 font-medium">Your latest appointments</p>
                </div>
            </div>

            <div className="flex-1 overflow-y-auto pr-2 custom-scrollbar max-h-[350px]">
                {isLoading ? (
                    <div className="flex flex-col items-center justify-center py-12 space-y-3 animate-pulse">
                        <div className="w-8 h-8 border-2 border-primary/20 border-t-primary rounded-full animate-spin" />
                        <p className="text-[13px] text-slate-400 font-medium tracking-tight">Fetching bookings...</p>
                    </div>
                ) : bookings.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-12 text-center space-y-4">
                        <div className="w-16 h-16 rounded-full bg-slate-50 flex items-center justify-center text-slate-200">
                            <Calendar className="w-8 h-8" />
                        </div>
                        <div className="space-y-1">
                            <p className="text-[14px] font-semibold text-slate-600">No recent bookings!</p>
                            <p className="text-[12px] text-slate-400 font-medium">When you get booked, they will appear here.</p>
                        </div>
                    </div>
                ) : (
                    <div className="space-y-4">
                        {bookings.map((booking) => (
                            <div key={booking.id} className="flex items-center gap-4 p-4 rounded-2xl border border-slate-50 hover:bg-slate-50 transition-all group">
                                <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center text-slate-400 overflow-hidden shrink-0">
                                    {booking.client?.profilePicture ? (
                                        <img src={booking.client.profilePicture} alt="" className="w-full h-full object-cover" />
                                    ) : (
                                        <User className="w-5 h-5" />
                                    )}
                                </div>
                                <div className="flex-1 min-w-0">
                                    <div className="flex items-center justify-between gap-2 mb-0.5">
                                        <h4 className="text-[13px] font-semibold text-slate-900 truncate">
                                            {booking.client?.firstName} {booking.client?.lastName}
                                        </h4>
                                        <span className="text-[11px] font-bold text-slate-400">
                                            {format(new Date(booking.createdAt), "MMM d")}
                                        </span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <span className="text-[11px] font-medium text-slate-500 uppercase tracking-wider">
                                            #{booking.bookingNumber}
                                        </span>
                                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-tight ${booking.status === "COMPLETED" ? "bg-green-100 text-green-700" :
                                                booking.status === "CONFIRMED" ? "bg-blue-100 text-blue-700" :
                                                    "bg-amber-100 text-amber-700"
                                            }`}>
                                            {booking.status}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
