"use client";

import { useState, useMemo } from "react";
import { CreatorCard } from "@/features/creators/components/CreatorCard";
import { FilterSidebar, ImageSearch } from "@/features/creators/components/FilterSidebar";
import { Search } from "lucide-react";
import { useCreators } from "@/features/creators/hooks/useCreators";
import { Loading } from "@/components/ui/loading";

export default function FindCreatorsPage() {
    const [searchQuery, setSearchQuery] = useState("");
    const [creatorTypes, setCreatorTypes] = useState<string[]>([]);
    const [eventCategories, setEventCategories] = useState<string[]>([]);
    const [locations, setLocations] = useState<string[]>([]);

    const { data: rawCreators, isLoading } = useCreators();

    const creators = useMemo(() => {
        return (rawCreators || []).map((c: any) => ({
            id: c.id,
            userId: c.user.id,
            name: `${c.user.firstName} ${c.user.lastName}`,
            role: c.creatorType.charAt(0) + c.creatorType.slice(1).toLowerCase().replace('_', ' '),
            avatar: c.user.profilePicture || "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=400",
            specialty: c.bio,
            location: `${c.user.city || ''}, ${c.user.country || ''}`,
            rating: Number(c.averageRating) || 0,
            reviews: c.totalReviews || 0,
            jobs: c.stats?.totalBookings || 0,
            description: c.bio
        }));
    }, [rawCreators]);

    const filteredCreators = useMemo(() => {
        return creators.filter((creator: any) => {
            const matchesSearch = creator.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                                creator.role.toLowerCase().includes(searchQuery.toLowerCase()) ||
                                creator.specialty?.toLowerCase().includes(searchQuery.toLowerCase());
            
            const matchesType = creatorTypes.length === 0 || 
                               creatorTypes.includes(creator.role) || 
                               (creatorTypes.includes("Video Creator") && creator.role.toLowerCase().includes("video"));
            
            const matchesLocation = locations.length === 0 || 
                                   locations.some(loc => creator.location.toLowerCase().includes(loc.toLowerCase()));
            
            const matchesCategory = eventCategories.length === 0 || 
                                   eventCategories.some(cat => 
                                       creator.specialty?.toLowerCase().includes(cat.toLowerCase())
                                   );

            return matchesSearch && matchesType && matchesLocation && matchesCategory;
        });
    }, [creators, searchQuery, creatorTypes, eventCategories, locations]);

    if (isLoading) {
        return (
            <div className="flex-1 flex flex-col items-center justify-center py-20 bg-white rounded-[32px] border border-slate-100 min-h-[400px]">
                <Loading size="lg" />
                <p className="mt-4 text-slate-500 font-medium animate-pulse">Loading creators...</p>
            </div>
        );
    }

    return (
        <div className="max-w-[1600px] mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
            <div>
                <h1 className="text-2xl font-semibold text-slate-900 tracking-tight">Explore creators</h1>
            </div>

            <div className="flex flex-col xl:flex-row gap-10 h-full">
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

                <div className="flex-1 min-w-0">
                    <ImageSearch value={searchQuery} onChange={setSearchQuery} />

                    <div className="mb-6 h-8 flex items-center">
                        <h2 className="text-2xl font-semibold text-slate-900">
                            Showing {filteredCreators.length} results {searchQuery && `for "${searchQuery}"`}
                        </h2>
                    </div>

                    <div className="grid grid-cols-1 gap-6 pb-20">
                        {filteredCreators.map((creator: any) => (
                            <CreatorCard key={creator.id} {...creator} />
                        ))}

                        {filteredCreators.length === 0 && (
                            <div className="py-20 text-center bg-white rounded-[32px] border border-slate-100 animate-in fade-in zoom-in-95 duration-500">
                                <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-4">
                                     <Search className="w-8 h-8 text-slate-400" />
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
