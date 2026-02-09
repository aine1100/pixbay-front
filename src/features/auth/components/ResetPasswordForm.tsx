"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Eye, EyeOff } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useRouter } from "next/navigation";
import { useSearchParams } from "next/navigation";
import { resetPasswordSchema, ResetPasswordFormData } from "../schemas/reset-password.schema";
import { authService } from "../services/auth.service";
import { toast } from "react-hot-toast";
import { Loading } from "@/components/ui/loading";

export function ResetPasswordForm() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const email = searchParams.get("email");
    const otp = searchParams.get("otp");

    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<ResetPasswordFormData>({
        resolver: zodResolver(resetPasswordSchema),
    });

    const onSubmit = async (data: ResetPasswordFormData) => {
        if (!email || !otp) {
            setError("Missing email or OTP. Please start the process again.");
            return;
        }
        setIsLoading(true);
        setError(null);
        try {
            await authService.resetPassword({
                email,
                otp,
                newPassword: data.password,
            });
            toast.success("Password reset successful!");
            router.push("/login?reset=success");
        } catch (err) {
            const message = err instanceof Error ? err.message : "Failed to reset password";
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
                    Reset Password
                </h1>
                <p className="text-muted-foreground text-sm leading-relaxed">
                    Set a strong password to secure your account.
                </p>
            </div>

            {/* Form Fields */}
            <div className="space-y-4">
                <div className="space-y-1.5">
                    <Label htmlFor="password" className="text-foreground font-medium text-[13px]">
                        New Password
                    </Label>
                    <div className="relative">
                        <Input
                            id="password"
                            type={showPassword ? "text" : "password"}
                            placeholder="••••••••"
                            className="h-11 rounded-xl border-border bg-input text-foreground placeholder:text-muted pr-10 focus:ring-1 focus:ring-primary focus:border-primary text-sm transition-all"
                            {...register("password")}
                        />
                        <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-muted hover:text-slate-600 transition-colors"
                        >
                            {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                        </button>
                    </div>
                    {errors.password && (
                        <p className="text-[11px] text-red-500 mt-0.5">{errors.password.message}</p>
                    )}
                </div>

                <div className="space-y-1.5">
                    <Label htmlFor="confirmPassword" className="text-foreground font-medium text-[13px]">
                        Confirm New Password
                    </Label>
                    <div className="relative">
                        <Input
                            id="confirmPassword"
                            type={showConfirmPassword ? "text" : "password"}
                            placeholder="••••••••"
                            className="h-11 rounded-xl border-border bg-input text-foreground placeholder:text-muted pr-10 focus:ring-1 focus:ring-primary focus:border-primary text-sm transition-all"
                            {...register("confirmPassword")}
                        />
                        <button
                            type="button"
                            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-muted hover:text-slate-600 transition-colors"
                        >
                            {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                        </button>
                    </div>
                    {errors.confirmPassword && (
                        <p className="text-[11px] text-red-500 mt-0.5">{errors.confirmPassword.message}</p>
                    )}
                </div>
            </div>

            {/* Error Message */}
            {error && (
                <div className="mb-4 p-3 rounded-lg bg-red-50 text-red-500 text-sm border border-red-100">
                    {error}
                </div>
            )}

            {/* Submit Button */}
            <Button
                type="submit"
                disabled={isLoading}
                className="w-full h-11 rounded-xl bg-primary hover:bg-primary/90 text-primary-foreground font-semibold text-base mt-8 transition-all border-none"
            >
                {isLoading ? <Loading size="sm" /> : "Reset Password"}
            </Button>
        </form>
    );
}
