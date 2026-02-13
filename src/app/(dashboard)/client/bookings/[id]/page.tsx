"use client";

import { useState, useMemo, useRef, useEffect } from "react";
import {
    X, Star, MapPin, Check, ChevronLeft, ChevronRight,
    Clock, Plus, Minus, Search, Bell, Globe, ChevronDown, CheckCircle2,
    Calendar as CalendarIcon, DollarSign, MessageSquare, Info,
    Camera, Image as ImageIcon, Video, Zap, ShieldCheck, Truck,
    ChevronUp, Mail, Phone, ExternalLink, AlertCircle
} from "lucide-react";
import NextImage from "next/image";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import { useBookingDetails, useUpdateBookingStatus } from "@/features/bookings/hooks/useBookings";
import { Loading } from "@/components/ui/loading";
import { toast } from "react-hot-toast";
import { ProjectMediaGallery } from "@/features/bookings/components/ProjectMediaGallery";
import { CreateReviewModal } from "@/features/reviews/components/CreateReviewModal";

export default function BookingDetailsPage() {
    const params = useParams();
    const router = useRouter();
    const id = params.id as string;

    const { data: booking, isLoading, error } = useBookingDetails(id);
    const updateStatusMutation = useUpdateBookingStatus();
    const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);

    // Generate calendar days for a fixed month (June 2026) for demo (if needed for picker later)
    const calendarDays = useMemo(() => {
        const days = [];
        for (let i = 1; i <= 30; i++) days.push(i);
        return days;
    }, []);

    if (isLoading) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center bg-white">
                <Loading size="lg" />
                <p className="mt-4 text-slate-500 font-medium">Loading booking details...</p>
            </div>
        );
    }

    if (error || !booking) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center bg-white p-6 text-center">
                <div className="w-16 h-16 bg-red-50 rounded-full flex items-center justify-center mb-4">
                    <X className="w-8 h-8 text-primary" />
                </div>
                <h1 className="text-xl font-semibold text-slate-900 mb-2">Booking Not Found</h1>
                <p className="text-slate-500 mb-8 max-w-sm">We couldn&apos;t find the booking you&apos;re looking for or you don&apos;t have permission to view it.</p>
                <Link href="/client/bookings" className="px-8 h-12 bg-primary text-white rounded-xl font-semibold flex items-center">
                    Back to My Bookings
                </Link>
            </div>
        );
    }

    const eventTitle = booking.category || booking.serviceType?.replace('_', ' ') || "Event Details";
    const pricing = booking.pricing || {};
    const creator = booking.creator || {};
    const creatorUser = creator.user || {};
    const heroImage = booking.heroImage || "https://images.unsplash.com/photo-1492684223066-81342ee5ff30?q=80&w=1200";
    const bookingDetails = booking.bookingDetails || {};

    const handlePayment = () => {
        toast.promise(
            new Promise((resolve) => setTimeout(resolve, 2000)),
            {
                loading: 'Initializing secure payment...',
                success: 'Payment feature coming soon! Your booking is secured.',
                error: 'Payment failed.',
            }
        );
    };

    return (
        <div className="bg-white min-h-screen pb-20 font-sans animate-in fade-in duration-700">
            <div className="max-w-[1100px] mx-auto px-6 pt-6">
                
                {/* Navigation Header */}
                <div className="flex items-center justify-between py-4 mb-6">
                    <Link
                        href="/client/bookings"
                        className="flex items-center gap-2.5 text-slate-500 hover:text-primary transition-all font-semibold text-sm group"
                    >
                        <div className="w-8 h-8 rounded-full bg-slate-50 flex items-center justify-center group-hover:bg-primary/10 group-hover:text-primary transition-all">
                            <ChevronLeft className="w-5 h-5" />
                        </div>
                        Back to bookings
                    </Link>
                    
                    <div className="flex items-center gap-3">
                        <span className="text-[10px] font-bold text-slate-300 tracking-widest uppercase">Booking ID: {booking.bookingNumber || id.slice(0, 8).toUpperCase()}</span>
                        <div className={cn(
                            "px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider",
                            booking.status === "PENDING" ? "bg-orange-50 text-orange-600" :
                            booking.status === "CONFIRMED" ? "bg-blue-50 text-blue-600" :
                            booking.status === "IN_PROGRESS" ? "bg-green-50 text-green-600" :
                            "bg-slate-100 text-slate-500"
                        )}>
                            {booking.status.replace('_', ' ')}
                        </div>
                    </div>
                </div>

                {/* Main Content Layout */}
                <div className="grid lg:grid-cols-3 gap-10">
                    
                    {/* Left Column: Details */}
                    <div className="lg:col-span-2 space-y-10">
                        
                        {/* Hero Image */}
                        <div className="relative w-full h-[350px] rounded-[32px] overflow-hidden shadow-2xl shadow-slate-200 group">
                            <NextImage
                                src={heroImage}
                                alt={eventTitle}
                                fill
                                className="object-cover group-hover:scale-105 transition-transform duration-1000"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                            <div className="absolute bottom-6 left-8 text-white">
                                <h1 className="text-3xl font-bold tracking-tight">{eventTitle}</h1>
                                <p className="text-white/80 font-medium text-sm mt-1 flex items-center gap-2">
                                    <MapPin className="w-3.5 h-3.5 text-[#FF3B30]" />
                                    {bookingDetails.location || "Location Not Specified"}
                                </p>
                            </div>
                        </div>

                        {/* Creator Info Card */}
                        <div className="bg-slate-50/50 rounded-[32px] p-8 space-y-6 border border-slate-100">
                            <div className="flex items-center gap-5">
                                <div className="relative w-16 h-16 rounded-2xl overflow-hidden ring-4 ring-white shadow-sm">
                                    <NextImage
                                        src={creatorUser.profilePicture || `https://ui-avatars.com/api/?name=${creatorUser.firstName || 'C'}+${creatorUser.lastName || 'U'}&background=random`}
                                        alt={creatorUser.firstName}
                                        fill
                                        className="object-cover"
                                    />
                                </div>
                                <div>
                                    <h2 className="text-xl font-bold text-slate-900">Hosted by {creatorUser.firstName} {creatorUser.lastName}</h2>
                                    <div className="flex items-center gap-2 mt-0.5">
                                        <div className="flex items-center gap-1">
                                            <Star className="w-3 h-3 fill-[#FF3B30] text-[#FF3B30]" />
                                            <span className="text-xs font-bold text-slate-700">{creator.rating || "5.0"}</span>
                                        </div>
                                        <span className="text-slate-300">|</span>
                                        <p className="text-slate-500 text-xs font-semibold uppercase tracking-wider">{creator.role || "Professional Creator"}</p>
                                    </div>
                                </div>
                                <button className="ml-auto p-3 bg-white hover:bg-slate-50 text-primary rounded-xl border border-slate-100 transition-all active:scale-95 shadow-sm">
                                    <MessageSquare className="w-5 h-5" />
                                </button>
                            </div>

                            <div className="grid grid-cols-2 gap-8 pt-6 border-t border-slate-200/50">
                                <div className="flex items-center gap-4 group cursor-pointer">
                                    <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center text-slate-400 group-hover:text-primary transition-all shadow-sm">
                                        <Mail className="w-4 h-4" />
                                    </div>
                                    <div className="space-y-0.5">
                                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Creator Email</p>
                                        <p className="text-sm font-semibold text-slate-700">{creatorUser.email || "Contact via Chat"}</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-4 group cursor-pointer">
                                    <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center text-slate-400 group-hover:text-primary transition-all shadow-sm">
                                        <Phone className="w-4 h-4" />
                                    </div>
                                    <div className="space-y-0.5">
                                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Support Contact</p>
                                        <p className="text-sm font-semibold text-slate-700">Platform Secure Line</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Description & Requirements */}
                        <div className="space-y-8 px-2">
                            <div className="space-y-4">
                                <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                                    <Info className="w-5 h-5 text-primary" />
                                    Project Requirements
                                </h3>
                                <p className="text-slate-600 leading-relaxed font-medium">
                                    {bookingDetails.description || "No specific requirements provided at the time of booking. Ensure to discuss all details with the creator via direct message before the session starts."}
                                </p>
                            </div>

                            {/* Metadata Grid */}
                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                                <div className="p-5 bg-white border border-slate-100 rounded-2xl space-y-1 shadow-sm">
                                    <p className="text-[9px] font-extrabold text-slate-400 uppercase tracking-widest">Scheduled For</p>
                                    <p className="text-sm font-bold text-slate-800">
                                        {new Date(booking.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                                    </p>
                                </div>
                                <div className="p-5 bg-white border border-slate-100 rounded-2xl space-y-1 shadow-sm">
                                    <p className="text-[9px] font-extrabold text-slate-400 uppercase tracking-widest">Service Level</p>
                                    <p className="text-sm font-bold text-slate-800">{booking.serviceType?.replace('_', ' ')}</p>
                                </div>
                                <div className="p-5 bg-white border border-slate-100 rounded-2xl space-y-1 shadow-sm">
                                    <p className="text-[9px] font-extrabold text-slate-400 uppercase tracking-widest">Duration</p>
                                    <p className="text-sm font-bold text-slate-800">{bookingDetails.duration || "Standard Session"}</p>
                                </div>
                            </div>
                        </div>

                        {/* Project Media Gallery */}
                        <ProjectMediaGallery delivery={booking.delivery} />
                    </div>

                    {/* Right Column: Sticky Sidebar */}
                    <div className="space-y-8">
                        <div className="sticky top-8 bg-white border border-slate-100 rounded-[32px] p-8 space-y-8 ">
                            
                            <div className="space-y-1">
                                <h3 className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em]">Investment Summary</h3>
                                <div className="flex items-baseline gap-1">
                                    <span className="text-4xl font-bold tracking-tighter text-slate-900">${pricing.totalAmount || 0}</span>
                                    <span className="text-slate-400 font-bold text-sm tracking-tight uppercase">{pricing.currency || "USD"}</span>
                                </div>
                            </div>

                            <div className="space-y-4 py-6 border-y border-slate-50">
                                <div className="flex justify-between text-[13px] font-semibold text-slate-500">
                                    <span>Creative Services</span>
                                    <span>${pricing.baseAmount || 0}</span>
                                </div>
                                <div className="flex justify-between text-[13px] font-semibold text-slate-500">
                                    <span>Platform Protection Fee</span>
                                    <span>${pricing.platformFee || 0}</span>
                                </div>
                                <div className="flex justify-between text-base font-bold text-slate-900 pt-2">
                                    <span className="uppercase tracking-widest text-[11px]">Total Cost</span>
                                    <span>${pricing.totalAmount || 0}</span>
                                </div>
                            </div>

                            {/* Booking Management Actions */}
                            <div className="space-y-3">
                                    <button 
                                        onClick={handlePayment}
                                        className="w-full h-14 bg-primary text-white rounded-2xl text-xs font-bold uppercase tracking-[0.2em]  hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-2"
                                    >
                                        <Zap className="w-4 h-4" />
                                        Complete Payment
                                    </button>
                                

                                {["CONFIRMED", "COMPLETED"].includes(booking.status) && (
                                    <button 
                                        onClick={() => setIsReviewModalOpen(true)}
                                        className="w-full h-14 bg-[#16A34A] text-white rounded-2xl text-xs font-bold uppercase tracking-[0.2em] hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-2 shadow-lg shadow-green-200"
                                    >
                                        <Star className="w-4 h-4 fill-white" />
                                        Leave a Review
                                    </button>
                                )}

                                <button className="w-full h-14 bg-slate-50 text-slate-700 border border-slate-100 rounded-2xl text-xs font-bold uppercase tracking-[0.2em] hover:bg-slate-100 transition-all flex items-center justify-center gap-2">
                                    <MessageSquare className="w-4 h-4" />
                                    Contact Host
                                </button>

                                {booking.status === "PENDING" && (
                                    <button 
                                        onClick={() => {
                                            if (confirm("Are you sure you want to cancel this booking?")) {
                                                updateStatusMutation.mutate({ id, status: "CANCELLED" });
                                            }
                                        }}
                                        className="w-full h-14 bg-red-50 text-red-500 rounded-2xl text-xs font-bold uppercase tracking-[0.2em] hover:bg-red-100 transition-all"
                                    >
                                        Cancel Request
                                    </button>
                                )}

                                {booking.status === "IN_PROGRESS" && (
                                    <div className="p-4 bg-green-50 rounded-2xl border border-green-100 flex items-center gap-3">
                                        <ShieldCheck className="w-5 h-5 text-green-500" />
                                        <p className="text-[11px] font-bold text-green-700 leading-snug">
                                            Job Protected. The session is currently in progress.
                                        </p>
                                    </div>
                                )}
                            </div>

                            <div className="flex items-center gap-3 p-4 bg-orange-50/50 rounded-2xl border border-orange-100/50">
                                <AlertCircle className="w-5 h-5 text-orange-400" />
                                <p className="text-[11px] font-bold text-orange-600 leading-snug">
                                    Payments are held securely and released only after project completion.
                                </p>
                            </div>

                            {/* Booking Policies */}
                            <div className="pt-6 border-t border-slate-50 space-y-4">
                                <h4 className="text-[10px] font-bold tracking-widest uppercase text-slate-400">Booking Policies</h4>
                                <div className="space-y-3">
                                    <div className="flex gap-3">
                                        <Check className="w-3.5 h-3.5 text-green-500 flex-shrink-0" />
                                        <p className="text-slate-600 text-[10px] font-medium leading-relaxed">
                                            Cancel up to 24 hours before the session for a full refund.
                                        </p>
                                    </div>
                                    <div className="flex gap-3">
                                        <Check className="w-3.5 h-3.5 text-green-500 flex-shrink-0" />
                                        <p className="text-slate-600 text-[10px] font-medium leading-relaxed">
                                            Platform protection covers all creative deliverables.
                                        </p>
                                    </div>
                                </div>
                                <Link href="/client/help" className="flex items-center gap-2 text-[10px] font-bold text-primary hover:underline">
                                    <Info className="w-3.5 h-3.5" />
                                    Read Full Terms
                                </Link>
                            </div>
                        </div>

                    </div>
                </div>
            </div>

            {/* Create Review Modal */}
            {booking.status === "COMPLETED" && (
                <CreateReviewModal 
                    isOpen={isReviewModalOpen}
                    onClose={() => setIsReviewModalOpen(false)}
                    bookingId={booking.id}
                    creatorName={`${creatorUser.firstName} ${creatorUser.lastName}`}
                />
            )}
        </div>
    );
}
