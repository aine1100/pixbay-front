"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
    LayoutDashboard,
    Search,
    Calendar,
    MessageSquare,
    Wallet,
    Settings,
    HelpCircle,
    LogOut,
} from "lucide-react";
import { cn } from "@/lib/utils";

const MENU_ITEMS = [
    { label: "Home", icon: LayoutDashboard, href: "/client" },
    { label: "Find Creators", icon: Search, href: "/client/find-creators" },
    { label: "Bookings", icon: Calendar, href: "/client/bookings" },
    { label: "Messages", icon: MessageSquare, href: "/client/messages", badge: "12+" },
    { label: "Payments", icon: Wallet, href: "/client/payments" },
];

const GENERAL_ITEMS = [
    { label: "Settings", icon: Settings, href: "/client/settings" },
    { label: "Help", icon: HelpCircle, href: "/client/help" },
];

export function Sidebar() {
    const pathname = usePathname();

    return (
        <div className="flex flex-col h-full bg-white">
            {/* Logo */}
            <div className="flex items-center gap-3 px-8 h-20 items-center">
                <span className="text-xl font-semibold text-slate-900">Pixbay</span>
            </div>

            <div className="flex-1 px-4 py-4 space-y-8 overflow-y-auto custom-scrollbar">
                <div>
                    <nav className="space-y-1">
                        {MENU_ITEMS.map((item) => {
                            const isActive = pathname === item.href ||
                                (item.href === "/client/find-creators" && pathname.startsWith("/client/creators")) ||
                                (item.href === "/client/bookings" && pathname.startsWith("/client/bookings/"));
                            return (
                                <Link
                                    key={item.href}
                                    href={item.href}
                                    className={cn(
                                        "group flex items-center justify-between px-4 h-12 rounded-lg transition-all relative overflow-hidden",
                                        isActive
                                            ? "bg-primary text-white"
                                            : "text-slate-900 hover:bg-slate-50"
                                    )}
                                >
                                    <div className="flex items-center gap-4">
                                        <item.icon className={cn("w-5 h-5", isActive ? "text-white" : "text-slate-700")} />
                                        <span className="text-[14px] font-medium">{item.label}</span>
                                    </div>
                                    {item.badge && (
                                        <span className={cn(
                                            "text-[10px] font-semibold px-2 py-0.5 rounded-lg",
                                            isActive ? "bg-white/20 text-white" : "bg-primary/10 text-primary"
                                        )}>
                                            {item.badge}
                                        </span>
                                    )}
                                </Link>
                            );
                        })}
                    </nav>
                </div>

                <div>
                    <nav className="space-y-1">
                        {GENERAL_ITEMS.map((item) => {
                            const isActive = pathname === item.href;
                            return (
                                <Link
                                    key={item.href}
                                    href={item.href}
                                    className={cn(
                                        "group flex items-center gap-4 px-4 h-12 rounded-lg transition-all relative",
                                        isActive
                                            ? "bg-primary text-white"
                                            : "text-slate-900 hover:bg-slate-50"
                                    )}
                                >
                                    <item.icon className={cn("w-5 h-5", isActive ? "text-white" : "text-slate-700")} />
                                    <span className="text-[14px] font-medium">{item.label}</span>
                                </Link>
                            );
                        })}
                        <button className="w-full group flex items-center gap-4 px-4 h-12 rounded-xl text-slate-900 hover:text-primary hover:bg-slate-50 transition-all">
                            <LogOut className="w-5 h-5 text-slate-700 group-hover:text-primary" />
                            <span className="text-[14px] font-medium">Logout</span>
                        </button>
                    </nav>
                </div>
            </div>

        </div>
    );
}
