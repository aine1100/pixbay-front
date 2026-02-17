"use client"
import { useEffect, useState, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { CheckCircle2, XCircle, Loader2, ArrowRight } from "lucide-react";
import Link from "next/link";
import { paymentService } from "@/features/payment/services/payment.service";
import { cn } from "@/lib/utils";

function PaymentCallbackContent() {
    const searchParams = useSearchParams();
    const router = useRouter();
    const [status, setStatus] = useState<'verifying' | 'success' | 'error'>('verifying');
    const [message, setMessage] = useState('Verifying your payment...');

    const transactionId = searchParams.get('transaction_id') || searchParams.get('tx_ref');
    const statusParam = searchParams.get('status');

    useEffect(() => {
        const verify = async () => {
            if (!transactionId) {
                setStatus('error');
                setMessage('No transaction reference found.');
                return;
            }

            if (statusParam === 'cancelled') {
                setStatus('error');
                setMessage('Payment was cancelled.');
                return;
            }

            try {
                const result = await paymentService.verifyPayment(transactionId);
                if (result.success) {
                    setStatus('success');
                    setMessage('Your payment has been processed successfully!');
                } else {
                    setStatus('error');
                    setMessage(result.message || 'Payment verification failed.');
                }
            } catch (error) {
                console.error('Verification Error:', error);
                setStatus('error');
                setMessage('An error occurred while verifying your payment.');
            }
        };

        verify();
    }, [transactionId, statusParam]);

    return (
        <div className="min-h-[60vh] flex flex-col items-center justify-center p-6 text-center">
            <div className="bg-white rounded-[32px] border border-slate-100 p-12 max-w-md w-full shadow-sm">
                {status === 'verifying' && (
                        <div className="space-y-6">
                        <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mx-auto border border-slate-100">
                            <Loader2 className="w-10 h-10 text-[#FF3B30] animate-spin" />
                        </div>
                        <div className="space-y-2">
                            <h2 className="text-2xl font-medium text-slate-900">Verifying Payment</h2>
                            <p className="text-slate-500 font-medium">{message}</p>
                        </div>
                    </div>
                )}

                {status === 'success' && (
                    <div className="space-y-6 animate-in zoom-in-95 duration-500">
                        <div className="w-20 h-20 bg-green-50 rounded-full flex items-center justify-center mx-auto border border-green-100">
                            <CheckCircle2 className="w-10 h-10 text-[#16A34A] fill-green-500/10" />
                        </div>
                        <div className="space-y-2">
                            <h2 className="text-2xl font-medium text-slate-900">Payment Successful!</h2>
                            <p className="text-slate-500 font-medium">{message}</p>
                        </div>
                        <div className="pt-4">
                            <Link
                                href="/client/bookings"
                                className="inline-flex items-center gap-2 px-8 py-4 bg-[#FF3B30] text-white rounded-2xl font-medium text-sm uppercase tracking-widest hover:bg-red-600 transition-all"
                            >
                                Go to My Bookings
                                <ArrowRight className="w-4 h-4" />
                            </Link>
                        </div>
                    </div>
                )}

                {status === 'error' && (
                    <div className="space-y-6 animate-in zoom-in-95 duration-500">
                        <div className="w-20 h-20 bg-red-50 rounded-full flex items-center justify-center mx-auto border border-red-100">
                            <XCircle className="w-10 h-10 text-[#FF3B30] fill-red-500/10" />
                        </div>
                        <div className="space-y-2">
                            <h2 className="text-2xl font-medium text-slate-900">Payment Error</h2>
                            <p className="text-slate-500 font-medium">{message}</p>
                        </div>
                        <div className="pt-4 flex flex-col gap-3">
                            <Link
                                href="/client/bookings"
                                className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-slate-900 text-white rounded-2xl font-medium text-sm uppercase tracking-widest hover:bg-slate-800 transition-all"
                            >
                                Try Again from Bookings
                            </Link>
                            <Link
                                href="/support"
                                className="text-xs font-medium uppercase tracking-widest text-slate-400 hover:text-slate-900 transition-colors pt-2"
                            >
                                Contact Support
                            </Link>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}

export default function PaymentCallbackPage() {
    return (
        <Suspense fallback={
            <div className="min-h-[60vh] flex items-center justify-center">
                <Loader2 className="w-10 h-10 text-[#FF3B30] animate-spin" />
            </div>
        }>
            <PaymentCallbackContent />
        </Suspense>
    );
}
