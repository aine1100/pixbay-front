"use client";

import { useState, useEffect ,useRef} from "react";
import { useRouter } from "next/navigation";
import { Sidebar } from "@/features/dashboard/components/Sidebar";
import { NotificationDropdown } from "@/features/dashboard/components/NotificationDropdown";
import { Search, Bell, Menu, X, Mail, ChevronDown, Settings, LogOut, User } from "lucide-react";
import Image from "next/image";
import { useProfile } from "@/features/user/hooks/useProfile";
import { Loading } from "@/components/ui/loading";
import { authStorage } from "@/lib/auth-storage";
import { authService } from "@/features/auth/services/auth.service";

import { CompleteProfileModal } from "@/features/creators/components/Dashboard/CompleteProfileModal";
import { cn } from "@/lib/utils";
import { useUserStore } from "@/features/user/store/userStore";

export default function DashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const router = useRouter();
    const [mounted, setMounted] = useState(false);
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [showCompleteProfile, setShowCompleteProfile] = useState(false);
    
    // Global user state (from token initially)
    const { user: storeUser } = useUserStore();
    
    // Fetch fresh profile data
    const { data: profileUser, isLoading: isProfileLoading, isError } = useProfile();

    useEffect(() => {
        setMounted(true);
    }, []);

    // Check for incomplete profile
    useEffect(() => {
        if (profileUser?.role === 'CREATOR' && 
            profileUser?.creatorProfile?.verificationStatus === 'APPROVED' &&
            (profileUser?.creatorProfile?.bio === 'Pending activation' || !profileUser?.creatorProfile?.businessName)) {
            setShowCompleteProfile(true);
        }
    }, [profileUser]);

    // ... existing useEffect ...

    const [isLangOpen, setIsLangOpen] = useState(false);
    const [isProfileOpen, setIsProfileOpen] = useState(false);
    const langRef = useRef<HTMLDivElement>(null);
    const profileRef = useRef<HTMLDivElement>(null);

    const handleLogout = () => {
        authService.logout();
        router.push("/login");
    };

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (langRef.current && !langRef.current.contains(event.target as Node)) {
                setIsLangOpen(false);
            }
            if (profileRef.current && !profileRef.current.contains(event.target as Node)) {
                setIsProfileOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const languages = [
        { id: "en", label: "England", flag: "https://flagcdn.com/w40/gb.png", active: true },
        { id: "fr", label: "French", flag: "https://flagcdn.com/w40/fr.png", active: false },
    ];

    useEffect(() => {
        const checkAuth = () => {
            const accessToken = localStorage.getItem("pixbay_access_token");
            const refreshToken = localStorage.getItem("pixbay_refresh_token");
            
            const isAccessExpired = !accessToken || authStorage.isTokenExpired();
            
            if (isAccessExpired && !refreshToken) {
                console.warn("Session expired and no refresh token found. Logging out...");
                localStorage.removeItem("pixbay_access_token");
                localStorage.removeItem("pixbay_refresh_token");
                router.push("/login?expired=true");
            }
        };

        checkAuth();
        const interval = setInterval(checkAuth, 60 * 1000);
        return () => clearInterval(interval);
    }, [router]);

    // Only show full-screen loading if we don't even have a token user
    // We also check !mounted to prevent hydration mismatch since storeUser is available immediately on client but not server
    if (!mounted || (isProfileLoading && !storeUser)) {
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

                        {/* Language Selector Dropdown */}
                        <div className="relative" ref={langRef}>
                            <button
                                onClick={() => setIsLangOpen(!isLangOpen)}
                                className="flex items-center gap-1.5 px-3 h-10 bg-white rounded-full border border-slate-100 cursor-pointer hover:bg-slate-50 transition-colors hidden md:flex outline-none"
                            >
                                <div className="w-6 h-4 relative overflow-hidden rounded-sm border border-slate-100">
                                    <Image
                                        src="https://flagcdn.com/w40/gb.png"
                                        alt="English"
                                        fill
                                        className="object-cover"
                                    />
                                </div>
                                <ChevronDown className={cn("w-3.5 h-3.5 text-slate-400 transition-transform duration-300", isLangOpen && "rotate-180")} />
                            </button>

                            {isLangOpen && (
                                <div className="absolute top-[calc(100%+12px)] right-0 w-48 bg-white rounded-2xl border border-slate-100/50 overflow-hidden z-50 animate-in fade-in slide-in-from-top-2 duration-200">
                                    <div className="p-1.5 space-y-0.5">
                                        {languages.map((lang) => (
                                            <button
                                                key={lang.id}
                                                disabled={!lang.active}
                                                className={cn(
                                                    "w-full flex items-center gap-3 px-3.5 h-11 rounded-xl text-[13px] font-semibold transition-all",
                                                    lang.active 
                                                        ? "text-slate-900 hover:bg-slate-50" 
                                                        : "text-slate-300 cursor-not-allowed"
                                                )}
                                            >
                                                <div className="w-5 h-3.5 relative overflow-hidden rounded-sm border border-slate-100 shrink-0">
                                                    <Image src={lang.flag} alt={lang.label} fill className="object-cover" />
                                                </div>
                                                <span>{lang.label}</span>
                                                {lang.active && <div className="ml-auto w-1.5 h-1.5 bg-primary rounded-full" />}
                                                {!lang.active && <span className="ml-auto text-[10px] uppercase tracking-wider opacity-50">Soon</span>}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Profile Dropdown */}
                        <div className="relative" ref={profileRef}>
                            <button
                                onClick={() => setIsProfileOpen(!isProfileOpen)}
                                className="flex items-center gap-4 pl-6 border-l border-slate-100 outline-none group"
                            >
                                <div className="w-10 h-10 rounded-full bg-slate-200 border border-slate-100 overflow-hidden relative transition-transform group-hover:scale-105">
                                    <Image
                                        src={displayUser?.avatar || "https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=150&h=150&auto=format&fit=crop"}
                                        alt="Profile"
                                        fill
                                        className="object-cover"
                                    />
                                </div>
                                <div className="flex items-center gap-2">
                                    <p className="text-sm font-semibold text-slate-900 leading-none">
                                        {displayUser?.firstName && displayUser?.lastName ? `${displayUser.firstName} ${displayUser.lastName}` : (displayUser?.firstName || displayUser?.email || "User")}
                                    </p>
                                    <ChevronDown className={cn("w-4 h-4 text-slate-400 transition-transform duration-300", isProfileOpen && "rotate-180")} />
                                </div>
                            </button>

                            {isProfileOpen && (
                                <div className="absolute top-[calc(100%+12px)] right-0 w-64 bg-white rounded-[24px] border border-slate-100/50 overflow-hidden z-50 animate-in fade-in slide-in-from-top-2 duration-200">
                                    {/* User Info Header */}
                                    <div className="px-6 py-5 bg-slate-50/50 border-b border-slate-100">
                                        <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-widest mb-1">Logged in as</p>
                                        <p className="text-[14px] font-semibold text-slate-900 truncate">{displayUser?.email}</p>
                                    </div>

                                    <div className="p-2 space-y-0.5">
                                        <button 
                                            onClick={() => {
                                                setIsProfileOpen(false);
                                                router.push(displayUser?.role === 'CREATOR' ? '/creator/settings' : '/client/settings');
                                            }}
                                            className="w-full flex items-center gap-3 px-4 h-12 rounded-xl text-[14px] font-semibold text-slate-600 hover:bg-slate-50 hover:text-slate-900 transition-all"
                                        >
                                            <Settings className="w-4.5 h-4.5" />
                                            <span>Settings</span>
                                        </button>
                                        <div className="h-px bg-slate-100 mx-3 my-1" />
                                        <button 
                                            onClick={handleLogout}
                                            className="w-full flex items-center gap-3 px-4 h-12 rounded-xl text-[14px] font-semibold text-red-500 hover:bg-red-50 transition-all"
                                        >
                                            <LogOut className="w-4.5 h-4.5" />
                                            <span>Log Out</span>
                                        </button>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </header>

                {/* Dashboard Viewport */}
                <main className="flex-1 overflow-y-auto p-4 sm:p-8 custom-scrollbar">
                    {children}
                </main>
            </div>
            
            <CompleteProfileModal isOpen={showCompleteProfile} onOpenChange={setShowCompleteProfile} />
        </div>
    );
}
