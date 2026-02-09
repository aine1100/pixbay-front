"use client";

import { useState, useMemo } from "react";
import {
    Search,
    MoreVertical,
    CheckCircle2,
    Smartphone,
    BadgeCheck,
    Star
} from "lucide-react";
import NextImage from "next/image";
import { cn } from "@/lib/utils";

// Mock Data
const PAYMENTS = [
    {
        id: "p1",
        creatorName: "Emmanuel Mensah",
        creatorAvatar: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?q=80&w=150",
        category: "Photographer (Weddings, professional shots)",
        location: "Musanze, Rwanda",
        event: "Birthday",
        date: "April 1, 2026",
        amount: 80.0,
        status: "Completed",
        rating: 4
    },
    {
        id: "p2",
        creatorName: "Dianah Ken",
        creatorAvatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=150",
        category: "Photographer (Weddings, professional shots)",
        location: "Musanze, Rwanda",
        event: "Nathalie's Baby shower",
        date: "Feb 12, 2026",
        amount: 70.0,
        status: "Pending",
        rating: 4,
        isVerified: true
    }
];

const TABS = ["All", "Completed", "Cancelled"];

export default function PaymentsPage() {
    const [activeTab, setActiveTab] = useState("All");
    const [selectedId, setSelectedId] = useState<string | null>("p2");

    const filteredPayments = useMemo(() => {
        if (activeTab === "All") return PAYMENTS;
        return PAYMENTS.filter(p => p.status === activeTab);
    }, [activeTab]);

    const selectedPayment = useMemo(() =>
        PAYMENTS.find(p => p.id === selectedId),
        [selectedId]);

    return (
        <div className="flex bg-[#FAFBFC] h-[calc(100vh-80px)] overflow-hidden font-sans p-6 gap-6">

            {/* Left Pane: Payment List */}
            <div className="flex-1 flex flex-col gap-6 max-w-[650px]">
                {/* Header */}
                <div>
                    <h1 className="text-2xl font-semibold text-slate-900 mb-6">My Payments</h1>

                    {/* Tabs */}
                    <div className="flex gap-2 bg-white p-1 rounded-xl w-fit border border-slate-100">
                        {TABS.map((tab) => (
                            <button
                                key={tab}
                                onClick={() => setActiveTab(tab)}
                                className={cn(
                                    "px-6 py-2 rounded-lg text-sm font-medium transition-all",
                                    activeTab === tab
                                        ? "bg-primary text-white"
                                        : "text-slate-500 hover:text-slate-900"
                                )}
                            >
                                {tab}
                            </button>
                        ))}
                    </div>
                </div>

                {/* List */}
                <div className="flex-1 overflow-y-auto space-y-4 pr-2 custom-scrollbar">
                    {filteredPayments.map((payment) => (
                        <button
                            key={payment.id}
                            onClick={() => setSelectedId(payment.id)}
                            className={cn(
                                "w-full text-left bg-white p-6 rounded-[24px] border border-slate-100 transition-all flex items-start gap-4 group",
                                selectedId === payment.id ? "border-primary/20 bg-primary/[0.02]" : "hover:border-slate-200"
                            )}
                        >
                            <div className="relative w-16 h-16 rounded-xl overflow-hidden flex-shrink-0">
                                <NextImage src={payment.creatorAvatar} alt={payment.creatorName} fill className="object-cover" />
                            </div>

                            <div className="flex-1 min-w-0">
                                <div className="flex justify-between items-start mb-1">
                                    <div className="flex items-center gap-2">
                                        <h3 className="text-base font-semibold text-slate-900 truncate">
                                            {payment.creatorName}
                                        </h3>
                                        <div className="flex items-center gap-0.5">
                                            {[...Array(5)].map((_, i) => (
                                                <Star key={i} className={cn("w-3 h-3", i < payment.rating ? "fill-yellow-400 text-yellow-400" : "text-slate-200")} />
                                            ))}
                                        </div>
                                    </div>
                                    <div className="bg-yellow-50 text-slate-600 px-3 py-1 rounded-lg text-[13px] font-semibold border border-yellow-100/50">
                                        ${payment.amount}
                                    </div>
                                </div>

                                <p className="text-[12px] text-slate-500 font-medium mb-1 truncate">
                                    {payment.category}
                                </p>

                                <div className="flex items-center gap-2 mb-3">
                                    <span className="w-4 h-2.5 bg-[#00A1DE] rounded-[2px]" />
                                    <span className="text-[12px] text-slate-600 font-medium truncate">{payment.location}</span>
                                </div>

                                <div className="flex items-center gap-3 pt-3 border-t border-slate-50">
                                    <span className="text-[11px] font-semibold text-slate-900">{payment.event}</span>
                                    <div className="w-1 h-1 bg-slate-300 rounded-full" />
                                    <span className="text-[11px] font-medium text-slate-400">{payment.date}</span>
                                </div>
                            </div>
                        </button>
                    ))}
                </div>
            </div>

            {/* Right Pane: Payment Details */}
            <div className="w-[400px] bg-white rounded-[32px] border border-slate-100 flex flex-col overflow-hidden">
                {selectedPayment ? (
                    <div className="p-8 h-full flex flex-col">
                        <h2 className="text-lg font-semibold text-slate-900 mb-8">Payment Details</h2>

                        {/* Creator Profile */}
                        <div className="flex flex-col items-center mb-8">
                            <div className="relative w-24 h-24 rounded-full overflow-hidden border-4 border-slate-50 mb-4">
                                <NextImage src={selectedPayment.creatorAvatar} alt={selectedPayment.creatorName} fill className="object-cover" />
                            </div>
                            <div className="flex items-center gap-1.5 mb-1 text-center justify-center">
                                <h3 className="text-xl font-semibold text-slate-900">{selectedPayment.creatorName}</h3>
                                {selectedPayment.isVerified && <BadgeCheck className="w-5 h-5 text-blue-500" />}
                            </div>
                            <p className="text-sm text-slate-500 font-medium text-center px-4">
                                {selectedPayment.category}
                            </p>
                            <div className="flex items-center gap-0.5 mt-2">
                                {[...Array(5)].map((_, i) => (
                                    <Star key={i} className={cn("w-4 h-4", i < selectedPayment.rating ? "fill-yellow-400 text-yellow-400" : "text-slate-200")} />
                                ))}
                            </div>
                        </div>

                        {/* Fees */}
                        <div className="space-y-6 mb-8">
                            <div className="flex justify-between items-center px-2">
                                <span className="text-base font-semibold text-slate-900 border-b-2 border-slate-900">Session Fee</span>
                                <span className="text-base font-semibold text-slate-900 tracking-tight">${selectedPayment.amount.toFixed(1)}</span>
                            </div>

                            {/* Escrow Notice */}
                            <div className="bg-yellow-50/50 border border-yellow-100/30 p-4 rounded-xl flex items-center gap-3">
                                <CheckCircle2 className="w-5 h-5 text-yellow-500 flex-shrink-0" />
                                <p className="text-[12px] font-medium text-slate-800 leading-tight">
                                    Transaction will be held in <span className="font-semibold underline">escrow</span> until payment is complete
                                </p>
                            </div>
                        </div>

                        {/* Payment Method */}
                        <div className="flex-1">
                            <h4 className="text-[14px] font-semibold text-slate-900 mb-4 px-2">Payment method</h4>
                            <button className="w-full flex items-start gap-4 p-4 rounded-2xl hover:bg-slate-50 transition-colors text-left group">
                                <div className="w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center flex-shrink-0 group-hover:bg-white transition-colors">
                                    <Smartphone className="w-5 h-5 text-slate-600" />
                                </div>
                                <div>
                                    <p className="text-[13px] font-semibold text-slate-900 mb-0.5">Mobile Money</p>
                                    <p className="text-[11px] font-medium text-slate-500 leading-relaxed uppercase">
                                        (M-pesa, MTN Mobile money, Airtel money)
                                    </p>
                                </div>
                            </button>
                        </div>

                        {/* Action */}
                        <button className="w-full h-14 bg-primary hover:bg-primary/95 text-white font-semibold rounded-[20px] transition-all active:scale-[0.98] mt-auto">
                            Pay ${selectedPayment.amount.toFixed(1)}
                        </button>
                    </div>
                ) : (
                    <div className="flex-1 flex flex-col items-center justify-center p-8 text-center bg-slate-50/30">
                        <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center mb-4">
                            <Smartphone className="w-8 h-8 text-slate-300" />
                        </div>
                        <h3 className="text-base font-semibold text-slate-900 mb-2">Select a transaction</h3>
                        <p className="text-sm font-medium text-slate-500 max-w-[200px]">
                            Choose a payment from the list to view full details and complete your session.
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
}
