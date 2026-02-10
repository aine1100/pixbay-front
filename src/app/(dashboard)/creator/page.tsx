"use client";

import React from "react";
import { WelcomeHero } from "@/features/creators/components/Dashboard/WelcomeHero";
import { CreatorStats } from "@/features/creators/components/Dashboard/CreatorStats";
import { RecentReviews } from "@/features/creators/components/Dashboard/RecentReviews";
import { PaymentsMini } from "@/features/creators/components/Dashboard/PaymentsMini";
import { ProjectRecommendations } from "@/features/creators/components/Dashboard/ProjectRecommendations";
import { RecentBookings } from "@/features/creators/components/Dashboard/RecentBookings";
import { useUserStore } from "@/features/user/store/userStore";
import { useProfile } from "@/features/user/hooks/useProfile";
import { ChevronDown } from "lucide-react";

export default function CreatorDashboardPage() {
    const { user: storeUser } = useUserStore();
    const { data: profile } = useProfile();
    const user = profile || storeUser;
    
    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700 pb-12">
            {/* Approval Banner */}
            <div className="bg-[#FFF8E1] border border-[#FFE082] rounded-xl p-4 flex items-center justify-center gap-3">
                <span className="text-[14px] text-[#A27300] font-medium flex items-center gap-2">
                    <span className="text-lg">🌟</span>
                    Your account has been officially approved. It&apos;s your time to shine
                </span>
            </div>

            {/* Welcome Hero */}
            <WelcomeHero firstName={user?.firstName || "Creator"} />

            {/* Overview Stats */}
            <div className="space-y-6">
                <div className="flex items-center justify-between">
                    <h2 className="text-xl font-semibold text-slate-900">Overview</h2>
                    <button className="flex items-center gap-2 px-4 h-10 bg-white border border-slate-100 rounded-xl text-sm font-semibold text-slate-600 hover:bg-slate-50 transition-all">
                        Last week
                        <ChevronDown className="w-4 h-4" />
                    </button>
                </div>
                <CreatorStats />
            </div>

            {/* Second Row: Reviews & Payments */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2">
                    <RecentReviews />
                </div>
                <div>
                    <PaymentsMini />
                </div>
            </div>

            {/* Third Row: Recommended Projects & Recent Bookings */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <ProjectRecommendations />
                <RecentBookings />
            </div>
        </div>
    );
}
