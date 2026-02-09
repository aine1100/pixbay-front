"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useRouter } from "next/navigation";
import { z } from "zod";

const forgotPasswordSchema = z.object({
    email: z.string().email("Please enter a valid email"),
});

type ForgotPasswordFormData = z.infer<typeof forgotPasswordSchema>;

export function ForgotPasswordForm() {
    const router = useRouter();
    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<ForgotPasswordFormData>({
        resolver: zodResolver(forgotPasswordSchema),
    });

    const onSubmit = (data: ForgotPasswordFormData) => {
        console.log("Forgot Password Request:", data);
        // Simulate sending OTP and redirecting to verify step
        router.push("/forgot-password/verify");
    };

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col w-full max-w-md">
            {/* Header */}
            <div className="mb-8 text-center lg:text-left">
                <h1 className="text-3xl font-bold text-foreground tracking-tight mb-3">
                    Forgot Password?
                </h1>
                <p className="text-muted-foreground text-sm leading-relaxed">
                    Don't worry! It happens. Please enter the email address associated with your account.
                </p>
            </div>

            {/* Form Fields */}
            <div className="space-y-4">
                <div className="space-y-1.5">
                    <Label htmlFor="email" className="text-foreground font-medium text-[13px]">
                        Email address
                    </Label>
                    <Input
                        id="email"
                        type="email"
                        placeholder="amelia@mail.com"
                        className="h-11 rounded-xl border-border bg-input text-foreground placeholder:text-muted focus:ring-1 focus:ring-primary focus:border-primary text-sm transition-all"
                        {...register("email")}
                    />
                    {errors.email && (
                        <p className="text-[11px] text-red-500 mt-0.5">{errors.email.message}</p>
                    )}
                </div>
            </div>

            {/* Submit Button */}
            <Button
                type="submit"
                className="w-full h-11 rounded-xl bg-primary hover:bg-primary/90 text-primary-foreground font-semibold text-base mt-8 transition-all border-none"
            >
                Send OTP
            </Button>

            {/* Bottom Link */}
            <p className="text-center text-sm text-muted-foreground mt-8">
                Remember your password?{" "}
                <a href="/login" className="text-primary font-semibold hover:underline">
                    Login
                </a>
            </p>
        </form>
    );
}
