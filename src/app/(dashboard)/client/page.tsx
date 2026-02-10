"use client";

import { WelcomeBanner } from "@/features/dashboard/components/WelcomeBanner";
import { StatsCard } from "@/features/dashboard/components/StatsCard";
import { TrendingCreators } from "@/features/dashboard/components/TrendingCreators";
import { RecentBookings } from "@/features/dashboard/components/RecentBookings";
import { RecentPayments } from "@/features/dashboard/components/RecentPayments";
import { CalendarWidget } from "@/features/dashboard/components/CalendarWidget";
import Link from "next/link";
import {
    CalendarCheck,
    CreditCard,
    Star,
    CheckCircle2,
    ArrowUpRight
} from "lucide-react";

import { useUserStore } from "@/features/user/store/userStore";

export default function ClientDashboardPage() {
    const { user } = useUserStore();
    const userName = user?.firstName || "User";

    return (
        <div className="max-w-[1600px] mx-auto space-y-8 animate-in fade-in duration-500">
            {/* Top Row: Welcome */}
            <WelcomeBanner name={userName} />

            {/* Asymmetrical Grid: 3 Columns on XL, 2 on LG, 1 on Mobile */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 outline-none">

                {/* Main Content Area (Center-Left) - Span 8 columns */}
                <div className="lg:col-span-8 space-y-8">

                    {/* Performance Metrics Row */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                        <StatsCard
                            title="Active Bookings"
                            value="4"
                            trend="+22.5%"
                            trendType="up"
                            description="+1"
                            icon={CalendarCheck}
                        />
                        <StatsCard
                            title="Total Spent"
                            value="$2,500"
                            trend="+10%"
                            trendType="up"
                            description="+$50"
                            icon={CreditCard}
                        />
                        <StatsCard
                            title="Pending Reviews"
                            value="1"
                            trend="+0.5%"
                            trendType="up"
                            description="1"
                            icon={Star}
                        />
                        <StatsCard
                            title="Completed Orders"
                            value="4"
                            trend="+23.5%"
                            trendType="down"
                            description="-2"
                            icon={CheckCircle2}
                        />
                    </div>

                    {/* Primary Activity: Recent Bookings */}
                    <div className="bg-white p-2 rounded-[40px] border border-slate-100">
                        <RecentBookings />
                    </div>

                    {/* Recent Payments Section */}
                    <div className="bg-white p-8 rounded-[40px] border border-slate-100 flex flex-col min-h-[400px]">
                        <RecentPayments />
                    </div>
                </div>

                {/* Right Sidebar Area (Discovery & Schedule) - Span 4 columns */}
                <div className="lg:col-span-4 space-y-8">

                    {/* Discovery Panel */}
                    <div className="bg-white p-8 rounded-[40px] border border-slate-100">
                        <TrendingCreators />
                    </div>

                    {/* Schedule Manager */}
                    <div className="bg-white p-2 rounded-[40px] border border-slate-100">
                        <CalendarWidget />
                    </div>

                    {/* Book Session Card - White Variant */}
                    <div className="bg-white p-8 rounded-[40px] border border-slate-100 relative overflow-hidden group">
                        <div className="relative z-10">
                            <div className="w-12 h-12 bg-red-50 rounded-2xl flex items-center justify-center mb-6">
                                <CalendarCheck className="w-6 h-6 text-primary" />
                            </div>
                            <h4 className="text-xl font-semibold text-slate-700 mb-2">Book a Session</h4>
                            <p className="text-slate-700/70 text-sm mb-8 font-medium leading-relaxed">
                                Find the perfect creator for your next memorable event. Easy, fast and secure.
                            </p>
                            <Link href="/client/find-creators">
                                <button className="w-full h-12 bg-primary text-white rounded-2xl font-semibold text-sm hover:bg-primary/90 transition-all flex items-center justify-center gap-2 group-hover:gap-3">
                                    Start Booking
                                    <ArrowUpRight className="w-4 h-4" />
                                </button>
                            </Link>
                        </div>
                        {/* Subtle visual decorations */}
                        <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full blur-[60px] transform translate-x-10 -translate-y-10 group-hover:scale-125 transition-transform duration-700"></div>
                        <div className="absolute -bottom-10 -left-10 w-24 h-24 bg-red-50/50 rounded-full blur-[40px] group-hover:scale-125 transition-transform duration-700"></div>
                    </div>
                </div>

            </div>
        </div>
    );
}
