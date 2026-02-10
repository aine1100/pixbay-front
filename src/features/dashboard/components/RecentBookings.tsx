"use client";

import Image from "next/image";
import { MoreHorizontal, Calendar, ArrowUpRight } from "lucide-react";
import { cn } from "@/lib/utils";

const BOOKINGS = [
    {
        id: "1",
        title: "Wedding",
        creator: "Chris MUSA",
        date: "Aug 12, 2024",
        amount: "$250",
        status: "Approved",
        avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=100&h=100&auto=format&fit=crop"
    },
    {
        id: "2",
        title: "Bridal Shower",
        creator: "Christina Williams",
        date: "May 11, 2024",
        amount: "$100",
        status: "Pending",
        avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=100&h=100&auto=format&fit=crop"
    },
    {
        id: "3",
        title: "Birthday",
        creator: "Emmanuel Mensah",
        date: "April 1, 2024",
        amount: "$80",
        status: "Approved",
        avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=100&h=100&auto=format&fit=crop"
    }
];

export function RecentBookings() {
    return (
        <div className="bg-white p-6 rounded-[32px] border border-slate-100 overflow-hidden flex flex-col h-full">
            <div className="flex items-center justify-between mb-8">
                <div>
                    <h3 className="text-lg font-semibold text-slate-700 tracking-tight">Recent Bookings</h3>
                    <p className="text-[11px] text-slate-700 font-medium tracking-tight ">Tracking your latest project sessions</p>
                </div>
                <button className="p-2 hover:bg-slate-50 rounded-xl text-slate-700 transition-colors">
                    <MoreHorizontal className="w-5 h-5" />
                </button>
            </div>

            <div className="space-y-4 flex-1">
                {BOOKINGS.map((booking) => (
                    <div key={booking.id} className="group p-4 bg-slate-50 hover:bg-white border border-transparent hover:border-slate-100 rounded-2xl transition-all cursor-pointer">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-4">
                                <div className="w-14 h-14 rounded-2xl bg-white border border-slate-100 p-1 flex-shrink-0 relative overflow-hidden">
                                    <Image
                                        src={booking.avatar}
                                        alt={booking.creator}
                                        fill
                                        className="object-cover rounded-xl"
                                    />
                                </div>
                                <div>
                                    <h4 className="text-sm font-semibold text-slate-700 leading-tight mb-1">{booking.title}</h4>
                                    <div className="flex items-center gap-3">
                                        <p className="text-[11px] text-primary font-semibold">{booking.creator}</p>
                                        <div className="w-1 h-1 bg-primary/20 rounded-full"></div>
                                        <div className="flex items-center gap-1.5 text-[11px] text-slate-700 font-medium">
                                            <Calendar className="w-3 h-3 text-primary" />
                                            {booking.date}
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="text-right">
                                <span className={cn(
                                    "inline-block px-2 py-0.5 rounded-lg text-[9px] font-semibold mb-2 uppercase tracking-wider",
                                    booking.status === "Approved" ? "bg-red-50 text-primary" : "bg-slate-100 text-slate-600"
                                )}>
                                    {booking.status}
                                </span>
                                <p className="text-base font-semibold text-slate-900 leading-none">{booking.amount}</p>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            <button className="w-full py-4 mt-6 text-xs font-semibold text-slate-700 hover:text-primary transition-colors flex items-center justify-center gap-2 border-t border-slate-100 uppercase tracking-widest">
                View All Bookings
                <ArrowUpRight className="w-4 h-4" />
            </button>
        </div>
    );
}
