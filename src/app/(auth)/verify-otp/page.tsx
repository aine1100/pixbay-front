"use client"
import Image from "next/image";
import { OTPForm } from "@/features/auth/components/OTPForm";
import { useRouter } from "next/navigation";

export default function VerifyOTPPage() {
    const router = useRouter();

    return (
        <div className="flex min-h-screen w-full font-sans bg-white overflow-hidden">
            {/* Left Side: Form Content */}
            <div className="flex-1 flex flex-col justify-center items-center p-6 sm:p-12">
                <OTPForm
                    onSubmit={() => router.push("/verification-success")}
                    onCancel={() => router.push("/register")}
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
