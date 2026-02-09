"use client";

import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Loading } from "@/components/ui/loading";
interface OTPFormProps {
    onSubmit?: (otp: string) => void;
    onCancel?: () => void;
    title?: string;
    description?: string;
    isLoading?: boolean;
    error?: string | null;
}

export function OTPForm({ 
    onSubmit, 
    onCancel, 
    title = "Verify with OTP", 
    description = "For account security maintenance, please enter the One-Time 6 digits password sent to the phone number or email you registered with.",
    isLoading = false,
    error = null,
}: OTPFormProps) {
    const [otp, setOtp] = useState<string[]>(new Array(6).fill(""));
    const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>, index: number) => {
        const val = e.target.value;
        if (isNaN(Number(val))) return false;

        const newOtp = [...otp];
        newOtp[index] = val;
        setOtp(newOtp);

        // Focus next input
        if (val !== "" && index < 5) {
            inputRefs.current[index + 1]?.focus();
        }
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>, index: number) => {
        if (e.key === "Backspace" && !otp[index] && index > 0) {
            inputRefs.current[index - 1]?.focus();
        }
    };

    const handlePaste = (e: React.ClipboardEvent) => {
        const data = e.clipboardData.getData("text").slice(0, 6).split("");
        const newOtp = [...otp];
        data.forEach((char, index) => {
            if (!isNaN(Number(char))) {
                newOtp[index] = char;
            }
        });
        setOtp(newOtp);
        inputRefs.current[Math.min(data.length, 5)]?.focus();
    };

    return (
        <div className="w-full max-w-md pt-0 sm:pt-4">

            <div className="text-center mb-10">
                <h1 className="text-2xl font-semibold text-foreground mb-4">
                    {title}
                </h1>
                <p className="text-muted-foreground text-sm leading-relaxed px-4">
                    {description}
                </p>
            </div>

            {/* Error Message */}
            {error && (
                <div className="mb-6 p-3 rounded-lg bg-red-50 text-red-500 text-sm border border-red-100 text-center">
                    {error}
                </div>
            )}

            <div className="flex justify-center gap-3 sm:gap-4 mb-10" onPaste={handlePaste}>
                {otp.map((data, index) => (
                    <input
                        key={index}
                        type="text"
                        maxLength={1}
                        ref={(el) => { inputRefs.current[index] = el; }}
                        value={data}
                        onChange={(e) => handleChange(e, index)}
                        onKeyDown={(e) => handleKeyDown(e, index)}
                        disabled={isLoading}
                        className="w-12 h-12 sm:w-14 sm:h-14 text-center text-xl font-semibold rounded-xl border border-border bg-input focus:ring-1 focus:ring-primary focus:border-primary outline-none transition-all disabled:opacity-50"
                    />
                ))}
            </div>

            <div className="text-center mb-12">
                <p className="text-sm text-muted-foreground font-medium">
                    Didn&apos;t receive the OTP?{" "}
                    <button className="text-primary font-semibold hover:underline" disabled={isLoading}>
                        Resend
                    </button>
                </p>
            </div>

            <div className="space-y-3">
                <Button 
                    onClick={() => onSubmit?.(otp.join(""))}
                    disabled={isLoading || otp.join("").length < 6}
                    className="w-full h-11 rounded-xl bg-primary hover:bg-primary/90 text-primary-foreground font-semibold text-base transition-all border-none"
                >
                    {isLoading ? <Loading size="sm" /> : "Submit"}
                </Button>
                <Button 
                    variant="outline" 
                    onClick={onCancel}
                    disabled={isLoading}
                    className="w-full h-11 rounded-xl border-border text-slate-600 font-medium text-base hover:bg-slate-50 transition-all bg-transparent"
                >
                    Cancel
                </Button>
            </div>
        </div>
    );
}
