"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ModernSelect } from "@/components/ui/modern-select";
import { useProfile } from "@/features/user/hooks/useProfile";
import { creatorService } from "@/features/creators/services/creator.service";
import toast from "react-hot-toast";
import { Loader2, ArrowRight, CheckCircle2, Building2, MapPin, DollarSign, Clock, Briefcase, X } from "lucide-react";

interface CompleteProfileModalProps {
    isOpen: boolean;
    onOpenChange: (open: boolean) => void;
}

const STEPS = [
    { id: 1, title: "Basic Info", icon: Building2 },
    { id: 2, title: "Specialty & Location", icon: MapPin },
    { id: 3, title: "Pricing & Availability", icon: DollarSign },
];

export function CompleteProfileModal({ isOpen, onOpenChange }: CompleteProfileModalProps) {
    const { data: user, refetch } = useProfile();
    const [step, setStep] = useState(1);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const [formData, setFormData] = useState({
        businessName: "",
        bio: "",
        creatorType: "",
        baseCity: "",
        country: "",
        pricing: { hourlyRate: "", currency: "KES" },
        availability: { type: "full-time" }
    });

    useEffect(() => {
        if (user?.creatorProfile) {
            const cp = user.creatorProfile;
            setFormData(prev => ({
                ...prev,
                businessName: cp.businessName || "",
                bio: cp.bio === "Pending activation" ? "" : cp.bio || "",
                creatorType: cp.creatorType || "",
                baseCity: cp.baseCity || user.city || "",
                country: cp.country || user.country || "",
                pricing: {
                    hourlyRate: (cp.pricing as any)?.hourlyRate?.toString() || "",
                    currency: (cp.pricing as any)?.currency || "KES"
                },
                availability: {
                    type: (cp.availability as any)?.type || "full-time"
                }
            }));
        }
    }, [user]);

    const handleChange = (field: string, value: string) => {
        if (field.includes('.')) {
            const [parent, child] = field.split('.');
            setFormData(prev => ({
                ...prev,
                [parent]: { ...(prev as any)[parent], [child]: value }
            }));
        } else {
            setFormData(prev => ({ ...prev, [field]: value }));
        }
    };

    const handleNext = () => {
        if (step < STEPS.length) setStep(step + 1);
        else handleSubmit();
    };

    const handleBack = () => {
        if (step > 1) setStep(step - 1);
    };

    const handleSubmit = async () => {
        try {
            setIsSubmitting(true);
            await creatorService.updateProfile({
                businessName: formData.businessName,
                bio: formData.bio,
                creatorType: formData.creatorType,
                baseCity: formData.baseCity,
                country: formData.country,
                pricing: { hourlyRate: Number(formData.pricing.hourlyRate), currency: formData.pricing.currency },
                availability: formData.availability
            });
            await refetch();
            toast.success("Profile updated successfully!");
            onOpenChange(false);
        } catch (error: any) {
            toast.error(error.message || "Failed to update profile");
        } finally {
            setIsSubmitting(false);
        }
    };

    const isStepValid = () => {
        switch (step) {
            case 1: return formData.businessName.length > 2 && formData.bio.length > 20;
            case 2: return formData.creatorType !== "" && formData.baseCity.length > 2 && formData.country.length > 2;
            case 3: return Number(formData.pricing.hourlyRate) > 0;
            default: return false;
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center">
            {/* Backdrop */}
            <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={() => onOpenChange(false)} />

            {/* Modal */}
            <div className="relative w-full max-w-[600px] mx-4 bg-[#F8F9FA] rounded-3xl shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-300">

                {/* Close Button */}
                <button
                    onClick={() => onOpenChange(false)}
                    className="absolute top-5 right-5 z-10 w-8 h-8 flex items-center justify-center rounded-full bg-slate-100 text-slate-500 hover:bg-slate-200 hover:text-slate-900 transition-colors"
                >
                    <X className="w-4 h-4" />
                </button>

                {/* Header */}
                <div className="bg-white p-6 border-b border-slate-100">
                    <h2 className="text-xl font-bold text-slate-900">Complete Your Profile</h2>
                    <p className="text-sm text-slate-500 mt-1">
                        Your account is verified! Let&apos;s finish setting up your public profile to start getting bookings.
                    </p>

                    {/* Progress Steps */}
                    <div className="flex items-center justify-between mt-6 px-2 relative">
                        {/* Background bar */}
                        <div className="absolute top-5 left-[60px] right-[60px] h-0.5 bg-slate-200 hidden sm:block" />
                        <div
                            className="absolute top-5 left-[60px] h-0.5 bg-green-500 transition-all duration-300 hidden sm:block"
                            style={{ width: `${((step - 1) / (STEPS.length - 1)) * 80}%` }}
                        />
                        {STEPS.map((s) => {
                            const Icon = s.icon;
                            const isActive = s.id === step;
                            const isCompleted = s.id < step;
                            return (
                                <div key={s.id} className="flex flex-col items-center gap-2 relative z-10">
                                    <div className={`
                                        w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300
                                        ${isActive ? 'bg-primary text-white ring-4 ring-primary/20' :
                                          isCompleted ? 'bg-green-500 text-white' : 'bg-slate-100 text-slate-400'}
                                    `}>
                                        {isCompleted ? <CheckCircle2 className="w-5 h-5" /> : <Icon className="w-5 h-5" />}
                                    </div>
                                    <span className={`text-xs font-semibold ${isActive ? 'text-slate-900' : 'text-slate-500'}`}>
                                        {s.title}
                                    </span>
                                </div>
                            );
                        })}
                    </div>
                </div>

                {/* Body */}
                <div className="p-6 h-[380px] overflow-y-auto custom-scrollbar">

                    {step === 1 && (
                        <div className="space-y-5 animate-in fade-in slide-in-from-right-4 duration-300">
                            <div className="space-y-2">
                                <Label htmlFor="businessName">Business or Brand Name <span className="text-red-500">*</span></Label>
                                <Input
                                    id="businessName"
                                    placeholder="e.g. Acme Photography"
                                    value={formData.businessName}
                                    onChange={(e) => handleChange("businessName", e.target.value)}
                                    className="bg-white"
                                />
                                <p className="text-xs text-slate-500">This is how you will appear to clients.</p>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="bio">About You <span className="text-red-500">*</span></Label>
                                <textarea
                                    id="bio"
                                    placeholder="Tell clients about your style, experience, and what makes you unique..."
                                    value={formData.bio}
                                    onChange={(e) => handleChange("bio", e.target.value)}
                                    className="w-full min-h-[120px] px-4 py-3 bg-white border border-slate-200 rounded-xl text-sm text-slate-700 placeholder:text-slate-400 resize-none focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary/30 transition-all"
                                />
                                <p className="text-xs text-slate-500 text-right">{formData.bio.length}/500</p>
                            </div>
                        </div>
                    )}

                    {step === 2 && (
                        <div className="space-y-5 animate-in fade-in slide-in-from-right-4 duration-300">
                            <div className="space-y-2">
                                <Label>Primary Role <span className="text-red-500">*</span></Label>
                                <ModernSelect
                                    value={formData.creatorType === "PHOTOGRAPHER" ? "Photographer" :
                                           formData.creatorType === "VIDEO_CREATOR" ? "Video Creator" : ""}
                                    onChange={(val) => {
                                        const mapped = val === "Photographer" ? "PHOTOGRAPHER" : "VIDEO_CREATOR";
                                        handleChange("creatorType", mapped);
                                    }}
                                    options={["Photographer", "Video Creator"]}
                                    placeholder="Select your role"
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="baseCity">Base City <span className="text-red-500">*</span></Label>
                                    <Input
                                        id="baseCity"
                                        placeholder="e.g. Nairobi"
                                        value={formData.baseCity}
                                        onChange={(e) => handleChange("baseCity", e.target.value)}
                                        className="bg-white"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="country">Country <span className="text-red-500">*</span></Label>
                                    <Input
                                        id="country"
                                        placeholder="e.g. Kenya"
                                        value={formData.country}
                                        onChange={(e) => handleChange("country", e.target.value)}
                                        className="bg-white"
                                    />
                                </div>
                            </div>

                            <div className="bg-blue-50 p-4 rounded-xl border border-blue-100 flex gap-3">
                                <MapPin className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                                <div className="space-y-1">
                                    <h4 className="text-sm font-semibold text-slate-900">Coverage Area</h4>
                                    <p className="text-xs text-slate-600 leading-relaxed">
                                        Clients often search by location. Make sure your base city matches where you primarily operate.
                                    </p>
                                </div>
                            </div>
                        </div>
                    )}

                    {step === 3 && (
                        <div className="space-y-5 animate-in fade-in slide-in-from-right-4 duration-300">
                            <div className="space-y-2">
                                <Label>Starting Hourly Rate <span className="text-red-500">*</span></Label>
                                <div className="relative">
                                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 font-semibold text-sm">
                                        {formData.pricing.currency}
                                    </span>
                                    <Input
                                        type="number"
                                        placeholder="0.00"
                                        value={formData.pricing.hourlyRate}
                                        onChange={(e) => handleChange("pricing.hourlyRate", e.target.value)}
                                        className="bg-white pl-12"
                                    />
                                </div>
                                <p className="text-xs text-slate-500">You can create custom packages later.</p>
                            </div>

                            <div className="space-y-2">
                                <Label>Standard Availability</Label>
                                <div className="grid grid-cols-3 gap-3">
                                    {[
                                        { id: "full-time", label: "Full Time", Icon: Clock },
                                        { id: "part-time", label: "Part Time", Icon: Briefcase },
                                        { id: "weekends-only", label: "Weekends", Icon: CheckCircle2 },
                                    ].map(({ id, label, Icon }) => {
                                        const isSelected = formData.availability.type === id;
                                        return (
                                            <div
                                                key={id}
                                                onClick={() => handleChange("availability.type", id)}
                                                className={`
                                                    cursor-pointer rounded-xl border p-4 flex flex-col items-center gap-2 transition-all
                                                    ${isSelected ? 'bg-primary/5 border-primary text-primary' : 'bg-white border-slate-200 text-slate-600 hover:border-slate-300'}
                                                `}
                                            >
                                                <Icon className={`w-6 h-6 ${isSelected ? 'text-primary' : 'text-slate-400'}`} />
                                                <span className="text-xs font-medium">{label}</span>
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                        </div>
                    )}
                </div>

                {/* Footer */}
                <div className="p-6 bg-white border-t border-slate-100 flex items-center justify-between">
                    <Button
                        variant="ghost"
                        onClick={handleBack}
                        disabled={step === 1 || isSubmitting}
                        className="text-slate-500 hover:text-slate-900"
                    >
                        Back
                    </Button>

                    <Button
                        onClick={handleNext}
                        disabled={!isStepValid() || isSubmitting}
                        className="bg-primary hover:bg-primary/90 min-w-[120px]"
                    >
                        {isSubmitting ? (
                            <>
                                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                Saving...
                            </>
                        ) : step === STEPS.length ? (
                            "Complete Profile"
                        ) : (
                            <>
                                Next Step
                                <ArrowRight className="w-4 h-4 ml-2" />
                            </>
                        )}
                    </Button>
                </div>
            </div>
        </div>
    );
}
