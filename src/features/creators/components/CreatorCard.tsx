"use client";

import Link from "next/link";
import NextImage from "next/image";
import { Star, MapPin, BadgeCheck, Heart, Briefcase } from "lucide-react";

interface CreatorCardProps {
    id: string;
    name: string;
    role: string;
    specialty?: string;
    rating: number;
    reviews: number;
    jobs: number;
    location: string;
    description: string;
    avatar: string;
}

export function CreatorCard({
    id,
    name,
    role,
    specialty,
    rating,
    reviews,
    jobs,
    location,
    description,
    avatar
}: CreatorCardProps) {
    return (
        <div className="bg-white rounded-[32px] border border-slate-100 p-6 group relative hover:border-primary/20 transition-all flex flex-col md:flex-row gap-8">
            {/* Profile Image - Square */}
            <div className="w-32 h-32 rounded-2xl overflow-hidden flex-shrink-0 bg-slate-100 border border-slate-100">
                <NextImage
                    src={avatar}
                    alt={name}
                    width={128}
                    height={128}
                    className="object-cover w-full h-full"
                />
            </div>

            {/* Content Area */}
            <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between mb-2">
                    <div>
                        <div className="flex items-center gap-2">
                            <h3 className="text-xl font-semibold text-slate-900">{name}</h3>
                            <BadgeCheck className="w-5 h-5 text-blue-500 fill-blue-500/10" />
                        </div>
                        <p className="text-sm font-medium text-slate-700 mt-1">
                            {role} <span className="text-slate-700/60 font-medium">({specialty})</span>
                        </p>
                    </div>
                    <button className="text-slate-400 hover:text-primary transition-colors p-2">
                        <Heart className="w-6 h-6" />
                    </button>
                </div>

                {/* Metrics Row */}
                <div className="flex flex-wrap items-center gap-6 mt-4 mb-6">
                    <div className="flex items-center gap-1.5">
                        <div className="flex items-center gap-1">
                            {[1, 2, 3, 4].map((i) => (
                                <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                            ))}
                            <div className="relative">
                                <Star className="w-4 h-4 text-yellow-400 fill-yellow-400/20" />
                                <div className="absolute inset-0 overflow-hidden w-1/2">
                                    <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                                </div>
                            </div>
                        </div>
                        <span className="text-lg font-bold text-slate-900 ml-1">{rating}</span>
                    </div>

                    <div className="flex items-center gap-2 text-slate-700">
                        <div className="w-8 h-8 rounded-lg bg-slate-50 flex items-center justify-center border border-slate-100">
                            <Briefcase className="w-4 h-4" />
                        </div>
                        <span className="text-sm font-bold">{jobs}</span>
                    </div>

                    <div className="flex items-center gap-2 text-slate-700">
                        <div className="w-8 h-8 rounded-lg bg-slate-50 flex items-center justify-center border border-slate-100">
                            <div className="w-5 h-4 relative overflow-hidden rounded-sm">
                                <NextImage
                                    src="https://flagcdn.com/w40/rw.png"
                                    alt="Rwanda"
                                    width={20}
                                    height={16}
                                />
                            </div>
                        </div>
                        <span className="text-sm font-medium">{location}</span>
                    </div>
                </div>

                {/* Description and Action Area - Horizontal Flex */}
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                    <p className="text-sm text-slate-700/70 leading-relaxed max-w-md font-medium">
                        {description}... <button className="text-primary font-bold hover:underline">more</button>
                    </p>

                    <Link 
                        href={`/client/creators/${id}`}
                        className="flex-shrink-0 bg-primary rounded-xl px-8 h-11 flex items-center justify-center text-white text-sm font-medium tracking-widest hover:bg-primary/90 transition-all active:scale-95 whitespace-nowrap"
                    >
                        View Portfolio
                    </Link>
                </div>
            </div>
        </div>
    );
}
