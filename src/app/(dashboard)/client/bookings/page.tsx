"use client";

import { useState, useMemo, useEffect, useRef } from "react";
import { Search, Calendar, MoreVertical, CheckCircle2, Clock, XCircle, Eye, MessageCircle, X } from "lucide-react";
import NextImage from "next/image";
import Link from "next/link";
import { cn } from "@/lib/utils";

// Mock data (matches the image provided)
const BOOKINGS_DATA = [
    {
        id: "b1",
        eventTitle: "Wedding",
        creator: {
            name: "Chris MUSA",
            avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=150",
            isVerified: false
        },
        date: "Aug 12, 2026",
        status: "Confirmed",
        price: 250,
        image: "https://images.unsplash.com/photo-1519741497674-611481863552?q=80&w=400"
    },
    {
        id: "b2",
        eventTitle: "Bridal Shower",
        creator: {
            name: "Christina Williams",
            avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=150",
            isVerified: false
        },
        date: "May 11, 2026",
        status: "Pending",
        price: 100,
        image: "https://images.unsplash.com/photo-1511795409834-ef04bbd61622?q=80&w=400"
    },
    {
        id: "b3",
        eventTitle: "Birthday",
        creator: {
            name: "Emmanuel Mensah",
            avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=150",
            isVerified: true
        },
        date: "April 1, 2026",
        status: "Completed",
        price: 80,
        image: "https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?q=80&w=400"
    },
    {
        id: "b4",
        eventTitle: "Nathalie's Baby shower",
        creator: {
            name: "Diana Ken",
            avatar: "https://images.unsplash.com/photo-1531123897727-8f129e16fd3c?q=80&w=150",
            isVerified: false
        },
        date: "Feb 12, 2026",
        status: "Confirmed",
        price: 70,
        image: "https://images.unsplash.com/photo-1519703902419-f42c30412230?q=80&w=400"
    }
];

const FILTER_TABS = ["All", "Approved", "Cancelled", "Pending"];

export default function MyBookingsPage() {
    const [activeTab, setActiveTab] = useState("All");
    const [searchQuery, setSearchQuery] = useState("");
    const [openMenuId, setOpenMenuId] = useState<string | null>(null);
    const menuRef = useRef<HTMLDivElement | null>(null);

    // Close menu on click outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
                setOpenMenuId(null);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const filteredBookings = useMemo(() => {
        return BOOKINGS_DATA.filter((booking) => {
            const matchesTab =
                activeTab === "All" ||
                (activeTab === "Approved" && (booking.status === "Confirmed" || booking.status === "Completed")) ||
                (activeTab === "Cancelled" && booking.status === "Cancelled") ||
                (activeTab === "Pending" && booking.status === "Pending");

            const matchesSearch =
                booking.creator.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                booking.eventTitle.toLowerCase().includes(searchQuery.toLowerCase());

            return matchesTab && matchesSearch;
        });
    }, [activeTab, searchQuery]);

    return (
        <div className="max-w-[1400px] mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
            <div>
                <h1 className="text-2xl font-semibold text-[#111827] tracking-tight">My Bookings</h1>
            </div>

            <div className="bg-white rounded-[24px] border border-slate-100 p-8 shadow-none space-y-8">
                {/* Filter & Search Bar */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-6 border-b border-slate-50">
                    <div className="flex p-1 bg-slate-50 rounded-xl w-fit">
                        {FILTER_TABS.map((tab) => (
                            <button
                                key={tab}
                                onClick={() => setActiveTab(tab)}
                                className={cn(
                                    "px-6 py-2 rounded-lg text-sm font-semibold transition-all",
                                    activeTab === tab
                                        ? "bg-[#FF3B30] text-white shadow-sm"
                                        : "text-slate-500 hover:text-slate-900"
                                )}
                            >
                                {tab}
                            </button>
                        ))}
                    </div>

                    <div className="relative w-full md:w-80">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                        <input
                            type="text"
                            placeholder="Find creators"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full h-11 pl-12 pr-4 bg-slate-50 border-none rounded-xl text-sm font-medium placeholder:text-slate-400 focus:ring-2 focus:ring-[#FF3B30] outline-none transition-all"
                        />
                    </div>
                </div>

                {/* Bookings List */}
                <div className="space-y-4">
                    {filteredBookings.length > 0 ? (
                        filteredBookings.map((booking) => (
                            <div
                                key={booking.id}
                                className="group flex flex-col sm:flex-row items-start sm:items-center justify-between p-6 rounded-2xl border border-slate-100 hover:border-[#FF3B30]/5 transition-all gap-8"
                            >
                                <div className="flex items-center gap-8">
                                    {/* Event Image */}
                                    <div className="w-24 h-24 rounded-2xl overflow-hidden relative flex-shrink-0 bg-slate-50 border border-slate-50">
                                        <NextImage
                                            src={booking.image}
                                            alt={booking.eventTitle}
                                            fill
                                            className="object-cover"
                                        />
                                    </div>

                                    {/* Booking Info */}
                                    <div className="space-y-2">
                                        <h3 className="text-xl font-semibold text-slate-900 tracking-tight">{booking.eventTitle}</h3>
                                        <div className="flex items-center gap-2">
                                            <div className="w-7 h-7 rounded-full overflow-hidden relative ring-1 ring-slate-100">
                                                <NextImage
                                                    src={booking.creator.avatar}
                                                    alt={booking.creator.name}
                                                    fill
                                                    className="object-cover"
                                                />
                                            </div>
                                            <span className="text-sm font-semibold text-slate-600">
                                                {booking.creator.name}
                                                {booking.creator.isVerified && (
                                                    <CheckCircle2 className="inline w-3.5 h-3.5 text-blue-500 ml-1.5 fill-blue-500/10" />
                                                )}
                                            </span>
                                        </div>
                                        <div className="flex items-center gap-2 text-slate-400">
                                            <Calendar className="w-4 h-4" />
                                            <span className="text-sm font-medium">{booking.date}</span>
                                        </div>
                                    </div>
                                </div>

                                <div className="flex items-center gap-10 w-full sm:w-auto justify-between sm:justify-end">
                                    {/* Status Badge */}
                                    <StatusBadge status={booking.status} />

                                    {/* Price & Action */}
                                    <div className="flex items-center gap-8 relative">
                                        <span className="text-2xl font-semibold text-slate-900 tracking-tight">${booking.price}</span>
                                        <div className="relative">
                                            <button
                                                onClick={() => setOpenMenuId(openMenuId === booking.id ? null : booking.id)}
                                                className={cn(
                                                    "p-2 text-slate-400 hover:text-slate-900 hover:bg-slate-50 rounded-xl transition-all",
                                                    openMenuId === booking.id && "bg-slate-50 text-slate-900"
                                                )}
                                            >
                                                <MoreVertical className="w-6 h-6" />
                                            </button>

                                            {/* Action Dropdown */}
                                            {openMenuId === booking.id && (
                                                <div
                                                    ref={menuRef}
                                                    className="absolute right-0 top-full mt-2 w-48 bg-white rounded-2xl border border-slate-100 shadow-xl shadow-slate-200/50 p-2 z-50 animate-in fade-in slide-in-from-top-2 duration-200"
                                                >
                                                    <Link
                                                        href={`/client/bookings/${booking.id}`}
                                                        className="w-full flex items-center gap-3 px-3 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-50 rounded-xl transition-all text-left"
                                                    >
                                                        <Eye className="w-4 h-4 text-slate-400" />
                                                        View Details
                                                    </Link>
                                                    <button className="w-full flex items-center gap-3 px-3 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-50 rounded-xl transition-all text-left">
                                                        <MessageCircle className="w-4 h-4 text-slate-400" />
                                                        Message Creator
                                                    </button>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))
                    ) : (
                        <div className="py-12 text-center space-y-4">
                            <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mx-auto text-slate-300">
                                <Calendar className="w-8 h-8" />
                            </div>
                            <h3 className="text-lg font-semibold text-slate-900">No bookings found</h3>
                            <p className="text-slate-500 text-sm max-w-xs mx-auto">
                                We couldn&apos;t find any bookings matching your current filters or search query.
                            </p>
                            {(activeTab !== "All" || searchQuery) && (
                                <button
                                    onClick={() => { setActiveTab("All"); setSearchQuery(""); }}
                                    className="text-[#FF3B30] font-semibold text-sm hover:underline"
                                >
                                    Clear all filters
                                </button>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

function StatusBadge({ status }: { status: string }) {
    const config: Record<string, { bg: string, text: string, label?: string }> = {
        Confirmed: {
            bg: "bg-[#E0F2FE]",
            text: "text-[#0369A1]",
            label: "Confirmed"
        },
        Pending: {
            bg: "bg-[#FEF9C3]",
            text: "text-[#A16207]",
            label: "Pending"
        },
        Completed: {
            bg: "bg-[#DCFCE7]",
            text: "text-[#16A34A]",
            label: "completed"
        },
        Cancelled: {
            bg: "bg-red-50",
            text: "text-[#FF3B30]",
            label: "Cancelled"
        }
    };

    const style = config[status] || config.Pending;

    return (
        <span className={cn(
            "px-5 py-1.5 rounded-xl text-[12px] font-semibold",
            style.bg,
            style.text
        )}>
            {style.label}
        </span>
    );
}
