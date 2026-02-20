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
    Briefcase,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useUserStore } from "@/features/user/store/userStore";
import { authService } from "@/features/auth/services/auth.service";
import { useRouter } from "next/navigation";
import { useUnreadCount } from "@/features/chat/hooks/useUnreadCount";

interface MenuItem {
    label: string;
    icon: any;
    href: string;
}

const CLIENT_MENU_ITEMS: MenuItem[] = [
    { label: "Home", icon: LayoutDashboard, href: "/client" },
    { label: "Find Creators", icon: Search, href: "/client/find-creators" },
    { label: "Bookings", icon: Calendar, href: "/client/bookings" },
    { label: "Jobs", icon: Briefcase, href: "/client/jobs" },
    { label: "Messages", icon: MessageSquare, href: "/client/messages" },
    { label: "Payments", icon: Wallet, href: "/client/payments" },
];

const CREATOR_MENU_ITEMS: MenuItem[] = [
    { label: "Home", icon: LayoutDashboard, href: "/creator" },
    { label: "Portfolio", icon: Search, href: "/creator/portfolio" },
    { label: "Bookings", icon: Calendar, href: "/creator/bookings" },
    { label: "Jobs", icon: Briefcase, href: "/creator/jobs" },
    { label: "Messages", icon: MessageSquare, href: "/creator/messages" },
    { label: "Wallet", icon: Wallet, href: "/creator/wallet" },
    { label: "Reviews", icon: MessageSquare, href: "/creator/reviews" },
];

const GENERAL_ITEMS = (role: string): MenuItem[] => [
    { label: "Settings", icon: Settings, href: `/${role.toLowerCase()}/settings` },
    { label: "Help", icon: HelpCircle, href: `/${role.toLowerCase()}/help` }
];

export function Sidebar() {
    const pathname = usePathname();
    const router = useRouter();
    const { user } = useUserStore();
    const role = user?.role || "CLIENT";
    const menuItems = role === "CREATOR" ? CREATOR_MENU_ITEMS : CLIENT_MENU_ITEMS;
    const generalItems = GENERAL_ITEMS(role);
    const unreadCount = useUnreadCount();

    const handleLogout = () => {
        authService.logout();
        router.push("/login");
    };

    return (
        <div className="flex flex-col h-full bg-white">
            <div className="flex items-center gap-3 px-8 h-20">
                <span className="text-xl font-semibold text-slate-900 ">Pixbay</span>
            </div>

            <div className="flex-1 px-4 py-4 space-y-8 overflow-y-auto custom-scrollbar">
                <div>
                    <nav className="space-y-1">
                        {menuItems.map((item) => {
                            // Logic for active state including subroutes
                            const isActive = pathname === item.href ||
                                (pathname.startsWith(item.href + "/") && item.href !== "/client" && item.href !== "/creator") ||
                                (item.href === "/client/find-creators" && pathname.startsWith("/client/creators"));

                            const isMessages = item.label === "Messages";

                            return (
                                <Link
                                    key={item.href}
                                    href={item.href}
                                    className={cn(
                                        "group flex items-center justify-between px-4 h-12 rounded-xl transition-all relative overflow-hidden",
                                        isActive
                                            ? "bg-primary text-white"
                                            : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                                    )}
                                >
                                    <div className="flex items-center gap-4">
                                        <item.icon className={cn("w-5 h-5 transition-colors", isActive ? "text-white" : "text-slate-600 group-hover:text-slate-900")} />
                                        <span className="text-[14px] font-semibold">{item.label}</span>
                                    </div>
                                    {isMessages && unreadCount > 0 && (
                                        <span className={cn(
                                            "min-w-[20px] h-5 px-1.5 flex items-center justify-center rounded-full text-[10px] font-semibold",
                                            isActive ? "bg-white text-red-500" : "bg-red-500 text-white"
                                        )}>
                                            {unreadCount > 99 ? "99+" : unreadCount}
                                        </span>
                                    )}
                                </Link>
                            );
                        })}
                    </nav>
                </div>

                <div>
                    <nav className="space-y-1">
                        {generalItems.map((item) => {
                            const isActive = pathname === item.href || pathname.startsWith(item.href + "/");
                            return (
                                <Link
                                    key={item.href}
                                    href={item.href}
                                    className={cn(
                                        "group flex items-center gap-4 px-4 h-12 rounded-xl transition-all relative",
                                        isActive
                                            ? "bg-primary text-white"
                                            : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                                    )}
                                >
                                    <item.icon className={cn("w-5 h-5 transition-colors", isActive ? "text-white" : "text-slate-600 group-hover:text-slate-900")} />
                                    <span className="text-[14px] font-semibold">{item.label}</span>
                                </Link>
                            );
                        })}
                        <button
                            onClick={handleLogout}
                            className="w-full group flex items-center gap-4 px-4 h-12 rounded-xl text-slate-600 hover:text-primary hover:bg-slate-50 transition-all text-left mt-4"
                        >
                            <LogOut className="w-5 h-5 text-slate-600 group-hover:text-primary transition-colors" />
                            <span className="text-[14px] font-semibold">Logout</span>
                        </button>
                    </nav>
                </div>
            </div>
        </div>
    );
}
