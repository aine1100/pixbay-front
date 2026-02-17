"use client";

import React from "react";
import { useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { useBookings } from "@/features/bookings/hooks/useBookings";
import { paymentService } from "@/features/payment/services/payment.service";
import { Loading } from "@/components/ui/loading";
import { DollarSign, ArrowUpRight, ArrowDownLeft, Clock, CheckCircle2, XCircle, Search, Filter, Calendar, Users } from "lucide-react";
import { cn } from "@/lib/utils";
import { format } from "date-fns";

export default function CreatorPaymentsPage() {
    const { data: bookingData, isLoading: bookingsLoading } = useBookings();
    const { data: paymentData, isLoading: paymentsLoading } = useQuery({
        queryKey: ["creatorPayments"],
        queryFn: () => paymentService.getCreatorPayments()
    });

    const transactions = paymentData?.data || [];
    const bookings = bookingData || [];

    const stats = useMemo(() => {
        const completedTxs = transactions.filter((tx: any) => tx.status === "COMPLETED");
        const pendingTxs = transactions.filter((tx: any) => tx.status === "PENDING");
        
        // Missing people (Bookings confirmed but not fully paid)
        const missingPeople = bookings.filter((b: any) => 
            (b.status === "CONFIRMED" || b.status === "COMPLETED") && 
            b.paymentStatus !== "FULLY_PAID"
        );

        return {
            totalEarnings: completedTxs.reduce((sum: number, tx: any) => sum + parseFloat(tx.amount), 0),
            pendingPayments: pendingTxs.reduce((sum: number, tx: any) => sum + parseFloat(tx.amount), 0),
            completedCount: completedTxs.length,
            missingCount: missingPeople.length
        };
    }, [transactions, bookings]);

    if (bookingsLoading || paymentsLoading) {
        return (
            <div className="flex-1 flex flex-col items-center justify-center py-20 bg-white rounded-[24px] border border-slate-100 min-h-[500px]">
                <Loading size="lg" />
                <p className="mt-4 text-slate-500 font-medium animate-pulse">Loading transaction history...</p>
            </div>
        );
    }

    return (
        <div className="max-w-[1400px] mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700 font-sans">
            <div>
                <h1 className="text-2xl font-medium text-[#111827] tracking-tight">Earnings Dashboard</h1>
                <p className="text-slate-500 mt-1 font-medium">Track your income and transaction history across all bookings.</p>
            </div>

            {/* Stats Overview */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                {[
                    { 
                        label: "Total Earnings", 
                        value: `${transactions[0]?.currency || 'KES'} ${stats.totalEarnings.toLocaleString()}`, 
                        icon: DollarSign, 
                        color: "text-green-600", 
                        bg: "bg-green-50" 
                    },
                    { 
                        label: "Pending", 
                        value: `${transactions[0]?.currency || 'KES'} ${stats.pendingPayments.toLocaleString()}`, 
                        icon: Clock, 
                        color: "text-orange-600", 
                        bg: "bg-orange-50" 
                    },
                    { 
                        label: "Completed Jobs", 
                        value: stats.completedCount, 
                        icon: CheckCircle2, 
                        color: "text-blue-600", 
                        bg: "bg-blue-50" 
                    },
                    { 
                        label: "Missing Collections", 
                        value: stats.missingCount, 
                        icon: Users, 
                        color: "text-red-500", 
                        bg: "bg-red-50" 
                    }
                ].map((stat, i) => (
                    <div key={i} className="bg-white p-6 rounded-[24px] border border-slate-100 flex items-center justify-between">
                        <div className="space-y-1">
                            <p className="text-[11px] font-medium text-slate-400 uppercase tracking-widest">{stat.label}</p>
                            <p className="text-2xl font-medium text-slate-900">{stat.value}</p>
                        </div>
                        <div className={cn("w-12 h-12 rounded-2xl flex items-center justify-center", stat.bg)}>
                            <stat.icon className={cn("w-6 h-6", stat.color)} />
                        </div>
                    </div>
                ))}
            </div>

            {/* Transactions List */}
            <div className="bg-white rounded-[24px] border border-slate-100 overflow-hidden">
                <div className="p-6 border-b border-slate-50 flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <h2 className="text-lg font-medium text-slate-900">Transaction History</h2>
                    <div className="flex items-center gap-3">
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                            <input 
                                type="text" 
                                placeholder="Search transactions..." 
                                className="pl-9 pr-4 py-2 bg-slate-50 border-none rounded-xl text-sm focus:ring-2 focus:ring-[#FF3B30] outline-none"
                            />
                        </div>
                        <button className="p-2 border border-slate-100 rounded-xl hover:bg-slate-50 transition-colors">
                            <Filter className="w-5 h-5 text-slate-400" />
                        </button>
                    </div>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead>
                            <tr className="bg-slate-50/50 text-slate-400 text-[10px] font-medium uppercase tracking-widest">
                                <th className="px-6 py-4">Transaction Details</th>
                                <th className="px-6 py-4">Client</th>
                                <th className="px-6 py-4">Status</th>
                                <th className="px-6 py-4">Amount</th>
                                <th className="px-6 py-4">Date</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-50">
                            {transactions.length > 0 ? (
                                transactions.map((tx: any) => (
                                    <tr key={tx.id} className="hover:bg-slate-50/50 transition-colors group">
                                        <td className="px-6 py-5">
                                            <div className="flex items-center gap-4">
                                                <div className={cn(
                                                    "w-10 h-10 rounded-xl flex items-center justify-center",
                                                    tx.status === "COMPLETED" ? "bg-green-50 text-green-600" : "bg-slate-50 text-slate-400"
                                                )}>
                                                    <ArrowUpRight className="w-5 h-5" />
                                                </div>
                                                <div>
                                                    <p className="text-sm font-medium text-slate-900">#{tx.transactionNumber?.slice(0, 8).toUpperCase()}</p>
                                                    <p className="text-[11px] text-slate-500 font-medium">{tx.booking?.category || "Services"}</p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-5 text-sm font-medium text-slate-600">
                                            {tx.booking?.client?.firstName} {tx.booking?.client?.lastName}
                                        </td>
                                        <td className="px-6 py-5">
                                            <span className={cn(
                                                "px-3 py-1 rounded-full text-[10px] font-medium uppercase tracking-wider border",
                                                tx.status === "COMPLETED" ? "bg-green-50 text-green-600 border-green-100/50" :
                                                tx.status === "PENDING" ? "bg-orange-50 text-orange-600 border-orange-100/50" : "bg-red-50 text-red-600 border-red-100/50"
                                            )}>
                                                {tx.status}
                                            </span>
                                        </td>
                                        <td className="px-6 py-5">
                                            <p className="text-sm font-medium text-slate-900">{tx.currency} {parseFloat(tx.amount).toLocaleString()}</p>
                                        </td>
                                        <td className="px-6 py-5">
                                            <div className="flex items-center gap-2 text-slate-400">
                                                <Calendar className="w-4 h-4" />
                                                <span className="text-xs font-medium">{format(new Date(tx.createdAt), 'MMM d, yyyy')}</span>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan={5} className="px-6 py-20 text-center">
                                        <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mx-auto text-slate-300 mb-4">
                                            <DollarSign className="w-8 h-8" />
                                        </div>
                                        <h3 className="text-lg font-medium text-slate-900">No transactions found</h3>
                                        <p className="text-slate-500 text-sm font-medium">Once you complete sessions and receive payments, they will appear here.</p>
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
