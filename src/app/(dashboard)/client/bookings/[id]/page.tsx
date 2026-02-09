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

// Mock data
const BOOKINGS_DATA = [
    {
        id: "b1",
        eventTitle: "Wedding Ceremony",
        creator: {
            name: "Chris MUSA",
            avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=300",
            isVerified: true,
            role: "Professional Photographer",
            location: "Musanze, Rwanda",
            rating: 4.8,
            reviews: 64,
            pricePerHour: 20,
            bio: "I am a professional photographer located at Quill Residences. I offer luxurious shooting in the city's vibrant heart. My photography features modern styles, high-quality finishes, and a range of premium editing services. Clients enjoy convenient access to multiple locations and personalized shooting options, making me an ideal choice for those seeking upscale professional captures."
        },
        heroImage: "https://images.unsplash.com/photo-1519741497674-611481863552?q=80&w=1200",
        services: [
            { name: "Wedding", price: 250, duration: "6 Hours", description: "Full ceremony and reception coverage" },
            { name: "Graduation", price: 150, duration: "3 Hours", description: "Individual and group portraits" },
            { name: "Baby shower", price: 100, duration: "2 Hours", description: "Candid shots and family photos" },
            { name: "Birthday", price: 120, duration: "3 Hours", description: "Event coverage and highlights" }
        ],
        amenities: [
            { icon: Camera, label: "Pro Equipment" },
            { icon: Zap, label: "High-end Editing" },
            { icon: ShieldCheck, label: "Secure Delivery" },
            { icon: Clock, label: "Fast Turnaround" },
            { icon: Globe, label: "Online Gallery" },
            { icon: Video, label: "4K Clips" },
            { icon: MessageSquare, label: "24/7 Support" },
            { icon: ImageIcon, label: "Print Ready" }
        ]
    }
];

export default function BookingDetailsPage() {
    const params = useParams();
    const router = useRouter();

    // States for functionality
    const [selectedService, setSelectedService] = useState("Wedding");
    const [selectedDate, setSelectedDate] = useState<Date>(new Date(2026, 5, 12)); // June 12, 2026
    const [selectedTime, setSelectedTime] = useState("11:00 AM");
    const [location, setLocation] = useState("");
    const [specialNotes, setSpecialNotes] = useState("");

    // Dropdown/Picker states
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const [isCalendarOpen, setIsCalendarOpen] = useState(false);
    const [isTimePickerOpen, setIsTimePickerOpen] = useState(false);

    const dropdownRef = useRef<HTMLDivElement>(null);
    const calendarRef = useRef<HTMLDivElement>(null);
    const timeRef = useRef<HTMLDivElement>(null);

    const booking = useMemo(() => {
        return BOOKINGS_DATA.find(b => b.id === params.id) || BOOKINGS_DATA[0];
    }, [params.id]);

    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            const target = event.target as Node;
            if (dropdownRef.current && !dropdownRef.current.contains(target)) setIsDropdownOpen(false);
            if (calendarRef.current && !calendarRef.current.contains(target)) setIsCalendarOpen(false);
            if (timeRef.current && !timeRef.current.contains(target)) setIsTimePickerOpen(false);
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

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
                        src={booking.heroImage}
                        alt={booking.eventTitle}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-1000"
                        priority
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

                    {/* Overlay Info */}
                    <div className="absolute bottom-8 left-8 text-white space-y-2">
                        <h1 className="text-3xl font-sans font-semibold tracking-tight">{booking.eventTitle}</h1>
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
                                    src={booking.creator.avatar}
                                    alt={booking.creator.name}
                                    fill
                                    className="object-cover"
                                />
                            </div>
                            <div>
                                <div className="flex items-center gap-2">
                                    <h2 className="text-base font-semibold text-black">Hosted by {booking.creator.name}</h2>
                                    {booking.creator.isVerified && <CheckCircle2 className="w-3.5 h-3.5 text-[#3B82F6]" />}
                                </div>
                                <p className="text-xs font-medium text-slate-400 italic">Professional with more than 5 years</p>
                            </div>
                        </div>

                        {/* Overview */}
                        <div className="space-y-3">
                            <h3 className="text-md font-semibold text-slate-900 tracking-tight">Overview</h3>
                            <div className="text-slate-500 text-[14px] leading-relaxed max-w-[650px]">
                                {booking.creator.bio}
                            </div>
                        </div>

                        {/* What they offer */}
                        <div className="space-y-6">
                            <h3 className="text-md font-semibold text-slate-900 tracking-tight">What this creator offer</h3>
                            <div className="grid grid-cols-2 gap-y-3">
                                {booking.amenities.map((item, idx) => (
                                    <div key={idx} className="flex items-center gap-3 group">
                                        <div className="w-9 h-9 rounded-xl bg-slate-50 flex items-center justify-center group-hover:bg-[#FF3B30]/10 transition-colors">
                                            <item.icon className="w-3.5 h-3.5 text-slate-700 group-hover:text-[#FF3B30] transition-colors" />
                                        </div>
                                        <span className="text-[14px] font-medium text-slate-700">{item.label}</span>
                                    </div>
                                ))}
                            </div>

                        </div>
                    </div>

                    {/* Right Column: Sticky Booking Sidebar (Narrower) */}
                    <div className="w-full lg:w-[350px] sticky top-12">
                        <div className="bg-white border-2 border-slate-50 rounded-[32px] p-7 space-y-7">

                            {/* Price Header */}
                            <div className="flex items-baseline justify-between">
                                <div className="flex items-baseline gap-2">
                                    <span className="text-2xl font-semibold text-black">${booking.creator.pricePerHour}</span>
                                    <span className="text-[13px] font-semibold text-slate-400 line-through">$25</span>
                                    <span className="text-[12px] font-semibold text-slate-400 ml-1">/ session</span>
                                </div>
                            </div>

                            {/* Booking Inputs */}
                            <div className="space-y-5">
                                {/* Service Custom Dropdown */}
                                <div className="space-y-2" ref={dropdownRef}>
                                    <label className="text-[11px] font-semibold text-[#A0AEC0] uppercase tracking-wider px-1">Service Type</label>
                                    <div className="relative">
                                        <button
                                            type="button"
                                            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                                            className={cn(
                                                "w-full h-12 px-5 bg-[#F8FAFC] border border-[#E2E8F0] rounded-2xl text-[13px] font-semibold text-black flex items-center justify-between transition-all outline-none",
                                                isDropdownOpen ? "border-[#FF3B30] bg-white ring-4 ring-[#FF3B30]/5" : "hover:border-slate-300"
                                            )}
                                        >
                                            <span>{selectedService} Coverage</span>
                                            <ChevronDown className={cn("w-3.5 h-3.5 text-slate-400 transition-transform duration-300", isDropdownOpen && "rotate-180")} />
                                        </button>

                                        {isDropdownOpen && (
                                            <div className="absolute top-[calc(100%+8px)] left-0 right-0 p-1.5 bg-white border border-slate-100 shadow-xl rounded-2xl z-50 animate-in fade-in slide-in-from-top-2 duration-200">
                                                {booking.services.map((s) => (
                                                    <button
                                                        key={s.name}
                                                        type="button"
                                                        onClick={() => {
                                                            setSelectedService(s.name);
                                                            setIsDropdownOpen(false);
                                                        }}
                                                        className={cn(
                                                            "w-full px-4 py-2.5 rounded-xl text-[13px] font-semibold text-left flex items-center justify-between transition-colors",
                                                            selectedService === s.name
                                                                ? "bg-[#FF3B30]/5 text-[#FF3B30]"
                                                                : "text-slate-600 hover:bg-slate-50 hover:text-black"
                                                        )}
                                                    >
                                                        <span>{s.name} Coverage</span>
                                                        {selectedService === s.name && <Check className="w-4 h-4" />}
                                                    </button>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                </div>

                                {/* Location Input */}
                                <div className="space-y-2">
                                    <label className="text-[11px] font-semibold text-[#A0AEC0] uppercase tracking-wider px-1">Location</label>
                                    <div className="relative group">
                                        <input
                                            type="text"
                                            placeholder="Where is the event?"
                                            value={location}
                                            onChange={(e) => setLocation(e.target.value)}
                                            className="w-full h-12 pl-12 pr-5 bg-[#F8FAFC] border border-[#E2E8F0] rounded-2xl text-[13px] font-semibold text-black placeholder:text-slate-400 outline-none focus:border-[#FF3B30] focus:ring-4 focus:ring-[#FF3B30]/5 transition-all"
                                        />
                                        <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-slate-400 group-focus-within:text-[#FF3B30] transition-colors" />
                                    </div>
                                </div>

                                {/* Custom Date/Time Inputs */}
                                <div className="grid grid-cols-2 gap-4">
                                    {/* Custom Date Picker */}
                                    <div className="space-y-2" ref={calendarRef}>
                                        <label className="text-[11px] font-semibold text-[#A0AEC0] uppercase tracking-wider px-1">Date</label>
                                        <div className="relative">
                                            <button
                                                type="button"
                                                onClick={() => setIsCalendarOpen(!isCalendarOpen)}
                                                className={cn(
                                                    "w-full h-12 pl-12 pr-4 bg-[#F8FAFC] border border-[#E2E8F0] rounded-2xl text-[13px] font-semibold text-black flex items-center transition-all outline-none",
                                                    isCalendarOpen ? "border-[#FF3B30] bg-white ring-4 ring-[#FF3B30]/5" : "hover:border-slate-300"
                                                )}
                                            >
                                                <span>{selectedDate.getDate()} June &apos;26</span>
                                            </button>
                                            <CalendarIcon className={cn("absolute left-4 top-1/2 -translate-y-1/2 w-4.5 h-4.5 transition-colors", isCalendarOpen ? "text-[#FF3B30]" : "text-slate-400")} />

                                            {isCalendarOpen && (
                                                <div className="absolute top-[calc(100%+8px)] left-0 w-[280px] bg-white border border-slate-100 shadow-2xl rounded-[24px] z-50 p-5 animate-in fade-in slide-in-from-top-2 duration-200">
                                                    <div className="flex items-center justify-between mb-4 px-1">
                                                        <span className="text-[14px] font-semibold text-black">June 2026</span>
                                                        <div className="flex gap-1">
                                                            <button className="p-1 hover:bg-slate-50 rounded-lg text-slate-400"><ChevronLeft className="w-4 h-4" /></button>
                                                            <button className="p-1 hover:bg-slate-50 rounded-lg text-slate-400"><ChevronRight className="w-4 h-4" /></button>
                                                        </div>
                                                    </div>
                                                    <div className="grid grid-cols-7 gap-1 mb-2">
                                                        {['M', 'T', 'W', 'T', 'F', 'S', 'S'].map((d, i) => (
                                                            <span key={i} className="text-[10px] font-semibold text-slate-300 text-center uppercase">{d}</span>
                                                        ))}
                                                    </div>
                                                    <div className="grid grid-cols-7 gap-1">
                                                        {calendarDays.map((day) => (
                                                            <button
                                                                key={day}
                                                                type="button"
                                                                onClick={() => {
                                                                    setSelectedDate(new Date(2026, 5, day));
                                                                    setIsCalendarOpen(false);
                                                                }}
                                                                className={cn(
                                                                    "aspect-square flex items-center justify-center text-[12px] font-semibold rounded-xl transition-all",
                                                                    selectedDate.getDate() === day
                                                                        ? "bg-[#FF3B30] text-white"
                                                                        : "text-black hover:bg-slate-50"
                                                                )}
                                                            >
                                                                {day}
                                                            </button>
                                                        ))}
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    </div>

                                    {/* Custom Time Picker */}
                                    <div className="space-y-2" ref={timeRef}>
                                        <label className="text-[11px] font-semibold text-[#A0AEC0] uppercase tracking-wider px-1">Time</label>
                                        <div className="relative">
                                            <button
                                                type="button"
                                                onClick={() => setIsTimePickerOpen(!isTimePickerOpen)}
                                                className={cn(
                                                    "w-full h-12 pl-12 pr-4 bg-[#F8FAFC] border border-[#E2E8F0] rounded-2xl text-[13px] font-semibold text-black flex items-center transition-all outline-none",
                                                    isTimePickerOpen ? "border-[#FF3B30] bg-white ring-4 ring-[#FF3B30]/5" : "hover:border-slate-300"
                                                )}
                                            >
                                                <span>{selectedTime}</span>
                                            </button>
                                            <Clock className={cn("absolute left-4 top-1/2 -translate-y-1/2 w-4.5 h-4.5 transition-colors", isTimePickerOpen ? "text-[#FF3B30]" : "text-slate-400")} />

                                            {isTimePickerOpen && (
                                                <div className="absolute top-[calc(100%+8px)] right-0 w-[200px] bg-white border border-slate-100 shadow-2xl rounded-[24px] z-50 p-2 max-h-[280px] overflow-y-auto animate-in fade-in slide-in-from-top-2 duration-200 custom-scrollbar">
                                                    <div className="grid grid-cols-1 gap-1">
                                                        {timeSlots.map((time) => (
                                                            <button
                                                                key={time}
                                                                type="button"
                                                                onClick={() => {
                                                                    setSelectedTime(time);
                                                                    setIsTimePickerOpen(false);
                                                                }}
                                                                className={cn(
                                                                    "px-4 py-2.5 rounded-xl text-[12px] font-semibold transition-all text-left",
                                                                    selectedTime === time
                                                                        ? "bg-[#FF3B30]/5 text-[#FF3B30]"
                                                                        : "text-slate-600 hover:bg-slate-50 hover:text-black"
                                                                )}
                                                            >
                                                                {time}
                                                            </button>
                                                        ))}
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>

                                {/* Special Notes Styled like Login Inputs */}
                                <div className="space-y-2">
                                    <label className="text-[11px] font-semibold text-[#A0AEC0] uppercase tracking-wider px-1">Special Notes (Optional)</label>
                                    <textarea
                                        placeholder="Add any request..."
                                        value={specialNotes}
                                        onChange={(e) => setSpecialNotes(e.target.value)}
                                        rows={2}
                                        className="w-full p-4 bg-[#F8FAFC] border border-[#E2E8F0] rounded-2xl text-[13px] font-semibold text-black placeholder:text-slate-300 outline-none focus:border-[#FF3B30] focus:ring-4 focus:ring-[#FF3B30]/5 transition-all resize-none"
                                    />
                                </div>
                            </div>

                            {/* Book Now Button */}
                            <button className="w-full h-14 bg-[#FF3B30] text-white rounded-[20px] text-[15px] font-semibold uppercase tracking-[0.1em] hover:bg-[#E0352B] transition-all active:scale-[0.98]">
                                BOOK NOW
                            </button>

                            {/* Cost Summary */}
                            <div className="pt-4 border-t border-slate-50 space-y-2">
                                <div className="flex justify-between text-xs font-medium text-slate-400">
                                    <span>Base Service Fee</span>
                                    <span>$120.00</span>
                                </div>
                                <div className="flex justify-between text-xs font-medium text-slate-400">
                                    <span>Equipment Fee</span>
                                    <span>$0.00</span>
                                </div>
                                <div className="flex justify-between pt-2">
                                    <span className="text-[14px] font-semibold text-black">Total Expected</span>
                                    <span className="text-[15px] font-semibold text-black">$120.00</span>
                                </div>
                            </div>

                            <p className="text-center text-[10px] font-semibold text-slate-300 tracking-tight">
                                *You will not be charged yet
                            </p>
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
        </div>
    );
}
