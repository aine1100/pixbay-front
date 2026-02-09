"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
    LayoutDashboard,
    Search,
    Calendar,
    MessageSquare,
    Wallet,
    Star,
    Settings,
    HelpCircle,
    LogOut,
    Download
} from "lucide-react";
import { cn } from "@/lib/utils";

const MENU_ITEMS = [
    { label: "Dashboard", icon: LayoutDashboard, href: "/client" },
    { label: "Find Creators", icon: Search, href: "/client/find-creators" },
    { label: "Bookings", icon: Calendar, href: "/client/bookings" },
    { label: "Messages", icon: MessageSquare, href: "/client/messages", badge: "12+" },
    { label: "Payments", icon: Wallet, href: "/client/payments" },
    { label: "Reviews", icon: Star, href: "/client/reviews" },
];

const GENERAL_ITEMS = [
    { label: "Settings", icon: Settings, href: "/client/settings" },
    { label: "Help", icon: HelpCircle, href: "/client/help" },
];

export function Sidebar() {
    const pathname = usePathname();

    return (
        <div className="flex flex-col h-full bg-[#FAFAFA]">
            {/* Logo */}
            <div className="flex items-center gap-3 px-8 h-20 items-center">
                <div className="w-8 h-8 bg-primary rounded-xl flex items-center justify-center text-white">
                    <span className="text-sm font-bold">P</span>
                </div>
                <span className="text-lg font-semibold text-slate-900">Pixbay</span>
            </div>

            {/* Menu Items */}
            <div className="flex-1 px-4 py-4 space-y-8 overflow-y-auto custom-scrollbar">
                <div>
                    <p className="text-[10px] font-semibold text-slate-700 uppercase tracking-[0.2em] px-4 mb-4">
                        Menu
                    </p>
                    <nav className="space-y-1">
                        {MENU_ITEMS.map((item) => {
                            const isActive = pathname === item.href;
                            return (
                                <Link
                                    key={item.href}
                                    href={item.href}
                                    className={cn(
                                        "group flex items-center justify-between px-4 h-11 rounded-xl transition-all relative overflow-hidden",
                                        isActive
                                            ? "text-primary font-semibold"
                                            : "text-slate-700 font-medium hover:bg-slate-100/50"
                                    )}
                                >
                                    {isActive && (
                                        <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-6 bg-primary rounded-r-full" />
                                    )}
                                    <div className="flex items-center gap-3">
                                        <item.icon className={cn("w-5 h-5", isActive ? "text-primary" : "text-slate-700")} />
                                        <span className="text-[13px]">{item.label}</span>
                                    </div>
                                    {item.badge && (
                                        <span className="text-[10px] bg-primary/10 text-primary font-bold px-2 py-0.5 rounded-lg">
                                            {item.badge}
                                        </span>
                                    )}
                                </Link>
                            );
                        })}
                    </nav>
                </div>

                <div>
                    <p className="text-[10px] font-semibold text-slate-700 uppercase tracking-[0.2em] px-4 mb-4">
                        General
                    </p>
                    <nav className="space-y-1">
                        {GENERAL_ITEMS.map((item) => {
                            const isActive = pathname === item.href;
                            return (
                                <Link
                                    key={item.href}
                                    href={item.href}
                                    className={cn(
                                        "group flex items-center gap-3 px-4 h-11 rounded-xl transition-all relative",
                                        isActive
                                            ? "text-primary font-semibold"
                                            : "text-slate-700 font-medium hover:bg-slate-100/50"
                                    )}
                                >
                                    {isActive && (
                                        <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-6 bg-primary rounded-r-full" />
                                    )}
                                    <item.icon className={cn("w-5 h-5", isActive ? "text-primary" : "text-slate-700")} />
                                    <span className="text-[13px]">{item.label}</span>
                                </Link>
                            );
                        })}
                        <button className="w-full group flex items-center gap-3 px-4 h-11 rounded-xl text-slate-700 font-medium hover:text-red-500 hover:bg-red-50/50 transition-all">
                            <LogOut className="w-5 h-5 text-slate-700 group-hover:text-red-400" />
                            <span className="text-[13px]">Logout</span>
                        </button>
                    </nav>
                </div>
            </div>

        </div>
    );
}
