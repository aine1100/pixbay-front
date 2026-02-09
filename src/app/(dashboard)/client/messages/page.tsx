"use client";

import { useState, useMemo } from "react";
import { 
    Search, Plus, MoreVertical, Phone, Video, 
    Paperclip, Send, Mic, Check, CheckCheck,
    SearchIcon, Settings2, Filter,
    ChevronDown, PlusSquare
} from "lucide-react";
import NextImage from "next/image";
import { cn } from "@/lib/utils";

// Mock Data
const CONVERSATIONS = [
    {
        id: "c1",
        name: "Diana Ken",
        avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=150",
        message: "The version that you request...",
        time: "4m",
        unread: 1,
        isOnline: true
    },
    {
        id: "c2",
        name: "Chris Musa",
        avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=150",
        message: "Chris is typing...",
        time: "now",
        unread: 1,
        isOnline: true,
        isTyping: true
    },
    {
        id: "c3",
        name: "Emmanuel Mensah",
        avatar: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?q=80&w=150",
        message: "The payment that woul...",
        time: "1w",
        unread: 2,
        isOnline: false
    },
    {
        id: "c4",
        name: "Wilson SHYAKA",
        avatar: "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?q=80&w=150",
        message: "Since we've collabora...",
        time: "1mo",
        unread: 0,
        isOnline: false,
        isRead: true
    }
];

const MESSAGES = [
    {
        id: "m1",
        senderId: "c2",
        text: "Hello, your edited photos are now ready and I would like you to first review them.",
        time: "9:45 AM",
        date: "Today, January 7"
    },
    {
        id: "m2",
        senderId: "me",
        text: "That is good news am going to do it right away",
        time: "9:45 AM",
        date: "Today, January 7"
    },
    {
        id: "m3",
        senderId: "me",
        text: "You have really done a great job",
        time: "11:02 AM",
        date: "Today, January 7"
    },
    {
        id: "m4",
        senderId: "c2",
        text: "Hello, your edited photos are now ready and I would like you to first review them.",
        time: "9:45 AM",
        date: "Today, January 7"
    }
];

export default function MessagingPage() {
    const [selectedChatId, setSelectedChatId] = useState<string | null>(null);
    const [searchQuery, setSearchQuery] = useState("");
    const [messageInput, setMessageInput] = useState("");

    const selectedChat = useMemo(() =>
        CONVERSATIONS.find(c => c.id === selectedChatId),
        [selectedChatId]);

    return (
        <div className="flex bg-[#FAFBFC] h-[calc(100vh-80px)] overflow-hidden font-sans p-6 gap-6">

            {/* Left Sidebar: Conversation List */}
            <div className="w-[380px] bg-white rounded-[32px] border border-slate-100 flex flex-col overflow-hidden">
                {/* Sidebar Header */}
                <div className="p-6 pb-4">
                    <div className="flex items-center justify-between mb-6">
                        <h1 className="text-[20px] font-semibold text-slate-900 tracking-tight">Messages</h1>
                        <div className="flex gap-1">
                            <button className="w-10 h-10 flex items-center justify-center text-[#A67C52] hover:bg-slate-50 rounded-xl transition-colors">
                                <PlusSquare className="w-5 h-5" />
                            </button>
                            <button className="w-10 h-10 flex items-center justify-center text-slate-400 hover:bg-slate-50 rounded-xl transition-colors">
                                <MoreVertical className="w-5 h-5" />
                            </button>
                        </div>
                    </div>

                    {/* Search Bar */}
                    <div className="relative group">
                        <input 
                            type="text"
                            placeholder="Search conversations by name, date..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full h-11 pl-11 pr-4 bg-slate-50/30 border border-slate-100 rounded-xl text-[13px] font-medium text-slate-900 placeholder:text-slate-400 outline-none focus:border-primary/30 focus:bg-white transition-all "
                        />
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-primary transition-colors" />
                    </div>
                </div>

                {/* Conversation List */}
                <div className="flex-1 overflow-y-auto px-2 pb-6 custom-scrollbar">
                    {CONVERSATIONS.map((chat) => (
                        <button
                            key={chat.id}
                            onClick={() => setSelectedChatId(chat.id)}
                            className={cn(
                                "w-full p-4 rounded-2xl flex items-start gap-4 transition-all mb-1 group relative",
                                selectedChatId === chat.id ? "bg-white " : "hover:bg-slate-50/50"
                            )}
                        >
                            <div className="relative flex-shrink-0">
                                <div className="relative w-12 h-12 rounded-full overflow-hidden border-2 border-slate-50">
                                    <NextImage src={chat.avatar} alt={chat.name} fill className="object-cover" />
                                </div>
                                {chat.isOnline && (
                                    <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-white rounded-full" />
                                )}
                            </div>
                            
                            <div className="flex-1 text-left min-w-0">
                                <div className="flex justify-between items-baseline mb-1">
                                    <h3 className={cn("text-[14px] font-semibold truncate", selectedChatId === chat.id ? "text-primary" : "text-slate-900")}>
                                        {chat.name}
                                    </h3>
                                    <span className="text-[10px] font-medium text-slate-400">{chat.time}</span>
                                </div>
                                <div className="flex justify-between items-center">
                                    <p className={cn(
                                        "text-[12px] truncate",
                                        chat.isTyping ? "text-green-500 font-semibold italic" : "text-slate-500 font-medium"
                                    )}>
                                        {chat.message}
                                    </p>
                                    {chat.unread > 0 && (
                                        <div className="ml-2 w-5 h-5 bg-primary text-white text-[10px] font-semibold flex items-center justify-center rounded-full ">
                                            {chat.unread}
                                        </div>
                                    )}
                                    {chat.id === "c4" && (
                                        <CheckCheck className="text-blue-400 w-4 h-4" />
                                    )}
                                </div>
                            </div>
                            {selectedChatId === chat.id && (
                                <div className="absolute inset-y-4 left-0 w-1 bg-primary rounded-r-full" />
                            )}
                        </button>
                    ))}
                </div>
            </div>

            {/* Right Pane: Chat Window */}
            <div className="flex-1 bg-white rounded-[32px] border border-slate-100 flex flex-col overflow-hidden relative">
                {selectedChat ? (
                    <>
                        {/* Chat Header */}
                        <div className="p-6 border-b border-slate-50 flex items-center justify-between bg-white/80 backdrop-blur-md z-10">
                            <div className="flex items-center gap-4">
                                <div className="relative w-12 h-12 rounded-full overflow-hidden border-2 border-slate-50 ">
                                    <NextImage src={selectedChat.avatar} alt={selectedChat.name} fill className="object-cover" />
                                </div>
                                <div>
                                    <h2 className="text-base font-semibold text-slate-900">{selectedChat.name}</h2>
                                    <p className="text-[11px] font-medium text-green-500 italic">
                                        {selectedChat.isTyping ? `${selectedChat.name} is typing...` : 'Active now'}
                                    </p>
                                </div>
                            </div>
                            <div className="flex items-center gap-3">
                                <button className="w-11 h-11 flex items-center justify-center text-slate-500 hover:bg-slate-50 rounded-2xl transition-all active:scale-95 border border-transparent hover:border-slate-100">
                                    <Phone className="w-5 h-5" />
                                </button>
                                <button className="w-11 h-11 flex items-center justify-center text-slate-500 hover:bg-slate-50 rounded-2xl transition-all active:scale-95 border border-transparent hover:border-slate-100">
                                    <Video className="w-5 h-5" />
                                </button>
                                <button className="w-11 h-11 flex items-center justify-center text-slate-500 hover:bg-slate-50 rounded-2xl transition-all active:scale-95 border border-transparent hover:border-slate-100">
                                    <MoreVertical className="w-5 h-5" />
                                </button>
                            </div>
                        </div>

                        {/* Message List */}
                        <div className="flex-1 overflow-y-auto p-8 space-y-10 custom-scrollbar bg-white/50">
                            {/* Date Divider */}
                            <div className="flex justify-center mb-4">
                                <span className="border-border bg-slate-50/30 text-slate-600 font-medium px-4 py-6 rounded-xl h-11 w-full flex items-center justify-center">
                                    Today, January 7
                                </span>
                            </div>

                            {MESSAGES.map((msg, idx) => {
                                const isMe = msg.senderId === "me";
                                return (
                                    <div key={idx} className={cn("flex flex-col mb-8", isMe ? "items-end" : "items-start")}>
                                        <div className={cn("flex items-end gap-4 max-w-[70%]", isMe && "flex-row-reverse")}>
                                            {!isMe && (
                                                <div className="relative w-10 h-10 rounded-full overflow-hidden flex-shrink-0 border border-slate-100 ">
                                                    <NextImage src={selectedChat.avatar} alt={selectedChat.name} fill className="object-cover" />
                                                </div>
                                            )}
                                            <div className="flex flex-col space-y-2">
                                                {!isMe && (
                                                    <span className="text-[12px] font-semibold text-slate-900 ml-1">
                                                        {selectedChat.name}
                                                    </span>
                                                )}
                                                <div className={cn(
                                                    "px-6 py-4 rounded-[24px] text-[13px] font-medium leading-relaxed tracking-tight ",
                                                    isMe 
                                                        ? "bg-primary text-primary-foreground rounded-tr-none " 
                                                        : "bg-white border border-slate-100 text-slate-700 rounded-tl-none"
                                                )}>
                                                    {msg.text}
                                                </div>
                                                <span className={cn("text-[10px] font-medium text-slate-400 mt-2", isMe ? "text-right" : "text-left ml-1")}>
                                                    {msg.time}
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>

                        {/* Message Input area */}
                        <div className="p-6 pt-2 bg-white/80 backdrop-blur-sm">
                            <div className="flex items-center gap-4 bg-slate-50/30 p-2 pr-6 rounded-[28px] border border-slate-200 focus-within:border-primary/30 focus-within:bg-white transition-all ">
                                <button className="w-12 h-12 flex-shrink-0 rounded-full bg-white flex items-center justify-center text-slate-800  hover:scale-105 active:scale-95 transition-all border border-slate-100">
                                    <Paperclip className="w-5 h-5" />
                                </button>
                                <button className="w-12 h-12 flex-shrink-0 rounded-full bg-white flex items-center justify-center text-slate-800  hover:scale-105 active:scale-95 transition-all border border-slate-100">
                                    <Mic className="w-5 h-5 " />
                                </button>
                                <input 
                                    type="text"
                                    placeholder="Type your message"
                                    value={messageInput}
                                    onChange={(e) => setMessageInput(e.target.value)}
                                    className="flex-1 bg-transparent border-none outline-none py-4 px-2 text-[14px] font-medium text-slate-900 placeholder:text-slate-400"
                                />
                                <button className="flex items-center justify-center w-12 h-12  bg-primary text-white text-center rounded-full hover:scale-110 active:scale-90 transition-all ">
                                    <Send className="w-5 h-5" />
                                </button>
                            </div>
                        </div>
                    </>
                ) : (
                    /* Empty State */
                    <div className="flex-1 flex flex-col items-center justify-center p-12 text-center bg-white">
                        <div className="w-32 h-32 bg-[#FF3B30]/5 rounded-full flex items-center justify-center mb-8 animate-pulse">
                            <MessageSquare className="w-16 h-16 text-[#FF3B30]" />
                        </div>
                        <h2 className="text-2xl font-semibold text-slate-900 mb-3">Your Inbox</h2>
                        <p className="text-slate-800 font-medium max-w-[280px] text-sm leading-relaxed">
                            Select a professional to start discussing your project or event captures.
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
}

// Add Missing Icons
function MessageSquare(props: any) {
    return (
        <svg
            {...props}
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
        >
            <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
        </svg>
    )
}
