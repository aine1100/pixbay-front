"use client";

import { useState, useRef, useEffect } from "react";
import { Bell, Check, Trash2, Clock, Inbox } from "lucide-react";
import { useNotifications, useReadNotification, useReadAllNotifications, useArchiveNotification } from "../../../features/user/hooks/useNotifications";
import { cn } from "@/lib/utils";
import { formatDistanceToNow } from "date-fns";

export const NotificationDropdown = () => {
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    const { data: notificationsData, isLoading } = useNotifications({ limit: 5 });
    const markAsRead = useReadNotification();
    const markAllRead = useReadAllNotifications();
    const archive = useArchiveNotification();

    const notifications = notificationsData?.notifications || [];
    const unreadCount = notificationsData?.unreadCount || 0;

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const toggleDropdown = () => setIsOpen(!isOpen);

    const handleMarkAsRead = (e: React.MouseEvent, id: string) => {
        e.stopPropagation();
        markAsRead.mutate(id);
    };

    const handleArchive = (e: React.MouseEvent, id: string) => {
        e.stopPropagation();
        archive.mutate(id);
    };

    return (
        <div className="relative" ref={dropdownRef}>
            {/* Bell Icon */}
            <button
                onClick={toggleDropdown}
                className={cn(
                    "p-2.5 text-slate-900 hover:bg-slate-50 rounded-full transition-all relative outline-none",
                    isOpen && "bg-slate-100"
                )}
            >
                <Bell className="w-6 h-6" />
                {unreadCount > 0 && (
                    <span className="absolute top-2.5 right-2.5 w-4.5 h-4.5 bg-[#FF3B30] text-white text-[10px] font-bold rounded-full border-2 border-white flex items-center justify-center">
                        {unreadCount > 9 ? "9+" : unreadCount}
                    </span>
                )}
            </button>

            {/* Dropdown Menu */}
            {isOpen && (
                <div className="absolute right-0 mt-3 w-80 md:w-96 bg-white rounded-[24px] shadow-2xl border border-slate-100/50 overflow-hidden z-50 animate-in fade-in slide-in-from-top-2 duration-200">
                    {/* Header */}
                    <div className="px-6 py-5 border-b border-slate-50 flex items-center justify-between bg-white">
                        <div>
                            <h3 className="text-[17px] font-bold text-slate-900">Notifications</h3>
                            <p className="text-[12px] text-slate-400 font-medium">You have {unreadCount} unread Notifications</p>
                        </div>
                        {unreadCount > 0 && (
                            <button
                                onClick={() => markAllRead.mutate()}
                                className="text-[12px] font-bold text-primary hover:text-primary/80 transition-colors"
                            >
                                Mark all as read
                            </button>
                        )}
                    </div>

                    {/* Notification List */}
                    <div className="max-h-[420px] overflow-y-auto custom-scrollbar bg-slate-50/30">
                        {isLoading ? (
                            <div className="py-20 flex flex-col items-center justify-center text-slate-400 gap-3">
                                <div className="w-8 h-8 border-2 border-primary/30 border-t-primary rounded-full animate-spin" />
                                <span className="text-[13px] font-medium">Loading notifications...</span>
                            </div>
                        ) : notifications.length === 0 ? (
                            <div className="py-20 flex flex-col items-center justify-center text-slate-400 gap-4">
                                <div className="p-4 bg-white rounded-2xl shadow-sm">
                                    <Inbox className="w-8 h-8 text-slate-200" />
                                </div>
                                <div className="text-center">
                                    <p className="text-[15px] font-bold text-slate-900">All caught up!</p>
                                    <p className="text-[13px] font-medium text-slate-400">No new notifications to show.</p>
                                </div>
                            </div>
                        ) : (
                            <div className="divide-y divide-slate-50">
                                {notifications.map((notif: any) => (
                                    <div
                                        key={notif.id}
                                        className={cn(
                                            "px-6 py-5 hover:bg-white transition-all cursor-pointer group relative",
                                            !notif.isRead && "bg-primary/[0.02]"
                                        )}
                                        onClick={() => !notif.isRead && markAsRead.mutate(notif.id)}
                                    >
                                        <div className="flex gap-4">
                                            {/* Status Dot */}
                                            {!notif.isRead && (
                                                <div className="absolute left-2.5 top-1/2 -translate-y-1/2">
                                                    <div className="w-1.5 h-1.5 bg-primary rounded-full" />
                                                </div>
                                            )}

                                            <div className="flex-1 space-y-1.5">
                                                <div className="flex items-start justify-between gap-4">
                                                    <h4 className={cn(
                                                        "text-[14px] font-bold leading-tight",
                                                        notif.isRead ? "text-slate-600" : "text-slate-900"
                                                    )}>
                                                        {notif.title}
                                                    </h4>
                                                    <button
                                                        onClick={(e) => handleArchive(e, notif.id)}
                                                        className="opacity-0 group-hover:opacity-100 p-1.5 hover:bg-slate-100 rounded-lg text-slate-400 hover:text-red-500 transition-all"
                                                    >
                                                        <Trash2 className="w-4 h-4" />
                                                    </button>
                                                </div>
                                                <p className="text-[13px] font-medium text-slate-500 line-clamp-2 leading-relaxed">
                                                    {notif.message}
                                                </p>
                                                <div className="flex items-center gap-2 pt-1">
                                                    <Clock className="w-3.5 h-3.5 text-slate-300" />
                                                    <span className="text-[11px] font-bold text-slate-300 uppercase tracking-widest">
                                                        {formatDistanceToNow(new Date(notif.createdAt), { addSuffix: true })}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Footer */}
                    <div className="p-4 bg-white border-top border-slate-50">
                        <button className="w-full h-11 bg-slate-50 hover:bg-slate-100 text-slate-600 rounded-xl text-[13px] font-bold transition-all">
                            View all notifications
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};
