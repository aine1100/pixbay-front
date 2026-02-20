"use client";

import React from "react";
import { MessageSquare, User, ArrowRight } from "lucide-react";
import { useChats } from "@/features/chat/hooks/useChats";
import Link from "next/link";
import { formatDistanceToNow } from "date-fns";
import { cn } from "@/lib/utils";

export function RecentMessages() {
    const { data: chats, isLoading } = useChats();

    const recentChats = chats?.slice(0, 3) || [];

    return (
        <div className="bg-white p-8 rounded-[40px] border border-slate-100 flex flex-col min-h-[400px]">
            <div className="flex items-center justify-between mb-8">
                <div className="space-y-1">
                    <h3 className="text-xl font-semibold text-slate-900 tracking-tight">Recent Messages</h3>
                    <p className="text-[13px] text-slate-500 font-medium">Your active conversations</p>
                </div>
                <Link href="/creator/messages">
                    <button className="text-[13px] font-semibold text-primary hover:underline flex items-center gap-1.5 transition-all">
                        View all
                        <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                </Link>
            </div>

            {isLoading ? (
                <div className="flex-1 flex flex-col items-center justify-center space-y-3">
                    <div className="w-8 h-8 border-2 border-primary/20 border-t-primary rounded-full animate-spin" />
                    <p className="text-[13px] text-slate-400 font-medium">Loading messages...</p>
                </div>
            ) : recentChats.length === 0 ? (
                <div className="flex-1 flex flex-col items-center justify-center space-y-4 text-center">
                    <div className="w-12 h-12 bg-slate-50 rounded-full flex items-center justify-center">
                        <MessageSquare className="w-6 h-6 text-slate-300" />
                    </div>
                    <div className="space-y-1">
                        <p className="text-[14px] text-slate-600 font-semibold">No messages yet</p>
                        <p className="text-[12px] text-slate-400 font-medium max-w-[200px]">When you start chatting with clients, they'll appear here.</p>
                    </div>
                </div>
            ) : (
                <div className="space-y-4 flex-1">
                    {recentChats.map((chat) => (
                        <Link
                            key={chat.id}
                            href={`/creator/messages?chatId=${chat.id}`}
                            className="flex items-center gap-4 p-4 rounded-3xl border border-slate-50 hover:bg-slate-50 hover:border-slate-100 transition-all group"
                        >
                            <div className="relative">
                                <div className="w-12 h-12 rounded-2xl bg-slate-100 overflow-hidden border border-white flex items-center justify-center text-slate-400 shrink-0">
                                    {chat.otherUser.profilePicture ? (
                                        <img src={chat.otherUser.profilePicture} alt="" className="w-full h-full object-cover" />
                                    ) : (
                                        <User className="w-5 h-5" />
                                    )}
                                </div>
                                {chat.unreadCount > 0 && (
                                    <span className="absolute -top-1 -right-1 w-5 h-5 bg-primary text-white text-[10px] font-semibold rounded-lg flex items-center justify-center border-2 border-white">
                                        {chat.unreadCount}
                                    </span>
                                )}
                            </div>

                            <div className="flex-1 min-w-0">
                                <div className="flex items-center justify-between gap-2 mb-0.5">
                                    <h4 className="text-[14px] font-semibold text-slate-900 truncate">
                                        {chat.otherUser.firstName} {chat.otherUser.lastName}
                                    </h4>
                                    <span className="text-[11px] font-semibold text-slate-400 whitespace-nowrap">
                                        {formatDistanceToNow(new Date(chat.updatedAt), { addSuffix: true })}
                                    </span>
                                </div>
                                <p className={cn(
                                    "text-[13px] font-medium truncate",
                                    chat.unreadCount > 0 ? "text-slate-900" : "text-slate-500"
                                )}>
                                    {chat.lastMessage ? (
                                        typeof chat.lastMessage.content === 'string'
                                            ? chat.lastMessage.content
                                            : (chat.lastMessage.content?.fileName || "Sent an attachment")
                                    ) : "No messages yet"}
                                </p>
                            </div>
                        </Link>
                    ))}
                </div>
            )}
        </div>
    );
}
