"use client";

import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { X, Loader2, Save } from "lucide-react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { creatorService } from "../../services/creator.service";
import { toast } from "react-hot-toast";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

const editSchema = z.object({
    title: z.string().min(3, "Title must be at least 3 characters"),
    description: z.string().min(10, "Description must be at least 10 characters"),
});

type EditFormValues = z.infer<typeof editSchema>;

interface EditWorkModalProps {
    isOpen: boolean;
    onClose: () => void;
    item: {
        id: string;
        metadata?: {
            title?: string;
            description?: string;
        };
    } | null;
}

export function EditWorkModal({ isOpen, onClose, item }: EditWorkModalProps) {
    const queryClient = useQueryClient();

    const {
        register,
        handleSubmit,
        reset,
        formState: { errors },
    } = useForm<EditFormValues>({
        resolver: zodResolver(editSchema),
        defaultValues: {
            title: item?.metadata?.title || "",
            description: item?.metadata?.description || "",
        },
    });

    useEffect(() => {
        if (item) {
            reset({
                title: item.metadata?.title || "",
                description: item.metadata?.description || "",
            });
        }
    }, [item, reset]);

    const updateMutation = useMutation({
        mutationFn: (data: EditFormValues) =>
            creatorService.updatePortfolioItem(item!.id, data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["profile"] });
            toast.success("Work updated successfully");
            onClose();
        },
        onError: (error: any) => {
            toast.error(error.message || "Failed to update work");
        },
    });

    const onSubmit = (data: EditFormValues) => {
        updateMutation.mutate(data);
    };

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-[500px] rounded-[32px] p-0 overflow-hidden border-none bg-white">
                <DialogHeader className="p-8 pb-0">
                    <DialogTitle className="text-2xl font-bold text-slate-900">Edit Work Details</DialogTitle>
                </DialogHeader>

                <form onSubmit={handleSubmit(onSubmit)} className="p-8 pt-6 space-y-6">
                    <div className="space-y-4">
                        <div className="space-y-2">
                            <label className="text-sm font-semibold text-slate-700 ml-1">Title</label>
                            <Input
                                {...register("title")}
                                placeholder="Give your project a catchy title"
                                className="h-12 rounded-xl border-slate-100 bg-slate-50/50 focus:bg-white transition-all text-slate-900"
                            />
                            {errors.title && (
                                <p className="text-xs font-medium text-red-500 ml-1">{errors.title.message}</p>
                            )}
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-semibold text-slate-700 ml-1">Description</label>
                            <Textarea
                                {...register("description")}
                                placeholder="Describe the work, your role, and the impact"
                                className="min-h-[120px] rounded-xl border-slate-100 bg-slate-50/50 focus:bg-white transition-all text-slate-900 resize-none"
                            />
                            {errors.description && (
                                <p className="text-xs font-medium text-red-500 ml-1">{errors.description.message}</p>
                            )}
                        </div>
                    </div>

                    <div className="flex gap-3 pt-4">
                        <Button
                            type="button"
                            variant="outline"
                            onClick={onClose}
                            className="flex-1 h-12 rounded-xl border-slate-100 font-semibold"
                        >
                            Cancel
                        </Button>
                        <Button
                            type="submit"
                            disabled={updateMutation.isPending}
                            className="flex-[2] h-12 rounded-xl bg-primary hover:bg-primary/90 text-white font-semibold flex items-center gap-2"
                        >
                            {updateMutation.isPending ? (
                                <Loader2 className="w-4 h-4 animate-spin" />
                            ) : (
                                <Save className="w-4 h-4" />
                            )}
                            Save Changes
                        </Button>
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    );
}
