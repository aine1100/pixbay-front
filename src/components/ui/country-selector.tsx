"use client";

import { useState, useRef, useEffect } from "react";
import { ChevronDown, Check } from "lucide-react";
import { cn } from "@/lib/utils";

interface Country {
    code: string;
    name: string;
    flag: string;
}

const countries: Country[] = [
    { code: "GB", name: "English", flag: "🇬🇧" },
    { code: "FR", name: "French", flag: "🇫🇷" },
    { code: "NG", name: "Nigeria", flag: "🇳🇬" },
    { code: "KE", name: "Kenya", flag: "🇰🇪" },
    { code: "ZA", name: "South Africa", flag: "🇿🇦" },
];

export function CountrySelector() {
    const [isOpen, setIsOpen] = useState(false);
    const [selected, setSelected] = useState(countries[0]);
    const containerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    return (
        <div className="relative" ref={containerRef}>
            <button
                type="button"
                onClick={() => setIsOpen(!isOpen)}
                className="flex items-center gap-2 text-sm font-semibold border border-zinc-200 rounded-xl px-4 py-2 bg-white hover:bg-zinc-50 transition-all shadow-sm"
            >
                <span className="text-xl leading-none">{selected.flag}</span>
                <span className="text-zinc-900">{selected.name}</span>
                <ChevronDown className={cn("w-4 h-4 text-zinc-500 transition-transform", isOpen && "rotate-180")} />
            </button>

            {isOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white border border-zinc-200 rounded-xl shadow-xl z-50 overflow-hidden animate-in fade-in zoom-in duration-200">
                    <div className="py-1">
                        {countries.map((country) => (
                            <button
                                key={country.code}
                                type="button"
                                onClick={() => {
                                    setSelected(country);
                                    setIsOpen(false);
                                }}
                                className="flex items-center justify-between w-full px-4 py-2.5 text-sm text-zinc-700 hover:bg-primary/5 hover:text-primary transition-colors text-left"
                            >
                                <div className="flex items-center gap-3">
                                    <span className="text-lg">{country.flag}</span>
                                    <span className="font-medium">{country.name}</span>
                                </div>
                                {selected.code === country.code && (
                                    <Check className="w-4 h-4 text-primary" />
                                )}
                            </button>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}
