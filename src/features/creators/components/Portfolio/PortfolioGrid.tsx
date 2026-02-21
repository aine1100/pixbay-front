import { X, ChevronLeft, ChevronRight, Play, FileText, Link as LinkIcon, Camera, Trash2, Loader2, Pencil, Save } from "lucide-react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { creatorService } from "../../services/creator.service";
import { toast } from "react-hot-toast";
import { useCallback, useEffect, useState } from "react";
import NextImage from "next/image";
import { EditWorkModal } from "./EditWorkModal";
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@/components/ui/alert-dialog";


interface PortfolioMedia {
    id: string;
    type: string; // "IMAGE", "VIDEO", "DOCUMENT", "LINK"
    url: string;
    metadata?: any;
}

interface PortfolioGridProps {
    items: PortfolioMedia[];
}

interface GroupedProject {
    id: string;
    title: string;
    description: string;
    items: PortfolioMedia[];
}

export function PortfolioGrid({ items }: PortfolioGridProps) {
    const queryClient = useQueryClient();
    const [selectedProjectIndex, setSelectedProjectIndex] = useState<number | null>(null);
    const [currentImageIndex, setCurrentImageIndex] = useState(0);
    const [itemToDelete, setItemToDelete] = useState<string | null>(null);
    const [itemToEdit, setItemToEdit] = useState<any | null>(null);

    const deleteMutation = useMutation({
        mutationFn: (id: string) => creatorService.deletePortfolioItem(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["profile"] });
            toast.success("Work deleted successfully");
            setItemToDelete(null);
        },
        onError: (error: any) => {
            toast.error(error.message || "Failed to delete work");
        }
    });

    const handleDelete = (e: React.MouseEvent, id: string) => {
        e.stopPropagation();
        setItemToDelete(id);
    };

    const confirmDelete = () => {
        if (itemToDelete) {
            deleteMutation.mutate(itemToDelete);
        }
    };

    // Grouping logic similar to client-side
    const groupedMedia = Object.values((items || []).filter(m => m.type === 'IMAGE' || m.type === 'VIDEO').reduce((acc: Record<string, GroupedProject>, m: PortfolioMedia) => {
        const projectId = (m.metadata as any)?.projectId || `legacy_${m.id}`;
        if (!acc[projectId]) {
            acc[projectId] = {
                id: projectId,
                title: (m.metadata as any)?.title || "Work Sample",
                description: (m.metadata as any)?.description || "Creative showcase item",
                items: []
            };
        }
        acc[projectId].items.push(m);
        return acc;
    }, {})) as GroupedProject[];

    const linkItems = items.filter(item => item.type === "LINK");
    const documentItems = items.filter(item => item.type === "DOCUMENT");

    const nextItem = useCallback(() => {
        if (selectedProjectIndex !== null && groupedMedia[selectedProjectIndex]) {
            const projectItems = groupedMedia[selectedProjectIndex].items;
            setCurrentImageIndex((prev) => (prev + 1) % projectItems.length);
        }
    }, [selectedProjectIndex, groupedMedia]);

    const prevItem = useCallback(() => {
        if (selectedProjectIndex !== null && groupedMedia[selectedProjectIndex]) {
            const projectItems = groupedMedia[selectedProjectIndex].items;
            setCurrentImageIndex((prev) => (prev - 1 + projectItems.length) % projectItems.length);
        }
    }, [selectedProjectIndex, groupedMedia]);

    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (selectedProjectIndex === null) return;
            if (e.key === "Escape") setSelectedProjectIndex(null);
            if (e.key === "ArrowRight") nextItem();
            if (e.key === "ArrowLeft") prevItem();
        };
        window.addEventListener("keydown", handleKeyDown);
        return () => window.removeEventListener("keydown", handleKeyDown);
    }, [selectedProjectIndex, nextItem, prevItem]);

    if (!items || items.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center py-20 border-2 border-dashed border-slate-100 rounded-[32px] bg-white">
                <div className="w-16 h-16 rounded-full bg-slate-50 flex items-center justify-center mb-4">
                    <FileText className="w-8 h-8 text-slate-300" />
                </div>
                <h3 className="text-lg font-semibold text-slate-900">No work added yet</h3>
                <p className="text-slate-500 text-sm mt-1">Start by adding your first project or link.</p>
            </div>
        );
    }

    return (
        <div className="space-y-12">
            {/* Visual Media Section */}
            {groupedMedia.length > 0 ? (
                <div className="space-y-6">
                    <h3 className="text-sm font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2">
                        Visual Portfolio
                        <span className="h-px bg-slate-100 flex-1" />
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {groupedMedia.map((project: any, index: number) => {
                            const coverItem = project.items[0];
                            return (
                                <div
                                    key={project.id}
                                    onClick={() => {
                                        setSelectedProjectIndex(index);
                                        setCurrentImageIndex(0);
                                    }}
                                    className="group relative rounded-[24px] overflow-hidden aspect-[4/3] bg-slate-100 border border-slate-100 transition-all hover:border-primary/20 cursor-pointer"
                                >
                                    {coverItem.type === "IMAGE" && (
                                        <NextImage
                                            src={coverItem.url}
                                            alt={project.title}
                                            fill
                                            className="object-cover transition-transform duration-500 group-hover:scale-110"
                                        />
                                    )}
                                    {coverItem.type === "VIDEO" && (
                                        <div className="relative w-full h-full">
                                            <video
                                                src={coverItem.url}
                                                className="w-full h-full object-cover"
                                                muted
                                                loop
                                                playsInline
                                            />
                                            <div className="absolute inset-0 flex items-center justify-center bg-black/20">
                                                <Play className="w-12 h-12 text-white/80" />
                                            </div>
                                        </div>
                                    )}

                                    {/* Multi-item Badge */}
                                    {project.items.length > 1 ? (
                                        <div className="absolute top-4 right-4 px-3 py-1.5 bg-black/40 backdrop-blur-md rounded-full border border-white/10 flex items-center gap-2 z-10">
                                            <Camera className="w-3.5 h-3.5 text-white" />
                                            <span className="text-[11px] font-bold text-white leading-none">{project.items.length} Files</span>
                                        </div>
                                    ) : null}

                                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent flex flex-col justify-end p-6 opacity-0 group-hover:opacity-100 transition-opacity">
                                        <div className="flex items-center justify-between gap-4 mb-1">
                                            <h4 className="text-white font-semibold text-lg truncate flex-1">{project.title}</h4>
                                            <div className="flex items-center gap-2">
                                                <button
                                                    onClick={(e) => { e.stopPropagation(); setItemToEdit(coverItem); }}
                                                    className="p-2 bg-white/20 hover:bg-white text-white hover:text-primary rounded-lg backdrop-blur-md transition-all hover:scale-110"
                                                    title="Edit details"
                                                >
                                                    <Pencil className="w-4 h-4" />
                                                </button>
                                                <button
                                                    onClick={(e) => handleDelete(e, coverItem.id)}
                                                    className="p-2 bg-red-500/20 hover:bg-red-500 text-red-100 rounded-lg backdrop-blur-md transition-all hover:scale-110"
                                                    title="Delete this project item"
                                                >
                                                    <Trash2 className="w-4 h-4" />
                                                </button>
                                            </div>
                                        </div>
                                        <p className="text-white/70 text-xs line-clamp-1">{project.description}</p>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            ) : null}

            {linkItems.length > 0 || documentItems.length > 0 ? (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 pt-4">
                    {/* Links Section */}
                    {linkItems.length > 0 ? (
                        <div className="space-y-6">
                            <h3 className="text-sm font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2">
                                External Works
                                <span className="h-px bg-slate-100 flex-1" />
                            </h3>
                            <div className="space-y-3">
                                {linkItems.map((item) => (
                                    <a
                                        key={item.id}
                                        href={item.url}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="flex items-center gap-4 p-4 bg-slate-50/50 rounded-2xl border border-slate-100 hover:border-primary/20 hover:bg-white hover:shadow-sm transition-all group"
                                    >
                                        <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center border border-slate-100 group-hover:bg-primary/5 group-hover:border-primary/20 transition-all">
                                            <LinkIcon className="w-5 h-5 text-primary" />
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <h4 className="text-sm font-semibold text-slate-900 truncate">{(item.metadata as any)?.title || "Project Link"}</h4>
                                            <p className="text-[11px] text-slate-500 font-medium truncate">{item.url}</p>
                                        </div>
                                        <div className="flex items-center gap-1">
                                            <button
                                                onClick={(e) => { e.preventDefault(); e.stopPropagation(); setItemToEdit(item); }}
                                                className="p-2 text-slate-400 hover:text-primary hover:bg-blue-50 rounded-lg transition-all"
                                                title="Edit"
                                            >
                                                <Pencil className="w-4 h-4" />
                                            </button>
                                            <button
                                                onClick={(e) => { e.preventDefault(); handleDelete(e, item.id); }}
                                                className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all"
                                                title="Delete"
                                            >
                                                <Trash2 className="w-4 h-4" />
                                            </button>
                                        </div>
                                        <ChevronRight className="w-4 h-4 text-slate-300 group-hover:text-primary transition-colors" />
                                    </a>
                                ))}
                            </div>
                        </div>
                    ) : null}

                    {/* Documents Section */}
                    {documentItems.length > 0 ? (
                        <div className="space-y-6">
                            <h3 className="text-sm font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2">
                                Documents & CVs
                                <span className="h-px bg-slate-100 flex-1" />
                            </h3>
                            <div className="space-y-3">
                                {documentItems.map((item) => (
                                    <a
                                        key={item.id}
                                        href={item.url}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="flex items-center gap-4 p-4 bg-slate-50/50 rounded-2xl border border-slate-100 hover:border-primary/20 hover:bg-white hover:shadow-sm transition-all group"
                                    >
                                        <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center border border-slate-100 group-hover:bg-primary/5 group-hover:border-primary/20 transition-all">
                                            <FileText className="w-5 h-5 text-blue-500" />
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <h4 className="text-sm font-semibold text-slate-900 truncate">{(item.metadata as any)?.originalName || "Portfolio Document"}</h4>
                                            <p className="text-[11px] text-slate-500 font-medium truncate">PDF / DOCX</p>
                                        </div>
                                        <div className="flex items-center gap-1">
                                            <button
                                                onClick={(e) => { e.preventDefault(); e.stopPropagation(); setItemToEdit(item); }}
                                                className="p-2 text-slate-400 hover:text-primary hover:bg-blue-50 rounded-lg transition-all"
                                                title="Edit"
                                            >
                                                <Pencil className="w-4 h-4" />
                                            </button>
                                            <button
                                                onClick={(e) => { e.preventDefault(); handleDelete(e, item.id); }}
                                                className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all"
                                                title="Delete"
                                            >
                                                <Trash2 className="w-4 h-4" />
                                            </button>
                                        </div>
                                        <ChevronRight className="w-4 h-4 text-slate-300 group-hover:text-primary transition-colors" />
                                    </a>
                                ))}
                            </div>
                        </div>
                    ) : null}
                </div>
            ) : null}

            {/* Lightbox */}
            {selectedProjectIndex !== null && groupedMedia[selectedProjectIndex] ? (
                <div
                    className="fixed inset-0 z-[100] bg-black/95 flex flex-col items-center justify-center animate-in fade-in duration-300"
                    onClick={() => setSelectedProjectIndex(null)}
                >
                    <div className="absolute top-0 inset-x-0 p-8 flex items-center justify-between z-50">
                        <div className="flex flex-col">
                            <h3 className="text-white text-xl font-semibold">{groupedMedia[selectedProjectIndex].title}</h3>
                            <p className="text-white/50 text-sm font-medium">
                                Item {currentImageIndex + 1} of {groupedMedia[selectedProjectIndex].items.length}
                            </p>
                        </div>
                        <div className="flex items-center gap-3">
                            <button
                                className="p-3 bg-white/10 hover:bg-white text-white hover:text-primary rounded-full transition-all active:scale-95"
                                onClick={(e) => {
                                    e.stopPropagation();
                                    setItemToEdit(groupedMedia[selectedProjectIndex].items[currentImageIndex]);
                                }}
                                title="Edit details"
                            >
                                <Pencil className="w-5 h-5" />
                            </button>
                            <button
                                className="p-3 bg-red-500/20 hover:bg-red-500 rounded-full text-white transition-all active:scale-95"
                                onClick={(e) => {
                                    e.stopPropagation();
                                    handleDelete(e, groupedMedia[selectedProjectIndex].items[currentImageIndex].id);
                                }}
                                title="Delete this item"
                            >
                                <Trash2 className="w-5 h-5" />
                            </button>
                            <button
                                className="p-3 bg-white/10 hover:bg-white/20 rounded-full text-white transition-all active:scale-95"
                                onClick={(e) => { e.stopPropagation(); setSelectedProjectIndex(null); }}
                            >
                                <X className="w-6 h-6" />
                            </button>
                        </div>
                    </div>

                    <div className="relative w-full h-[70vh] flex items-center justify-center gap-8 px-4" onClick={(e) => e.stopPropagation()}>
                        {groupedMedia[selectedProjectIndex].items.length > 1 ? (
                            <>
                                <button
                                    className="absolute left-10 p-4 bg-white/5 hover:bg-white/10 rounded-full text-white transition-all z-50 border border-white/10 active:scale-90"
                                    onClick={prevItem}
                                >
                                    <ChevronLeft className="w-8 h-8" />
                                </button>
                                <button
                                    className="absolute right-10 p-4 bg-white/5 hover:bg-white/10 rounded-full text-white transition-all z-50 border border-white/10 active:scale-90"
                                    onClick={nextItem}
                                >
                                    <ChevronRight className="w-8 h-8" />
                                </button>
                            </>
                        ) : null}

                        <div className="relative w-full max-w-5xl h-full rounded-[32px] overflow-hidden shadow-2xl animate-in zoom-in-95 duration-500">
                            {groupedMedia[selectedProjectIndex].items[currentImageIndex].type === "IMAGE" ? (
                                <NextImage
                                    src={groupedMedia[selectedProjectIndex].items[currentImageIndex].url}
                                    alt="Portfolio item"
                                    fill
                                    className="object-contain"
                                    priority
                                />
                            ) : null}
                            {groupedMedia[selectedProjectIndex].items[currentImageIndex].type === "VIDEO" ? (
                                <div className="w-full h-full bg-slate-900 flex items-center justify-center">
                                    <video
                                        src={groupedMedia[selectedProjectIndex].items[currentImageIndex].url}
                                        controls
                                        className="max-w-full max-h-full"
                                        autoPlay
                                    />
                                </div>
                            ) : null}
                        </div>
                    </div>

                    {/* Footer Info */}
                    <div className="absolute bottom-10 inset-x-0 flex flex-col items-center gap-8 px-8" onClick={(e) => e.stopPropagation()}>
                        <div className="max-w-3xl text-center">
                            <p className="text-white/80 text-lg leading-relaxed font-medium line-clamp-2">
                                {groupedMedia[selectedProjectIndex].items[currentImageIndex]?.metadata?.description || groupedMedia[selectedProjectIndex].description}
                            </p>
                        </div>

                        {groupedMedia[selectedProjectIndex].items.length > 1 ? (
                            <div className="flex gap-2">
                                {groupedMedia[selectedProjectIndex].items.map((_: any, index: number) => (
                                    <button
                                        key={index}
                                        onClick={() => setCurrentImageIndex(index)}
                                        className={`transition-all duration-500 rounded-full ${index === currentImageIndex ? "w-10 h-1.5 bg-primary" : "w-1.5 h-1.5 bg-white/20 hover:bg-white/40"}`}
                                    />
                                ))}
                            </div>
                        ) : null}
                    </div>
                </div>
            ) : null}

            {/* Delete Confirmation */}
            <AlertDialog open={!!itemToDelete} onOpenChange={(open) => !open && setItemToDelete(null)}>
                <AlertDialogContent className="rounded-[32px] border-slate-100 bg-white">
                    <AlertDialogHeader>
                        <AlertDialogTitle className="text-xl font-bold text-slate-900">Remove from Portfolio?</AlertDialogTitle>
                        <AlertDialogDescription className="text-slate-500 font-medium">
                            This action cannot be undone. This work sample will be permanently removed from your profile.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter className="gap-2 pt-4">
                        <AlertDialogCancel className="rounded-xl border-slate-100 font-semibold h-11 px-6 hover:bg-slate-50">
                            Cancel
                        </AlertDialogCancel>
                        <AlertDialogAction
                            onClick={confirmDelete}
                            disabled={deleteMutation.isPending}
                            className="rounded-xl bg-red-500 hover:bg-red-600 text-white font-semibold h-11 px-6 flex items-center gap-2"
                        >
                            {deleteMutation.isPending && <Loader2 className="w-4 h-4 animate-spin" />}
                            Delete Permanently
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>

            {/* Edit Modal */}
            <EditWorkModal
                isOpen={!!itemToEdit}
                onClose={() => setItemToEdit(null)}
                item={itemToEdit}
            />
        </div>
    );
}
