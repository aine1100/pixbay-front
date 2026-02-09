import { ChevronDown, Search } from "lucide-react";

interface FilterSidebarProps {
    creatorTypes: string[];
    setCreatorTypes: (types: string[]) => void;
    eventCategories: string[];
    setEventCategories: (cats: string[]) => void;
    locations: string[];
    setLocations: (locs: string[]) => void;
    onClear: () => void;
}

export function FilterSidebar({
    creatorTypes,
    setCreatorTypes,
    eventCategories,
    setEventCategories,
    locations,
    setLocations,
    onClear
}: FilterSidebarProps) {
    const toggleFilter = (list: string[], setList: (val: string[]) => void, item: string) => {
        if (list.includes(item)) {
            setList(list.filter(i => i !== item));
        } else {
            setList([...list, item]);
        }
    };

    return (
        <div className="w-full xl:w-80 space-y-6">
            <div className="flex items-center justify-between mb-8">
                <h2 className="text-lg font-semibold text-slate-900">Filters</h2>
                <button 
                    onClick={onClear}
                    className="text-sm font-medium text-primary hover:underline"
                >
                    Clear all
                </button>
            </div>

            {/* Creator Type */}
            <div className="bg-white rounded-2xl border border-slate-100 overflow-hidden">
                <div className="w-full px-6 py-4 flex items-center justify-between border-b border-slate-50">
                    <span className="text-sm font-semibold text-slate-900 uppercase tracking-tight">Creator type</span>
                    <ChevronDown className="w-4 h-4 text-slate-400" />
                </div>
                <div className="px-6 py-6 space-y-4">
                    {["Photographer", "Video Creator"].map((type) => (
                        <label key={type} className="flex items-center gap-3 cursor-pointer group">
                             <div className={`w-5 h-5 rounded border flex items-center justify-center transition-all ${
                                creatorTypes.includes(type) ? "bg-primary border-primary" : "border-slate-200 group-hover:border-primary"
                            }`}>
                                <input 
                                    type="checkbox" 
                                    className="hidden" 
                                    checked={creatorTypes.includes(type)}
                                    onChange={() => toggleFilter(creatorTypes, setCreatorTypes, type)}
                                />
                                <div className={`w-2 h-2 rounded-sm bg-white transition-opacity ${creatorTypes.includes(type) ? "opacity-100" : "opacity-0"}`} />
                            </div>
                            <span className={`text-sm font-medium transition-colors ${creatorTypes.includes(type) ? "text-slate-900" : "text-slate-700"}`}>
                                {type}
                            </span>
                        </label>
                    ))}
                </div>
            </div>

            {/* Event Category */}
            <div className="bg-white rounded-2xl border border-slate-100 overflow-hidden">
                <div className="w-full px-6 py-4 flex items-center justify-between border-b border-slate-50">
                    <span className="text-sm font-semibold text-slate-900 uppercase tracking-tight">Event category</span>
                    <ChevronDown className="w-4 h-4 text-slate-400" />
                </div>
                <div className="px-6 py-6 space-y-4">
                    {["Wedding", "Graduation", "Content creator", "Birthday party", "Baby shower"].map((cat) => (
                        <label key={cat} className="flex items-center gap-3 cursor-pointer group">
                            <div className={`w-5 h-5 rounded border flex items-center justify-center transition-all ${
                                eventCategories.includes(cat) ? "bg-primary border-primary" : "border-slate-200 group-hover:border-primary"
                            }`}>
                                <input 
                                    type="checkbox" 
                                    className="hidden" 
                                    checked={eventCategories.includes(cat)}
                                    onChange={() => toggleFilter(eventCategories, setEventCategories, cat)}
                                />
                                <div className={`w-2 h-2 rounded-sm bg-white transition-opacity ${eventCategories.includes(cat) ? "opacity-100" : "opacity-0"}`} />
                            </div>
                            <span className={`text-sm font-medium transition-colors ${eventCategories.includes(cat) ? "text-slate-900" : "text-slate-700"}`}>
                                {cat}
                            </span>
                        </label>
                    ))}
                </div>
            </div>

            {/* Location */}
            <div className="bg-white rounded-2xl border border-slate-100 overflow-hidden">
                <div className="w-full px-6 py-4 flex items-center justify-between border-b border-slate-50">
                    <span className="text-sm font-semibold text-slate-900 uppercase tracking-tight">Location</span>
                    <ChevronDown className="w-4 h-4 text-slate-400" />
                </div>
                <div className="px-6 py-6 space-y-4 max-h-60 overflow-y-auto custom-scrollbar">
                    {["Kigali", "Gisenyi", "Karongi", "Muhanga", "Nyamata", "Musanze"].map((loc) => (
                        <label key={loc} className="flex items-center gap-3 cursor-pointer group">
                            <div className={`w-5 h-5 rounded border flex items-center justify-center transition-all ${
                                locations.includes(loc) ? "bg-primary border-primary" : "border-slate-200 group-hover:border-primary"
                            }`}>
                                <input 
                                    type="checkbox" 
                                    className="hidden" 
                                    checked={locations.includes(loc)}
                                    onChange={() => toggleFilter(locations, setLocations, loc)}
                                />
                                <div className={`w-2 h-2 rounded-sm bg-white transition-opacity ${locations.includes(loc) ? "opacity-100" : "opacity-0"}`} />
                            </div>
                            <span className={`text-sm font-medium transition-colors ${locations.includes(loc) ? "text-slate-900" : "text-slate-700"}`}>
                                {loc}
                            </span>
                        </label>
                    ))}
                </div>
            </div>

            {/* Apply Button */}
            <button className="w-full h-12 bg-primary text-white rounded-xl font-semibold text-[11px] uppercase tracking-[0.2em] hover:bg-primary/90 transition-all active:scale-95">
                Apply Filters
            </button>
        </div>
    );
}

interface ImageSearchProps {
    value: string;
    onChange: (val: string) => void;
}

export function ImageSearch({ value, onChange }: ImageSearchProps) {
    return (
        <div className="relative mb-8 group">
            <Search className="absolute left-6 top-1/2 -translate-y-1/2 w-5 h-5 text-primary" />
            <input 
                type="text"
                placeholder="Find creators"
                value={value}
                onChange={(e) => onChange(e.target.value)}
                className="w-full h-16 pl-14 pr-6 bg-white border border-slate-100 rounded-full text-sm font-medium text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-primary/20 transition-all shadow-none"
            />
        </div>
    );
}
