"use client";

import { useState, useMemo,useEffect } from "react";
import { Search, MoreVertical, CheckCircle2, Smartphone, BadgeCheck, Star, CreditCard, Clock } from "lucide-react";
import NextImage from "next/image";
import { cn } from "@/lib/utils";
import { useBookings } from "@/features/bookings/hooks/useBookings";
import { paymentService } from "@/features/payment/services/payment.service";
import { PaymentModal } from "@/features/payment/components/PaymentModal";
import { Loading } from "@/components/ui/loading";
import { toast } from "react-hot-toast";
import { useSocket } from "@/features/chat/hooks/useSocket";

const TABS = ["All", "Completed", "Pending"];

export default function PaymentsPage() {
    const { data: rawBookings, isLoading, refetch } = useBookings();
    const [activeTab, setActiveTab] = useState("All");
    const [selectedId, setSelectedId] = useState<string | null>(null);
    const [isPaying, setIsPaying] = useState<string | null>(null);
    const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
    const { socket } = useSocket();

    const payments = useMemo(() => {
        return (rawBookings || []).map((b: any) => ({
            id: b.id,
            creatorName: `${b.creator?.user?.firstName || ''} ${b.creator?.user?.lastName || ''}`,
            creatorAvatar: b.creator?.user?.profilePicture || "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=150",
            category: b.category || b.serviceType?.replace('_', ' ') || "Photography",
            location: b.bookingDetails?.location || b.creator?.baseCity || "Remote",
            event: b.category || "Session",
            date: new Date(b.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
            amount: b.pricing?.totalAmount || 0,
            status: b.paymentStatus === "FULLY_PAID" ? "Completed" : "Pending",
            rating: b.creator?.averageRating || 5,
            isVerified: b.creator?.isVerified,
            bookingNumber: b.bookingNumber
        }));
    }, [rawBookings]);

    // Pending count for the requirement "the payment he must make"
    const pendingCount = useMemo(() => 
        payments.filter((p: any) => p.status === "Pending").length
    , [payments]);

    const filteredPayments = useMemo(() => {
        if (activeTab === "All") return payments;
        return payments.filter((p: any) => p.status === activeTab);
    }, [activeTab, payments]);

    const selectedPayment = useMemo(() =>
        payments.find((p: any) => p.id === selectedId),
        [selectedId, payments]);

    useEffect(() => {
        if (!selectedId && filteredPayments.length > 0) {
            setSelectedId(filteredPayments[0].id);
        }
    }, [filteredPayments, selectedId]);

    // Socket.io for real-time payment status
    useEffect(() => {
        if (socket) {
            socket.on("payment_completed", (data: any) => {
                if (data.status === "FULLY_PAID") {
                    toast.success("Payment Successful!");
                    refetch();
                    setIsPaying(null);
                }
            });
            return () => { socket.off("payment_completed"); };
        }
    }, [socket, refetch]);

    const initiatePayment = async (payload: any) => {
        if (!selectedPayment) return;

        setIsPaying(selectedPayment.id);
        try {
            const response = await paymentService.initializePayment(selectedPayment.id, payload);
            
            if (response.success) {
                const { data } = response;
                if (data.paymentLink) {
                    window.location.href = data.paymentLink;
                    return;
                }

                const isConfirmed = data.status === "success" && (data.message === "Charge successful" || data.message === "Charge initiated");
                
                if (isConfirmed) {
                    if (payload.type === 'card' && data.status === "success") {
                        toast.success("Payment Successful!");
                        refetch();
                        setIsPaying(null);
                    } else if (payload.type === 'momo') {
                        // Wait for socket confirmation
                    }
                } else {
                    toast.error("Payment Failed!");
                    setIsPaying(null);
                }
            } else {
                toast.error("Payment Failed!");
                setIsPaying(null);
            }
        } catch (error: any) {
            console.error("Payment Error:", error);
            toast.error("Payment Failed!");
            setIsPaying(null);
        }
    };

    if (isLoading) {
        return (
            <div className="flex-1 flex flex-col items-center justify-center py-20 bg-white border border-slate-100 min-h-[500px]">
                <Loading size="lg" />
                <p className="mt-4 text-slate-500 font-medium animate-pulse">Loading payments...</p>
            </div>
        );
    }

    return (
        <div className="flex bg-[#FAFBFC] h-[calc(100vh-80px)] overflow-hidden font-sans p-6 gap-6">

            {/* Left Pane: Payment List */}
            <div className="flex-1 flex flex-col gap-6 max-w-[650px]">
                {/* Header */}
                <div className="space-y-6">
                    <div className="flex items-center justify-between">
                        <h1 className="text-2xl font-medium text-slate-900 tracking-tight">Payments</h1>
                        {pendingCount > 0 && (
                            <div className="flex items-center gap-2 px-4 py-2 bg-orange-50 text-orange-600 rounded-xl border border-orange-100/50">
                                <Clock className="w-4 h-4" />
                                <span className="text-sm font-medium">{pendingCount} Pending Payments</span>
                            </div>
                        )}
                    </div>

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
                    {filteredPayments.length > 0 ? (
                        filteredPayments.map((payment: any) => (
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
                                            <h3 className="text-base font-medium text-slate-900 truncate">
                                                {payment.creatorName}
                                            </h3>
                                            <div className="flex items-center gap-0.5">
                                                {[...Array(5)].map((_, i) => (
                                                    <Star key={i} className={cn("w-3 h-3", i < payment.rating ? "fill-yellow-400 text-yellow-400" : "text-slate-200")} />
                                                ))}
                                            </div>
                                        </div>
                                        <div className={cn(
                                            "px-3 py-1 rounded-lg text-[13px] font-medium border",
                                            payment.status === "Pending" ? "bg-orange-50 text-orange-600 border-orange-100" : "bg-green-50 text-green-600 border-green-100"
                                        )}>
                                            RWF {payment.amount.toLocaleString()}
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
                                        <span className="text-[11px] font-medium text-slate-900 tracking-tight uppercase">Booking: #{payment.bookingNumber?.slice(0, 8)}</span>
                                        <div className="w-1 h-1 bg-slate-200 rounded-full" />
                                        <span className="text-[11px] font-medium text-slate-400">{payment.date}</span>
                                    </div>
                                </div>
                            </button>
                        ))
                    ) : (
                        <div className="flex flex-col items-center justify-center py-20 px-6 text-center bg-white rounded-[24px] border border-slate-50 border-dashed">
                            <div className="w-16 h-16 bg-slate-50 rounded-2xl flex items-center justify-center mb-4">
                                <CreditCard className="w-8 h-8 text-slate-300" />
                            </div>
                            <h3 className="text-base font-medium text-slate-900 mb-1">No payments found</h3>
                            <p className="text-sm font-medium text-slate-400 max-w-[250px]">
                                {activeTab === "All" 
                                    ? "You haven't made any bookings yet. Start exploring creators to book a session!" 
                                    : `You don't have any ${activeTab.toLowerCase()} payments at the moment.`
                                }
                            </p>
                        </div>
                    )}
                </div>
            </div>

            {/* Right Pane: Payment Details */}
            <div className="w-[400px] bg-white rounded-[32px] border border-slate-100 flex flex-col overflow-hidden">
                {selectedPayment ? (
                    <div className="p-8 h-full flex flex-col">
                        <h2 className="text-lg font-medium text-slate-900 mb-8 tracking-tight">Payment Details</h2>

                        {/* Creator Profile */}
                        <div className="flex flex-col items-center mb-8">
                            <div className="relative w-24 h-24 rounded-full overflow-hidden border border-slate-100 mb-4">
                                <NextImage src={selectedPayment.creatorAvatar} alt={selectedPayment.creatorName} fill className="object-cover" />
                            </div>
                            <div className="flex items-center gap-1.5 mb-1 text-center justify-center">
                                <h3 className="text-xl font-medium text-slate-900">{selectedPayment.creatorName}</h3>
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
                            <div className="flex justify-between items-center px-2 pb-4 border-b border-slate-50">
                                <span className="text-base font-medium text-slate-600">Total Amount</span>
                                <span className="text-lg font-medium text-slate-900 tracking-tight">RWF {selectedPayment.amount.toLocaleString()}</span>
                            </div>

                            {/* Escrow Notice */}
                            <div className="bg-slate-50 border border-slate-100 p-4 rounded-xl flex items-center gap-3">
                                <CheckCircle2 className="w-5 h-5 text-green-500 flex-shrink-0" />
                                <p className="text-[12px] font-medium text-slate-600 leading-tight">
                                    Payment status: <span className={cn(selectedPayment.status === "Pending" ? "text-orange-500" : "text-green-500")}>{selectedPayment.status}</span>
                                </p>
                            </div>
                        </div>

                        {/* Payment Method */}
                        <div className="flex-1">
                            <h4 className="text-[14px] font-medium text-slate-400 uppercase tracking-widest mb-4 px-2">Payment Details</h4>
                            <div className="space-y-4">
                                <div className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl border border-slate-100">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 rounded-xl bg-white border border-slate-100 flex items-center justify-center">
                                            <CreditCard className="w-5 h-5 text-slate-400" />
                                        </div>
                                        <div>
                                            <p className="text-[13px] font-medium text-slate-900">Direct Payment</p>
                                            <p className="text-[11px] font-medium text-slate-500">Secure Flutterwave Checkout</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Action */}
                        {selectedPayment.status === "Pending" ? (
                            <button 
                                onClick={() => setIsPaymentModalOpen(true)}
                                disabled={isPaying === selectedPayment.id}
                                className="w-full h-14 bg-primary text-white font-medium rounded-[20px] transition-all active:scale-[0.98] mt-auto flex items-center justify-center tracking-widest uppercase text-sm"
                            >
                                {isPaying === selectedPayment.id ? <Loading size="sm" /> : `Pay RWF ${selectedPayment.amount.toLocaleString()}`}
                            </button>
                        ) : (
                            <div className="w-full h-14 bg-green-50 text-green-600 font-medium rounded-[20px] flex items-center justify-center gap-2 mt-auto border border-green-100">
                                <CheckCircle2 className="w-5 h-5" />
                                Fully Paid
                            </div>
                        )}
                    </div>
                ) : (
                    <div className="flex-1 flex flex-col items-center justify-center p-8 text-center">
                        <div className="w-16 h-16 bg-slate-50 rounded-2xl flex items-center justify-center mb-4">
                            <CreditCard className="w-8 h-8 text-slate-300" />
                        </div>
                        <h3 className="text-base font-medium text-slate-900 mb-2">Select a transaction</h3>
                        <p className="text-sm font-medium text-slate-500 max-w-[200px]">
                            Choose a payment from the list to view full details and status.
                        </p>
                    </div>
                )}
            </div>

            {selectedPayment && (
                <PaymentModal
                    isOpen={isPaymentModalOpen}
                    onClose={() => setIsPaymentModalOpen(false)}
                    onPaymentInitiate={initiatePayment}
                    bookingDetails={{
                        id: selectedPayment.id,
                        amount: selectedPayment.amount,
                        currency: "RWF",
                        type: selectedPayment.category || "Booking Payment"
                    }}
                />
            )}
        </div>
    );
}
