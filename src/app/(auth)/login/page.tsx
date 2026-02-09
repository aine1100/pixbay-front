import Image from "next/image";
import { LoginForm } from "@/features/auth/components/LoginForm";

export default function LoginPage() {
    return (
        <div className="flex min-h-screen w-full font-sans bg-card overflow-hidden">
            {/* Left Side: Sticky Illustration */}
            <div className="hidden lg:block sticky top-0 h-screen w-1/2 overflow-hidden bg-zinc-100">
                <Image
                    src="/hero.png" // Using same image for consistency unless specified
                    alt="Login illustration"
                    fill
                    className="object-cover"
                    priority
                />
            </div>

            {/* Right Side: Scrollable Form Content */}
            <div className="flex-1 flex flex-col justify-center items-center p-6 sm:p-12 bg-white overflow-y-auto min-h-screen">
                <div className="w-full max-w-[480px] py-4">
                    <LoginForm />
                </div>
            </div>
        </div>
    );
}
