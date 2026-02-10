"use client";

import React, { useState, useRef, useEffect } from "react";
import { ChevronDown, Check } from "lucide-react";
import { cn } from "@/lib/utils";

interface ModernSelectProps {
    value: string;
    onChange: (val: string) => void;
    options: string[];
    placeholder?: string;
    icon?: React.ReactNode;
    className?: string;
}

export function ModernSelect({ 
    value, 
    onChange, 
    options, 
    placeholder = "Select an option", 
    icon,
    className 
}: ModernSelectProps) {
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    return (
        <div className={cn("relative", className)} ref={dropdownRef}>
            <button
                type="button"
                onClick={() => setIsOpen(!isOpen)}
                className={cn(
                    "w-full h-10 px-4 bg-slate-50 border-none rounded-xl text-[13px] font-medium text-slate-700 flex items-center justify-between transition-all outline-none",
                    isOpen ? "ring-2 ring-primary/20" : "hover:bg-slate-100/50"
                )}
            >
                <div className="flex items-center gap-3">
                    {icon && <div className="text-primary">{icon}</div>}
                    <span className={cn(!value && "text-slate-400")}>{value || placeholder}</span>
                </div>
                <ChevronDown className={cn("w-3.5 h-3.5 text-slate-400 transition-transform duration-300", isOpen && "rotate-180")} />
            </button>

            {isOpen && (
                <div className="absolute top-[calc(100%+6px)] left-0 right-0 p-1 bg-white border border-slate-100 rounded-2xl z-50 shadow-xl animate-in fade-in slide-in-from-top-2 duration-200">
                    {options.map((option) => (
                        <button
                            key={option}
                            type="button"
                            onClick={() => {
                                onChange(option);
                                setIsOpen(false);
                            }}
                            className={cn(
                                "w-full px-4 py-2 rounded-xl text-[13px] font-medium text-left flex items-center justify-between transition-colors",
                                value === option
                                    ? "bg-primary/5 text-primary"
                                    : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                            )}
                        >
                            <span>{option}</span>
                            {value === option && <Check className="w-3.5 h-3.5" />}
                        </button>
                    ))}
                </div>
            )}
        </div>
    );
}
