"use client";

import Image from "next/image";
import { OTPForm } from "@/features/auth/components/OTPForm";
import { useRouter, useSearchParams } from "next/navigation";
import { authService } from "@/features/auth/services/auth.service";
import { useState } from "react";
import { toast } from "react-hot-toast";

export default function ForgotPasswordVerifyPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const email = searchParams.get("email");
  const [error, setError] = useState<string | null>(null);

  const handleVerify = async (otp: string) => {
    if (!email) {
      setError("Email is missing. Please try again.");
      return;
    }
    // For password reset, we might just store the OTP and email for the next step
    // or verify it now. According to backend, /auth/reset-password takes { email, otp, newPassword }.
    // So here we just validate the OTP format and proceed to reset page with both email and otp.
    router.push(`/forgot-password/reset?email=${encodeURIComponent(email)}&otp=${encodeURIComponent(otp)}`);
  };

  return (
    <div className="flex min-h-screen w-full font-sans bg-white overflow-hidden">
      {/* Left Side: Form Content */}
      <div className="flex-1 flex flex-col justify-center items-center p-6 sm:p-12">
        <OTPForm 
            title="Verify OTP"
            description="Please enter the 6-digit code sent to your email to reset your password."
            onSubmit={handleVerify}
            onCancel={() => router.push("/forgot-password")}
            isLoading={false}
            error={error}
        />
      </div>

      {/* Right Side: Sticky Illustration */}
      <div className="hidden lg:block sticky top-0 h-screen w-1/2 overflow-hidden bg-black">
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
