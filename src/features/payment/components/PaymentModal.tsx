"use client"

import React, { useState, useEffect, useRef } from "react";
import { X, Phone, CreditCard, Zap, Smartphone, ArrowRight, ArrowLeft, Loader2, CheckCircle, ShieldCheck, Lock } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

interface PaymentModalProps {
    isOpen: boolean;
    onClose
    : () => void;
    onPaymentInitiate: (details: any) => Promise<any>;
    onOtpVerify?: (transactionId: string, otp: string) => Promise<any>;
    bookingDetails: {
        id: string;
        amount: number;
        currency: string;
        type: string;
    };
}

type Step = 'selection' | 'details' | 'pin' | 'otp' | 'success';

export const PaymentModal: React.FC<PaymentModalProps> = ({
    isOpen,
    onClose,
    onPaymentInitiate,
    onOtpVerify,
    bookingDetails
}) => {
    const [step, setStep] = useState<Step>('selection');
    const [method, setMethod] = useState<'card' | 'momo' | null>(null);
    const [cardDetails, setCardDetails] = useState({
        number: "",
        expiry: "",
        cvv: ""
    });
    const [phoneNumber, setPhoneNumber] = useState("");
    const [network, setNetwork] = useState("MTN");
    const [isProcessing, setIsProcessing] = useState(false);

    // PIN/OTP state as individual boxes
    const [pinDigits, setPinDigits] = useState<string[]>(new Array(4).fill("")); // Card PIN
    const [otpDigits, setOtpDigits] = useState<string[]>(new Array(5).fill("")); // Validation OTP
    const [transactionId, setTransactionId] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);

    const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

    // Reset state when modal opens/closes
    useEffect(() => {
        if (!isOpen) {
            setStep('selection');
            setMethod(null);
            setPinDigits(new Array(4).fill(""));
            setOtpDigits(new Array(5).fill(""));
            setTransactionId(null);
            setIsProcessing(false);
            setError(null);
        }
    }, [isOpen]);

    if (!isOpen) return null;

    const handleMethodSelect = (selectedMethod: 'card' | 'momo') => {
        setMethod(selectedMethod);
        setStep('details');
        setError(null);
    };

    const handleBack = () => {
        if (step === 'otp') {
            setStep('pin');
        } else if (step === 'pin') {
            setStep('details');
        } else if (step === 'details') {
            setStep('selection');
            setMethod(null);
        }
        setError(null);
    };

    const handleDigitChange = (val: string, index: number, type: 'pin' | 'otp') => {
        if (isNaN(Number(val)) && val !== "") return;

        const digits = type === 'pin' ? [...pinDigits] : [...otpDigits];
        const setter = type === 'pin' ? setPinDigits : setOtpDigits;
        const maxLength = type === 'pin' ? 4 : 5;

        digits[index] = val;
        setter(digits);

        // Focus next input
        if (val !== "" && index < maxLength - 1) {
            inputRefs.current[index + 1]?.focus();
        }
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>, index: number, type: 'pin' | 'otp') => {
        const digits = type === 'pin' ? pinDigits : otpDigits;
        if (e.key === "Backspace" && !digits[index] && index > 0) {
            inputRefs.current[index - 1]?.focus();
        }
    };

    const handleProceed = async () => {
        setError(null);

        // For card, if we are in 'details' step, we move to 'pin' step first
        if (method === 'card' && step === 'details') {
            setStep('pin');
            return;
        }

        setIsProcessing(true);
        try {
            if (step === 'otp') {
                if (!onOtpVerify || !transactionId) throw new Error("Verification failed. Please retry.");
                const otp = otpDigits.join("");
                const verifyRes = await onOtpVerify(transactionId, otp);
                if (verifyRes?.success) {
                    setStep('success');
                    setTimeout(() => onClose(), 2000);
                }
                return;
            }

            const details = method === 'card'
                ? { ...cardDetails, pin: pinDigits.join(""), type: 'card' }
                : { phoneNumber, network, type: 'momo' };

            const result = await onPaymentInitiate(details);

            if (result?.success && !result?.requiresOtp) {
                setStep('success');
                setTimeout(() => onClose(), 2000);
                return;
            }

            // Handle OTP requirement signal from parent
            if (result?.requiresOtp) {
                setTransactionId(result.flw_ref || null);
                setStep('otp');
            } else if (result?.requiresPin && step !== 'pin') {
                setStep('pin');
            }
        } catch (err: any) {
            setError(err.message || "An error occurred");
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
        setCardDetails(prev => ({ ...prev, number: parts.length ? parts.join(' ') : val }));
    };

    const handleExpiryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        let val = e.target.value.replace(/[^0-9]/gi, '');
        if (val.length > 2) {
            val = val.substring(0, 2) + '/' + val.substring(2, 4);
        }
        setCardDetails(prev => ({ ...prev, expiry: val.substring(0, 5) }));
    };

    const isStepValid = () => {
        if (step === 'selection') return method !== null;
        if (step === 'details') {
            if (method === 'card') {
                return cardDetails.number.replace(/\s/g, '').length >= 15 && cardDetails.expiry.length === 5 && cardDetails.cvv.length >= 3;
            }
            if (method === 'momo') {
                return phoneNumber.length >= 10;
            }
        }
        if (step === 'pin') return pinDigits.join("").length === 4 || pinDigits.join("").length === 4;
        if (step === 'otp') return otpDigits.join("").length === 5;
        return true;
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-300 font-sans">
            <div className="bg-white rounded-2xl w-full max-w-md overflow-hidden border border-slate-100 animate-in zoom-in-95 duration-300">
                <div className="p-8 space-y-8">
                    {/* Header */}
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                            {step !== 'selection' && (
                                <button
                                    onClick={handleBack}
                                    className="w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center text-slate-500 hover:text-slate-900 transition-all border border-slate-100"
                                >
                                    <ArrowLeft className="w-5 h-5" />
                                </button>
                            )}
                            <div>
                                <h2 className="text-xl font-semibold text-slate-900">
                                    {step === 'selection' ? "Select Method" : step === 'details' ? "Payment Information" : step === 'pin' ? "Security PIN" : "Verify Payment"}
                                </h2>
                                <p className="text-slate-500 text-xs font-medium mt-0.5">
                                    {step === 'selection' ? "How would you like to pay?" : step === 'details' ? `${method === 'card' ? 'Secure Card Checkout' : 'Mobile Wallet Payment'}` : step === 'pin' ? "Enter your secret card PIN" : "Enter the verification code"}
                                </p>
                            </div>
                        </div>
                        <button
                            onClick={onClose}
                            disabled={step === 'success'}
                            className="w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center text-slate-500 hover:text-slate-900 transition-all border border-slate-100 disabled:opacity-30"
                        >
                            <X className="w-5 h-5" />
                        </button>
                    </div>

                    {/* Amount Summary */}
                    <div className="bg-slate-50/50 rounded-xl p-5 flex items-center justify-between border border-slate-100">
                        <div className="space-y-0.5">
                            <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">Amount to Pay</p>
                            <p className="text-2xl font-bold text-slate-900">{bookingDetails.currency} {bookingDetails.amount.toLocaleString()}</p>
                        </div>
                        <div className="w-12 h-12 rounded-xl bg-white flex items-center justify-center border border-slate-100">
                            <Zap className="w-6 h-6 text-[#FF3B30] fill-[#FF3B30]/10" />
                        </div>
                    </div>

                    {/* Step Content */}
                    <div className="min-h-[220px] flex flex-col pt-2">
                        {error && (
                            <div className="mb-6 p-4 rounded-xl bg-red-50 text-red-500 text-xs border border-red-100 font-medium text-center animate-in slide-in-from-top-2">
                                {error}
                            </div>
                        )}

                        {step === 'selection' && (
                            <div className="grid grid-cols-1 gap-3 animate-in fade-in slide-in-from-bottom-4 duration-300">
                                <button
                                    onClick={() => handleMethodSelect('card')}
                                    className="p-5 rounded-xl border border-slate-100 bg-white hover:bg-slate-50 group transition-all flex items-center gap-5 text-left active:scale-[0.99]"
                                >
                                    <div className="w-12 h-12 rounded-xl bg-slate-50 flex items-center justify-center border border-slate-100 group-hover:bg-white transition-colors">
                                        <CreditCard className="w-6 h-6 text-slate-600" />
                                    </div>
                                    <div className="flex-1">
                                        <span className="text-sm font-semibold text-slate-900 block">Credit/Debit Card</span>
                                        <p className="text-[10px] text-slate-500 font-medium uppercase tracking-wide mt-1">Visa, Mastercard, & more</p>
                                    </div>
                                    <ArrowRight className="w-5 h-5 text-slate-300 group-hover:text-slate-900 transition-colors" />
                                </button>
                                <button
                                    onClick={() => handleMethodSelect('momo')}
                                    className="p-5 rounded-xl border border-slate-100 bg-white hover:bg-slate-50 group transition-all flex items-center gap-5 text-left active:scale-[0.99]"
                                >
                                    <div className="w-12 h-12 rounded-xl bg-slate-50 flex items-center justify-center border border-slate-100 group-hover:bg-white transition-colors">
                                        <Smartphone className="w-6 h-6 text-slate-600" />
                                    </div>
                                    <div className="flex-1">
                                        <span className="text-sm font-semibold text-slate-900 block">Mobile Money</span>
                                        <p className="text-[10px] text-slate-500 font-medium uppercase tracking-wide mt-1">MTN / Airtel Rwanda</p>
                                    </div>
                                    <ArrowRight className="w-5 h-5 text-slate-300 group-hover:text-slate-900 transition-colors" />
                                </button>
                            </div>
                        )}

                        {step === 'details' && method === 'card' && (
                            <div className="space-y-5 animate-in slide-in-from-right-4 duration-300">
                                <div className="space-y-2">
                                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider pl-1 font-sans">Card Number</label>
                                    <div className="relative">
                                        <CreditCard className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                                        <input
                                            type="text"
                                            value={cardDetails.number}
                                            onChange={handleCardNumberChange}
                                            placeholder="0000 0000 0000 0000"
                                            className="w-full pl-12 pr-4 py-4 bg-slate-50 rounded-xl border border-slate-100 outline-none focus:ring-1 focus:ring-red-100 focus:bg-white text-sm font-semibold text-slate-900 transition-all"
                                        />
                                    </div>
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider pl-1 font-sans">Expiry</label>
                                        <input
                                            type="text"
                                            value={cardDetails.expiry}
                                            onChange={handleExpiryChange}
                                            placeholder="MM/YY"
                                            className="w-full px-4 py-4 bg-slate-50 rounded-xl border border-slate-100 outline-none focus:ring-1 focus:ring-red-100 focus:bg-white text-sm font-semibold text-slate-900 text-center transition-all"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider pl-1 font-sans">CVV</label>
                                        <div className="relative">
                                            <input
                                                type="text"
                                                maxLength={3}
                                                value={cardDetails.cvv}
                                                onChange={(e) => setCardDetails(prev => ({ ...prev, cvv: e.target.value.replace(/[^0-9]/g, '') }))}
                                                placeholder="123"
                                                className="w-full px-4 py-4 bg-slate-50 rounded-xl border border-slate-100 outline-none focus:ring-1 focus:ring-red-100 focus:bg-white text-sm font-semibold text-slate-900 text-center transition-all"
                                            />
                                            <Lock className="absolute right-4 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-300" />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}

                        {step === 'details' && method === 'momo' && (
                            <div className="space-y-6 animate-in slide-in-from-right-4 duration-300">
                                <div className="space-y-2">
                                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider pl-1 font-sans">Network Provider</label>
                                    <div className="grid grid-cols-2 gap-3">
                                        {['MTN', 'Airtel'].map((net) => (
                                            <button
                                                key={net}
                                                onClick={() => setNetwork(net)}
                                                className={cn(
                                                    "py-3.5 rounded-xl border text-[11px] font-semibold uppercase tracking-wider transition-all",
                                                    network === net ? "bg-slate-900 text-white border-slate-900" : "bg-white text-slate-500 border-slate-100 hover:bg-slate-50"
                                                )}
                                            >
                                                {net} Rwanda
                                            </button>
                                        ))}
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider pl-1 font-sans">Mobile Number</label>
                                    <div className="relative">
                                        <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                                        <input
                                            type="tel"
                                            value={phoneNumber}
                                            onChange={(e) => setPhoneNumber(e.target.value)}
                                            placeholder="078xxxxxxx"
                                            className="w-full pl-12 pr-4 py-4 bg-slate-50 rounded-xl border border-slate-100 outline-none focus:ring-1 focus:ring-red-100 focus:bg-white text-sm font-semibold text-slate-900 transition-all"
                                        />
                                    </div>
                                </div>
                            </div>
                        )}

                        {(step === 'pin' || step === 'otp') && (
                            <div className="space-y-8 animate-in zoom-in-95 duration-300 text-center py-4">
                                <div className="w-16 h-16 rounded-2xl bg-slate-50 flex items-center justify-center mx-auto mb-2 border border-slate-100">
                                    {step === 'pin' ? <ShieldCheck className="w-8 h-8 text-[#FF3B30]" /> : <Smartphone className="w-8 h-8 text-[#FF3B30]" />}
                                </div>

                                <div className="space-y-4">
                                    <div className="flex justify-center gap-3">
                                        {(step === 'pin' ? pinDigits : otpDigits).map((digit, index) => (
                                            <input
                                                key={index}
                                                type="text"
                                                maxLength={1}
                                                ref={(el) => { inputRefs.current[index] = el; }}
                                                value={digit}
                                                onChange={(e) => handleDigitChange(e.target.value, index, step as any)}
                                                onKeyDown={(e) => handleKeyDown(e, index, step as any)}
                                                disabled={isProcessing}
                                                className="w-12 h-12 sm:w-14 sm:h-14 text-center text-xl font-bold rounded-xl border border-slate-100 bg-slate-50 focus:ring-1 focus:ring-red-100 focus:bg-white outline-none transition-all disabled:opacity-50"
                                                autoFocus={index === 0}
                                            />
                                        ))}
                                    </div>
                                    <p className="text-[11px] text-slate-500 font-medium px-6 leading-relaxed">
                                        {step === 'pin'
                                            ? "For security maintenance, please enter your card PIN to authorize this transaction."
                                            : "Please enter the verification code sent to your registered phone or email."
                                        }
                                    </p>
                                </div>
                            </div>
                        )}

                        {step === 'success' && (
                            <div className="flex flex-col items-center justify-center py-10 space-y-6 animate-in zoom-in-95 duration-500">
                                <div className="w-20 h-20 bg-green-50 rounded-full flex items-center justify-center border border-green-100">
                                    <CheckCircle className="w-10 h-10 text-green-500 animate-in fade-in zoom-in duration-700 delay-200" />
                                </div>
                                <div className="space-y-2 text-center">
                                    <h3 className="text-xl font-bold text-slate-900 tracking-tight">Payment Successful</h3>
                                    <p className="text-sm text-slate-500 font-medium font-sans">
                                        Your payment has been processed securely.
                                    </p>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Action Button */}
                    {step !== 'selection' && step !== 'success' && (
                        <div className="space-y-4">
                            <Button
                                onClick={handleProceed}
                                disabled={isProcessing || !isStepValid()}
                                className="w-full h-14 bg-[#FF3B30] hover:bg-red-600 text-white rounded-xl flex items-center justify-center gap-3 font-bold text-sm uppercase tracking-widest transition-all active:scale-[0.98] border-none"
                            >
                                {isProcessing ? (
                                    <Loader2 className="w-5 h-5 animate-spin" />
                                ) : (
                                    <>
                                        {method === 'card' && step === 'details' ? "Setup PIN" : step === 'otp' ? "Verify & Pay" : "Proceed to Pay"}
                                        <ArrowRight className="w-5 h-5" />
                                    </>
                                )}
                            </Button>

                            {step === 'otp' && (
                                <p className="text-[11px] text-center text-slate-400 font-medium tracking-wide">
                                    Didn&apos;t receive the code? <button className="text-[#FF3B30] font-bold hover:underline ml-1">Resend OTP</button>
                                </p>
                            )}
                        </div>
                    )}
                </div>

                <div className="bg-slate-50/50 p-5 text-center border-t border-slate-100">
                    <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest flex items-center justify-center gap-2">
                        <CheckCircle className="w-4 h-4 text-green-500" />
                        PCI DSS COMPLIANT SECURE CHECKOUT
                    </p>
                </div>
            </div>
        </div>
    );
};
