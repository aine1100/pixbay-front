"use client";

import React from "react";
import Image from "next/image";

interface WelcomeHeroProps {
    firstName: string;
}

export function WelcomeHero({ firstName }: WelcomeHeroProps) {
    return (
        <div className="relative h-48 rounded-[32px] overflow-hidden bg-gradient-to-r from-[#D31027] to-[#EA384D] flex items-center p-12 transition-all group">
            {/* Background elements */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -mr-32 -mt-32 blur-3xl transition-transform group-hover:scale-110 duration-700" />
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-black/10 rounded-full -ml-32 -mb-32 blur-3xl transition-transform group-hover:scale-110 duration-700" />

            {/* Content */}
            <div className="relative z-10 flex flex-col space-y-2">
                <h1 className="text-2xl font-semibold text-white tracking-tight">
                    Good Morning {firstName}!
                </h1>
                <p className="text-white/80 text-[14px] font-medium max-w-md leading-relaxed">
                    Get ready to embark on a wonderful experience
                </p>
            </div>

            {/* Floating Image Placeholder */}
            <div className="absolute right-12 bottom-0 w-48 h-40 transform translate-y-4 group-hover:translate-y-2 transition-transform duration-500">
                <div className="relative w-full h-full rounded-2xl overflow-hidden border-4 border-white/20">
                    <Image
                        src="https://images.unsplash.com/photo-1516035069371-29a1b244cc32?q=80&w=400&auto=format&fit=crop"
                        alt="Creator Life"
                        fill
                        className="object-cover"
                    />
                </div>
            </div>
        </div>
    );
}
