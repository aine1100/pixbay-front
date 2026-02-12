import React, { useState, useEffect, useCallback } from 'react';
import { ChatList } from './ChatList';
import { ChatWindow } from './ChatWindow';
import { chatService, Chat } from '../services/chat.service';
import { Loader2, Search } from 'lucide-react';
import { useSearchParams } from 'next/navigation';
import { useOnlineUsers } from '../hooks/useOnlineUsers';
import { useSocket } from '../hooks/useSocket';
import { useUserStore } from '@/features/user/store/userStore';

export const MessagesView: React.FC = () => {
    const [chats, setChats] = useState<Chat[]>([]);
    const [activeChatId, setActiveChatId] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState("");
    const searchParams = useSearchParams();
    const { onlineUsers, isOnline } = useOnlineUsers();
    const { on } = useSocket();
    const user = useUserStore(state => state.user);

    const loadChats = async () => {
        setIsLoading(true);
        try {
            const data = await chatService.listChats();
            setChats(data);

            // Auto-select chat from query param if available
            const chatIdFromUrl = searchParams.get('chatId');
            if (chatIdFromUrl) {
                handleChatSelect(chatIdFromUrl);
            }
        } catch (error) {
            console.error('Failed to load chats:', error);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        loadChats();
    }, []);

    // Listen for new messages to update chat list in real-time
    useEffect(() => {
        const offMsg = on('receive_message', (msg: any) => {
            setChats(prev => prev.map(chat => {
                if (chat.id !== msg.chatId) return chat;

                // If this chat is currently active, don't bump unread
                const isActive = msg.chatId === activeChatId;
                const isFromMe = msg.senderId === user?.id;

                return {
                    ...chat,
                    lastMessage: {
                        content: msg.content,
                        senderId: msg.senderId,
                        sentAt: msg.sentAt,
                        messageType: msg.messageType,
                    },
                    unreadCount: (isActive || isFromMe) ? 0 : chat.unreadCount + 1,
                    updatedAt: msg.sentAt,
                };
            }));
        });

        return () => { offMsg(); };
    }, [on, activeChatId, user?.id]);

    const handleChatSelect = useCallback((chatId: string) => {
        setActiveChatId(chatId);

        // Immediately zero out unread count for this chat locally
        setChats(prev => prev.map(chat =>
            chat.id === chatId ? { ...chat, unreadCount: 0 } : chat
        ));

        // Mark as read on the backend
        chatService.markAsRead(chatId).catch(() => {});
    }, []);

    const filteredChats = chats.filter(chat =>
        `${chat.otherUser.firstName} ${chat.otherUser.lastName}`
            .toLowerCase()
            .includes(searchQuery.toLowerCase())
    );

    const activeChat = chats.find(c => c.id === activeChatId) || null;
    const isOtherUserOnline = activeChat ? isOnline(activeChat.otherUser.id) : false;

    return (
        <div className="flex bg-white rounded-[32px] border border-slate-100 overflow-hidden h-[calc(100vh-140px)]">
            {/* Sidebar */}
            <div className="w-80 md:w-96 border-r border-slate-100 flex flex-col bg-white">
                <div className="p-6 pb-4">
                    <h2 className="text-[22px] font-semibold text-slate-900 mb-4">Messages</h2>
                    <div className="relative">
                        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                        <input
                            type="text"
                            placeholder="Search messages..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full bg-slate-50 border border-slate-100 rounded-2xl pl-10 pr-4 py-2.5 text-[14px] focus:outline-none focus:border-slate-200 transition-all"
                        />
                    </div>
                </div>

                {isLoading ? (
                    <div className="flex-1 flex items-center justify-center">
                        <Loader2 className="w-6 h-6 text-slate-400 animate-spin" />
                    </div>
                ) : (
                    <ChatList
                        chats={filteredChats}
                        activeChatId={activeChatId}
                        onChatSelect={handleChatSelect}
                        onlineUsers={onlineUsers}
                    />
                )}
            </div>

            {/* Main Content */}
            <ChatWindow activeChat={activeChat} isOtherUserOnline={isOtherUserOnline} />
        </div>
    );
};
