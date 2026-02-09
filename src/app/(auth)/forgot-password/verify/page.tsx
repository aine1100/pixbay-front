"use client";

import Image from "next/image";
import { OTPForm } from "@/features/auth/components/OTPForm";
import { useRouter, useSearchParams } from "next/navigation";
import { authService } from "@/features/auth/services/auth.service";
import { useState, Suspense } from "react";
import { toast } from "react-hot-toast";
import { Loading } from "@/components/ui/loading";

function ForgotPasswordVerifyContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const email = searchParams.get("email");
  const [error, setError] = useState<string | null>(null);

  const handleVerify = async (otp: string) => {
    if (!email) {
      setError("Email is missing. Please try again.");
      return;
    }
    router.push(`/forgot-password/reset?email=${encodeURIComponent(email)}&otp=${encodeURIComponent(otp)}`);
  };

  return (
    <div className="flex min-h-screen w-full font-sans bg-white overflow-hidden">
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

export default function ForgotPasswordVerifyPage() {
  return (
    <Suspense fallback={<div className="flex h-screen items-center justify-center"><Loading size="lg" /></div>}>
      <ForgotPasswordVerifyContent />
    </Suspense>
  );
}
