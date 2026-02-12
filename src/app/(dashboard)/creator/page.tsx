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
import { useDashboardStats } from "@/features/dashboard/hooks/useDashboardStats";
import { ChevronDown, MessageSquare } from "lucide-react";
import { RecentMessages } from "@/features/creators/components/Dashboard/RecentMessages";
import Link from "next/link";

export default function CreatorDashboardPage() {
    const { user: storeUser } = useUserStore();
    const { data: profile } = useProfile();
    const user = profile || storeUser;

    const { data: dashboardData, isLoading } = useDashboardStats();
    const stats = dashboardData?.stats || {};
    const transactions = dashboardData?.transactions || [];
    
    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700 pb-12">
            {/* Dynamic Status Banners */}
            {(() => {
                const creator = user?.creatorProfile;
                const status = creator?.verificationStatus;
                const isVerified = creator?.isVerified || false;

                if (status === "APPROVED" || isVerified) {
                    return (
                        <div className="bg-[#FFF8E1] border border-[#FFE082] rounded-xl p-4 flex items-center justify-center gap-3 animate-in fade-in duration-500">
                            <span className="text-[14px] text-[#A27300] font-medium flex items-center gap-2">
                                <span className="text-lg">🌟</span>
                                Your account has been officially approved. It&apos;s your time to shine
                            </span>
                        </div>
                    );
                }

                if (status === "PENDING" || !status) {
                    return (
                        <div className="bg-blue-50 border border-blue-100 rounded-xl p-4 flex items-center justify-center gap-3 animate-in fade-in duration-500">
                            <span className="text-[14px] text-blue-600 font-medium flex items-center gap-2">
                                <span className="text-lg">⏳</span>
                                Your profile is currently under review by our team. We&apos;ll notify you once you&apos;re verified.
                            </span>
                        </div>
                    );
                }

                if (status === "REJECTED") {
                    return (
                        <div className="bg-red-50 border border-red-100 rounded-xl p-4 flex items-center justify-center gap-3 animate-in fade-in duration-500">
                            <span className="text-[14px] text-red-600 font-medium flex items-center gap-2">
                                <span className="text-lg">⚠️</span>
                                Your verification was not successful. Please check your email or contact support for more details.
                            </span>
                        </div>
                    );
                }

                return null;
            })()}

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
                <CreatorStats stats={stats} isLoading={isLoading} />
            </div>

            {/* Second Row: Reviews & Payments & Messages */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 space-y-8">
                    <RecentReviews />
                    <RecentMessages />
                </div>
                <div className="space-y-8">
                    <PaymentsMini transactions={transactions} isLoading={isLoading} />
                    
                    {/* Quick Access Card */}
                    <div className="bg-white p-8 rounded-[40px] border border-slate-100 relative overflow-hidden group">
                        <div className="relative z-10">
                            <div className="w-12 h-12 bg-primary/5 rounded-2xl flex items-center justify-center mb-6">
                                <MessageSquare className="w-6 h-6 text-primary" />
                            </div>
                            <h4 className="text-xl font-semibold text-slate-900 mb-2">Need Help?</h4>
                            <p className="text-slate-500 text-sm mb-8 font-medium leading-relaxed">
                                Our support team is here for you 24/7.
                            </p>
                            <Link href="/creator/help">
                                <button className="w-full h-12 bg-slate-900 text-white rounded-2xl font-semibold text-sm hover:bg-slate-800 transition-all">
                                    Contact Support
                                </button>
                            </Link>
                        </div>
                    </div>
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
