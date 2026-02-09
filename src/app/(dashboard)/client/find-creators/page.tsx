"use client";

import { CreatorCard } from "@/features/creators/components/CreatorCard";
import { FilterBar } from "@/features/creators/components/FilterBar";

const CREATORS = [
    {
        id: "1",
        name: "Elena Gilbert",
        role: "Photographer",
        rating: 4.9,
        reviews: 128,
        location: "Kigali, Rwanda",
        price: "$150",
        avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=400"
    },
    {
        id: "2",
        name: "Marcus Wright",
        role: "Videographer",
        rating: 4.8,
        reviews: 95,
        location: "Musanze, Rwanda",
        price: "$200",
        avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=400"
    },
    {
        id: "3",
        name: "Sarah Chen",
        role: "Photographer",
        rating: 5.0,
        reviews: 210,
        location: "Kigali, Rwanda",
        price: "$80",
        avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&q=80&w=400"
    },
    {
        id: "4",
        name: "David Ndoli",
        role: "Photographer",
        rating: 4.7,
        reviews: 64,
        location: "Rubavu, Rwanda",
        price: "$120",
        avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80&w=400"
    },
    {
        id: "5",
        name: "Aisha Kamali",
        role: "Videographer",
        rating: 4.9,
        reviews: 152,
        location: "Kigali, Rwanda",
        price: "$100",
        avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=400"
    },
    {
        id: "6",
        name: "Julian Vane",
        role: "Videographer",
        rating: 4.6,
        reviews: 42,
        location: "Huye, Rwanda",
        price: "$250",
        avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=400"
    }
];

export default function FindCreatorsPage() {
    return (
        <div className="max-w-[1600px] mx-auto space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-700">
            {/* Header Section */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                <div>
                    <h1 className="text-3xl font-semibold text-slate-700 tracking-tight">Find Creators</h1>
                    <p className="text-sm font-medium text-slate-700/60 mt-2 max-w-md">
                        Discover top photographers and videographers in Rwanda. Find the perfect creative partner for your next project.
                    </p>
                </div>
                <div className="text-right">
                    <p className="text-[11px] font-semibold text-primary uppercase tracking-widest">{CREATORS.length} Creators Available</p>
                    <div className="flex items-center gap-1 justify-end mt-1">
                        <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                        <span className="text-[11px] font-medium text-slate-700">Real-time updates</span>
                    </div>
                </div>
            </div>

            {/* Filter Section */}
            <FilterBar />

            {/* Content Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-8 pb-20">
                {CREATORS.map((creator) => (
                    <CreatorCard key={creator.id} {...creator} />
                ))}
            </div>
        </div>
    );
}
