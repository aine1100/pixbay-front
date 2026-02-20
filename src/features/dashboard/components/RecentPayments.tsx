"use client";

import { CreditCard, ArrowUpRight, ChevronRight, Clock } from "lucide-react";
import { format } from "date-fns";
import Link from "next/link";

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

interface RecentPaymentsProps {
    transactions?: Transaction[];
    isLoading?: boolean;
}

export function RecentPayments({ transactions = [], isLoading = false }: RecentPaymentsProps) {
    if (isLoading) {
        return (
            <div className="flex flex-col min-h-[400px] animate-pulse">
                <div className="h-8 w-48 bg-slate-100 rounded-lg mb-8"></div>
                <div className="space-y-4">
                    {[1, 2, 3].map(i => (
                        <div key={i} className="h-20 bg-slate-50 rounded-3xl"></div>
                    ))}
                </div>
            </div>
        );
    }

    return (
        <div className="flex flex-col min-h-[400px]">
            <div className="flex items-center justify-between mb-8">
                <div>
                    <h3 className="text-lg font-semibold text-slate-700 tracking-tight">Recent Payments</h3>
                    <p className="text-[11px] text-slate-600 font-medium mt-1 tracking-wider">Your transaction history</p>
                </div>
                <Link href="/client/payments">
                    <button className="text-xs font-semibold text-primary hover:underline flex items-center gap-1">
                        View All <ArrowUpRight className="w-3 h-3" />
                    </button>
                </Link>
            </div>

            <div className="space-y-4 flex-1">
                {transactions.map((tx) => (
                    <div
                        key={tx.id}
                        className="group flex items-center p-4 rounded-3xl border border-slate-100 hover:border-primary/20 hover:bg-slate-50/50 transition-all cursor-pointer"
                    >
                        <div className="w-12 h-12 bg-slate-50 group-hover:bg-white rounded-2xl flex items-center justify-center text-slate-400 group-hover:text-primary transition-colors border border-transparent group-hover:border-slate-100">
                            <CreditCard className="w-6 h-6" />
                        </div>

                        <div className="ml-4 flex-1 min-w-0">
                            <h4 className="text-sm font-semibold text-slate-700 truncate">
                                {tx.booking?.category || "Payment"}
                            </h4>
                            <div className="flex items-center gap-2 mt-0.5">
                                <Clock className="w-3 h-3 text-slate-400" />
                                <span className="text-[11px] font-medium text-slate-500">
                                    {format(new Date(tx.createdAt), "MMM d, h:mm a")}
                                </span>
                            </div>
                        </div>

                        <div className="text-right ml-4">
                            <p className="text-sm font-bold text-slate-900">
                                {tx.currency} {Number(tx.amount).toLocaleString()}
                            </p>
                            <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                                tx.status === "COMPLETED"
                                    ? "bg-red-50 text-primary"
                                    : "bg-slate-100 text-slate-600"
                            }`}>
                                {tx.status.charAt(0) + tx.status.slice(1).toLowerCase()}
                            </span>
                        </div>

                        <div className="ml-4 w-8 h-8 flex items-center justify-center rounded-xl bg-slate-50 text-slate-400 opacity-0 group-hover:opacity-100 transition-all">
                            <ChevronRight className="w-4 h-4" />
                        </div>
                    </div>
                ))}

                {transactions.length === 0 && (
                    <div className="flex-1 flex flex-col justify-center items-center text-center p-8">
                        <div className="w-16 h-16 bg-red-50 rounded-[28px] flex items-center justify-center text-primary mb-4 transform -rotate-12">
                            <CreditCard className="w-8 h-8 fill-primary/10" />
                        </div>
                        <h4 className="text-sm font-semibold text-slate-700 mb-1">No payments yet</h4>
                        <p className="text-xs text-slate-700 font-medium max-w-[200px]">Your transaction history will appear here once you start booking.</p>
                    </div>
                )}
            </div>
        </div>
    );
}
