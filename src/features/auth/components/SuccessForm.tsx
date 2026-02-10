"use client";

import { Check, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { useUserStore } from "@/features/user/store/userStore";

export function SuccessForm() {
    const router = useRouter();
    const user = useUserStore((state) => state.user);

    const handleNext = () => {
        if (user?.role === "CREATOR") {
            router.push("/creator-onboarding");
        } else {
            router.push("/login");
        }
    };

    return (
        <div className="w-full max-w-md pt-0 sm:pt-4 flex flex-col items-center font-sans">
            {/* Success Icon */}
            <div className="mb-8 p-4 bg-green-500 rounded-full text-white ">
                <Check className="w-10 h-10" strokeWidth={3} />
            </div>

            <div className="text-center mb-12">
                <h1 className="text-2xl font-semibold text-foreground mb-4">
                    Verification Success
                </h1>
                <p className="text-muted-foreground text-sm leading-relaxed px-6">
                    Congratulations! You have successfully verified your account.
                </p>
                <p className="text-[#FF3B30] text-sm mt-4 font-medium px-4">
                    {user?.role === "CREATOR"
                        ? "By clicking next, you will be redirected to complete your activation process."
                        : "By clicking next, you will be redirected to the login page."}
                </p>
            </div>

            <div className="w-full">
                <Button
                    onClick={handleNext}
                    className="w-full h-12 rounded-xl bg-primary hover:bg-primary/90 text-primary-foreground font-semibold text-base transition-all flex items-center justify-center gap-2 border-none "
                >
                    Next
                    <ArrowRight className="w-5 h-5" />
                </Button>
            </div>
        </div>
    );
}
