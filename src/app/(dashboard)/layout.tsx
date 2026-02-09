"use client";

import { useState } from "react";
import { Sidebar } from "@/features/dashboard/components/Sidebar";
import { Search, Bell, Menu, X, Mail, ChevronDown } from "lucide-react";
import Image from "next/image";

export default function DashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

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
                <header className="h-20 bg-white border-b border-slate-100 flex items-center justify-between px-4 sm:px-8 sticky top-0 z-30 flex-shrink-0">
                    <div className="flex items-center gap-4 flex-1">
                        <button
                            className="lg:hidden p-2 -ml-2 text-slate-700"
                            onClick={() => setIsSidebarOpen(true)}
                        >
                            <Menu className="w-6 h-6" />
                        </button>

                        {/* Search Bar */}
                        <div className="relative max-w-md w-full hidden sm:block">
                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-700" />
                            <input
                                type="text"
                                placeholder="Search for anything..."
                                className="w-full h-11 bg-slate-50 rounded-2xl pl-11 pr-4 text-sm border-none focus:ring-1 focus:ring-primary outline-none transition-all placeholder:text-slate-700 placeholder:font-medium"
                            />
                        </div>
                    </div>

                    <div className="flex items-center gap-3 sm:gap-4">
                        {/* Mail Icon */}
                        <button className="p-2.5 text-slate-700 hover:text-primary hover:bg-slate-50 rounded-2xl transition-all relative hidden sm:flex">
                            <Mail className="w-5 h-5" />
                        </button>

                        {/* Bell Icon */}
                        <button className="p-2.5 text-slate-700 hover:text-primary hover:bg-slate-50 rounded-2xl transition-all relative">
                            <Bell className="w-5 h-5" />
                            <span className="absolute top-2.5 right-3 w-2 h-2 bg-red-500 rounded-full border border-white"></span>
                        </button>

                        {/* Language Selector */}
                        <div className="flex items-center gap-1.5 px-3 h-10 bg-slate-50 rounded-2xl border border-slate-100 cursor-pointer hover:bg-slate-100 transition-colors hidden md:flex">
                            <div className="w-5 h-4 relative overflow-hidden rounded-sm">
                                <Image 
                                    src="https://flagcdn.com/w40/rw.png" 
                                    alt="Rwanda"
                                    fill
                                    className="object-cover"
                                />
                            </div>
                            <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
                        </div>
                        
                        {/* Profile Info */}
                        <div className="flex items-center gap-3 pl-2 sm:pl-4 border-l border-slate-100">
                            <div className="text-right hidden sm:block">
                                <p className="text-sm font-semibold text-slate-700 leading-none">Alena SHIMA</p>
                                <p className="text-[11px] text-primary mt-1 font-medium italic uppercase">Client</p>
                            </div>
                            <div className="w-10 h-10 rounded-2xl bg-slate-200 border border-slate-100 overflow-hidden relative cursor-pointer hover:border-primary transition-all">
                                <Image
                                    src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=150&h=150&auto=format&fit=crop"
                                    alt="Profile"
                                    fill
                                    className="object-cover"
                                />
                            </div>
                        </div>
                    </div>
                </header>

                {/* Dashboard Viewport */}
                <main className="flex-1 overflow-y-auto p-4 sm:p-8 custom-scrollbar">
                    {children}
                </main>
            </div>
        </div>
    );
}
