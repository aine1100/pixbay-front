"use client";

import { useWallet, useUpdatePayoutSettings } from "@/features/wallet/hooks/useWallet";
import { useQuery } from "@tanstack/react-query";
import { paymentService } from "@/features/payment/services/payment.service";
import { StatsCard } from "@/features/dashboard/components/StatsCard";
import { Wallet, Clock, CreditCard, Smartphone, ShieldCheck, AlertCircle, Search, Filter, Calendar, ArrowUpRight } from "lucide-react";
import { useState, useEffect } from "react";
import { toast } from "react-hot-toast";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { Loading } from "@/components/ui/loading";

export default function WalletPage() {
    const { data: wallet, isLoading: walletLoading } = useWallet();
    const { data: paymentData, isLoading: paymentsLoading } = useQuery({
        queryKey: ["creatorPayments"],
        queryFn: async () => {
            const response = await paymentService.getCreatorPayments();
            return response.data?.data || response.data || response;
        }
    });

    const transactions = paymentData || [];
    const updatePayoutMutation = useUpdatePayoutSettings();

    const [payoutMethod, setPayoutMethod] = useState<"MOBILE_MONEY" | "BANK">("MOBILE_MONEY");
    const [formData, setFormData] = useState({
        phoneNumber: "",
        network: "MTN",
        accountName: "",
        accountNumber: "",
        bankCode: ""
    });

    useEffect(() => {
        if (wallet?.payoutMethod) {
            setPayoutMethod(wallet.payoutMethod);
        }
        if (wallet?.payoutDetails) {
            setFormData({
                ...formData,
                ...wallet.payoutDetails
            });
        }
    }, [wallet]);

    const handleSavePayout = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await updatePayoutMutation.mutateAsync({
                method: payoutMethod,
                details: formData
            });
            toast.success("Payout settings saved!");
        } catch (error) {
            toast.error("Failed to save payout settings.");
        }
    };

    if (walletLoading || paymentsLoading) {
        return (
            <div className="flex-1 flex flex-col items-center justify-center py-20 bg-white rounded-[32px] border border-slate-100 min-h-[400px]">
                <Loading size="lg" />
                <p className="mt-4 text-slate-500 font-medium animate-pulse">Loading wallets...</p>
            </div>
        )
    }

    return (
        <div className="p-8 max-w-7xl mx-auto space-y-8">
            <header className="flex justify-between items-end">
                <div>
                    <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Financial Dashboard</h1>
                    <p className="text-slate-500 mt-1 font-medium">Manage your earnings and payout settings.</p>
                </div>
                <div className="flex gap-3">
                    <button className="px-6 h-12 bg-primary text-white rounded-2xl font-semibold flex items-center gap-2 hover:bg-red-600 transition-all">
                        Withdraw Funds
                    </button>
                </div>
            </header>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <StatsCard
                    title="Available Balance"
                    value={`${wallet?.currency || 'KES'} ${wallet?.balance || '0.00'}`}
                    trend="Ready for withdrawal"
                    trendType="up"
                    description="Available"
                    icon={Wallet}
                />
                <StatsCard
                    title="Pending Earnings"
                    value={`${wallet?.currency || 'KES'} ${wallet?.pendingBalance || '0.00'}`}
                    trend="Held inEscrow"
                    trendType="down"
                    description="Pending"
                    icon={Clock}
                />
                <div className="bg-red-50 p-6 rounded-3xl border border-red-100 flex flex-col justify-center">
                    <div className="flex items-center gap-3 text-primary mb-2">
                        <ShieldCheck className="w-5 h-5" />
                        <span className="font-semibold">Safe Payments</span>
                    </div>
                    <p className="text-[11px] text-slate-600 leading-relaxed font-medium">
                        Funds are held securely in escrow until the client confirms delivery. Once confirmed, they move to your available balance instantly.
                    </p>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Payout Settings Form */}
                <div className="bg-white p-8 rounded-[32px] border border-slate-100 shadow-sm space-y-6">
                    <div>
                        <h2 className="text-xl font-bold text-slate-800 tracking-tight">Payout Destination</h2>
                        <p className="text-sm text-slate-500 mt-1 font-medium">Where should we send your money?</p>
                    </div>

                    <div className="flex gap-4 p-1 bg-slate-50 rounded-2xl w-fit">
                        <button
                            onClick={() => setPayoutMethod("MOBILE_MONEY")}
                            className={`px-6 py-2.5 rounded-xl text-sm font-semibold transition-all flex items-center gap-2 ${payoutMethod === "MOBILE_MONEY" ? "bg-white shadow-sm text-primary" : "text-slate-500 hover:text-slate-700"}`}
                        >
                            <Smartphone className="w-4 h-4" />
                            Mobile Money
                        </button>
                        <button
                            onClick={() => setPayoutMethod("BANK")}
                            className={`px-6 py-2.5 rounded-xl text-sm font-semibold transition-all flex items-center gap-2 ${payoutMethod === "BANK" ? "bg-white shadow-sm text-primary" : "text-slate-500 hover:text-slate-700"}`}
                        >
                            <CreditCard className="w-4 h-4" />
                            Bank Account
                        </button>
                    </div>

                    <form onSubmit={handleSavePayout} className="space-y-4">
                        {payoutMethod === "MOBILE_MONEY" ? (
                            <div className="grid grid-cols-1 gap-4">
                                <div className="space-y-1.5">
                                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Phone Number</label>
                                    <input
                                        type="text"
                                        placeholder="e.g. 256770000000"
                                        value={formData.phoneNumber}
                                        onChange={(e) => setFormData({ ...formData, phoneNumber: e.target.value })}
                                        className="w-full h-12 px-5 bg-slate-50 border-none rounded-xl text-sm focus:ring-2 focus:ring-primary/20 outline-none font-medium"
                                    />
                                </div>
                                <div className="space-y-1.5">
                                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Network Operator</label>
                                    <select
                                        value={formData.network}
                                        onChange={(e) => setFormData({ ...formData, network: e.target.value })}
                                        className="w-full h-12 px-5 bg-slate-50 border-none rounded-xl text-sm focus:ring-2 focus:ring-primary/20 outline-none font-medium"
                                    >
                                        <option value="MTN">MTN</option>
                                        <option value="AIRTEL">Airtel</option>
                                        <option value="MPESA">M-Pesa</option>
                                    </select>
                                </div>
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 gap-4">
                                <div className="space-y-1.5">
                                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Account Holder Name</label>
                                    <input
                                        type="text"
                                        placeholder="Full legal name"
                                        value={formData.accountName}
                                        onChange={(e) => setFormData({ ...formData, accountName: e.target.value })}
                                        className="w-full h-12 px-5 bg-slate-50 border-none rounded-xl text-sm focus:ring-2 focus:ring-primary/20 outline-none font-medium"
                                    />
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-1.5">
                                        <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Account Number</label>
                                        <input
                                            type="text"
                                            value={formData.accountNumber}
                                            onChange={(e) => setFormData({ ...formData, accountNumber: e.target.value })}
                                            className="w-full h-12 px-5 bg-slate-50 border-none rounded-xl text-sm focus:ring-2 focus:ring-primary/20 outline-none font-medium"
                                        />
                                    </div>
                                    <div className="space-y-1.5">
                                        <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Bank Name/Code</label>
                                        <input
                                            type="text"
                                            value={formData.bankCode}
                                            onChange={(e) => setFormData({ ...formData, bankCode: e.target.value })}
                                            className="w-full h-12 px-5 bg-slate-50 border-none rounded-xl text-sm focus:ring-2 focus:ring-primary/20 outline-none font-medium"
                                        />
                                    </div>
                                </div>
                            </div>
                        )}

                        <button
                            type="submit"
                            disabled={updatePayoutMutation.isPending}
                            className="w-full h-12 bg-slate-900 text-white rounded-xl font-semibold hover:bg-slate-800 transition-all disabled:opacity-50 mt-4 shadow-lg shadow-slate-200"
                        >
                            {updatePayoutMutation.isPending ? "Saving..." : "Save Payout Settings"}
                        </button>
                    </form>
                </div>

                {/* Important Notice */}
                <div className="space-y-6">
                    <div className="bg-amber-50 p-8 rounded-[32px] border border-amber-100 flex gap-4">
                        <AlertCircle className="w-6 h-6 text-amber-500 shrink-0 mt-1" />
                        <div className="space-y-2">
                            <h3 className="font-bold text-amber-900">Withdrawal Notice</h3>
                            <p className="text-sm text-amber-800 leading-relaxed font-medium">
                                Please ensure your payout details are 100% correct. Withdrawals are processed through Flutterwave and once sent, they cannot be reversed. Available funds are disbursed within 24 hours of request.
                            </p>
                        </div>
                    </div>

                    <div className="bg-white p-8 rounded-[32px] border border-slate-100 shadow-sm space-y-6">
                        <div className="flex items-center justify-between">
                            <h3 className="font-bold text-slate-800">Security & Trust</h3>
                            <ShieldCheck className="w-5 h-5 text-green-500" />
                        </div>
                        <ul className="space-y-4">
                            {[
                                "Encrypted payout information",
                                "Two-factor verification for large payouts",
                                "24/7 fraud monitoring",
                                "Direct Flutterwave settlement"
                            ].map((text, i) => (
                                <li key={i} className="flex items-center gap-3 text-xs font-semibold text-slate-500">
                                    <div className="w-1.5 h-1.5 rounded-full bg-green-500" />
                                    {text}
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>
            </div>

            {/* Transactions History */}
            <div className="bg-white rounded-[32px] border border-slate-100 overflow-hidden shadow-sm">
                <div className="p-8 border-b border-slate-50 flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <h2 className="text-xl font-bold text-slate-900 tracking-tight">Transaction History</h2>
                    <div className="flex items-center gap-3">
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                            <input
                                type="text"
                                placeholder="Search..."
                                className="pl-9 pr-4 py-2 bg-slate-50 border-none rounded-xl text-sm focus:ring-2 focus:ring-primary/20 outline-none font-medium"
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
                            <tr className="bg-slate-50/50 text-slate-400 text-[10px] font-bold uppercase tracking-[0.2em]">
                                <th className="px-8 py-4">Transaction Details</th>
                                <th className="px-8 py-4">Client</th>
                                <th className="px-8 py-4">Status</th>
                                <th className="px-8 py-4">Amount</th>
                                <th className="px-8 py-4">Date</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-50">
                            {transactions.length > 0 ? (
                                transactions.map((tx: any) => (
                                    <tr key={tx.id} className="hover:bg-slate-50/30 transition-colors group">
                                        <td className="px-8 py-5">
                                            <div className="flex items-center gap-4">
                                                <div className={cn(
                                                    "w-10 h-10 rounded-xl flex items-center justify-center transition-all",
                                                    tx.status === "COMPLETED" ? "bg-green-50 text-green-600 group-hover:bg-green-100" : "bg-slate-50 text-slate-400 group-hover:bg-slate-100"
                                                )}>
                                                    <ArrowUpRight className="w-5 h-5" />
                                                </div>
                                                <div>
                                                    <p className="text-sm font-bold text-slate-900">#{tx.transactionNumber?.slice(0, 8).toUpperCase()}</p>
                                                    <p className="text-[11px] text-slate-500 font-bold uppercase tracking-wider">{tx.booking?.category || "Creative Services"}</p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-8 py-5 text-sm font-bold text-slate-600">
                                            {tx.booking?.client?.firstName} {tx.booking?.client?.lastName}
                                        </td>
                                        <td className="px-8 py-5">
                                            <span className={cn(
                                                "px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider border",
                                                tx.status === "COMPLETED" ? "bg-green-50 text-green-600 border-green-100/50" :
                                                    tx.status === "PENDING" ? "bg-orange-50 text-orange-600 border-orange-100/50" : "bg-red-50 text-red-600 border-red-100/50"
                                            )}>
                                                {tx.status}
                                            </span>
                                        </td>
                                        <td className="px-8 py-5">
                                            <p className="text-sm font-bold text-slate-900">{tx.currency} {parseFloat(tx.amount).toLocaleString()}</p>
                                        </td>
                                        <td className="px-8 py-5">
                                            <div className="flex items-center gap-2 text-slate-400">
                                                <Calendar className="w-4 h-4" />
                                                <span className="text-xs font-bold">{format(new Date(tx.createdAt), 'MMM d, yyyy')}</span>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan={5} className="px-8 py-20 text-center">
                                        <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mx-auto text-slate-200 mb-4">
                                            <Wallet className="w-8 h-8" />
                                        </div>
                                        <h3 className="text-lg font-bold text-slate-900 tracking-tight">No transactions found</h3>
                                        <p className="text-slate-400 text-sm font-medium">Your earnings records will appear here as soon as you start receiving payments.</p>
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
