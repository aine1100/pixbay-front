"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";

interface WelcomeBannerProps {
    name: string;
}

export function WelcomeBanner({ name }: WelcomeBannerProps) {
    const router=useRouter()
    return (
        <div className="relative w-full h-[220px] rounded-[32px] overflow-hidden bg-primary group border border-primary/10">
            {/* Background Image / Decoration */}
            <div className="absolute inset-0 bg-gradient-to-r from-primary via-primary/80 to-transparent z-10"></div>
            <div className="absolute right-0 top-0 bottom-0 w-1/2 overflow-hidden pointer-events-none">
                <div className="relative w-full h-full transform scale-110 group-hover:scale-100 transition-transform duration-700">
                    <Image
                        src="https://images.unsplash.com/photo-1542038784456-1ea8e935640e?q=80&w=600&auto=format&fit=crop"
                        alt="Photography"
                        fill
                        className="object-cover opacity-60"
                    />
                </div>
            </div>

            {/* Content */}
            <div className="relative z-20 h-full flex flex-col justify-center px-8 sm:px-12 text-white">
                <h1 className="text-2xl sm:text-3xl font-semibold mb-3 tracking-tight">
                    Good Morning {name}!
                </h1>
                <p className="text-white text-base sm:text-md max-w-md font-medium leading-relaxed">
                    Get ready to embark on a wonderful experience with Africa's best creators.
                </p>

                <div className="mt-6 flex items-center gap-2">
                    <button className="px-6 h-11 bg-white text-primary rounded-xl font-semibold text-sm hover:bg-slate-50 transition-colors" onClick={()=>router.push("/creators")}>
                        View Creators
                    </button>
                </div>
            </div>

            {/* Abstract shapes */}
            <div className="absolute top-[-10%] right-[-5%] w-64 h-64 bg-white/5 rounded-full blur-3xl translate-x-10 -translate-y-10"></div>
            <div className="absolute bottom-[-20%] left-[20%] w-48 h-48 bg-primary-foreground/5 rounded-full blur-2xl"></div>
        </div>
    );
}
