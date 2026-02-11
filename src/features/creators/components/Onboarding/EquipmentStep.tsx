"use client";

import React, { useState } from "react";
import { Camera, Plus, Trash2, Monitor, Mic, Lightbulb, Package } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { ModernSelect } from "@/components/ui/modern-select";
import { creatorService } from "../../services/creator.service";
import { toast } from "react-hot-toast";
import { useRouter } from "next/navigation";

interface EquipmentStepProps {
    onComplete: (data: any) => void;
    onBack: () => void;
}

interface EquipmentItem {
    id: string;
    name: string;
    category: string;
    quantity: number;
}

const CATEGORIES = ["Camera", "Lens", "Lighting", "Audio", "Support", "Other"];

export function EquipmentStep({ onComplete, onBack }: EquipmentStepProps) {
    const router = useRouter();
    const [equipment, setEquipment] = useState<EquipmentItem[]>([
        { id: "1", name: "", category: "Camera", quantity: 1 }
    ]);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const addEquipment = () => {
        setEquipment((prev) => [
            ...prev,
            { id: Math.random().toString(36).substr(2, 9), name: "", category: "Camera", quantity: 1 }
        ]);
    };

    const removeEquipment = (id: string) => {
        if (equipment.length === 1) return;
        setEquipment((prev) => prev.filter((item) => item.id !== id));
    };

    const updateEquipmentField = (id: string, field: keyof EquipmentItem, value: any) => {
        setEquipment((prev) =>
            prev.map((item) => (item.id === id ? { ...item, [field]: value } : item))
        );
    };

    const handleSubmit = async () => {
        const isValid = equipment.every(item => item.name.trim() !== "");
        if (!isValid) {
            toast.error("Please fill in all equipment names.");
            return;
        }

        setIsSubmitting(true);
        try {
            await creatorService.submitEquipment(equipment);
            toast.success("Professional profile data submitted successfully!");
            onComplete({ equipmentList: equipment });
            router.push("/creator");
        } catch (error: any) {
            toast.error(error.message || "Failed to complete activation.");
        } finally {
            setIsSubmitting(false);
        }
    };

    const getCategoryIcon = (category: string) => {
        const iconClass = "w-4 h-4";
        switch (category) {
            case "Camera": return <Camera className={iconClass} />;
            case "Lens": return <Monitor className={iconClass} />;
            case "Lighting": return <Lightbulb className={iconClass} />;
            case "Audio": return <Mic className={iconClass} />;
            default: return <Package className={iconClass} />;
        }
    };

    return (
        <div className="w-full animate-in fade-in slide-in-from-bottom-4 duration-300">
            <div className="mb-6">
                <h2 className="text-xl font-semibold text-slate-900 mb-1">Professional Equipment</h2>
                <p className="text-slate-500 text-xs leading-relaxed">
                    List the professional gear you bring to your projects.
                </p>
            </div>

            <div className="space-y-4">
                <div className="space-y-3">
                    {equipment.map((item, index) => (
                        <div
                            key={item.id}
                            className="flex flex-wrap md:flex-nowrap items-end gap-3 p-4 rounded-[20px] border border-slate-100 bg-white group transition-all"
                        >
                            {/* Category Select */}
                            <div className="flex-none w-full md:w-44 space-y-1">
                                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest px-1">Category</label>
                                <ModernSelect
                                    value={item.category}
                                    onChange={(val) => updateEquipmentField(item.id, "category", val)}
                                    options={CATEGORIES}
                                    icon={getCategoryIcon(item.category)}
                                />
                            </div>

                            {/* Name Input */}
                            <div className="flex-1 min-w-[180px] space-y-1">
                                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest px-1">Model / Name</label>
                                <Input
                                    placeholder="e.g. Sony A7R IV"
                                    value={item.name}
                                    onChange={(e) => updateEquipmentField(item.id, "name", e.target.value)}
                                    className="h-10 bg-slate-50 border-none rounded-xl text-[13px] font-medium placeholder:text-slate-300 focus:ring-2 focus:ring-primary/20"
                                />
                            </div>

                            {/* Quantity */}
                            <div className="flex-none w-20 space-y-1">
                                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest px-1">Qty</label>
                                <Input
                                    type="number"
                                    min="1"
                                    value={item.quantity}
                                    onChange={(e) => updateEquipmentField(item.id, "quantity", parseInt(e.target.value))}
                                    className="h-10 bg-slate-50 border-none rounded-xl text-[13px] font-medium focus:ring-2 focus:ring-primary/20"
                                />
                            </div>

                            {/* Remove */}
                            <button
                                onClick={() => removeEquipment(item.id)}
                                disabled={equipment.length === 1}
                                className="flex-none h-10 w-10 rounded-xl flex items-center justify-center text-slate-300 hover:text-red-500 hover:bg-red-50 transition-all disabled:opacity-0"
                            >
                                <Trash2 className="w-4 h-4" />
                            </button>
                        </div>
                    ))}
                </div>

                <button
                    onClick={addEquipment}
                    className="w-full h-12 rounded-[20px] border-2 border-dashed border-slate-100 text-slate-400 hover:border-primary/20 hover:text-primary hover:bg-primary/[0.01] transition-all flex items-center justify-center gap-2 font-semibold text-xs"
                >
                    <Plus className="w-4 h-4" />
                    Add More Equipment
                </button>

                {/* Footer Actions */}
                <div className="pt-8 flex items-center justify-between border-t border-slate-50 mt-10">
                    <button
                        onClick={onBack}
                        className="text-slate-500 font-semibold px-4 hover:text-slate-700 transition-colors text-[15px]"
                    >
                        Previous
                    </button>
                    <div className="flex gap-4 items-center">
                        <Button
                            variant="outline"
                            onClick={onBack}
                            className="rounded-full border-slate-100 text-slate-700 font-semibold h-12 px-8 text-[15px] hover:bg-slate-50"
                        >
                            Cancel
                        </Button>
                        <Button
                            onClick={handleSubmit}
                            disabled={isSubmitting || !equipment.every(item => item.name.trim() !== "")}
                            className="rounded-[20px] bg-primary text-white font-semibold h-12 px-12 text-[15px] transition-all border-none min-w-[200px]"
                        >
                            {isSubmitting ? "Finishing..." : "Complete Activation"}
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    );
}
