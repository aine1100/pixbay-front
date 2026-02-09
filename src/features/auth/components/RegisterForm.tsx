"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Eye, EyeOff } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Image from "next/image";
import { RoleDropdown } from "./RoleDropdown";
import { z } from "zod";

// Schema for registration
const registerSchema = z.object({
    role: z.enum(["Client", "Creator", "Admin"], {
        error: "Please select a role",
    }),
    firstName: z.string().min(2, "First name is required"),
    lastName: z.string().min(2, "Last name is required"),
    email: z.string().email("Please enter a valid email"),
    password: z.string().min(8, "Password must be at least 8 characters"),
    confirmPassword: z.string().min(8, "Please confirm your password"),
    agreeTerms: z.boolean().refine((val) => val === true, "You must agree to the terms"),
}).refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
});

type RegisterFormData = z.infer<typeof registerSchema>;

// Avatar URLs for trust section
const avatars = [
    "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop&crop=face",
    "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face",
    "https://images.unsplash.com/photo-1527980965255-d3b416303d12?w=100&h=100&fit=crop&crop=face",
];

export function RegisterForm() {
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    const {
        register,
        handleSubmit,
        setValue,
        watch,
        formState: { errors },
    } = useForm<RegisterFormData>({
        resolver: zodResolver(registerSchema),
        defaultValues: {
            role: "Client",
        }
    });

    const selectedRole = watch("role");

    const onSubmit = (data: RegisterFormData) => {
        console.log("Register:", data);
    };

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col h-full">
            {/* Header */}
            <div className="mb-4">
                <h1 className="text-3xl font-semibold text-foreground tracking-tight mb-2">
                    Join Pixbay
                </h1>
                <p className="text-muted-foreground text-sm leading-relaxed">
                    Create an account to explore and book photographers easily across Africa.
                </p>
            </div>

            {/* Form Fields */}
            <div className="space-y-3 flex-1">
                {/* Role Selector */}
                <div className="space-y-1">
                    <Label className="text-foreground font-medium text-[13px]">
                        Select your role
                    </Label>
                    <RoleDropdown
                        value={selectedRole}
                        onChange={(val) => setValue("role", val)}
                    />
                    {errors.role && (
                        <p className="text-[11px] text-red-500 mt-0.5">{errors.role.message}</p>
                    )}
                </div>

                {/* Name Group */}
                <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-1">
                        <Label htmlFor="firstName" className="text-foreground font-medium text-[13px]">
                            First name
                        </Label>
                        <Input
                            id="firstName"
                            placeholder="John"
                            className="h-10 rounded-xl border-border bg-input text-foreground placeholder:text-muted focus:ring-2 focus:ring-ring/20 focus:border-ring text-sm"
                            {...register("firstName")}
                        />
                        {errors.firstName && (
                            <p className="text-[11px] text-red-500 mt-0.5">{errors.firstName.message}</p>
                        )}
                    </div>
                    <div className="space-y-1">
                        <Label htmlFor="lastName" className="text-foreground font-medium text-[13px]">
                            Last name
                        </Label>
                        <Input
                            id="lastName"
                            placeholder="Doe"
                            className="h-10 rounded-xl border-border bg-input text-foreground placeholder:text-muted focus:ring-2 focus:ring-ring/20 focus:border-ring text-sm"
                            {...register("lastName")}
                        />
                        {errors.lastName && (
                            <p className="text-[11px] text-red-500 mt-0.5">{errors.lastName.message}</p>
                        )}
                    </div>
                </div>

                {/* Email */}
                <div className="space-y-1">
                    <Label htmlFor="email" className="text-foreground font-medium text-[13px]">
                        Email address
                    </Label>
                    <Input
                        id="email"
                        type="email"
                        placeholder="amelia@mail.com"
                        className="h-10 rounded-xl border-border bg-input text-foreground placeholder:text-muted focus:ring-2 focus:ring-ring/20 focus:border-ring text-sm"
                        {...register("email")}
                    />
                    {errors.email && (
                        <p className="text-[11px] text-red-500 mt-0.5">{errors.email.message}</p>
                    )}
                </div>

                {/* Password Groups */}
                <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-1">
                        <Label htmlFor="password" className="text-foreground font-medium text-[13px]">
                            Password
                        </Label>
                        <div className="relative">
                            <Input
                                id="password"
                                type={showPassword ? "text" : "password"}
                                placeholder="••••••••"
                                className="h-10 rounded-xl border-border bg-input text-foreground placeholder:text-muted pr-10 focus:ring-2 focus:ring-ring/20 focus:border-ring text-sm"
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

                    <div className="space-y-1">
                        <Label htmlFor="confirmPassword" className="text-foreground font-medium text-[13px]">
                            Confirm
                        </Label>
                        <div className="relative">
                            <Input
                                id="confirmPassword"
                                type={showConfirmPassword ? "text" : "password"}
                                placeholder="••••••••"
                                className="h-10 rounded-xl border-border bg-input text-foreground placeholder:text-muted pr-10 focus:ring-2 focus:ring-ring/20 focus:border-ring text-sm"
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

                {/* Terms Checkbox */}
                <div className="flex items-start space-x-2 py-1">
                    <input
                        type="checkbox"
                        id="agreeTerms"
                        className="mt-0.5 w-4 h-4 rounded border-border text-primary focus:ring-ring/20 cursor-pointer"
                        {...register("agreeTerms")}
                    />
                    <label htmlFor="agreeTerms" className="text-[13px] text-muted-foreground cursor-pointer leading-tight">
                        I agree to the <a href="/terms" className="text-slate-900 font-semibold hover:underline">Terms</a> & <a href="/privacy" className="text-slate-900 font-semibold hover:underline">Privacy Policy</a>
                    </label>
                </div>
            </div>

            {/* Submit Button */}
            <Button
                type="submit"
                className="w-full h-11 rounded-xl bg-primary hover:bg-primary/90 text-primary-foreground font-semibold text-base mt-4 transition-all"
            >
                Create Account
            </Button>

            {/* Divider */}
            <div className="relative my-4">
                <div className="absolute inset-0 flex items-center">
                    <span className="w-full border-t border-border" />
                </div>
                <div className="relative flex justify-center text-xs">
                    <span className="bg-white px-4 text-slate-300 font-medium">or</span>
                </div>
            </div>

            {/* Social Button */}
            <div className="w-full">
                <Button
                    type="button"
                    variant="outline"
                    className="h-11 w-full rounded-xl border-border bg-slate-50/30 text-slate-600 font-medium hover:bg-slate-50 transition-all flex items-center justify-center gap-3 text-sm"
                >
                    <Image src="https://www.svgrepo.com/show/475656/google-color.svg" alt="Google" width={18} height={18} />
                    Continue with Google
                </Button>
            </div>

            {/* Bottom Link */}
            <p className="text-center text-sm text-muted-foreground mt-5">
                Already have an account?{" "}
                <a href="/login" className="text-primary font-semibold hover:underline">
                    Login
                </a>
            </p>
        </form>
    );
}
