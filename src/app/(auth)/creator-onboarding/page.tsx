"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { OnboardingLayout } from "@/features/creators/components/Onboarding/OnboardingLayout";
import { IdentityStep } from "@/features/creators/components/Onboarding/IdentityStep";
import { PortfolioStep } from "@/features/creators/components/Onboarding/PortfolioStep";
import { EquipmentStep } from "@/features/creators/components/Onboarding/EquipmentStep";
import { Camera, FileText, UserCheck } from "lucide-react";
import { toast } from "react-hot-toast";

const steps = [
    {
        id: 1,
        title: "National ID (Identity)",
        description: "Verify your identity with a government-issued card.",
        icon: <FileText className="w-5 h-5" />,
    },
    {
        id: 2,
        title: "Portfolio Samples",
        description: "Showcase your best work to attract potential clients.",
        icon: <UserCheck className="w-5 h-5" />,
    },
    {
        id: 3,
        title: "Equipment List",
        description: "List the gear you use for your professional projects.",
        icon: <Camera className="w-5 h-5" />,
    },
];

export default function CreatorOnboardingPage() {
    const router = useRouter();
    const [currentStep, setCurrentStep] = useState(1);
    const [onboardingData, setOnboardingData] = useState({
        identity: null,
        portfolio: null,
        equipment: null,
    });

    const handleNext = (stepData: any) => {
        setOnboardingData((prev) => ({ ...prev, ...stepData }));
        if (currentStep < 3) {
            setCurrentStep(currentStep + 1);
            window.scrollTo({ top: 0, behavior: "smooth" });
        }
    };

    const handleBack = () => {
        if (currentStep > 1) {
            setCurrentStep(currentStep - 1);
            window.scrollTo({ top: 0, behavior: "smooth" });
        } else {
            router.back();
        }
    };

    const handleComplete = (finalData: any) => {
        // EquipmentStep already handles the final submission and redirection
        console.log("Onboarding Complete:", finalData);
    };

    return (
        <OnboardingLayout currentStep={currentStep} steps={steps}>
            <header className="mb-8 block lg:hidden">
                <h1 className="text-2xl font-semibold text-slate-900">Creator Portal Activation</h1>
                <p className="text-slate-500 text-sm mt-1">Complete account requirement for your identity to be approved!</p>
            </header>

            <div className="mb-12 hidden lg:block">
                <h1 className="text-3xl font-semibold text-slate-900 mb-2">Creator Portal Activation</h1>
                <p className="text-slate-500 text-base">Complete account requirement for your identity to be approved!</p>
            </div>

            {currentStep === 1 && (
                <IdentityStep onNext={handleNext} onBack={handleBack} />
            )}
            {currentStep === 2 && (
                <PortfolioStep onNext={handleNext} onBack={handleBack} />
            )}
            {currentStep === 3 && (
                <EquipmentStep onComplete={handleComplete} onBack={handleBack} />
            )}
        </OnboardingLayout>
    );
}
