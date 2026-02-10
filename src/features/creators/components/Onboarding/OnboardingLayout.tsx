"use client";

import React from "react";
import Image from "next/image";
import { Check } from "lucide-react";
import { cn } from "@/lib/utils";

interface Step {
  id: number;
  title: string;
  description: string;
  icon: React.ReactNode;
}

interface OnboardingLayoutProps {
  children: React.ReactNode;
  currentStep: number;
  steps: Step[];
}

export function OnboardingLayout({ children, currentStep, steps }: OnboardingLayoutProps) {
  return (
    <div className="flex h-screen w-full bg-white font-sans overflow-hidden">
      {/* Sidebar - Progress Stepper */}
      <div className="hidden lg:flex w-1/3 flex-col bg-slate-50/50 border-r border-slate-100 p-12 sticky top-0 h-screen overflow-hidden">
        <div className="mb-12">
          <h1 className="text-xl font-semibold text-slate-800">Pixbay</h1>
        </div>

        <div className="flex-1 flex flex-col justify-center max-w-sm mx-auto w-full">
          <div className="space-y-12 relative">
            {/* Step Line */}
            <div className="absolute left-[19px] top-2 bottom-2 w-[2px] bg-slate-100" />

            {steps.map((step, index) => {
              const isActive = currentStep === step.id;
              const isCompleted = currentStep > step.id;

              return (
                <div key={step.id} className="relative flex items-start gap-6 group">
                  {/* Step Indicator */}
                  <div
                    className={cn(
                      "relative z-10 flex items-center justify-center w-10 h-10 rounded-full border-2 transition-all duration-300",
                      isActive
                        ? "bg-primary border-primary text-white"
                        : isCompleted
                        ? "bg-primary border-primary text-white"
                        : "bg-white border-slate-200 text-slate-400 group-hover:border-slate-300"
                    )}
                  >
                    {isCompleted ? (
                      <Check className="w-5 h-5" strokeWidth={3} />
                    ) : (
                      <span className="text-sm font-semibold">{step.id}</span>
                    )}
                  </div>

                  {/* Step Info */}
                  <div className="flex flex-col">
                    <span
                      className={cn(
                        "text-[13px] font-semibold uppercase tracking-wider mb-1",
                        isActive ? "text-primary" : "text-slate-400"
                      )}
                    >
                      Step {step.id}
                    </span>
                    <h3
                      className={cn(
                        "text-base font-semibold",
                        isActive ? "text-slate-900" : "text-slate-500"
                      )}
                    >
                      {step.title}
                    </h3>
                    <p className="text-sm text-slate-400 mt-1 leading-relaxed">
                      {step.description}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div className="mt-auto">
          <p className="text-xs text-slate-400 font-medium">
            &copy; 2026 Pixbay. All rights reserved.
          </p>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col bg-white overflow-y-auto">
        {/* Header - Mobile Only */}
        <div className="lg:hidden p-6 border-b border-slate-100 flex items-center justify-between">
          <h1 className="text-lg font-semibold text-slate-800">Pixbay</h1>
          <div className="text-sm font-semibold text-slate-400">
            Step {currentStep} of {steps.length}
          </div>
        </div>

        <div className="flex-1 flex flex-col justify-center items-center p-6 sm:p-12 lg:p-24 w-full">
          <div className="w-full max-w-2xl">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
}
