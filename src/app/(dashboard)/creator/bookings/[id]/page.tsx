"use client";
import { useState, useMemo, useRef, useEffect } from "react";
import {
    X, Star, MapPin, Check, ChevronLeft, ChevronRight,
    Clock, Plus, Minus, Search, Bell, Globe, ChevronDown, CheckCircle2,
    Calendar as CalendarIcon, DollarSign, MessageSquare, Info,
    Camera, Image as ImageIcon, Video, Zap, ShieldCheck, Truck,
    ChevronUp, Mail, Phone, ExternalLink, AlertCircle,
    XCircle
} from "lucide-react";
import NextImage from "next/image";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import { useBookingDetails, useUpdateBookingStatus } from "@/features/bookings/hooks/useBookings";
import { Loading } from "@/components/ui/loading";
import { toast } from "react-hot-toast";
import { bookingService } from "@/features/bookings/services/booking.service";

export default function CreatorBookingDetailsPage() {
    const params = useParams();
    const router = useRouter();
    const id = params.id as string;

    const { data: booking, isLoading, error, refetch } = useBookingDetails(id);
    const updateStatusMutation = useUpdateBookingStatus();
    const [isCheckingIn, setIsCheckingIn] = useState(false);

    const client = booking?.client || {};
    const bookingDetails = booking?.bookingDetails || {};
    const pricing = booking?.pricing || {};
    const heroImage = booking?.heroImage || "https://images.unsplash.com/photo-1492684223066-81342ee5ff30?q=80&w=1200";

    const handleUpdateStatus = async (status: string) => {
        try {
            await updateStatusMutation.mutateAsync({ id, status });
            toast.success(`Booking ${status.toLowerCase()} successfully`);
        } catch (error: any) {
            toast.error(error.message || "Failed to update booking status");
        }
    };

    const handleCheckIn = async (sessionNumber: number) => {
        setIsCheckingIn(true);
        try {
            // Mock location for now, or use navigator.geolocation
            const location = { latitude: -1.9441, longitude: 30.0619 }; // Kigali
            await bookingService.registerCheckIn(id, sessionNumber, location);
            toast.success("Check-in successful!");
            refetch();
        } catch (error: any) {
            toast.error(error.message || "Check-in failed");
        } finally {
            setIsCheckingIn(false);
        }
    };

    if (isLoading) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center bg-white">
                <Loading size="lg" />
                <p className="mt-4 text-slate-500 font-medium animate-pulse">Fetching booking details...</p>
            </div>
        );
    }

    if (error || !booking) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center bg-white p-6 text-center">
                <div className="w-20 h-20 bg-red-50 rounded-full flex items-center justify-center mb-6">
                    <XCircle className="w-10 h-10 text-primary" />
                </div>
                <h1 className="text-2xl font-bold text-slate-900 mb-2">Booking Unavailable</h1>
                <p className="text-slate-500 mb-8 max-w-sm">This booking record could not be retrieved. It might have been deleted or you may lack secondary access permissions.</p>
                <Link href="/creator/bookings" className="px-8 h-12 bg-primary text-white rounded-xl font-bold flex items-center transition-transform active:scale-95 shadow-lg shadow-primary/20">
                    Return to Dashboard
                </Link>
            </div>
        );
    }

    return (
        <div className="bg-white min-h-screen pb-20 font-sans animate-in fade-in duration-700">
            <div className="max-w-[1100px] mx-auto px-6 pt-6">

                {/* Navigation Header */}
                <div className="flex items-center justify-between py-4 mb-6">
                    <Link
                        href="/creator/bookings"
                        className="flex items-center gap-2.5 text-slate-500 hover:text-primary transition-all font-semibold text-sm group"
                    >
                        <div className="w-8 h-8 rounded-full bg-slate-50 flex items-center justify-center group-hover:bg-primary/10 group-hover:text-primary transition-all">
                            <ChevronLeft className="w-5 h-5" />
                        </div>
                        Back to bookings
                    </Link>

                    <div className="flex items-center gap-3">
                        <span className="text-[10px] font-bold text-slate-300 tracking-widest uppercase">Booking ID: {booking.bookingNumber}</span>
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

                {/* Hero Layout */}
                <div className="grid lg:grid-cols-3 gap-10">

                    {/* Left Column: Details */}
                    <div className="lg:col-span-2 space-y-10">

                        {/* Hero Image */}
                        <div className="relative w-full h-[350px] rounded-[32px] overflow-hidden shadow-2xl shadow-slate-200 group">
                            <NextImage
                                src={heroImage}
                                alt="Event"
                                fill
                                className="object-cover group-hover:scale-105 transition-transform duration-1000"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                            <div className="absolute bottom-6 left-8 text-white">
                                <h1 className="text-3xl font-bold tracking-tight">{booking.category || booking.serviceType?.replace('_', ' ')}</h1>
                                <p className="text-white/80 font-medium text-sm mt-1 flex items-center gap-2">
                                    <MapPin className="w-3.5 h-3.5 text-[#FF3B30]" />
                                    {bookingDetails.location || "Remote Project"}
                                </p>
                            </div>
                        </div>

                        {/* Client Info Card */}
                        <div className="bg-slate-50/50 rounded-[32px] p-8 space-y-6 border border-slate-100">
                            <div className="flex items-center gap-5">
                                <div className="relative w-16 h-16 rounded-2xl overflow-hidden ring-4 ring-white shadow-sm">
                                    <NextImage
                                        src={client.profilePicture || `https://ui-avatars.com/api/?name=${client.firstName || 'C'}+${client.lastName || 'U'}&background=random`}
                                        alt={client.firstName}
                                        fill
                                        className="object-cover"
                                    />
                                </div>
                                <div>
                                    <h2 className="text-xl font-bold text-slate-900">Project for {client.firstName} {client.lastName}</h2>
                                    <p className="text-slate-500 text-sm font-medium">Potential Long-term Partner</p>
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
                                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Email Address</p>
                                        <p className="text-sm font-semibold text-slate-700">{client.email || "N/A"}</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-4 group cursor-pointer">
                                    <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center text-slate-400 group-hover:text-primary transition-all shadow-sm">
                                        <Phone className="w-4 h-4" />
                                    </div>
                                    <div className="space-y-0.5">
                                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Phone Number</p>
                                        <p className="text-sm font-semibold text-slate-700">{client.phoneNumber || "Not provided"}</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Description & Requirements */}
                        <div className="space-y-8 px-2">
                            <div className="space-y-4 text-center sm:text-left">
                                <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                                    <Info className="w-5 h-5 text-primary" />
                                    Project Description
                                </h3>
                                <p className="text-slate-600 leading-relaxed font-medium">
                                    {bookingDetails.description || "The client has not provided a specific description yet. Start a chat to gather requirements and finalize project goals."}
                                </p>
                            </div>

                            {/* Metadata Grid */}
                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                                <div className="p-5 bg-white border border-slate-100 rounded-2xl space-y-1 shadow-sm">
                                    <p className="text-[9px] font-extrabold text-slate-400 uppercase tracking-widest">Scheduled For</p>
                                    <p className="text-sm font-bold text-slate-800">{new Date(booking.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</p>
                                </div>
                                <div className="p-5 bg-white border border-slate-100 rounded-2xl space-y-1 shadow-sm">
                                    <p className="text-[9px] font-extrabold text-slate-400 uppercase tracking-widest">Service Level</p>
                                    <p className="text-sm font-bold text-slate-800">{booking.serviceType?.replace('_', ' ')}</p>
                                </div>
                                <div className="p-5 bg-white border border-slate-100 rounded-2xl space-y-1 shadow-sm">
                                    <p className="text-[9px] font-extrabold text-slate-400 uppercase tracking-widest">Duration</p>
                                    <p className="text-sm font-bold text-slate-800">{bookingDetails.duration || "Fixed Session"}</p>
                                </div>
                            </div>
                        </div>

                        {/* Sessions / Timeline (Conditional) */}
                        {booking.status === "IN_PROGRESS" && (
                            <div className="space-y-6 pt-6 border-t border-slate-100">
                                <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                                    <Clock className="w-5 h-5 text-green-500" />
                                    Execution Timeline
                                </h3>
                                <div className="space-y-3">
                                    {[1].map((s) => (
                                        <div key={s} className="flex items-center justify-between p-6 bg-slate-50 rounded-[24px] border border-slate-100 group">
                                            <div className="flex items-center gap-4">
                                                <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center font-bold text-slate-900 shadow-sm">
                                                    #{s}
                                                </div>
                                                <div>
                                                    <p className="text-sm font-bold text-slate-900">Arrival & Setup</p>
                                                    <p className="text-xs text-slate-400 font-medium tracking-wide">Ready for check-in at location</p>
                                                </div>
                                            </div>
                                            <button
                                                onClick={() => handleCheckIn(s)}
                                                disabled={isCheckingIn}
                                                className="px-6 h-10 bg-black text-white rounded-xl text-[11px] font-bold tracking-widest uppercase hover:bg-slate-800 transition-all active:scale-95 disabled:opacity-50"
                                            >
                                                {isCheckingIn ? "Verifying..." : "Confirm Arrival"}
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Right Column: Sticky Sidebar */}
                    <div className="space-y-8">
                        <div className="sticky top-8 bg-white border border-slate-100 rounded-[32px] p-8 space-y-8 shadow-2xl shadow-slate-100">

                            <div className="space-y-1">
                                <h3 className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em]">Financial Overview</h3>
                                <div className="flex items-baseline gap-1">
                                    <span className="text-4xl font-bold tracking-tighter text-slate-900">${pricing.totalAmount || 0}</span>
                                    <span className="text-slate-400 font-bold text-sm tracking-tight uppercase">{pricing.currency || "USD"}</span>
                                </div>
                            </div>

                            <div className="space-y-4 py-6 border-y border-slate-50">
                                <div className="flex justify-between text-[13px] font-semibold text-slate-500">
                                    <span>Creative Fee</span>
                                    <span>${pricing.baseAmount || 0}</span>
                                </div>
                                <div className="flex justify-between text-[13px] font-semibold text-slate-500">
                                    <span>Platform Protection</span>
                                    <span>${pricing.platformFee || 0}</span>
                                </div>
                                <div className="flex justify-between text-sm font-bold text-slate-900 pt-2">
                                    <span className="uppercase tracking-widest text-[11px]">Net Earnings</span>
                                    <span>${(pricing.baseAmount || 0)}</span>
                                </div>
                            </div>

                            {/* Booking Management Actions */}
                            <div className="space-y-3">
                                {booking.status === "PENDING" ? (
                                    <>
                                        <button
                                            onClick={() => handleUpdateStatus("CONFIRMED")}
                                            className="w-full h-14 bg-primary text-white rounded-2xl text-xs font-bold uppercase tracking-[0.2em] shadow-lg shadow-primary/20 hover:scale-[1.02] active:scale-95 transition-all"
                                        >
                                            Confirm Request
                                        </button>
                                        <button
                                            onClick={() => handleUpdateStatus("CANCELLED")}
                                            className="w-full h-14 bg-red-50 text-primary border border-primary/5 rounded-2xl text-xs font-bold uppercase tracking-[0.2em] hover:bg-red-100 transition-all"
                                        >
                                            Decline Project
                                        </button>
                                    </>
                                ) : (
                                    <>
                                        {booking.status === "CONFIRMED" && (
                                            <button
                                                onClick={() => handleUpdateStatus("IN_PROGRESS")}
                                                className="w-full h-14 bg-black text-white rounded-2xl text-xs font-bold uppercase tracking-[0.2em] hover:bg-slate-800 transition-all shadow-xl shadow-slate-100"
                                            >
                                                Start Project
                                            </button>
                                        )}
                                        {booking.status === "IN_PROGRESS" && (
                                            <button
                                                onClick={() => handleUpdateStatus("COMPLETED")}
                                                className="w-full h-14 bg-green-500 text-white rounded-2xl text-xs font-bold uppercase tracking-[0.2em] shadow-lg shadow-green-500/20 hover:scale-[1.02] active:scale-95 transition-all"
                                            >
                                                Mark as Completed
                                            </button>
                                        )}
                                        <button
                                            onClick={() => handleUpdateStatus("CANCELLED")}
                                            className="w-full h-14 bg-slate-50 text-slate-400 rounded-2xl text-xs font-bold uppercase tracking-[0.2em] hover:text-red-500 hover:bg-red-50 transition-all"
                                        >
                                            Cancel Booking
                                        </button>
                                    </>
                                )}
                            </div>

                            <div className="flex items-center gap-3 p-4 bg-orange-50/50 rounded-2xl border border-orange-100/50">
                                <AlertCircle className="w-5 h-5 text-orange-400" />
                                <p className="text-[11px] font-bold text-orange-600 leading-snug">
                                    Remember to stay on platform for all payments to ensure job protection.
                                </p>
                            </div>

                            {/* Booking Policies */}
                            <div className="pt-6 border-t border-slate-50 space-y-4">
                                <h4 className="text-[10px] font-bold tracking-widest uppercase text-slate-400">Booking Policies</h4>
                                <div className="space-y-3">
                                    <div className="flex gap-3">
                                        <Check className="w-3.5 h-3.5 text-green-500 flex-shrink-0" />
                                        <p className="text-slate-600 text-[10px] font-medium leading-relaxed">
                                            Payouts are initiated 24 hours after project completion.
                                        </p>
                                    </div>
                                    <div className="flex gap-3">
                                        <Check className="w-3.5 h-3.5 text-green-500 flex-shrink-0" />
                                        <p className="text-slate-600 text-[10px] font-medium leading-relaxed">
                                            Platform protection covers all creative disputes and arrivals.
                                        </p>
                                    </div>
                                </div>
                                <Link href="/creator/help" className="flex items-center gap-2 text-[10px] font-bold text-primary hover:underline">
                                    <Info className="w-3.5 h-3.5" />
                                    Read Terms
                                </Link>
                            </div>
                        </div>

                        {/* Project Deliverables Card */}
                        <div className="p-8 bg-black rounded-[32px] text-white space-y-4 shadow-xl">
                            <h4 className="text-sm font-semibold tracking-widest uppercase">Project Deliverables</h4>
                            <p className="text-white/40 text-[11px] leading-relaxed">
                                Once you complete the shoot, you'll be able to upload the final files here for client approval and payment release.
                            </p>
                            <button className="w-full h-12 bg-white/10 hover:bg-white/20 text-white rounded-xl text-[10px] font-bold uppercase tracking-widest border border-white/5 transition-all flex items-center justify-center gap-2">
                                <ExternalLink className="w-4 h-4" />
                                Storage Instructions
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
