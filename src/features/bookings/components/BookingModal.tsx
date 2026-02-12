"use client";
import React, { useState, useMemo } from "react";
import { X, Calendar as CalendarIcon, MapPin, Info, DollarSign, Clock, CheckCircle2, ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { useCreateBooking } from "../hooks/useBookings";
import { toast } from "react-hot-toast";
import { ModernSelect } from "@/components/ui/modern-select";
import { Button } from "@/components/ui/button";

interface BookingModalProps {
    isOpen: boolean;
    onClose: () => void;
    creator: {
        id: string;
        name: string;
        pricing: {
            hourly: number;
            currency: string;
        };
        category: string;
    };
}

const SERVICE_TYPES = [
    { value: "SINGLE_SESSION", label: "Single Session", description: "One-time session" },
    { value: "MULTI_SESSION", label: "Multi-Session", description: "Multiple sessions" },
    { value: "PROJECT_BASED", label: "Project Based", description: "Full project" }
];

const MONTHS = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
];

const HOURS = Array.from({ length: 24 }, (_, i) => `${i.toString().padStart(2, "0")}:00`);
const DURATIONS = Array.from({ length: 12 }, (_, i) => `${i + 1}`);

export function BookingModal({ isOpen, onClose, creator }: BookingModalProps) {
    const [formData, setFormData] = useState({
        serviceType: "SINGLE_SESSION",
        category: creator.category || "Photography",
        description: "",
        day: new Date().getDate().toString(),
        month: MONTHS[new Date().getMonth()],
        time: "10:00",
        location: "",
        duration: "1"
    });

    const createBookingMutation = useCreateBooking();

    // Generate days for selected month
    const days = useMemo(() => {
        return Array.from({ length: 31 }, (_, i) => (i + 1).toString());
    }, []);

    if (!isOpen) return null;

    const handleSubmit = async () => {
        if (!formData.description || !formData.location) {
            toast.error("Please fill in all required fields.");
            return;
        }

        try {
            const numericDuration = parseInt(formData.duration);
            const pricing = {
                baseAmount: creator.pricing.hourly * numericDuration,
                platformFee: (creator.pricing.hourly * numericDuration) * 0.1,
                totalAmount: (creator.pricing.hourly * numericDuration) * 1.1,
                currency: creator.pricing.currency
            };

            const formattedDate = `${formData.day} ${formData.month} 2026 at ${formData.time}`;

            await createBookingMutation.mutateAsync({
                creatorId: creator.id,
                serviceType: formData.serviceType,
                category: formData.category,
                bookingDetails: {
                    description: formData.description,
                    date: formattedDate,
                    location: formData.location,
                    duration: `${numericDuration} hours`
                },
                pricing
            });

            toast.success("Booking request sent!");
            onClose();
        } catch (error: any) {
            toast.error(error.message || "Failed to create booking");
        }
    };

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
            <div 
                className="relative w-full max-w-xl bg-white rounded-[24px] overflow-hidden border border-slate-100 animate-in zoom-in-95 duration-200"
                onClick={(e) => e.stopPropagation()}
            >
                {/* Header */}
                <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
                    <div>
                        <h2 className="text-lg font-semibold text-slate-900 leading-tight">Book {creator.name}</h2>
                        <p className="text-sm text-slate-500">Specify your project details below</p>
                    </div>
                    <button 
                        onClick={onClose}
                        className="p-2 hover:bg-slate-50 rounded-full text-slate-400 hover:text-slate-600 transition-colors"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>

                <div className="p-6 space-y-6 max-h-[75vh] overflow-y-auto custom-scrollbar">
                    {/* Service Type Selection */}
                    <div className="space-y-3">
                        <label className="text-xs font-bold text-slate-400 uppercase tracking-wider ml-1">Select Service Type</label>
                        <div className="grid grid-cols-3 gap-3">
                            {SERVICE_TYPES.map((type) => (
                                <button
                                    key={type.value}
                                    onClick={() => setFormData({ ...formData, serviceType: type.value })}
                                    className={cn(
                                        "p-3 rounded-xl border text-left transition-all",
                                        formData.serviceType === type.value
                                            ? "border-primary bg-primary/5 ring-1 ring-primary/20"
                                            : "border-slate-100 hover:border-slate-200 bg-slate-50/50"
                                    )}
                                >
                                    <p className={cn("text-[11px] font-bold uppercase tracking-tight", formData.serviceType === type.value ? "text-primary" : "text-slate-900")}>
                                        {type.label}
                                    </p>
                                    <p className="text-[10px] text-slate-500 mt-0.5 leading-tight">{type.description}</p>
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Date & Time Custom Pickers */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <label className="text-xs font-bold text-slate-400 uppercase tracking-wider ml-1">Appointment Date</label>
                            <div className="flex gap-2">
                                <ModernSelect 
                                    className="flex-1"
                                    options={MONTHS}
                                    value={formData.month}
                                    onChange={(val) => setFormData({ ...formData, month: val })}
                                    icon={<CalendarIcon className="w-3.5 h-3.5" />}
                                />
                                <ModernSelect 
                                    className="w-20"
                                    options={days}
                                    value={formData.day}
                                    onChange={(val) => setFormData({ ...formData, day: val })}
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-xs font-bold text-slate-400 uppercase tracking-wider ml-1">Preferred Time</label>
                            <ModernSelect 
                                options={HOURS}
                                value={formData.time}
                                onChange={(val) => setFormData({ ...formData, time: val })}
                                icon={<Clock className="w-3.5 h-3.5" />}
                            />
                        </div>

                        <div className="space-y-2">
                            <label className="text-xs font-bold text-slate-400 uppercase tracking-wider ml-1">Duration (Hours)</label>
                            <ModernSelect 
                                options={DURATIONS}
                                value={formData.duration}
                                onChange={(val) => setFormData({ ...formData, duration: val })}
                                icon={<Clock className="w-3.5 h-3.5" />}
                            />
                        </div>

                        <div className="space-y-2">
                            <label className="text-xs font-bold text-slate-400 uppercase tracking-wider ml-1">Location</label>
                            <div className="relative">
                                <MapPin className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                                <input 
                                    type="text"
                                    placeholder="Venue or address"
                                    value={formData.location}
                                    onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                                    className="w-full h-10 pl-10 pr-4 bg-slate-50 border-none rounded-xl text-[13px] font-medium placeholder:text-slate-300 focus:ring-1 focus:ring-primary/20 outline-none transition-all"
                                />
                            </div>
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label className="text-xs font-bold text-slate-400 uppercase tracking-wider ml-1">Project Requirements</label>
                        <textarea 
                            placeholder="Describe your vision or any specific needs..."
                            rows={3}
                            value={formData.description}
                            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                            className="w-full p-4 bg-slate-50 border-none rounded-xl text-[13px] font-medium placeholder:text-slate-300 focus:ring-1 focus:ring-primary/20 outline-none transition-all resize-none"
                        />
                    </div>

                    {/* Pricing Summary - Compact */}
                    <div className="p-4 bg-slate-50/50 rounded-2xl border border-slate-100 flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-white rounded-lg border border-slate-100 flex items-center justify-center text-primary">
                                <DollarSign className="w-5 h-5" />
                            </div>
                            <div>
                                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Estimated Total</p>
                                <p className="text-lg font-bold text-slate-900">
                                    {creator.pricing.currency} {(creator.pricing.hourly * parseInt(formData.duration) * 1.1).toLocaleString()}
                                </p>
                            </div>
                        </div>
                        <div className="text-right">
                            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Rate</p>
                            <p className="text-xs font-bold text-slate-600">{creator.pricing.currency} {creator.pricing.hourly.toLocaleString()} / hr</p>
                        </div>
                    </div>
                </div>

                {/* Footer */}
                <div className="px-6 py-4 bg-slate-50 border-t border-slate-100 flex items-center justify-end gap-3">
                    <Button 
                        variant="ghost" 
                        onClick={onClose}
                        className="rounded-xl font-semibold text-slate-600 hover:text-slate-900"
                    >
                        Cancel
                    </Button>
                    <Button 
                        onClick={handleSubmit}
                        disabled={createBookingMutation.isPending}
                        className="rounded-xl bg-primary text-white font-semibold px-8 hover:bg-primary/90 transition-all shadow-none h-11"
                    >
                        {createBookingMutation.isPending ? "Booking..." : "Confirm Booking"}
                    </Button>
                </div>
            </div>
        </div>
    );
}
