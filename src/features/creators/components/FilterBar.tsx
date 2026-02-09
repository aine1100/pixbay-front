"use client";

import { 
    Search, 
    SlidersHorizontal, 
    ChevronDown, 
    LayoutGrid, 
    ListFilter 
} from "lucide-react";

const CATEGORIES = ["All", "Photographers", "Videographers"];

export function FilterBar() {
    return (
        <div className="bg-slate-50/50 p-2 rounded-[32px] border border-slate-100 flex flex-col xl:flex-row items-center gap-4">
            
            {/* Left: Category Tabs */}
            <div className="bg-white p-1 rounded-full border border-slate-100 flex items-center gap-1">
                {CATEGORIES.map((category) => (
                    <button
                        key={category}
                        className={`px-6 h-10 rounded-full text-[11px] font-semibold uppercase tracking-widest transition-all ${
                            category === "All"
                                ? "bg-primary text-white"
                                : "text-slate-700/50 hover:text-slate-700"
                        }`}
                    >
                        {category}
                        {category === "All" && <span className="ml-2 opacity-50 text-[9px]">(128)</span>}
                    </button>
                ))}
            </div>

            {/* Center: Search & Actions */}
            <div className="flex-1 flex flex-col md:flex-row items-center gap-3 w-full">
                
                {/* Search Input */}
                <div className="relative flex-1 w-full group">
                    <Search className="absolute left-5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-primary transition-colors" />
                    <input 
                        type="text"
                        placeholder="Search name, location, etc..."
                        className="w-full h-12 pl-12 pr-4 bg-white border border-slate-100 rounded-2xl text-[13px] font-medium text-slate-700 placeholder:text-slate-400 focus:outline-none focus:border-primary/20 transition-all"
                    />
                </div>

                {/* Advanced Actions Row */}
                <div className="flex items-center gap-2 w-full md:w-auto">
                    {/* Filter Icon Button */}
                    <button className="w-12 h-12 bg-slate-900 text-white rounded-2xl flex items-center justify-center hover:bg-primary transition-all active:scale-95">
                        <SlidersHorizontal className="w-4 h-4" />
                    </button>

                    {/* Category Dropdown */}
                    <button className="h-12 px-5 bg-white border border-slate-100 rounded-2xl flex items-center gap-3 text-slate-700 font-semibold text-[11px] uppercase tracking-widest hover:border-primary/20 transition-all whitespace-nowrap">
                        All Category
                        <ChevronDown className="w-3.5 h-3.5 opacity-50" />
                    </button>

                    {/* Pricing/Date Dropdown */}
                    <button className="h-12 px-5 bg-white border border-slate-100 rounded-2xl flex items-center gap-3 text-slate-700 font-semibold text-[11px] uppercase tracking-widest hover:border-primary/20 transition-all whitespace-nowrap">
                        Pricing
                        <ChevronDown className="w-3.5 h-3.5 opacity-50" />
                    </button>

                    {/* View Switcher */}
                    <div className="flex bg-white border border-slate-100 rounded-2xl p-1 overflow-hidden">
                        <button className="w-10 h-10 bg-slate-900 text-white rounded-xl flex items-center justify-center transition-all">
                            <LayoutGrid className="w-4 h-4" />
                        </button>
                        <button className="w-10 h-10 text-slate-700 flex items-center justify-center hover:bg-slate-50 rounded-xl transition-all">
                            <ListFilter className="w-4 h-4" />
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
