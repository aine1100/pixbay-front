"use client"
import { useState, useMemo, useEffect, useCallback } from "react";
import NextImage from "next/image";
import {
    BadgeCheck,
    Mail,
    Instagram,
    Facebook,
    Twitter,
    MapPin,
    Star,
    MessageSquare,
    DollarSign,
    Briefcase,
    ChevronLeft,
    ChevronRight,
    Share2,
    Heart,
    Calendar,
    X,
    Camera,
    Video
} from "lucide-react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useCreatorProfile } from "@/features/creators/hooks/useCreators";
import { Loading } from "@/components/ui/loading";
import { BookingModal } from "@/features/bookings/components/BookingModal";
import { chatService } from "@/features/chat/services/chat.service";
import { useBookings } from "@/features/bookings/hooks/useBookings";
import { CreateReviewModal } from "@/features/reviews/components/CreateReviewModal";
import { PaymentModal } from "@/features/payment/components/PaymentModal";
import { paymentService } from "@/features/payment/services/payment.service";
import { toast } from "react-hot-toast";
import { useSocket } from "@/features/chat/hooks/useSocket";
import { Clock } from "lucide-react";

export default function CreatorProfilePage() {
    const params = useParams();
    const id = params.id as string;
    const { data: creator, isLoading, isError } = useCreatorProfile(id);

    const [selectedProjectIndex, setSelectedProjectIndex] = useState<number | null>(null);
    const [currentImageIndex, setCurrentImageIndex] = useState(0);
    const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);
    const [reviewingBooking, setReviewingBooking] = useState<{ id: string } | null>(null);
    const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
    const [isPaying, setIsPaying] = useState(false);

    const { data: allBookings, refetch: refetchBookings } = useBookings();
    const { socket } = useSocket();

    // Find a booking that needs payment
    const payableBooking = useMemo(() => {
        if (!allBookings || !creator) return null;
        return allBookings.find((b: any) =>
            b.creatorId === creator.id &&
            b.status === "CONFIRMED" &&
            b.paymentStatus !== "FULLY_PAID"
        );
    }, [allBookings, creator]);

    // Find a completed booking for this specific creator that hasn't been reviewed
    const eligibleBooking = useMemo(() => {
        if (!allBookings || !creator) return null;
        return allBookings.find((b: any) =>
            b.creatorId === creator.id &&
            ["CONFIRMED", "COMPLETED"].includes(b.status)
        );
    }, [allBookings, creator]);

    // Socket.io listener for real-time payment confirmation
    useEffect(() => {
        if (socket && payableBooking) {
            socket.on("payment_completed", (data: any) => {
                if (data.bookingId === payableBooking.id && data.status === "FULLY_PAID") {
                    toast.success("Payment Successful!");
                    refetchBookings();
                    setIsPaying(false);
                    setIsPaymentModalOpen(false);
                }
            });
            return () => { socket.off("payment_completed"); };
        }
    }, [socket, payableBooking, refetchBookings]);

    const initiatePayment = async (payload: any) => {
        if (!payableBooking) return;
        setIsPaying(true);
        try {
            const response = await paymentService.initializePayment(payableBooking.id, payload);
            console.info(`[Payment Flow] Backend Response:`, response);
            
            if (response.success) {
                const { data } = response;

                // Check for payment link (hosted)
                if (data.paymentLink) {
                    window.location.href = data.paymentLink;
                    return;
                }

                // Check for OTP requirement
                if (data.meta?.authorization?.mode === "otp" || data.message?.toLowerCase().includes("otp")) {
                    console.info("[Payment Flow] OTP required, signaling modal...");
                    return { 
                        requiresOtp: true, 
                        flw_ref: data.data?.flw_ref || data.flw_ref 
                    };
                }

                // Check for successful confirmation
                const isConfirmed = data.status === "success" && (data.message === "Charge successful" || data.message === "Charge initiated");
                
                if (isConfirmed) {
                    if (data.message === "Charge initiated" || payload.type === 'momo') {
                        toast.success("Payment initiated. Please confirm on your device.");
                        setIsPaymentModalOpen(false);
                    } else {
                        toast.success("Payment Successful!");
                        refetchBookings();
                        setIsPaymentModalOpen(false);
                    }
                } else {
                    const errorMsg = data.message || response.message || "Payment Failed!";
                    toast.error(errorMsg);
                    console.warn("[Payment Flow] Payment was not confirmed (Unhandleable state):", data);
                }
            } else {
                toast.error(response.message || "Payment Failed!");
            }
        } catch (error: any) {
            console.error("Payment Error:", error);
            toast.error("Payment Failed!");
        } finally {
            setIsPaying(false);
        }
    };

    const handleOtpVerify = async (transactionId: string, otp: string) => {
        try {
            const response = await paymentService.validatePayment(transactionId, otp);
            if (response.success) {
                toast.success("Payment Verified Successfully!");
                refetchBookings();
                setIsPaymentModalOpen(false);
            } else {
                toast.error(response.message || "Verification Failed");
                throw new Error(response.message || "Verification Failed");
            }
        } catch (error: any) {
            toast.error(error.message || "Failed to verify payment");
            throw error;
        }
    };

    // Map backend data to UI-friendly structure
    const displayData = creator ? {
        id: creator.id,
        name: `${creator.user.firstName} ${creator.user.lastName}`,
        role: creator.creatorType === "PHOTOGRAPHER" ? "Photographer" : "Video Creator",
        specialty: creator.specializations?.join(", ") || "Visual Arts",
        rating: Number(creator.averageRating) || 0,
        reviewsCount: creator.totalReviews || 0,
        location: creator.baseCity || creator.user.city || "Rwanda",
        locationDetails: `${creator.baseCity || ""}, ${creator.country || ""}`,
        email: creator.user.email || "Contact via portal",
        socials: {
            instagram: (creator.portfolioLinks as any)?.instagram || "",
            facebook: (creator.portfolioLinks as any)?.facebook || "",
            twitter: (creator.portfolioLinks as any)?.twitter || ""
        },
        pricing: {
            hourly: (creator.pricing as any)?.hourlyRate || 0,
            currency: (creator.pricing as any)?.currency || "RWF"
        },
        joinedDate: new Date(creator.createdAt).toLocaleDateString("en-US", { month: 'long', day: 'numeric', year: 'numeric' }),
        overview: creator.bio || "No overview provided.",
        equipment: (creator.equipment as any[]) || [],
        specializations: creator.specializations || [],
        portfolio: Object.values((creator.portfolioMedia || []).filter((m: any) => m.type !== 'LINK').reduce((acc: any, m: any) => {
            const projectId = (m.metadata as any)?.projectId || `legacy_${m.id}`;
            if (!acc[projectId]) {
                acc[projectId] = {
                    id: projectId,
                    title: (m.metadata as any)?.title || "Work Sample",
                    description: (m.metadata as any)?.description || "Creative showcase item",
                    items: []
                };
            }
            acc[projectId].items.push({
                id: m.id,
                url: m.url,
                type: m.type,
                title: (m.metadata as any)?.title || "Work Sample",
                description: (m.metadata as any)?.description || "Creative showcase item"
            });
            return acc;
        }, {})) as any[],
        externalLinks: (creator.portfolioMedia || []).filter((m: any) => m.type === 'LINK').map((m: any) => ({
            id: m.id,
            url: m.url,
            title: (m.metadata as any)?.title || "Project Link",
            description: (m.metadata as any)?.description || m.url
        })),
        reviews: (creator.user.reviewsReceived || []).map((r: any) => ({
            id: r.id,
            user: `${r.reviewer?.firstName || "Anonymous"} ${r.reviewer?.lastName || "User"}`,
            location: `${r.reviewer?.city || ""}, ${r.reviewer?.country || ""}`,
            date: new Date(r.createdAt).toLocaleDateString(),
            rating: r.rating,
            comment: r.comment,
            avatar: (r.reviewer?.profilePicture && r.reviewer.profilePicture.startsWith('http'))
                ? r.reviewer.profilePicture
                : `https://ui-avatars.com/api/?name=${r.reviewer?.firstName || "A"}+${r.reviewer?.lastName || "U"}&background=random`
        }))
    } : null;

    const nextImage = useCallback(() => {
        if (selectedProjectIndex !== null && displayData && (displayData.portfolio[selectedProjectIndex] as any)?.items.length > 0) {
            const projectItems = (displayData.portfolio[selectedProjectIndex] as any).items;
            setCurrentImageIndex((prev) => (prev + 1) % projectItems.length);
        }
    }, [selectedProjectIndex, displayData]);

    const prevImage = useCallback(() => {
        if (selectedProjectIndex !== null && displayData && (displayData.portfolio[selectedProjectIndex] as any)?.items.length > 0) {
            const projectItems = (displayData.portfolio[selectedProjectIndex] as any).items;
            setCurrentImageIndex((prev) => (prev - 1 + projectItems.length) % projectItems.length);
        }
    }, [selectedProjectIndex, displayData]);

    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (selectedProjectIndex === null) return;
            if (e.key === "Escape") setSelectedProjectIndex(null);
            if (e.key === "ArrowRight") nextImage();
            if (e.key === "ArrowLeft") prevImage();
        };
        window.addEventListener("keydown", handleKeyDown);
        return () => window.removeEventListener("keydown", handleKeyDown);
    }, [selectedProjectIndex, nextImage, prevImage]);

    if (isLoading) return (
        <div className="min-h-[60vh] flex flex-col items-center justify-center bg-transparent">
            <Loading size="lg" />
            <p className="mt-4 text-slate-400 font-medium">Loading ...</p>
        </div>
    );

    if (isError || !displayData) return (
        <div className="min-h-[60vh] flex flex-col items-center justify-center">
            <p className="text-red-500 font-medium text-lg">Failed to load creator profile.</p>
            <Link href="/client/find-creators" className="mt-4 text-primary font-medium hover:underline transition-all">
                Back to discovery
            </Link>
        </div>
    );

    const profilePictureUrl = (creator?.user.profilePicture && creator.user.profilePicture.startsWith('http'))
        ? creator.user.profilePicture
        : `https://ui-avatars.com/api/?name=${creator?.user.firstName}+${creator?.user.lastName}&background=random`;

    return (
        <div className="max-w-[1400px] mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700 pb-20">
            {/* Breadcrumbs/Header */}
            <div className="flex items-center justify-between">
                <Link
                    href="/client/find-creators"
                    className="flex items-center gap-2 text-slate-600 hover:text-primary transition-colors font-medium text-sm"
                >
                    <ChevronLeft className="w-4 h-4" />
                    Back to discovery
                </Link>
                <div className="flex items-center gap-4">
                    <button className="flex items-center gap-2 text-slate-600 hover:text-primary transition-colors font-medium text-sm border border-slate-100 px-4 py-2 rounded-xl bg-white">
                        <Share2 className="w-4 h-4" />
                        Share Profile
                    </button>
                    <button className="flex items-center gap-2 text-slate-600 hover:text-primary transition-colors font-medium text-sm border border-slate-100 px-4 py-2 rounded-xl bg-white">
                        <Heart className="w-4 h-4" />
                        Save to favorites
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                <div className="lg:col-span-4 space-y-6">
                    <div className="bg-white rounded-[32px] border border-slate-100 p-8 space-y-8 shadow-none">
                        <div className="flex flex-col items-center text-center space-y-4">
                            <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-white ring-1 ring-slate-100 relative group">
                                <NextImage
                                    src={profilePictureUrl}
                                    alt={displayData.name}
                                    fill
                                    className="object-cover"
                                />
                            </div>
                            <div>
                                <div className="flex items-center justify-center gap-2">
                                    <h1 className="text-md font-medium text-slate-900">{displayData.name}</h1>
                                    <BadgeCheck className="w-6 h-6 text-blue-500 fill-blue-500/10" />
                                    <div className="w-6 h-5 relative overflow-hidden rounded-sm border border-slate-100">
                                        <NextImage
                                            src="https://flagcdn.com/w40/rw.png"
                                            alt="Rwanda"
                                            fill
                                            className="object-cover"
                                        />
                                    </div>
                                    <span className="text-sm font-medium text-slate-500">{displayData.location}</span>
                                </div>
                                <p className="text-sm font-medium text-slate-600 mt-1 uppercase tracking-wider">
                                    {displayData.role} <span className="text-slate-400">({displayData.specialty})</span>
                                </p>
                            </div>
                            <div className="flex items-center gap-6 pt-2">
                                <div className="flex items-center gap-1.5">
                                    <div className="flex items-center text-yellow-500">
                                        {[...Array(5)].map((_, i) => (
                                            <Star key={i} className={`w-5 h-5 ${i < Math.floor(displayData.rating) ? "fill-current" : "text-yellow-500/10 fill-current"}`} />
                                        ))}
                                    </div>
                                    <span className="text-xl font-medium text-slate-900">{displayData.rating.toFixed(1)}</span>
                                </div>
                                <div className="flex items-center gap-2 text-slate-700">
                                    <MessageSquare className="w-5 h-5 text-slate-400" />
                                    <span className="text-xl font-medium">{displayData.reviewsCount}</span>
                                </div>

                            </div>
                            {eligibleBooking && (
                                <button
                                    onClick={() => setReviewingBooking({ id: eligibleBooking.id })}
                                    className="flex items-center gap-2 px-4 py-2 bg-green-50 text-green-600 rounded-xl text-xs font-medium tracking-wider hover:bg-green-100 transition-all border border-green-100"
                                >
                                    Add Review
                                </button>
                            )}
                        </div>

                        {/* More About Me Section */}
                        <div className="space-y-6 pt-6 border-t border-slate-50">
                            <h3 className="text-sm font-medium text-slate-900 uppercase tracking-widest">More About Me</h3>

                            <div className="space-y-3">
                                <div className="flex items-center gap-4 text-slate-600 hover:text-primary transition-colors cursor-pointer group">
                                    <div className="w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center group-hover:bg-primary/5 transition-colors">
                                        <Mail className="w-5 h-5" />
                                    </div>
                                    <span className="text-sm font-medium">{displayData.email}</span>
                                </div>
                                {displayData.socials.instagram && (
                                    <div className="flex items-center gap-4 text-slate-600 hover:text-primary transition-colors cursor-pointer group">
                                        <div className="w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center group-hover:bg-primary/5 transition-colors">
                                            <Instagram className="w-5 h-5" />
                                        </div>
                                        <span className="text-sm font-medium">{displayData.socials.instagram}</span>
                                    </div>
                                )}
                                {displayData.socials.facebook && (
                                    <div className="flex items-center gap-4 text-slate-600 hover:text-primary transition-colors cursor-pointer group">
                                        <div className="w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center group-hover:bg-primary/5 transition-colors">
                                            <Facebook className="w-5 h-5" />
                                        </div>
                                        <span className="text-sm font-medium">{displayData.socials.facebook}</span>
                                    </div>
                                )}
                                {displayData.socials.twitter && (
                                    <div className="flex items-center gap-4 text-slate-600 hover:text-primary transition-colors cursor-pointer group">
                                        <div className="w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center group-hover:bg-primary/5 transition-colors">
                                            <Twitter className="w-5 h-5" />
                                        </div>
                                        <span className="text-sm font-medium">{displayData.socials.twitter}</span>
                                    </div>
                                )}
                                <div className="flex items-center gap-4 text-slate-600 hover:text-primary transition-colors cursor-pointer group">
                                    <div className="w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center group-hover:bg-primary/5 transition-colors">
                                        <MapPin className="w-5 h-5" />
                                    </div>
                                    <span className="text-sm font-medium">{displayData.locationDetails}</span>
                                </div>
                            </div>
                        </div>

                        {/* Pricing Details */}
                        <div className="pt-6 border-t border-slate-50">
                            <div className="space-y-4">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-2">
                                        <DollarSign className="w-4 h-4 text-slate-400" />
                                        <span className="text-sm font-medium text-slate-600">Starting Rate</span>
                                    </div>
                                    <span className="text-md font-medium text-slate-900">{displayData.pricing.currency} {displayData.pricing.hourly.toLocaleString()} / hr</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <Calendar className="w-4 h-4 text-slate-400" />
                                    <span className="text-sm font-medium text-slate-600">Joined {displayData.joinedDate}</span>
                                </div>
                            </div>
                        </div>

                        {/* CTA */}
                        <div className="space-y-4">
                            {payableBooking ? (
                                <button
                                    onClick={() => setIsPaymentModalOpen(true)}
                                    disabled={isPaying}
                                    className="w-full h-14 bg-primary text-white rounded-2xl font-medium text-sm uppercase tracking-widest hover:bg-primary/90 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
                                >
                                    {isPaying ? <Clock className="w-4 h-4 animate-spin" /> : <DollarSign className="w-4 h-4" />}
                                    Complete Payment
                                </button>
                            ) : (
                                <button
                                    onClick={() => setIsBookingModalOpen(true)}
                                    className="w-full h-14 bg-primary text-white rounded-2xl font-medium text-sm uppercase tracking-widest hover:bg-primary/90 transition-all active:scale-95"
                                >
                                    Book creator now
                                </button>
                            )}
                            <button
                                onClick={async () => {
                                    try {
                                        const chat = await chatService.initiateChat(creator.user.id);
                                        window.location.href = `/client/messages?chatId=${chat.id}`;
                                    } catch (error) {
                                        console.error("Failed to initiate chat:", error);
                                    }
                                }}
                                className="w-full h-14 bg-slate-50 border border-slate-100 text-slate-900 rounded-2xl font-medium text-sm uppercase tracking-widest hover:bg-slate-100 transition-all active:scale-95"
                            >
                                Message creator
                            </button>
                        </div>
                    </div>
                </div>

                {/* RIGHT COLUMN: Details Section */}
                <div className="lg:col-span-8 space-y-8">
                    {/* Overview */}
                    <section className="bg-white rounded-[32px] border border-slate-100 p-8 space-y-6">
                        <h2 className="text-xl font-medium text-slate-900">Overview</h2>
                        <p className="text-slate-600 leading-relaxed font-medium">
                            {displayData.overview}
                        </p>

                        {displayData.specializations.length > 0 && (
                            <div className="flex flex-wrap gap-2 pt-2">
                                {displayData.specializations.map((spec: string) => (
                                    <span key={spec} className="px-3 py-1 bg-slate-50 text-slate-600 rounded-full text-xs font-medium uppercase tracking-wider border border-slate-100">
                                        {spec}
                                    </span>
                                ))}
                            </div>
                        )}
                    </section>

                    {/* Equipment section */}
                    {displayData.equipment.length > 0 && (
                        <section className="bg-white rounded-[32px] border border-slate-100 p-8 space-y-6">
                            <h2 className="text-xl font-medium text-slate-900">Professional Gear</h2>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                {displayData.equipment.map((item: any, i: number) => (
                                    <div key={i} className="flex items-center gap-4 p-4 bg-slate-50/50 rounded-2xl border border-slate-100">
                                        <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center border border-slate-100">
                                            {displayData.role === "Photographer" ? <Camera className="w-5 h-5 text-primary" /> : <Video className="w-5 h-5 text-primary" />}
                                        </div>
                                        <div>
                                            <p className="text-xs font-medium text-slate-400 uppercase tracking-tighter">{item.brand || "Professional"}</p>
                                            <p className="text-sm font-medium text-slate-900">{item.name}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </section>
                    )}

                    {/* External Links Section */}
                    {displayData.externalLinks.length > 0 && (
                        <section className="bg-white rounded-[32px] border border-slate-100 p-8 space-y-8">
                            <h2 className="text-xl font-medium text-slate-900">External Works & Links</h2>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {displayData.externalLinks.map((link: any) => (
                                    <a
                                        key={link.id}
                                        href={link.url}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="flex items-center gap-4 p-5 bg-slate-50/30 rounded-2xl border border-slate-100 hover:border-primary/20 hover:bg-slate-50 transition-all group"
                                    >
                                        <div className="w-12 h-12 rounded-xl bg-white flex items-center justify-center border border-slate-100 group-hover:scale-105 transition-transform">
                                            <Share2 className="w-6 h-6 text-primary" />
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <h4 className="font-medium text-slate-900 truncate">{link.title}</h4>
                                            <p className="text-xs text-slate-500 font-medium truncate">{link.description}</p>
                                        </div>
                                        <div className="text-slate-300 group-hover:text-primary transition-colors">
                                            <ChevronRight className="w-5 h-5" />
                                        </div>
                                    </a>
                                ))}
                            </div>
                        </section>
                    )}

                    {/* Portfolio */}
                    <section className="bg-white rounded-[32px] border border-slate-100 p-8 space-y-8">
                        <div className="flex items-center justify-between">
                            <h2 className="text-xl font-medium text-slate-900">Portfolio</h2>
                            {displayData.portfolio.length > 6 && (
                                <button className="text-sm font-medium text-primary hover:underline">View all work</button>
                            )}
                        </div>

                        {displayData.portfolio.length > 0 ? (
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {displayData.portfolio.map((project: any, index: number) => {
                                    const coverItem = project.items[0];
                                    return (
                                        <div
                                            key={project.id}
                                            onClick={() => {
                                                setSelectedProjectIndex(index);
                                                setCurrentImageIndex(0);
                                            }}
                                            className="group relative rounded-2xl overflow-hidden aspect-[4/3] bg-slate-100 border border-slate-100 transition-all hover:border-primary/20 cursor-pointer"
                                        >
                                            {coverItem.type === 'VIDEO' ? (
                                                <div className="relative w-full h-full">
                                                    <video
                                                        src={coverItem.url}
                                                        className="w-full h-full object-cover"
                                                        muted
                                                        loop
                                                        playsInline
                                                    />
                                                    <div className="absolute top-4 right-4 w-10 h-10 rounded-full bg-black/40 backdrop-blur-md flex items-center justify-center">
                                                        <Video className="w-5 h-5 text-white" />
                                                    </div>
                                                </div>
                                            ) : (
                                                <NextImage
                                                    src={coverItem.url}
                                                    alt={project.title}
                                                    fill
                                                    className="object-cover transition-transform duration-500 group-hover:scale-110"
                                                />
                                            )}

                                            {/* Multi-item Badge */}
                                            {project.items.length > 1 && (
                                                <div className="absolute top-4 right-4 px-3 py-1.5 bg-black/40 backdrop-blur-md rounded-full border border-white/10 flex items-center gap-2 z-10">
                                                    <Camera className="w-3.5 h-3.5 text-white" />
                                                    <span className="text-[11px] font-bold text-white leading-none">{project.items.length} Files</span>
                                                </div>
                                            )}

                                            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent flex flex-col justify-end p-6 opacity-0 group-hover:opacity-100 transition-opacity">
                                                <div className="flex items-center justify-between mb-1">
                                                    <h3 className="text-white font-medium text-lg">{project.title}</h3>
                                                </div>
                                                <p className="text-white/80 text-xs line-clamp-2 leading-relaxed font-medium">
                                                    {project.description}
                                                </p>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        ) : (
                            <div className="py-20 flex flex-col items-center justify-center bg-slate-50/50 rounded-3xl border border-dashed border-slate-200">
                                <Briefcase className="w-12 h-12 text-slate-200 mb-4" />
                                <p className="text-slate-400 font-medium text-sm">No portfolio items uploaded yet.</p>
                            </div>
                        )}
                    </section>

                    {/* Reviews */}
                    <section className="bg-white rounded-[32px] border border-slate-100 p-8 space-y-8">
                        <div className="flex items-center gap-4 pb-4 border-b border-slate-50">
                            <div className="flex items-center gap-2">
                                <Star className="w-6 h-6 fill-yellow-500 text-yellow-500" />
                                <span className="text-2xl font-medium text-slate-900">{displayData.rating.toFixed(1)}</span>
                            </div>
                            <span className="text-slate-200">|</span>
                            <span className="text-xl font-medium text-slate-700">{displayData.reviewsCount} Reviews</span>
                        </div>

                        {displayData.reviews.length > 0 ? (
                            <div className="space-y-6">
                                {displayData.reviews.map((review: any) => (
                                    <div key={review.id} className="p-6 rounded-2xl bg-slate-50/50 border border-slate-100 space-y-4">
                                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                                            <div className="flex items-center gap-3">
                                                <div className="w-12 h-12 rounded-xl border border-slate-100 overflow-hidden relative">
                                                    <NextImage
                                                        src={review.avatar}
                                                        alt={review.user}
                                                        fill
                                                        className="object-cover"
                                                    />
                                                </div>
                                                <div>
                                                    <h4 className="font-medium text-slate-900">{review.user}</h4>
                                                    <p className="text-[11px] font-medium text-slate-500">{review.location} • {review.date}</p>
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-1">
                                                {[...Array(5)].map((_, i) => (
                                                    <Star key={i} className={`w-4 h-4 ${i < Math.floor(review.rating) ? "fill-yellow-500 text-yellow-500" : "fill-slate-200 text-slate-200"}`} />
                                                ))}
                                            </div>
                                        </div>
                                        <p className="text-sm text-slate-600 leading-relaxed font-medium">
                                            {review.comment}
                                        </p>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="py-20 flex flex-col items-center justify-center">
                                <Star className="w-12 h-12 text-slate-100 mb-4" />
                                <p className="text-slate-400 font-medium text-sm">No reviews yet for this creator.</p>
                            </div>
                        )}
                    </section>
                </div>
            </div>

            {/* Portfolio Project Gallery Lightbox */}
            {selectedProjectIndex !== null && displayData && displayData.portfolio[selectedProjectIndex] && (
                <div
                    className="fixed inset-0 z-[100] bg-black/95 flex flex-col items-center justify-center animate-in fade-in duration-300"
                    onClick={() => setSelectedProjectIndex(null)}
                >
                    {/* Header: Title & Close */}
                    <div className="absolute top-0 inset-x-0 p-8 flex items-center justify-between z-50">
                        <div className="flex flex-col">
                            <h3 className="text-white text-2xl font-medium">{(displayData.portfolio[selectedProjectIndex] as any).title}</h3>
                            <p className="text-white/50 text-sm font-medium">
                                {(displayData.portfolio[selectedProjectIndex] as any).items[currentImageIndex]?.title || "Work Sample"} • Item {currentImageIndex + 1} of {(displayData.portfolio[selectedProjectIndex] as any).items.length}
                            </p>
                        </div>
                        <button
                            className="p-3 bg-white/10 hover:bg-white/20 rounded-full text-white transition-all active:scale-95"
                            onClick={(e) => { e.stopPropagation(); setSelectedProjectIndex(null); }}
                        >
                            <X className="w-6 h-6" />
                        </button>
                    </div>

                    {/* Main Carousel Area */}
                    <div className="relative w-full h-[60vh] flex items-center justify-center gap-8 px-4" onClick={(e) => e.stopPropagation()}>
                        {/* Navigation Arrows (Only if more than one image) */}
                        {(displayData.portfolio[selectedProjectIndex] as any).items.length > 1 && (
                            <>
                                <button
                                    className="absolute left-10 p-4 bg-white/5 hover:bg-white/10 rounded-full text-white transition-all z-50 border border-white/10 active:scale-90"
                                    onClick={prevImage}
                                >
                                    <ChevronLeft className="w-8 h-8" />
                                </button>

                                <button
                                    className="absolute right-10 p-4 bg-white/5 hover:bg-white/10 rounded-full text-white transition-all z-50 border border-white/10 active:scale-90"
                                    onClick={nextImage}
                                >
                                    <ChevronRight className="w-8 h-8" />
                                </button>
                            </>
                        )}

                        {/* Active Content */}
                        <div className="relative w-full lg:w-[60%] h-full rounded-[32px] overflow-hidden shadow-2xl animate-in zoom-in-95 duration-500">
                            {(displayData.portfolio[selectedProjectIndex] as any).items[currentImageIndex]?.type === 'VIDEO' ? (
                                <video
                                    src={(displayData.portfolio[selectedProjectIndex] as any).items[currentImageIndex].url}
                                    className="w-full h-full object-contain"
                                    controls
                                    autoPlay
                                />
                            ) : (
                                <NextImage
                                    src={(displayData.portfolio[selectedProjectIndex] as any).items[currentImageIndex].url}
                                    alt={(displayData.portfolio[selectedProjectIndex] as any).items[currentImageIndex].title}
                                    fill
                                    className="object-contain"
                                    priority
                                />
                            )}
                        </div>
                    </div>

                    {/* Footer Info & Thumbnails */}
                    <div className="absolute bottom-10 inset-x-0 flex flex-col items-center gap-8 px-8" onClick={(e) => e.stopPropagation()}>
                        <div className="max-w-3xl text-center">
                            <p className="text-white/80 text-lg leading-relaxed font-medium line-clamp-2">
                                {(displayData.portfolio[selectedProjectIndex] as any).items[currentImageIndex]?.description}
                            </p>
                        </div>

                        {(displayData.portfolio[selectedProjectIndex] as any).items.length > 1 && (
                            <div className="flex gap-2">
                                {(displayData.portfolio[selectedProjectIndex] as any).items.map((_: any, index: number) => (
                                    <button
                                        key={index}
                                        onClick={() => setCurrentImageIndex(index)}
                                        className={`transition-all duration-500 rounded-full ${index === currentImageIndex ? "w-10 h-1.5 bg-primary" : "w-1.5 h-1.5 bg-white/20 hover:bg-white/40"}`}
                                    />
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            )}

            {/* Booking Modal */}
            {displayData && (
                <BookingModal
                    isOpen={isBookingModalOpen}
                    onClose={() => setIsBookingModalOpen(false)}
                    creator={{
                        id: displayData.id,
                        name: displayData.name,
                        pricing: displayData.pricing,
                        category: displayData.role
                    }}
                />
            )}

            {/* Create Review Modal */}
            {eligibleBooking && (
                <CreateReviewModal
                    isOpen={!!reviewingBooking}
                    onClose={() => setReviewingBooking(null)}
                    bookingId={eligibleBooking.id}
                    creatorName={displayData.name}
                />
            )}

            {payableBooking && (
                <PaymentModal
                    isOpen={isPaymentModalOpen}
                    onClose={() => setIsPaymentModalOpen(false)}
                    onPaymentInitiate={initiatePayment}
                    onOtpVerify={handleOtpVerify}
                    bookingDetails={{
                        id: payableBooking.id,
                        amount: payableBooking.pricing?.totalAmount || 0,
                        currency: payableBooking.pricing?.currency || "RWF",
                        type: payableBooking.category || "Booking Payment"
                    }}
                />
            )}
        </div>
    );
}
