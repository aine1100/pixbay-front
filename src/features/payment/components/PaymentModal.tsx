"use client"

import React, { useState } from "react";
import { X, Phone, CreditCard, Zap, Smartphone, ArrowRight, Loader2, CheckCircle, Info, ShieldCheck } from "lucide-react";
import { cn } from "@/lib/utils";

interface PaymentModalProps {
    isOpen: boolean;
    onClose: () => void;
    onPaymentInitiate: (details: any) => Promise<void>;
    bookingDetails: {
        id: string;
        amount: number;
        currency: string;
        type: string;
    };
}

export const PaymentModal: React.FC<PaymentModalProps> = ({
    isOpen,
    onClose,
    onPaymentInitiate,
    bookingDetails
}) => {
    const [method, setMethod] = useState<'card' | 'momo'>('card');
    const [cardDetails, setCardDetails] = useState({
        number: "",
        expiry: "",
        cvv: ""
    });
    const [phoneNumber, setPhoneNumber] = useState("");
    const [network, setNetwork] = useState("MTN");
    const [isProcessing, setIsProcessing] = useState(false);

    if (!isOpen) return null;

    const handleProceed = async () => {
        setIsProcessing(true);
        try {
            const details = method === 'card'
                ? { ...cardDetails, type: 'card' }
                : { phoneNumber, network, type: 'momo' };
            await onPaymentInitiate(details);
        } finally {
            setIsProcessing(false);
        }
    };

    const handleCardNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const val = e.target.value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
        const matches = val.match(/\d{4,16}/g);
        const match = matches && matches[0] || '';
        const parts = [];
        for (let i = 0, len = match.length; i < len; i += 4) {
            parts.push(match.substring(i, i + 4));
        }
        if (parts.length) {
            setCardDetails(prev => ({ ...prev, number: parts.join(' ') }));
        } else {
            setCardDetails(prev => ({ ...prev, number: val }));
        }
    };

    const handleExpiryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        let val = e.target.value.replace(/[^0-9]/gi, '');
        if (val.length > 2) {
            val = val.substring(0, 2) + '/' + val.substring(2, 4);
        }
        setCardDetails(prev => ({ ...prev, expiry: val.substring(0, 5) }));
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-300">
            <div className="bg-white rounded-[32px] w-full max-w-md overflow-hidden shadow-2xl animate-in zoom-in-95 duration-300">
                <div className="p-8 space-y-6">
                    {/* Header */}
                    <div className="flex items-center justify-between">
                        <div>
                            <h2 className="text-xl font-medium text-slate-900">Secure Checkout</h2>
                            <p className="text-slate-500 text-sm font-medium">Choose your payment method</p>
                        </div>
                        <button
                            onClick={onClose}
                            className="w-10 h-10 rounded-full bg-slate-50 flex items-center justify-center text-slate-400 hover:text-slate-900 transition-colors"
                        >
                            <X className="w-5 h-5" />
                        </button>
                    </div>

                    {/* Amount Summary */}
                    <div className="bg-slate-50/50 rounded-2xl p-6 flex items-center justify-between border border-slate-100">
                        <div className="space-y-1">
                            <p className="text-[10px] font-medium text-slate-400 uppercase tracking-widest">Total Amount</p>
                            <p className="text-2xl font-medium text-slate-900">{bookingDetails.currency} {bookingDetails.amount.toLocaleString()}</p>
                        </div>
                        <div className="w-12 h-12 rounded-xl bg-white flex items-center justify-center border border-slate-100">
                            <Zap className="w-6 h-6 text-[#FF3B30]" />
                        </div>
                    </div>

                    {/* Payment Selection */}
                    <div className="grid grid-cols-2 gap-4">
                        <button
                            onClick={() => setMethod('card')}
                            className={cn(
                                "p-4 rounded-2xl border transition-all flex flex-col items-center gap-3 text-center",
                                method === 'card'
                                    ? "border-[#FF3B30] bg-red-50/30 text-[#FF3B30]"
                                    : "border-slate-100 hover:border-slate-200 text-slate-500"
                            )}
                        >
                            <CreditCard className="w-6 h-6" />
                            <span className="text-[10px] font-medium uppercase tracking-wider">Debit/Credit Card</span>
                        </button>
                        <button
                            onClick={() => setMethod('momo')}
                            className={cn(
                                "p-4 rounded-2xl border transition-all flex flex-col items-center gap-3 text-center",
                                method === 'momo'
                                    ? "border-[#FF3B30] bg-red-50/30 text-[#FF3B30]"
                                    : "border-slate-100 hover:border-slate-200 text-slate-500"
                            )}
                        >
                            <Smartphone className="w-6 h-6" />
                            <span className="text-[10px] font-medium uppercase tracking-wider">MTN / Airtel MoMo</span>
                        </button>
                    </div>

                    {/* Input Fields */}
                    <div className="space-y-4 animate-in slide-in-from-top-4 duration-300">
                        {method === 'card' ? (
                            <div className="space-y-4">
                                <div className="space-y-2">
                                    <label className="text-[10px] font-medium text-slate-400 uppercase tracking-widest pl-1">Card Number</label>
                                    <div className="relative">
                                        <CreditCard className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                                        <input
                                            type="text"
                                            value={cardDetails.number}
                                            onChange={handleCardNumberChange}
                                            placeholder="0000 0000 0000 0000"
                                            className="w-full pl-12 pr-4 py-4 bg-slate-50 rounded-2xl border-none outline-none focus:ring-1 focus:ring-[#FF3B30]/20 text-sm font-medium text-slate-900"
                                        />
                                    </div>
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-medium text-slate-400 uppercase tracking-widest pl-1">Expiry (MM/YY)</label>
                                        <input
                                            type="text"
                                            value={cardDetails.expiry}
                                            onChange={handleExpiryChange}
                                            placeholder="MM/YY"
                                            className="w-full px-4 py-4 bg-slate-50 rounded-2xl border-none outline-none focus:ring-1 focus:ring-[#FF3B30]/20 text-sm font-medium text-slate-900"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-medium text-slate-400 uppercase tracking-widest pl-1">CVV</label>
                                        <input
                                            type="text"
                                            maxLength={3}
                                            value={cardDetails.cvv}
                                            onChange={(e) => setCardDetails(prev => ({ ...prev, cvv: e.target.value.replace(/[^0-9]/g, '') }))}
                                            placeholder="123"
                                            className="w-full px-4 py-4 bg-slate-50 rounded-2xl border-none outline-none focus:ring-1 focus:ring-[#FF3B30]/20 text-sm font-medium text-slate-900"
                                        />
                                    </div>
                                </div>
                            </div>
                        ) : (
                            <div className="space-y-4">
                                <div className="space-y-2">
                                    <label className="text-[10px] font-medium text-slate-400 uppercase tracking-widest pl-1">Select Network</label>
                                    <div className="grid grid-cols-2 gap-3">
                                        {['MTN', 'Airtel'].map((net) => (
                                            <button
                                                key={net}
                                                onClick={() => setNetwork(net)}
                                                className={cn(
                                                    "py-3 rounded-xl border text-[10px] font-medium uppercase tracking-widest transition-all",
                                                    network === net ? "bg-slate-900 text-white border-slate-900" : "bg-white text-slate-500 border-slate-100 font-medium"
                                                )}
                                            >
                                                {net} Rwanda
                                            </button>
                                        ))}
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[10px] font-medium text-slate-400 uppercase tracking-widest pl-1">Phone Number</label>
                                    <div className="relative">
                                        <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                                        <input
                                            type="tel"
                                            value={phoneNumber}
                                            onChange={(e) => setPhoneNumber(e.target.value)}
                                            placeholder="e.g. 078xxxxxxx"
                                            className="w-full pl-12 pr-4 py-4 bg-slate-50 rounded-2xl border-none outline-none focus:ring-1 focus:ring-[#FF3B30]/20 text-sm font-medium text-slate-900"
                                        />
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Proceed Button */}
                    <button
                        onClick={handleProceed}
                        disabled={isProcessing}
                        className="w-full h-14 bg-[#FF3B30] text-white rounded-2xl flex items-center justify-center gap-3 font-medium text-sm uppercase tracking-widest hover:bg-red-600 transition-all disabled:opacity-50 active:scale-[0.98]"
                    >
                        {isProcessing ? (
                            <Loader2 className="w-5 h-5 animate-spin" />
                        ) : (
                            <>
                                Pay Securely
                                <ArrowRight className="w-5 h-5" />
                            </>
                        )}
                    </button>
                </div>

                <div className="bg-slate-50/50 p-4 text-center border-t border-slate-100">
                    <p className="text-[10px] text-slate-400 font-medium uppercase tracking-widest flex items-center justify-center gap-2">
                        <CheckCircle className="w-3.5 h-3.5 text-green-500" />
                        Secured by Industry Standard Encryption
                    </p>
                </div>
            </div>
        </div>
    );
};
