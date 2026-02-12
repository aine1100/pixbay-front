import React from 'react';
import { format } from 'date-fns';
import { Chat } from '../services/chat.service';
import { cn } from '@/lib/utils';

interface ChatListProps {
    chats: Chat[];
    activeChatId: string | null;
    onChatSelect: (chatId: string) => void;
    onlineUsers?: Set<string>;
}

export const ChatList: React.FC<ChatListProps> = ({ 
    chats, 
    activeChatId, 
    onChatSelect,
    onlineUsers = new Set()
}) => {
    return (
        <div className="flex-1 overflow-y-auto">
            {chats.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full p-8 text-center">
                    <p className="text-slate-400 text-[14px]">No messages yet</p>
                </div>
            ) : (
                <div className="divide-y divide-slate-50">
                    {chats.map((chat) => {
                        const isOnline = onlineUsers.has(chat.otherUser.id);

                        return (
                            <button
                                key={chat.id}
                                onClick={() => onChatSelect(chat.id)}
                                className={cn(
                                    "w-full flex items-center gap-4 p-4 transition-all text-left",
                                    activeChatId === chat.id ? "bg-slate-50" : "hover:bg-slate-50/50"
                                )}
                            >
                                <div className="relative">
                                    <div className="w-12 h-12 rounded-full overflow-hidden bg-slate-100 border border-slate-100">
                                        {chat.otherUser.profilePicture ? (
                                            <img 
                                                src={chat.otherUser.profilePicture} 
                                                alt={chat.otherUser.firstName}
                                                className="w-full h-full object-cover"
                                            />
                                        ) : (
                                            <div className="w-full h-full flex items-center justify-center text-slate-400 text-sm font-semibold">
                                                {chat.otherUser.firstName[0]}
                                            </div>
                                        )}
                                    </div>
                                    {/* Online indicator */}
                                    {isOnline && (
                                        <span className="absolute bottom-0 right-0 w-3.5 h-3.5 bg-emerald-500 border-2 border-white rounded-full" />
                                    )}
                                    {/* Unread badge */}
                                    {chat.unreadCount > 0 && (
                                        <span className="absolute -top-1 -right-1 min-w-[20px] h-5 px-1 bg-red-500 border-2 border-white rounded-full flex items-center justify-center text-[10px] font-semibold text-white">
                                            {chat.unreadCount}
                                        </span>
                                    )}
                                </div>

                                <div className="flex-1 min-w-0">
                                    <div className="flex items-center justify-between mb-0.5">
                                        <div className="flex items-center gap-2 min-w-0">
                                            <h3 className={cn(
                                                "text-[15px] font-semibold truncate",
                                                chat.unreadCount > 0 ? "text-slate-900" : "text-slate-700"
                                            )}>
                                                {chat.otherUser.firstName} {chat.otherUser.lastName}
                                            </h3>
                                            {isOnline && (
                                                <span className="text-[10px] font-semibold text-emerald-500 shrink-0">Online</span>
                                            )}
                                        </div>
                                        <span className="text-[11px] text-slate-400 shrink-0 ml-2">
                                            {format(new Date(chat.updatedAt), 'HH:mm')}
                                        </span>
                                    </div>
                                    <div className="flex items-center justify-between">
                                        <p className={cn(
                                            "text-[13px] truncate flex-1",
                                            chat.unreadCount > 0 ? "text-slate-900 font-medium" : "text-slate-500"
                                        )}>
                                            {chat.lastMessage?.messageType === 'TEXT' 
                                                ? chat.lastMessage.content 
                                                : chat.lastMessage?.messageType === 'DOCUMENT' 
                                                    ? "📎 Attached file" 
                                                    : "No messages yet"}
                                        </p>
                                    </div>
                                </div>
                            </button>
                        );
                    })}
                </div>
            )}
        </div>
    );
};
