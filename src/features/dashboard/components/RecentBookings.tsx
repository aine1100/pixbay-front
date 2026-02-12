"use client";

import Image from "next/image";
import Link from "next/link";
import { MoreHorizontal, Calendar, ArrowUpRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { useBookings } from "@/features/bookings/hooks/useBookings";
import { Loading } from "@/components/ui/loading";
import { format } from "date-fns";
import { useUserStore } from "@/features/user/store/userStore";

export function RecentBookings() {
    const { user } = useUserStore();
    const role = user?.role || "CLIENT";
    const { data: rawBookings, isLoading } = useBookings();

    const bookings = (rawBookings || []).map((b: any) => {
        const isCreator = role === "CREATOR";
        const otherParty = isCreator ? b.client : b.creator?.user;

        return {
            id: b.id,
            title: b.category || b.serviceType.replace('_', ' '),
            otherPartyName: `${otherParty?.firstName || ''} ${otherParty?.lastName || ''}`,
            date: format(new Date(b.createdAt), "MMM d, yyyy"),
            amount: `$${b.pricing?.totalAmount || 0}`,
            status: b.status.charAt(0) + b.status.slice(1).toLowerCase().replace('_', ' '),
            rawStatus: b.status,
            avatar: otherParty?.profilePicture || `https://ui-avatars.com/api/?name=${otherParty?.firstName || 'P'}+${otherParty?.lastName || 'B'}&background=random`
        };
    });

    if (isLoading) {
        return (
            <div className="bg-white p-6 rounded-[32px] border border-slate-100 flex flex-col h-full min-h-[400px]">
                <div className="flex items-center justify-between mb-8">
                    <h3 className="text-lg font-semibold text-slate-700 tracking-tight">Recent Bookings</h3>
                </div>
                <div className="flex-1 flex flex-col items-center justify-center">
                    <Loading size="md" />
                    <p className="mt-4 text-[11px] text-slate-500 font-medium">Fetching bookings...</p>
                </div>
            </div>
        );
    }
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

            <div className="space-y-4 flex-1 overflow-y-auto pr-1 custom-scrollbar">
                {bookings.length > 0 ? (
                    bookings.slice(0, 3).map((booking: any) => (
                        <div key={booking.id} className="group p-4 bg-slate-50 hover:bg-white border border-transparent hover:border-slate-100 rounded-2xl transition-all cursor-pointer">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-4">
                                    <div className="w-14 h-14 rounded-2xl bg-white border border-slate-100 p-1 flex-shrink-0 relative overflow-hidden">
                                        <Image
                                            src={booking.avatar}
                                            alt={booking.otherPartyName}
                                            fill
                                            className="object-cover rounded-xl"
                                        />
                                    </div>
                                    <div>
                                        <h4 className="text-sm font-semibold text-slate-700 leading-tight mb-1">{booking.title}</h4>
                                        <div className="flex items-center gap-3">
                                            <p className="text-[11px] text-primary font-semibold truncate max-w-[100px]">{booking.otherPartyName}</p>
                                            <div className="w-1 h-1 bg-primary/20 rounded-full"></div>
                                            <div className="flex items-center gap-1.5 text-[11px] text-slate-700 font-medium whitespace-nowrap">
                                                <Calendar className="w-3 h-3 text-primary" />
                                                {booking.date}
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className="text-right">
                                    <span className={cn(
                                        "inline-block px-2 py-0.5 rounded-lg text-[9px] font-semibold mb-2 uppercase tracking-wider",
                                        ["Confirmed", "Completed", "In Progress"].includes(booking.status) ? "bg-red-50 text-primary" : "bg-slate-100 text-slate-600"
                                    )}>
                                        {booking.status}
                                    </span>
                                    <p className="text-base font-semibold text-slate-900 leading-none">{booking.amount}</p>
                                </div>
                            </div>
                        </div>
                    ))
                ) : (
                    <div className="flex-1 flex flex-col items-center justify-center py-10 opacity-60">
                        <div className="w-12 h-12 bg-slate-50 rounded-full flex items-center justify-center mb-4">
                            <Calendar className="w-6 h-6 text-slate-400" />
                        </div>
                        <p className="text-xs font-semibold text-slate-500 uppercase tracking-widest">No bookings yet</p>
                        <p className="text-[10px] text-slate-400 mt-1 italic text-center px-4">Your future sessions will appear here</p>
                    </div>
                )}
            </div>

            <Link href={role === "CREATOR" ? "/creator/bookings" : "/client/bookings"} className="w-full py-4 mt-6 text-xs font-semibold text-slate-700 hover:text-primary transition-colors flex items-center justify-center gap-2 border-t border-slate-100 uppercase tracking-widest">
                View All Bookings
                <ArrowUpRight className="w-4 h-4" />
            </Link>
        </div>
    );
}
