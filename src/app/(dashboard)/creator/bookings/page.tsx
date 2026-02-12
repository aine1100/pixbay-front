"use client"
import { useState, useMemo, useEffect, useRef } from "react";
import { Search, Calendar, MoreVertical, CheckCircle2, Clock, XCircle, Eye, MessageCircle, X, Check, Ban } from "lucide-react";
import NextImage from "next/image";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { useBookings, useUpdateBookingStatus } from "@/features/bookings/hooks/useBookings";
import { Loading } from "@/components/ui/loading";
import { toast } from "react-hot-toast";
const FILTER_TABS = ["All", "Pending", "Confirmed", "In Progress", "Completed", "Cancelled"];

export default function CreatorBookingsPage() {
    const [activeTab, setActiveTab] = useState("All");
    const [searchQuery, setSearchQuery] = useState("");
    const [openMenuId, setOpenMenuId] = useState<string | null>(null);
    const menuRef = useRef<HTMLDivElement | null>(null);

    const { data: rawBookings, isLoading } = useBookings();
    const updateStatusMutation = useUpdateBookingStatus();

    const bookings = useMemo(() => {
        return (rawBookings || []).map((b: any) => ({
            id: b.id,
            bookingNumber: b.bookingNumber,
            client: {
                name: `${b.client?.firstName || ''} ${b.client?.lastName || ''}`,
                avatar: b.client?.profilePicture || `https://ui-avatars.com/api/?name=${b.client?.firstName || 'C'}+${b.client?.lastName || 'U'}&background=random`,
                email: b.client?.email
            },
            date: new Date(b.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
            status: b.status.charAt(0) + b.status.slice(1).toLowerCase().replace('_', ' '),
            rawStatus: b.status,
            price: b.pricing?.totalAmount || 0,
            type: b.category || b.serviceType?.replace('_', ' ') || "Photography",
            location: b.bookingDetails?.location || "Remote",
            createdAt: b.createdAt
        }));
    }, [rawBookings]);

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
        return bookings.filter((booking: any) => {
            const matchesTab =
                activeTab === "All" ||
                (activeTab === "Pending" && booking.rawStatus === "PENDING") ||
                (activeTab === "Confirmed" && booking.rawStatus === "CONFIRMED") ||
                (activeTab === "In Progress" && booking.rawStatus === "IN_PROGRESS") ||
                (activeTab === "Completed" && booking.rawStatus === "COMPLETED") ||
                (activeTab === "Cancelled" && booking.rawStatus === "CANCELLED");

            const matchesSearch =
                booking.client.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                booking.bookingNumber.toLowerCase().includes(searchQuery.toLowerCase());

            return matchesTab && matchesSearch;
        });
    }, [activeTab, searchQuery, bookings]);

    const handleUpdateStatus = async (id: string, status: string) => {
        try {
            await updateStatusMutation.mutateAsync({ id, status });
            toast.success(`Booking ${status.toLowerCase()} successfully`);
            setOpenMenuId(null);
        } catch (error: any) {
            toast.error(error.message || "Failed to update booking status");
        }
    };

    if (isLoading) {
        return (
            <div className="flex-1 flex flex-col items-center justify-center py-20 bg-white rounded-[24px] border border-slate-100 min-h-[500px]">
                <Loading size="lg" />
                <p className="mt-4 text-slate-500 font-medium animate-pulse">Loading bookings...</p>
            </div>
        );
    }

    return (
        <div className="max-w-[1400px] mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-semibold text-[#111827] tracking-tight">Manage Bookings</h1>
                    <p className="text-slate-500 text-sm mt-1">Accept or decline incoming booking requests from clients.</p>
                </div>
            </div>

            <div className="bg-white rounded-[24px] border border-slate-100 p-8 shadow-none space-y-8">
                {/* Filter & Search Bar */}
                <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-6 pb-6 border-b border-slate-50">
                    <div className="flex p-1 bg-slate-50 rounded-xl w-fit overflow-x-auto max-w-full no-scrollbar">
                        {FILTER_TABS.map((tab) => (
                            <button
                                key={tab}
                                onClick={() => setActiveTab(tab)}
                                className={cn(
                                    "px-5 py-2 rounded-lg text-sm font-semibold transition-all whitespace-nowrap",
                                    activeTab === tab
                                        ? "bg-primary text-white shadow-sm"
                                        : "text-slate-500 hover:text-slate-900"
                                )}
                            >
                                {tab}
                            </button>
                        ))}
                    </div>

                    <div className="relative w-full xl:w-80">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                        <input
                            type="text"
                            placeholder="Search by client or booking"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full h-11 pl-12 pr-4 bg-slate-50 border-none rounded-xl text-sm font-medium placeholder:text-slate-400 focus:ring-2 focus:ring-primary outline-none transition-all"
                        />
                    </div>
                </div>

                {/* Bookings List */}
                <div className="space-y-4">
                    {filteredBookings.length > 0 ? (
                        filteredBookings.map((booking: any) => (
                            <div
                                key={booking.id}
                                className="group flex flex-col lg:flex-row lg:items-center justify-between p-6 rounded-2xl border border-slate-100 hover:border-primary/5 transition-all gap-8"
                            >
                                <div className="flex items-center gap-6">
                                    {/* Client Avatar */}
                                    <div className="w-16 h-16 rounded-2xl overflow-hidden relative flex-shrink-0 bg-slate-50 border border-slate-50">
                                        <NextImage
                                            src={booking.client.avatar}
                                            alt={booking.client.name}
                                            fill
                                            className="object-cover"
                                        />
                                    </div>

                                    {/* Booking Info */}
                                    <div className="space-y-1">
                                        <div className="flex items-center gap-2">
                                            <h3 className="text-lg font-semibold text-slate-900 tracking-tight">{booking.client.name}</h3>
                                            <span className="text-[10px] font-bold text-slate-300">#{booking.bookingNumber}</span>
                                        </div>
                                        <div className="flex items-center gap-4 text-sm font-medium text-slate-500">
                                            <span className="flex items-center gap-1.5">
                                                <Calendar className="w-3.5 h-3.5" />
                                                {booking.date}
                                            </span>
                                            <span className="w-1 h-1 bg-slate-300 rounded-full" />
                                            <span>{booking.type}</span>
                                        </div>
                                        <p className="text-xs text-slate-400 flex items-center gap-1">
                                            <span className="w-1.5 h-1.5 bg-slate-200 rounded-full" />
                                            {booking.location}
                                        </p>
                                    </div>
                                </div>

                                <div className="flex items-center gap-8 w-full lg:w-auto justify-between lg:justify-end border-t lg:border-none pt-4 lg:pt-0">
                                    {/* Status Badge */}
                                    <StatusBadge status={booking.rawStatus} />

                                    {/* Price & Action */}
                                    <div className="flex items-center gap-6 relative">
                                        <div className="text-right">
                                            <span className="text-xl font-bold text-slate-900 tracking-tight">${booking.price}</span>
                                            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Total Amount</p>
                                        </div>

                                        <div className="flex items-center gap-2">
                                            {booking.rawStatus === "PENDING" && (
                                                <>
                                                    <button
                                                        onClick={() => handleUpdateStatus(booking.id, "CONFIRMED")}
                                                        disabled={updateStatusMutation.isPending}
                                                        className="p-2.5 bg-green-50 text-green-600 hover:bg-green-100 rounded-xl transition-all"
                                                        title="Approve Booking"
                                                    >
                                                        <Check className="w-5 h-5" />
                                                    </button>
                                                    <button
                                                        onClick={() => handleUpdateStatus(booking.id, "CANCELLED")}
                                                        disabled={updateStatusMutation.isPending}
                                                        className="p-2.5 bg-red-50 text-red-600 hover:bg-red-100 rounded-xl transition-all"
                                                        title="Decline Booking"
                                                    >
                                                        <X className="w-5 h-5" />
                                                    </button>
                                                </>
                                            )}

                                            <div className="relative">
                                                <button
                                                    onClick={() => setOpenMenuId(openMenuId === booking.id ? null : booking.id)}
                                                    className={cn(
                                                        "p-2.5 text-slate-400 hover:text-slate-900 hover:bg-slate-50 rounded-xl transition-all",
                                                        openMenuId === booking.id && "bg-slate-50 text-slate-900"
                                                    )}
                                                >
                                                    <MoreVertical className="w-5 h-5" />
                                                </button>

                                                {/* Action Dropdown */}
                                                {openMenuId === booking.id && (
                                                    <div
                                                        ref={menuRef}
                                                        className="absolute right-0 top-full mt-2 w-56 bg-white rounded-2xl border border-slate-100 shadow-xl shadow-slate-200/50 p-2 z-50 animate-in fade-in slide-in-from-top-2 duration-200"
                                                    >
                                                        <Link
                                                            href={`/creator/bookings/${booking.id}`}
                                                            className="w-full flex items-center gap-3 px-3 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-50 rounded-xl transition-all text-left"
                                                        >
                                                            <Eye className="w-4 h-4 text-slate-400" />
                                                            View Details
                                                        </Link>
                                                        <button className="w-full flex items-center gap-3 px-3 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-50 rounded-xl transition-all text-left">
                                                            <MessageCircle className="w-4 h-4 text-slate-400" />
                                                            Message Client
                                                        </button>
                                                        {booking.rawStatus === "CONFIRMED" && (
                                                            <button
                                                                onClick={() => handleUpdateStatus(booking.id, "CANCELLED")}
                                                                className="w-full flex items-center gap-3 px-3 py-2.5 text-sm font-semibold text-red-600 hover:bg-red-50 rounded-xl transition-all text-left"
                                                            >
                                                                <Ban className="w-4 h-4 text-red-400" />
                                                                Cancel Booking
                                                            </button>
                                                        )}
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))
                    ) : (
                        <div className="py-20 text-center space-y-4">
                            <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mx-auto text-slate-200">
                                <Calendar className="w-10 h-10" />
                            </div>
                            <div className="max-w-xs mx-auto space-y-2">
                                <h3 className="text-xl font-semibold text-slate-900">No bookings found</h3>
                                <p className="text-slate-500 text-sm">
                                    We couldn&apos;t find any bookings matching your current filters or search query.
                                </p>
                            </div>
                            {(activeTab !== "All" || searchQuery) && (
                                <button
                                    onClick={() => { setActiveTab("All"); setSearchQuery(""); }}
                                    className="text-primary font-bold text-sm tracking-tight border-b-2 border-primary/20 hover:border-primary transition-all pb-0.5"
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
        CONFIRMED: {
            bg: "bg-[#E0F2FE]",
            text: "text-[#0369A1]",
            label: "Confirmed"
        },
        IN_PROGRESS: {
            bg: "bg-[#F0FDF4]",
            text: "text-[#16A34A]",
            label: "In Progress"
        },
        PENDING: {
            bg: "bg-orange-50",
            text: "text-orange-600",
            label: "Pending"
        },
        COMPLETED: {
            bg: "bg-[#DCFCE7]",
            text: "text-[#16A34A]",
            label: "Completed"
        },
        CANCELLED: {
            bg: "bg-red-50",
            text: "text-primary",
            label: "Cancelled"
        },
        DISPUTED: {
            bg: "bg-slate-100",
            text: "text-slate-600",
            label: "Disputed"
        }
    };

    const style = config[status] || config.PENDING;

    return (
        <span className={cn(
            "px-4 py-1.5 rounded-xl text-[11px] font-bold whitespace-nowrap tracking-wide uppercase",
            style.bg,
            style.text
        )}>
            {style.label}
        </span>
    );
}
