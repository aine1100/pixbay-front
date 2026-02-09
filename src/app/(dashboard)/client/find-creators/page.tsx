"use client";

import { useState, useMemo } from "react";
import { CreatorCard } from "@/features/creators/components/CreatorCard";
import { FilterSidebar, ImageSearch } from "@/features/creators/components/FilterSidebar";
import { Search } from "lucide-react";

const CREATORS = [
    {
        id: "1",
        name: "Yvan SHEMA",
        role: "Photographer",
        specialty: "Weddings, professional shots",
        rating: 4.5,
        reviews: 25,
        jobs: 25,
        location: "Musanze, Rwanda",
        description: "I'm a portrait and corporate photographer helping professionals present themselves with confidence. My work is clean, well-lit, and intention",
        avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=400"
    },
    {
        id: "2",
        name: "Elena Gilbert",
        role: "Photographer",
        specialty: "Fashion, Portraits",
        rating: 4.9,
        reviews: 128,
        jobs: 142,
        location: "Kigali, Rwanda",
        description: "Specializing in high-end fashion photography and artistic portraiture. Captured over 100+ professional campaigns across East Africa",
        avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=400"
    },
    {
        id: "3",
        name: "Chris Musa",
        role: "Videographer",
        specialty: "Commercials, Documentaries",
        rating: 4.7,
        reviews: 45,
        jobs: 60,
        location: "Kigali, Rwanda",
        description: "High-end commercial videographer with 10 years experience in storytelling and brand growth through visual media",
        avatar: "https://images.unsplash.com/photo-1542909168-82c3e7fdca5c?q=80&w=400"
    }
];

export default function FindCreatorsPage() {
    const [searchQuery, setSearchQuery] = useState("");
    const [creatorTypes, setCreatorTypes] = useState<string[]>([]);
    const [eventCategories, setEventCategories] = useState<string[]>([]);
    const [locations, setLocations] = useState<string[]>([]);

    const filteredCreators = useMemo(() => {
        return CREATORS.filter(creator => {
            const matchesSearch = creator.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                                creator.role.toLowerCase().includes(searchQuery.toLowerCase()) ||
                                creator.specialty?.toLowerCase().includes(searchQuery.toLowerCase());
            
            const matchesType = creatorTypes.length === 0 || 
                               creatorTypes.includes(creator.role) || 
                               (creatorTypes.includes("Video Creator") && creator.role === "Videographer");
            
            const matchesLocation = locations.length === 0 || 
                                   locations.some(loc => creator.location.includes(loc));
            
            const matchesCategory = eventCategories.length === 0 || 
                                   eventCategories.some(cat => 
                                       creator.specialty?.toLowerCase().includes(cat.toLowerCase())
                                   );

            return matchesSearch && matchesType && matchesLocation && matchesCategory;
        });
    }, [searchQuery, creatorTypes, eventCategories, locations]);

    return (
        <div className="max-w-[1600px] mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
            {/* Page Header */}
            <div>
                <h1 className="text-2xl font-semibold text-slate-900 tracking-tight">Explore creators</h1>
            </div>

            <div className="flex flex-col xl:flex-row gap-10 h-full">
                {/* Left: Filter Sidebar */}
                <div className="xl:sticky xl:top-[100px] h-fit">
                    <FilterSidebar 
                        creatorTypes={creatorTypes}
                        setCreatorTypes={setCreatorTypes}
                        eventCategories={eventCategories}
                        setEventCategories={setEventCategories}
                        locations={locations}
                        setLocations={setLocations}
                        onClear={() => {
                            setCreatorTypes([]);
                            setEventCategories([]);
                            setLocations([]);
                        }}
                    />
                </div>

                {/* Right: Search + Results */}
                <div className="flex-1 min-w-0">
                    <ImageSearch value={searchQuery} onChange={setSearchQuery} />

                    <div className="mb-6 h-8 flex items-center">
                        <h2 className="text-2xl font-semibold text-slate-900">
                            Showing {filteredCreators.length} results {searchQuery && `for "${searchQuery}"`}
                        </h2>
                    </div>

                    <div className="grid grid-cols-1 gap-6 pb-20">
                        {filteredCreators.map((creator) => (
                            <CreatorCard key={creator.id} {...creator} />
                        ))}

                        {filteredCreators.length === 0 && (
                            <div className="py-20 text-center bg-white rounded-[32px] border border-slate-100 animate-in fade-in zoom-in-95 duration-500">
                                <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-4">
                                     <span className="text-2xl"><Search/></span>
                                </div>
                                <h3 className="text-lg font-semibold text-slate-900 mb-2">No creators found</h3>
                                <p className="text-slate-500 font-medium max-w-xs mx-auto mb-8">
                                    We couldn&apos;t find any results matching your current filters. Try adjusting your preferences.
                                </p>
                                <button 
                                    onClick={() => {
                                        setSearchQuery("");
                                        setCreatorTypes([]);
                                        setEventCategories([]);
                                        setLocations([]);
                                    }}
                                    className="px-8 h-12 bg-primary text-white rounded-xl font-semibold text-sm uppercase tracking-widest hover:bg-primary/90 transition-all active:scale-95"
                                >
                                    Clear all filters
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
