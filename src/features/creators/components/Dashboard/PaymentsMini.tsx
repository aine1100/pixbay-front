"use client";

import React from "react";
import { CreditCard, ArrowUpRight, ChevronRight, Clock } from "lucide-react";
import { format } from "date-fns";

interface Transaction {
    id: string;
    type: string;
    amount: number | string;
    currency: string;
    status: string;
    createdAt: string;
    booking?: {
        category: string;
        bookingNumber: string;
    };
}

interface PaymentsMiniProps {
    transactions?: Transaction[];
    isLoading?: boolean;
}

export function PaymentsMini({ transactions = [], isLoading = false }: PaymentsMiniProps) {
    if (isLoading) {
        return (
            <div className="bg-white rounded-[32px] border border-slate-100 p-8 space-y-8 h-full animate-pulse">
                <div className="h-6 w-32 bg-slate-100 rounded"></div>
                <div className="space-y-4">
                    {[1, 2, 3].map(i => (
                        <div key={i} className="h-16 bg-slate-50 rounded-2xl"></div>
                    ))}
                </div>
            </div>
        );
    }

    return (
        <div className="bg-white rounded-[32px] border border-slate-100 p-8 space-y-8 h-full flex flex-col">
            <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold text-slate-900 tracking-tight">Recent Payments</h2>
                <button className="text-xs font-semibold text-primary hover:underline flex items-center gap-1">
                     <ArrowUpRight className="w-4 h-4" />
                </button>
            </div>

            <div className="space-y-4 flex-1">
                {transactions.slice(0, 4).map((tx) => (
                    <div
                        key={tx.id}
                        className="group flex items-center p-4 rounded-2xl border border-slate-50 hover:border-primary/20 hover:bg-slate-50/50 transition-all cursor-pointer"
                    >
                        <div className="w-10 h-10 bg-slate-50 group-hover:bg-white rounded-xl flex items-center justify-center text-slate-400 group-hover:text-primary transition-colors border border-transparent group-hover:border-slate-100">
                            <CreditCard className="w-5 h-5" />
                        </div>

                        <div className="ml-3 flex-1 min-w-0">
                            <h4 className="text-xs font-semibold text-slate-700 truncate">
                                {tx.booking?.category || "Payout"}
                            </h4>
                            <p className="text-[10px] text-slate-400 font-medium">
                                {format(new Date(tx.createdAt), "MMM d")}
                            </p>
                        </div>

                        <div className="text-right ml-3">
                            <p className="text-xs font-bold text-slate-900">
                                {tx.currency === "KES" ? "KES" : "$"} {Number(tx.amount).toLocaleString()}
                            </p>
                        </div>
                    </div>
                ))}

                {transactions.length === 0 && (
                    <div className="flex-1 flex flex-col items-center justify-center py-10 text-center space-y-3 opacity-60">
                        <div className="w-12 h-12 bg-slate-50 rounded-full flex items-center justify-center mb-2">
                             <CreditCard className="w-6 h-6 text-slate-300" />
                        </div>
                        <p className="text-[12px] font-semibold text-slate-400">
                            No recent payments
                        </p>
                    </div>
                )}
            </div>
            
            {transactions.length > 0 && (
                <button className="w-full py-3 text-[11px] font-bold text-slate-400 hover:text-primary transition-colors border-t border-slate-50 uppercase tracking-widest">
                    View Transaction History
                </button>
            )}
        </div>
    );
}
