import Image from "next/image";
import { SuccessForm } from "@/features/auth/components/SuccessForm";

export default function VerificationSuccessPage() {
  return (
    <div className="flex min-h-screen w-full font-sans bg-white overflow-hidden">
      {/* Left Side: Form Content */}
      <div className="flex-1 flex flex-col justify-center items-center p-6 sm:p-12">
        <SuccessForm />
      </div>

      {/* Right Side: Sticky Illustration with Text (Consistent with OTP page) */}
      <div className="hidden lg:block sticky top-0 h-screen w-1/2 overflow-hidden bg-black">
        <div className="relative w-full h-full">
          <Image
            src="/hero.png"
            alt="Success illustration"
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
