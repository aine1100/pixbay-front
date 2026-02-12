import React, { useEffect, useRef } from 'react';
import { useChat } from '../hooks/useChat';
import { MessageBubble } from './MessageBubble';
import { ChatInput } from './ChatInput';
import { Loader2, User } from 'lucide-react';
import { Chat } from '../services/chat.service';
import { useUserStore } from '@/features/user/store/userStore';

interface ChatWindowProps {
    activeChat: Chat | null;
    isOtherUserOnline?: boolean;
}

export const ChatWindow: React.FC<ChatWindowProps> = ({ activeChat, isOtherUserOnline = false }) => {
    const user = useUserStore(state => state.user);
    const {
        messages,
        isLoading,
        isTyping,
        isUploading,
        sendMessage,
        sendTyping,
        uploadFile
    } = useChat(activeChat?.id || null);

    const messagesEndRef = useRef<HTMLDivElement>(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages, isTyping]);

    if (!activeChat) {
        return (
            <div className="flex-1 flex flex-col items-center justify-center bg-slate-50/50 p-8 text-center">
                <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mb-4 border border-slate-100">
                    <User className="w-8 h-8 text-slate-300" />
                </div>
                <h3 className="text-[17px] font-semibold text-slate-900 mb-2">Your Messages</h3>
                <p className="text-slate-500 text-[14px] max-w-[280px]">
                    Select a conversation from the list to start messaging or find a creator to chat with.
                </p>
            </div>
        );
    }

    const otherUserName = `${activeChat.otherUser.firstName}`;

    return (
        <div className="flex-1 flex flex-col bg-white h-full overflow-hidden">
            {/* Header */}
            <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <div className="relative">
                        <div className="w-10 h-10 rounded-full overflow-hidden bg-slate-100 border border-slate-100">
                            {activeChat.otherUser.profilePicture ? (
                                <img
                                    src={activeChat.otherUser.profilePicture}
                                    alt={activeChat.otherUser.firstName}
                                    className="w-full h-full object-cover"
                                />
                            ) : (
                                <div className="w-full h-full flex items-center justify-center text-slate-400 text-xs font-semibold">
                                    {activeChat.otherUser.firstName[0]}
                                </div>
                            )}
                        </div>
                        {isOtherUserOnline && (
                            <span className="absolute bottom-0 right-0 w-3 h-3 bg-emerald-500 border-2 border-white rounded-full" />
                        )}
                    </div>
                    <div>
                        <h3 className="text-[15px] font-semibold text-slate-900">
                            {activeChat.otherUser.firstName} {activeChat.otherUser.lastName}
                        </h3>
                        <p className="text-[11px] text-slate-500">
                            {isOtherUserOnline ? (
                                <span className="text-emerald-500 font-semibold">Online now</span>
                            ) : activeChat.booking ? (
                                <>Booking #{activeChat.booking.bookingNumber} • {activeChat.booking.status}</>
                            ) : (
                                "Offline"
                            )}
                        </p>
                    </div>
                </div>
            </div>

            {/* Messages Area */}
            <div className="flex-1 overflow-y-auto p-6 space-y-2">
                {isLoading ? (
                    <div className="flex items-center justify-center h-full">
                        <Loader2 className="w-6 h-6 text-slate-400 animate-spin" />
                    </div>
                ) : (
                    <>
                        {messages.length === 0 && (
                            <div className="flex flex-col items-center justify-center h-full text-center">
                                <div className="w-14 h-14 bg-slate-50 rounded-full flex items-center justify-center mb-3">
                                    <User className="w-7 h-7 text-slate-300" />
                                </div>
                                <p className="text-slate-500 text-[14px] font-medium">
                                    Start the conversation with {otherUserName}
                                </p>
                                <p className="text-slate-400 text-[12px] mt-1">
                                    Send a message or share a file to get started
                                </p>
                            </div>
                        )}
                        {messages.map((msg) => (
                            <MessageBubble
                                key={msg.id}
                                message={msg}
                                isOwn={msg.senderId === user?.id}
                            />
                        ))}
                        {isTyping && (
                            <div className="flex justify-start mb-4">
                                <div className="bg-slate-50 border border-slate-100 rounded-[20px] rounded-tl-none px-4 py-2.5 flex items-center gap-2">
                                    <div className="flex items-center gap-1">
                                        <span className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></span>
                                        <span className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></span>
                                        <span className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></span>
                                    </div>
                                    <span className="text-[11px] text-slate-400 font-medium ml-1">{otherUserName} is typing</span>
                                </div>
                            </div>
                        )}
                        <div ref={messagesEndRef} />
                    </>
                )}
            </div>

            {/* Input Area */}
            <ChatInput
                onSendMessage={sendMessage}
                onUploadFile={uploadFile}
                onTyping={sendTyping}
                isUploading={isUploading}
            />
        </div>
    );
};
