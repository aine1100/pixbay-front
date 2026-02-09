"use client"
import Image from "next/image";
import { OTPForm } from "@/features/auth/components/OTPForm";
import { useRouter, useSearchParams } from "next/navigation";
import { authService } from "@/features/auth/services/auth.service";
import { useState } from "react";
import { toast } from "react-hot-toast";

export default function VerifyOTPPage() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const email = searchParams.get("email");
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleVerify = async (otp: string) => {
        if (!email) {
            setError("Email is missing. Please register again.");
            return;
        }
        setIsLoading(true);
        setError(null);
        try {
            await authService.verifyOtp(email, otp);
            toast.success("OTP verified successfully!");
            router.push("/verification-success");
        } catch (err) {
            const message = err instanceof Error ? err.message : "Failed to verify OTP";
            setError(message);
            toast.error(message);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="flex min-h-screen w-full font-sans bg-white overflow-hidden">
            {/* Left Side: Form Content */}
            <div className="flex-1 flex flex-col justify-center items-center p-6 sm:p-12">
                <OTPForm
                    onSubmit={handleVerify}
                    onCancel={() => router.push("/register")}
                    isLoading={isLoading}
                    error={error}
                />
            </div>

            {/* Right Side: Sticky Illustration with Text */}
            <div className="hidden lg:block sticky top-0 h-screen w-1/2 overflow-hidden bg-black">
                {/* Hero image with dark overlay for text readability */}
                <div className="relative w-full h-full">
                    <Image
                        src="/hero.png"
                        alt="OTP Verification illustration"
                        fill
                        className="object-cover opacity-60"
                        priority
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent"></div>


                </div>
            </div>
        </div>
    );
}
