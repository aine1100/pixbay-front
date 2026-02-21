"use client";

import { useState,useEffect } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Eye, EyeOff } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Image from "next/image";
import Link from "next/link";
import { Loading } from "@/components/ui/loading";
import { signInWithPopup } from "firebase/auth";
import { auth, googleProvider } from "@/lib/firebase";

import { loginSchema, LoginFormData } from "../schemas/login.schema";
import { authService } from "../services/auth.service";
import { toast } from "react-hot-toast";
import { useUserStore } from "@/features/user/store/userStore";
import { authStorage } from "@/lib/auth-storage";

export function LoginForm() {
    const router = useRouter();
    const [showPassword, setShowPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<LoginFormData>({
        resolver: zodResolver(loginSchema),
    });

    const setUser = useUserStore((state) => state.setUser);

    // Auto-redirect if already logged in
   

    useEffect(() => {
        if (authStorage.isAuthenticated()) {
            const user = authStorage.getUserFromToken();
            const role = user?.role || "CLIENT";
            router.replace(role === "CREATOR" ? "/creator" : "/client");
        }
    }, [router]);

    const onSubmit = async (data: LoginFormData) => {
        setIsLoading(true);
        setError(null);
        try {
            const response = await authService.login(data);
            // toast.success("Login successful!");
            console.log("Login Success:", response);
            
            // Redirect based on role (handle both direct and nested response)
            const authData = response.data || response;
            if (authData.user) {

                setUser(authData.user);
            }
            const role = authData.user?.role || authData.role;
            if (role === "CLIENT") {
                toast.success("Login Successfully")
                router.push("/client");
            } else if (role === "CREATOR") {
                const profile = authData.user?.creatorProfile;
                const isComplete = profile?.verificationStatus === "APPROVED";

                if (!isComplete) {
                    toast.success("Welcome, Creator! Let's finish your profile.");
                    router.push("/creator-onboarding");
                } else {
                    toast.success("Welcome back to your dashboard!");
                    router.push("/creator");
                }
            } else {
                router.push("/client");
            }
        } catch (err) {
            const message = err instanceof Error ? err.message : "Failed to login";
            setError(message);
            toast.error(message);
            setIsLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col h-full">
            {/* Header */}
            <div className="mb-6">
                <h1 className="text-3xl font-semibold text-foreground tracking-tight mb-2">
                    Welcome Back
                </h1>
                <p className="text-muted-foreground text-sm leading-relaxed">
                    Log in to your account to continue exploring photographers across Africa.
                </p>
            </div>

            {/* Form Fields */}
            <div className="space-y-4 flex-1">
                {/* Email */}
                <div className="space-y-1.5">
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

                {/* Password */}
                <div className="space-y-1.5">
                    <div className="flex items-center justify-between">
                        <Label htmlFor="password" className="text-foreground font-medium text-[13px]">
                            Password
                        </Label>
                        <Link href="/forgot-password"  className="text-[12px] font-semibold text-primary hover:underline">
                            Forgot password?
                        </Link>
                    </div>
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

                <div className="flex items-center justify-between py-1">
                    <div className="flex items-center space-x-2">
                        <input
                            type="checkbox"
                            id="remember"
                            className="w-4 h-4 rounded border-border text-primary focus:ring-ring/20 cursor-pointer"
                        />
                        <label htmlFor="remember" className="text-[13px] text-muted-foreground cursor-pointer">
                            Remember me
                        </label>
                    </div>
                    <Link href="/forgot-password" className="text-[13px] font-semibold text-slate-900 hover:underline">
                        Forgot Password?
                    </Link>
                </div>
            </div>

            {/* Error Message */}
            {/* {error && (
                <div className="mb-4 p-3 rounded-lg bg-red-50 text-red-500 text-sm border border-red-100">
                    {error}
                </div>
            )} */}

            {/* Submit Button */}
            <Button
                type="submit"
                disabled={isLoading}
                className="w-full h-11 rounded-xl bg-primary hover:bg-primary/90 text-primary-foreground font-semibold text-base mt-6 transition-all"
            >
                {isLoading ? <Loading size="sm" /> : "Log In"}
            </Button>

            {/* Divider */}
            <div className="relative my-6">
                <div className="absolute inset-0 flex items-center">
                    <span className="w-full border-t border-border" />
                </div>
                <div className="relative flex justify-center text-xs">
                    <span className="bg-white px-4 text-slate-300 font-medium">or</span>
                </div>
            </div>

            <div className="w-full">
                <Button
                    type="button"
                    variant="outline"
                    disabled={isLoading}
                    onClick={async () => {
                        setIsLoading(true);
                        try {
                            const result = await signInWithPopup(auth, googleProvider);
                            const idToken = await result.user.getIdToken();
                            
                            const response = await authService.googleLogin(idToken);
                            const authData = response.data || response;
                            
                            if (authData.user) {
                                setUser(authData.user);
                            }
                            
                            const role = authData.user?.role || authData.role;
                            if (role === "CLIENT") {
                                toast.success("Login Successful");
                                router.push("/client");
                            } else if (role === "CREATOR") {
                                const profile = authData.user?.creatorProfile;
                                const isComplete = profile?.verificationStatus === "APPROVED";
                                
                                if (!isComplete) {
                                    toast.success("Welcome, Creator! Let's finish your profile.");
                                    router.push("/creator-onboarding");
                                } else {
                                    toast.success("Welcome back!");
                                    router.push("/creator");
                                }
                            } else {
                                router.push("/client");
                            }
                        } catch (err) {
                            console.error("Google Auth Error:", err);
                            const message = err instanceof Error ? err.message : "Google login failed";
                            toast.error(message);
                        } finally {
                            setIsLoading(false);
                        }
                    }}
                    className="h-11 w-full rounded-xl border-border bg-slate-50/30 text-slate-600 font-medium hover:bg-slate-50 transition-all flex items-center justify-center gap-3 text-sm"
                >
                    <Image src="https://www.svgrepo.com/show/475656/google-color.svg" alt="Google" width={18} height={18} />
                    Continue with Google
                </Button>
            </div>

            <p className="text-center text-sm text-muted-foreground mt-8">
                Don&apos;t have an account?{" "}
                <Link href="/register" className="text-primary font-semibold hover:underline">
                    Sign up
                </Link>
            </p>
        </form>
    );
}
