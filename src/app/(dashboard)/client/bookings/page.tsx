"use client"
import { useState, useMemo, useEffect, useRef } from "react";
import { Search, Calendar, MoreVertical, CheckCircle2, Clock, XCircle, Eye, MessageCircle, X, Star } from "lucide-react";
import NextImage from "next/image";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { useBookings } from "@/features/bookings/hooks/useBookings";
import { Loading } from "@/components/ui/loading";
import { CreateReviewModal } from "@/features/reviews/components/CreateReviewModal";
import { chatService } from "@/features/chat/services/chat.service";
import { paymentService } from "@/features/payment/services/payment.service";
import { PaymentModal } from "@/features/payment/components/PaymentModal";
import { toast } from "react-hot-toast";
import { useSocket } from "@/features/chat/hooks/useSocket";
const FILTER_TABS = ["All", "Approved", "Cancelled", "Pending"];

export default function MyBookingsPage() {
    const [activeTab, setActiveTab] = useState("All");
    const [searchQuery, setSearchQuery] = useState("");
    const [openMenuId, setOpenMenuId] = useState<string | null>(null);
    const [reviewingBooking, setReviewingBooking] = useState<{ id: string, creatorName: string } | null>(null);
    const [paymentBooking, setPaymentBooking] = useState<any | null>(null);
    const [isPaying, setIsPaying] = useState<string | null>(null);
    const menuRef = useRef<HTMLDivElement | null>(null);
    const { socket } = useSocket();

    const { data: rawBookings, isLoading, refetch } = useBookings();

    const bookings = useMemo(() => {
        return (rawBookings || []).map((b: any) => ({
            id: b.id,
            creator: {
                name: `${b.creator?.user?.firstName || ''} ${b.creator?.user?.lastName || ''}`,
                avatar: b.creator?.user?.profilePicture || "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=150",
                isVerified: b.creator?.verificationStatus === "APPROVED"
            },
            date: new Date(b.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
            status: b.status.charAt(0) + b.status.slice(1).toLowerCase(),
            rawStatus: b.status,
            price: b.pricing?.totalAmount || 0,
            type: b.category || b.serviceType?.replace('_', ' ') || "Photography",
            eventTitle: b.category || b.serviceType?.replace('_', ' ') || "Session",
            image: b.heroImage || "https://images.unsplash.com/photo-1492684223066-81342ee5ff30?q=80&w=400",
            location: b.bookingDetails?.location || b.creator?.baseCity || "Remote",
            createdAt: b.createdAt,
            paymentStatus: b.paymentStatus,
            pricing: b.pricing
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

    // Socket.io for real-time payment status
    useEffect(() => {
        if (socket) {
            socket.on("payment_completed", (data: any) => {
                if (data.status === "FULLY_PAID") {
                    toast.success("Payment Successful!");
                    refetch();
                    setIsPaying(null);
                    setPaymentBooking(null);
                }
            });
            return () => { socket.off("payment_completed"); };
        }
    }, [socket, refetch]);

    const filteredBookings = useMemo(() => {
        return bookings.filter((booking: any) => {
            const matchesTab =
                activeTab === "All" ||
                (activeTab === "Approved" && ["Confirmed", "Completed", "In_progress"].includes(booking.status)) ||
                (activeTab === "Cancelled" && booking.status === "Cancelled") ||
                (activeTab === "Pending" && booking.status === "Pending");

            const matchesSearch =
                booking.creator.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                booking.eventTitle.toLowerCase().includes(searchQuery.toLowerCase());

            return matchesTab && matchesSearch;
        });
    }, [activeTab, searchQuery, bookings]);

    const handlePayment = (booking: any) => {
        setPaymentBooking(booking);
    };

    const initiatePayment = async (payload: any) => {
        if (!paymentBooking) return;

        setIsPaying(paymentBooking.id);
        try {
            const response = await paymentService.initializePayment(paymentBooking.id, payload);

            if (response.success) {
                const { data } = response;

                // If it's a hosted link redirect
                if (data.paymentLink) {
                    window.location.href = data.paymentLink;
                    return;
                }

                // If it's a direct charge (MoMo / Card)
                const isConfirmed = data.status === "success" && (data.message === "Charge successful" || data.message === "Charge initiated");

                if (isConfirmed) {
                    // For Card, if it's already successful, we show success
                    if (payload.type === 'card' && data.status === "success") {
                        toast.success("Payment Successful!");
                        refetch();
                        setIsPaying(null);
                        setPaymentBooking(null);
                    } else if (payload.type === 'momo') {
                        // For MoMo, we keep loading until the socket event or manual refresh
                        // No "initiated" toast as per user request
                    }
                } else {
                    toast.error("Payment Failed!");
                    setIsPaying(null);
                }
            } else {
                toast.error("Payment Failed!");
                setIsPaying(null);
            }
        } catch (error: any) {
            console.error("Payment Error:", error);
            toast.error("Payment Failed!");
            setIsPaying(null);
        }
    };

    if (isLoading) {
        return (
            <div className="flex-1 flex flex-col items-center justify-center py-20 bg-white rounded-[24px] border border-slate-100 min-h-[500px]">
                <Loading size="lg" />
                <p className="mt-4 text-slate-500 font-medium animate-pulse">Loading your bookings...</p>
            </div>
        );
    }

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
                        filteredBookings.map((booking: any) => (
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
                                            {/* Use createdAt from the booking object to format the date */}
                                            <span className="text-sm font-medium">
                                                {new Date(booking.createdAt).toLocaleDateString('en-US', {
                                                    month: 'short',
                                                    day: 'numeric',
                                                    year: 'numeric'
                                                })}
                                            </span>
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
                                                    <button
                                                        onClick={() => {
                                                            const chat = chatService.initiateChat(booking.creator.id);
                                                            // Handle chat initiation if needed, or link to messages
                                                        }}
                                                        className="w-full flex items-center gap-3 px-3 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-50 rounded-xl transition-all text-left"
                                                    >
                                                        <MessageCircle className="w-4 h-4 text-slate-400" />
                                                        Message Creator
                                                    </button>

                                                    {booking.paymentStatus === "PENDING" && booking.rawStatus !== "CANCELLED" && (
                                                        <button
                                                            onClick={() => handlePayment(booking)}
                                                            disabled={isPaying === booking.id}
                                                            className="w-full flex items-center gap-3 px-3 py-2.5 text-sm font-semibold text-[#FF3B30] hover:bg-red-50 rounded-xl transition-all text-left"
                                                        >
                                                            {isPaying === booking.id ? (
                                                                <Clock className="w-4 h-4 text-slate-400 animate-spin" />
                                                            ) : (
                                                                <Clock className="w-4 h-4 text-[#FF3B30]" />
                                                            )}
                                                            {isPaying === booking.id ? "Processing..." : "Pay Now"}
                                                        </button>
                                                    )}

                                                    {["CONFIRMED", "COMPLETED"].includes(booking.rawStatus) && (
                                                        <button
                                                            onClick={() => {
                                                                setReviewingBooking({
                                                                    id: booking.id,
                                                                    creatorName: booking.creator.name
                                                                });
                                                                setOpenMenuId(null);
                                                            }}
                                                            className="w-full flex items-center gap-3 px-3 py-2.5 text-sm font-semibold text-[#16A34A] hover:bg-green-50 rounded-xl transition-all text-left mt-1 border-t border-slate-50 pt-3"
                                                        >
                                                            <Star className="w-4 h-4 text-[#16A34A] fill-[#16A34A]" />
                                                            Leave a Review
                                                        </button>
                                                    )}
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

            {/* Create Review Modal */}
            {reviewingBooking && (
                <CreateReviewModal
                    isOpen={!!reviewingBooking}
                    onClose={() => setReviewingBooking(null)}
                    bookingId={reviewingBooking.id}
                    creatorName={reviewingBooking.creatorName}
                />
            )}

            {paymentBooking && (
                <PaymentModal
                    isOpen={!!paymentBooking}
                    onClose={() => setPaymentBooking(null)}
                    onPaymentInitiate={initiatePayment}
                    bookingDetails={{
                        id: paymentBooking.id,
                        amount: paymentBooking.price,
                        currency: paymentBooking.pricing?.currency || "KES",
                        type: paymentBooking.eventTitle
                    }}
                />
            )}
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
        In_progress: {
            bg: "bg-[#F0FDF4]",
            text: "text-[#16A34A]",
            label: "In Progress"
        },
        Pending: {
            bg: "bg-[#FEF9C3]",
            text: "text-[#A16207]",
            label: "Pending"
        },
        Completed: {
            bg: "bg-[#DCFCE7]",
            text: "text-[#16A34A]",
            label: "Completed"
        },
        Cancelled: {
            bg: "bg-red-50",
            text: "text-[#FF3B30]",
            label: "Cancelled"
        },
        Disputed: {
            bg: "bg-orange-50",
            text: "text-orange-600",
            label: "Disputed"
        }
    };

    const style = config[status] || config.Pending;

    return (
        <span className={cn(
            "px-5 py-1.5 rounded-xl text-[12px] font-semibold whitespace-nowrap",
            style.bg,
            style.text
        )}>
            {style.label}
        </span>
    );
}
