"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useRouter } from "next/navigation";

import { forgotPasswordSchema, ForgotPasswordFormData } from "../schemas/forgot-password.schema";
import { authService } from "../services/auth.service";
import { useState } from "react";
import { toast } from "react-hot-toast";
import Link from "next/link";
import { Loading } from "@/components/ui/loading";

export function ForgotPasswordForm() {
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<ForgotPasswordFormData>({
        resolver: zodResolver(forgotPasswordSchema),
    });

    const onSubmit = async (data: ForgotPasswordFormData) => {
        setIsLoading(true);
        setError(null);
        try {
            await authService.forgotPassword(data.email);
            toast.success("Password reset email sent!");
            router.push(`/forgot-password/verify?email=${encodeURIComponent(data.email)}`);
        } catch (err) {
            const message = err instanceof Error ? err.message : "Something went wrong";
            setError(message);
            toast.error(message);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col w-full max-w-md">
            {/* Header */}
            <div className="mb-8 text-center lg:text-left">
                <h1 className="text-3xl font-semibold text-foreground tracking-tight mb-3">
                    Forgot Password?
                </h1>
                <p className="text-muted-foreground text-sm leading-relaxed">
                    Don&apos;t worry! It happens. Please enter the email address associated with your account.
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

            {/* Error Message */}
            {error && (
                <div className="mb-4 p-3 rounded-lg bg-red-50 text-red-500 text-sm border border-red-100 mt-4">
                    {error}
                </div>
            )}

            {/* Submit Button */}
            <Button
                type="submit"
                disabled={isLoading}
                className="w-full h-11 rounded-xl bg-primary hover:bg-primary/90 text-primary-foreground font-semibold text-base mt-8 transition-all border-none"
            >
                {isLoading ? <Loading size="sm" /> : "Send OTP"}
            </Button>

            <p className="text-center text-sm text-muted-foreground mt-8">
                Remember your password?{" "}
                <Link href="/login" className="text-primary font-semibold hover:underline">
                    Login
                </Link>
            </p>
        </form>
    );
}
