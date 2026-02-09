"use client";

import Image from "next/image";
import { Star, MapPin, ArrowUpRight, Calendar } from "lucide-react";

interface CreatorCardProps {
    name: string;
    role: string;
    rating: number;
    reviews: number;
    location: string;
    price: string;
    avatar: string;
}

export function CreatorCard({ name, role, rating, reviews, location, price, avatar }: CreatorCardProps) {
    return (
        <div className="bg-white rounded-[40px] border border-slate-100 p-2 group transition-all">
            {/* Image Header */}
            <div className="relative h-72 w-full rounded-[32px] overflow-hidden bg-slate-100">
                <Image
                    src={avatar}
                    alt={name}
                    fill
                    className="object-cover transition-transform duration-700 group-hover:scale-105"
                />
                
                {/* Floating Tags */}
                <div className="absolute top-4 left-4 right-4 flex items-center justify-between">
                    <div className="bg-white/90 backdrop-blur-sm px-4 py-1.5 rounded-full border border-white/20">
                        <span className="text-[10px] font-semibold text-slate-700 uppercase tracking-widest">{role}</span>
                    </div>
                    <div className="bg-primary/90 backdrop-blur-sm px-4 py-1.5 rounded-full flex items-center gap-2 border border-primary/20">
                        <div className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
                        <span className="text-[10px] font-semibold text-white uppercase tracking-widest">Active</span>
                    </div>
                </div>

                {/* Rating Overlay */}
                <div className="absolute bottom-4 left-4 bg-[#1A1A1A]/80 backdrop-blur-sm px-4 py-2 rounded-2xl flex items-center gap-2 border border-white/10">
                    <Star className="w-3.5 h-3.5 fill-primary text-primary" />
                    <span className="text-xs font-bold text-white">{rating}</span>
                    <div className="w-1 h-1 rounded-full bg-white/20" />
                    <span className="text-[10px] font-medium text-white/60">{reviews} Verified</span>
                </div>
            </div>

            {/* Content Body */}
            <div className="p-6">
                <div className="space-y-1 mb-6">
                    <div className="flex items-center gap-2 text-slate-700/50">
                        <Calendar className="w-3.5 h-3.5" />
                        <span className="text-[10px] font-semibold uppercase tracking-widest">Available: Next Week</span>
                    </div>
                    <h3 className="text-xl font-semibold text-slate-700 tracking-tight group-hover:text-primary transition-colors">{name}</h3>
                    <div className="flex items-center gap-1.5 text-slate-700/60">
                        <MapPin className="w-3.5 h-3.5" />
                        <span className="text-[10px] font-medium uppercase tracking-widest">{location}</span>
                    </div>
                </div>

                {/* Expertise Bar (Inspired by progress bars in image) */}
                <div className="space-y-2 mb-8">
                    <div className="flex items-center justify-between text-[10px] font-semibold uppercase tracking-widest text-slate-700">
                        <span>Reputation</span>
                        <span>{rating * 20}%</span>
                    </div>
                    <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden p-0.5 border border-slate-50">
                        <div 
                            className="h-full bg-primary rounded-full transition-all duration-1000 group-hover:opacity-80" 
                            style={{ width: `${rating * 20}%` }} 
                        />
                    </div>
                </div>

                <div className="flex items-center justify-between pt-6 border-t border-slate-100">
                    <div className="w-10 h-10 rounded-2xl bg-slate-50 flex items-center justify-center text-slate-700 group-hover:bg-[#1A1A1A] group-hover:text-white transition-all transform group-hover:-rotate-12 cursor-pointer">
                        <ArrowUpRight className="w-5 h-5" />
                    </div>
                    <div className="text-right">
                        <p className="text-[10px] text-slate-700/50 font-bold uppercase tracking-tighter">Budget Starts</p>
                        <p className="text-2xl font-semibold text-primary mt-0.5">{price}</p>
                    </div>
                </div>
            </div>
        </div>
    );
}
