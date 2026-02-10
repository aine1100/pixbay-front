"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Sidebar } from "@/features/dashboard/components/Sidebar";
import { NotificationDropdown } from "@/features/dashboard/components/NotificationDropdown";
import { Search, Bell, Menu, X, Mail, ChevronDown } from "lucide-react";
import Image from "next/image";
import { useProfile } from "@/features/user/hooks/useProfile";
import { Loading } from "@/components/ui/loading";
import { authStorage } from "@/lib/auth-storage";

import { useUserStore } from "@/features/user/store/userStore";

export default function DashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const router = useRouter();
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    
    // Global user state (from token initially)
    const { user: storeUser } = useUserStore();
    
    // Fetch fresh profile data
    const { data: profileUser, isLoading: isProfileLoading, isError } = useProfile();

    useEffect(() => {
        const checkAuth = () => {
            const accessToken = localStorage.getItem("pixbay_access_token");
            const refreshToken = localStorage.getItem("pixbay_refresh_token");
            
            const isAccessExpired = !accessToken || authStorage.isTokenExpired();
            
            // For refresh token, we don't have a decoder yet but we know it's in localStorage
            // If access is expired AND there's no refresh token, THEN we log out.
            // If access is expired but refresh exists, the next API call will attempt to renew.
            if (isAccessExpired && !refreshToken) {
                console.warn("Session expired and no refresh token found. Logging out...");
                localStorage.removeItem("pixbay_access_token");
                localStorage.removeItem("pixbay_refresh_token");
                router.push("/login?expired=true");
            }
        };

        // Check immediately
        checkAuth();

        // Check periodically (every minute)
        const interval = setInterval(checkAuth, 60 * 1000);
        return () => clearInterval(interval);
    }, [router]);

    // Only show full-screen loading if we don't even have a token user
    if (isProfileLoading && !storeUser) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center bg-white">
                <Loading size="lg" />
                <p className="mt-4 text-slate-500 font-medium animate-pulse">Loading ...</p>
            </div>
        );
    }

    const displayUser = profileUser || storeUser;

    return (
        <div className="min-h-screen bg-[#F8F9FA] flex font-sans">
            {/* Sidebar - Desktop */}
            <aside className="hidden lg:flex w-64 flex-col border-r border-slate-200 bg-white sticky top-0 h-screen">
                <Sidebar />
            </aside>

            {/* Sidebar - Mobile Overlay */}
            {isSidebarOpen && (
                <div
                    className="fixed inset-0 bg-black/50 z-40 lg:hidden"
                    onClick={() => setIsSidebarOpen(false)}
                />
            )}
            <aside className={`fixed inset-y-0 left-0 w-64 bg-white z-50 transform transition-transform duration-300 ease-in-out lg:hidden ${isSidebarOpen ? "translate-x-0" : "-translate-x-full"}`}>
                <Sidebar />
                <button
                    onClick={() => setIsSidebarOpen(false)}
                    className="absolute top-4 right-4 p-2 text-slate-700"
                >
                    <X className="w-6 h-6" />
                </button>
            </aside>

            {/* Main Content Area */}
            <div className="flex-1 flex flex-col min-w-0 h-screen overflow-hidden">
                {/* Top Header */}
                <header className="h-20 bg-white border-b border-slate-100/50 flex items-center justify-between px-8 sticky top-0 z-30 flex-shrink-0">
                    <div className="flex items-center gap-6 flex-1">
                        <button
                            className="lg:hidden p-2 -ml-2 text-slate-700"
                            onClick={() => setIsSidebarOpen(true)}
                        >
                            <Menu className="w-6 h-6" />
                        </button>

                        <div className="flex items-center gap-4 w-full">


                            {/* Search Bar */}
                            <div className="relative max-w-lg w-full">
                                <Search className="absolute right-5 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-slate-900" />
                                <input
                                    type="text"
                                    placeholder="Search for anything"
                                    className="w-full h-11 bg-white border border-slate-100 rounded-full pl-6 pr-14 text-sm font-semibold text-slate-900 focus:ring-2 focus:ring-[#FF3B30]/5 focus:border-[#FF3B30]/20 outline-none transition-all placeholder:text-slate-400 placeholder:font-medium"
                                />
                            </div>
                        </div>
                    </div>

                    <div className="flex items-center gap-6">
                        {/* Bell Icon */}
                        <NotificationDropdown />

                        {/* Language Selector */}
                        <div className="flex items-center gap-1.5 px-3 h-10 bg-slate-50 rounded-full border border-slate-100/50 cursor-pointer hover:bg-slate-100 transition-colors hidden md:flex">
                            <div className="w-6 h-4 relative overflow-hidden rounded-sm">
                                <Image
                                    src="https://flagcdn.com/w40/rw.png"
                                    alt="Rwanda"
                                    fill
                                    className="object-cover"
                                />
                            </div>
                        </div>

                        {/* Profile Info */}
                        <div className="flex items-center gap-4 pl-6 border-l border-slate-100">
                            <div className="w-10 h-10 rounded-full bg-slate-200 border border-slate-100 overflow-hidden relative cursor-pointer">
                                <Image
                                    src={displayUser?.avatar || "https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=150&h=150&auto=format&fit=crop"}
                                    alt="Profile"
                                    fill
                                    className="object-cover"
                                />
                            </div>
                            <div className="flex items-center gap-2 cursor-pointer group">
                                <p className="text-sm font-semibold text-slate-900 leading-none">
                                    {displayUser?.firstName && displayUser?.lastName ? `${displayUser.firstName} ${displayUser.lastName}` : (displayUser?.firstName || displayUser?.email || "User")}
                                </p>
                                <ChevronDown className="w-4 h-4 text-slate-900 group-hover:translate-y-0.5 transition-transform" />
                            </div>
                        </div>
                    </div>
                </header>

                {/* Dashboard Viewport */}
                <main className="flex-1 overflow-y-auto p-4 sm:p-8 custom-scrollbar">
                    {children}
                </main>
            </div>
        </div>
    );
}
