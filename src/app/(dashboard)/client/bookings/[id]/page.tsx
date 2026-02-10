"use client";

import { useState, useMemo, useRef, useEffect } from "react";
import {
    X, Star, MapPin, Check, ChevronLeft, ChevronRight,
    Clock, Plus, Minus, Search, Bell, Globe, ChevronDown, CheckCircle2,
    Calendar as CalendarIcon, DollarSign, MessageSquare, Info,
    Camera, Image as ImageIcon, Video, Zap, ShieldCheck, Truck,
    ChevronUp
} from "lucide-react";
import NextImage from "next/image";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import { useBookingDetails, useUpdateBookingStatus } from "@/features/bookings/hooks/useBookings";
import { Loading } from "@/components/ui/loading";

export default function BookingDetailsPage() {
    const params = useParams();
    const router = useRouter();
    const id = params.id as string;

    const { data: booking, isLoading, error } = useBookingDetails(id);
    const updateStatusMutation = useUpdateBookingStatus();

    // Derived states from fetched booking
    const eventTitle = booking?.category || booking?.serviceType?.replace('_', ' ') || "Event Details";
    const pricing = booking?.pricing || {};
    const creator = booking?.creator || {};
    const creatorUser = creator.user || {};
    const heroImage = booking?.heroImage || "https://images.unsplash.com/photo-1492684223066-81342ee5ff30?q=80&w=1200";

    // For the UI logic that needs indices or states, we can adapt them
    const [selectedService, setSelectedService] = useState("");
    const [location, setLocation] = useState("");

    useEffect(() => {
        if (booking) {
            setSelectedService(booking.serviceType);
            setLocation(booking.bookingDetails?.location || "");
        }
    }, [booking]);

    // Dropdown/Picker states
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);

    const dropdownRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            const target = event.target as Node;
            if (dropdownRef.current && !dropdownRef.current.contains(target)) setIsDropdownOpen(false);
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
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


    // Generate calendar days for a fixed month (June 2026) for demo
    const calendarDays = useMemo(() => {
        const days = [];
        // Just a simple static grid for 2026-06 (Starts on Monday)
        for (let i = 1; i <= 30; i++) days.push(i);
        return days;
    }, []);

    const timeSlots = [
        "09:00 AM", "10:00 AM", "11:00 AM", "12:00 PM",
        "01:00 PM", "02:00 PM", "03:00 PM", "04:00 PM",
        "05:00 PM", "06:00 PM", "07:00 PM", "08:00 PM"
    ];

    return (
        <div className="bg-white min-h-screen pb-12 font-sans">
            {/* Main Content Container */}
            <div className="max-w-[1040px] mx-auto px-6 py-6">

                {/* Back Link */}
                <Link
                    href="/client/bookings"
                    className="flex items-center gap-2 text-slate-600 hover:text-primary py-5 transition-colors font-medium text-sm"
                >
                    <ChevronLeft className="w-4 h-4" />
                    Back to bookings
                </Link>

                {/* Hero Section (More Compact Aspect Ratio) */}
                <div className="relative w-full h-[300px] rounded-[32px] overflow-hidden mb-8 group">
                    <NextImage
                        src={heroImage}
                        alt={eventTitle}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-1000"
                        priority
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

                    {/* Overlay Info */}
                    <div className="absolute bottom-8 left-8 text-white space-y-2">
                        <h1 className="text-3xl font-sans font-semibold tracking-tight">{eventTitle}</h1>
                        <div className="flex items-center gap-5">
                            <div className="flex items-center gap-1.5">
                                <MapPin className="w-3.5 h-3.5 text-[#FF3B30]" />
                                <span className="text-[13px] font-semibold opacity-90">{booking.creator.location}</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <Star className="w-3.5 h-3.5 fill-[#FF3B30] text-[#FF3B30]" />
                                <span className="text-[13px] font-semibold">{booking.creator.rating} Rating</span>
                                <span className="text-[13px] font-semibold opacity-60"> {booking.creator.reviews} Reviews</span>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="flex flex-col lg:flex-row gap-10 items-start">
                    {/* Left Column: Creator Content */}
                    <div className="flex-1 space-y-10">

                        {/* Host Row */}
                        <div className="flex items-center gap-3.5">
                            <div className="relative w-12 h-12 rounded-full overflow-hidden border-2 border-slate-50">
                                <NextImage
                                    src={creatorUser.profilePicture || "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=300"}
                                    alt={creatorUser.firstName || "Creator"}
                                    fill
                                    className="object-cover"
                                />
                            </div>
                            <div>
                                <div className="flex items-center gap-2">
                                    <h2 className="text-base font-semibold text-black">Hosted by {creatorUser.firstName} {creatorUser.lastName}</h2>
                                    {creator.verificationStatus === "APPROVED" && <CheckCircle2 className="w-3.5 h-3.5 text-[#3B82F6]" />}
                                </div>
                                <p className="text-xs font-medium text-slate-400 italic">Professional Creator</p>
                            </div>
                        </div>

                        {/* Overview */}
                        <div className="space-y-3">
                            <h3 className="text-md font-semibold text-slate-900 tracking-tight">Booking Overview</h3>
                            <div className="text-slate-500 text-[14px] leading-relaxed max-w-[650px]">
                                {booking.bookingDetails?.description || creator.bio}
                            </div>
                        </div>

                        {/* Additional Info */}
                        <div className="grid grid-cols-2 gap-6 pb-6 border-b border-slate-50">
                            <div className="space-y-1">
                                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Booking Date</p>
                                <p className="text-sm font-semibold text-slate-700">
                                    {new Date(booking.createdAt).toLocaleDateString('en-US', {
                                        weekday: 'long',
                                        year: 'numeric',
                                        month: 'long',
                                        day: 'numeric'
                                    })}
                                </p>
                            </div>
                            <div className="space-y-1">
                                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Booking Number</p>
                                <p className="text-sm font-semibold text-slate-700">{booking.bookingNumber}</p>
                            </div>
                        </div>
                    </div>

                    {/* Right Column: Sticky Booking Sidebar (Narrower) */}
                    <div className="w-full lg:w-[350px] sticky top-12">
                        <div className="bg-white border-2 border-slate-50 rounded-[32px] p-7 space-y-7">

                            {/* Cost Summary */}
                            <div className="pt-4 border-t border-slate-50 space-y-3">
                                <div className="flex justify-between text-xs font-semibold text-slate-400">
                                    <span className="uppercase tracking-widest">Base Fee</span>
                                    <span>${pricing.baseAmount || 0}</span>
                                </div>
                                <div className="flex justify-between text-xs font-semibold text-slate-400">
                                    <span className="uppercase tracking-widest">Platform Fee</span>
                                    <span>${pricing.platformFee || 0}</span>
                                </div>
                                <div className="flex justify-between pt-2">
                                    <span className="text-[14px] font-bold text-slate-900 uppercase tracking-widest">Total Amount</span>
                                    <span className="text-[18px] font-bold text-primary">${pricing.totalAmount || 0}</span>
                                </div>
                            </div>

                            {/* Actions */}
                            <div className="space-y-3 pt-4">
                                <button className="w-full h-12 bg-white border-2 border-slate-100 text-slate-700 rounded-xl text-xs font-bold uppercase tracking-widest hover:bg-slate-50 transition-all flex items-center justify-center gap-2">
                                    <MessageSquare className="w-4 h-4" />
                                    Message Creator
                                </button>

                                {booking.status === "PENDING" && (
                                    <button
                                        onClick={() => {
                                            if (confirm("Are you sure you want to cancel this booking?")) {
                                                updateStatusMutation.mutate({ id, status: "CANCELLED" });
                                            }
                                        }}
                                        className="w-full h-12 bg-red-50 text-primary rounded-xl text-xs font-bold uppercase tracking-widest hover:bg-red-100 transition-all"
                                    >
                                        Cancel Booking
                                    </button>
                                )}
                            </div>

                            <p className="text-center text-[10px] font-semibold text-slate-300 tracking-tight leading-relaxed">
                                Need help with your booking?<br />
                                <Link href="/client/help" className="text-primary hover:underline">Contact Support</Link>
                            </p>
                        </div>
                    </div>

                    {/* Small Card below (secondary action - Narrower) */}
                    <div className="mt-6 relative w-full h-32 rounded-[28px] overflow-hidden group cursor-pointer">
                        <NextImage
                            src="https://images.unsplash.com/photo-1542038784456-1ea8e935640e?q=80&w=400"
                            alt="Portfolio"
                            fill
                            className="object-cover group-hover:scale-110 transition-transform duration-700"
                        />
                        <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                            <div className="bg-white/90 backdrop-blur px-5 py-2.5 rounded-xl text-[10px] font-semibold text-black uppercase tracking-widest hover:bg-white transition-colors">
                                Explore creators work
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
