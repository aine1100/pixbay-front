import { RegisterForm } from "@/features/auth/components/RegisterForm";
import Image from "next/image";

export default function RegisterPage() {
    return (
        <div className="flex min-h-screen w-full font-sans bg-card overflow-hidden">
            {/* Left Side: Sticky Illustration */}
            <div className="hidden lg:block sticky top-0 h-screen w-1/2 overflow-hidden bg-zinc-100">
                <Image
                    src="/hero.png"
                    alt="Children reading and creating"
                    fill
                    className="object-cover"
                    priority
                />
            </div>

            {/* Right Side: Scrollable Form Content */}
            <div className="flex-1 flex flex-col justify-center items-center p-6 sm:p-12 bg-white overflow-y-auto min-h-screen">
                <div className="w-full max-w-[480px] py-4">
                    <RegisterForm />
                </div>
            </div>
        </div>
    );
}
