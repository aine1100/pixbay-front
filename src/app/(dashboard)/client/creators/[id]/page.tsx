"use client"
import { useState, useEffect, useCallback } from "react";
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
    X
} from "lucide-react";
import Link from "next/link";
import { useParams } from "next/navigation";

// Mock data (expanded for multi-image gallery)
const CREATOR_DATA = {
    id: "1",
    name: "Yvan SHEMA",
    role: "Photographer",
    specialty: "Weddings, professional shots",
    rating: 4.5,
    reviewsCount: 25,
    location: "Musanze, Rwanda",
    locationDetails: "Kinigi, Musanze",
    email: "yvanshema@gmail.com",
    socials: {
        instagram: "yvanshema_1",
        facebook: "yvanshema_1",
        twitter: "yvanshema_1"
    },
    pricing: {
        hourly: 20,
        fixed: 100,
        project: 300
    },
    joinedDate: "March 12, 2025",
    overview: "I'm a portrait and corporate photographer helping professionals present themselves with confidence. My work is clean, well-lit, and intentional, designed to create strong first impressions for websites, LinkedIn, and marketing materials.",
    portfolio: [
        {
            id: "p1",
            title: "Tina & Cedro's wedding",
            description: "I captured the most breathtaking moments for this wonderful events for the two love birds.",
            images: [
                "https://images.unsplash.com/photo-1519741497674-611481863552?q=80&w=800",
                "https://images.unsplash.com/photo-1511795409834-ef04bbd61622?q=80&w=800",
                "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?q=80&w=800",
                "https://images.unsplash.com/photo-1519741497674-611481863552?q=80&w=800"
            ]
        },
        {
            id: "p2",
            title: "Her Future Summit",
            description: "Captured the most rememberable moments from Her Future Summit 2025",
            images: [
                "https://images.unsplash.com/photo-1511795409834-ef04bbd61622?q=80&w=800",
                "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?q=80&w=800",
                "https://images.unsplash.com/photo-1519741497674-611481863552?q=80&w=800"
            ]
        },
        {
            id: "p3",
            title: "Product Launch",
            description: "Professional product photography for a high-end tech startup.",
            images: [
                "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?q=80&w=800",
                "https://images.unsplash.com/photo-1519741497674-611481863552?q=80&w=800"
            ]
        }
    ],
    reviews: [
        {
            id: "r1",
            user: "Tina",
            location: "Musanze, Rwanda",
            date: "1 week ago",
            rating: 4.5,
            comment: "From start to finish, the experience was excellent. Mr Yvan made the session easy and comfortable, and the final images exceeded our expectations. Communication was clear, turnaround was fast, and the quality was consistently high. It's easy to see why they come so highly recommended.",
            avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=150"
        },
        {
            id: "r2",
            user: "Tina",
            location: "Kigali, Rwanda",
            date: "2 months ago",
            rating: 4,
            comment: "This was one of the smoothest photography experiences we've had. He paid close attention to detail, guided us naturally during the shoot, and delivered clean, professional images that truly represented us. The results were outstanding, and we've already recommended them to colleagues and friends.",
            avatar: "https://images.unsplash.com/photo-1531123897727-8f129c16fd3c?q=80&w=150"
        }
    ]
};

export default function CreatorProfilePage() {
    const params = useParams();
    const [selectedProjectIndex, setSelectedProjectIndex] = useState<number | null>(null);
    const [currentImageIndex, setCurrentImageIndex] = useState(0);

    const nextImage = useCallback(() => {
        if (selectedProjectIndex !== null) {
            const project = CREATOR_DATA.portfolio[selectedProjectIndex];
            setCurrentImageIndex((currentImageIndex + 1) % project.images.length);
        }
    }, [selectedProjectIndex, currentImageIndex]);

    const prevImage = useCallback(() => {
        if (selectedProjectIndex !== null) {
            const project = CREATOR_DATA.portfolio[selectedProjectIndex];
            setCurrentImageIndex((currentImageIndex - 1 + project.images.length) % project.images.length);
        }
    }, [selectedProjectIndex, currentImageIndex]);

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
                    <button className="flex items-center gap-2 text-slate-600 hover:text-primary transition-colors font-medium text-sm border border-slate-200 px-4 py-2 rounded-xl bg-white">
                        <Share2 className="w-4 h-4" />
                        Share Profile
                    </button>
                    <button className="flex items-center gap-2 text-slate-600 hover:text-primary transition-colors font-medium text-sm border border-slate-200 px-4 py-2 rounded-xl bg-white">
                        <Heart className="w-4 h-4" />
                        Save to favorites
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                {/* LEFT COLUMN: Profile Card */}
                <div className="lg:col-span-4 space-y-6">
                    <div className="bg-white rounded-[32px] border border-slate-100 p-8 space-y-8 shadow-none">
                        {/* Avatar & Basic Info */}
                        <div className="flex flex-col items-center text-center space-y-4">
                            <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-white ring-1 ring-slate-100 relative group">
                                <NextImage
                                    src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=400"
                                    alt={CREATOR_DATA.name}
                                    fill
                                    className="object-cover"
                                />
                            </div>
                            <div>
                                <div className="flex items-center justify-center gap-2">
                                    <h1 className="text-md font-semibold text-slate-900">{CREATOR_DATA.name}</h1>
                                    <BadgeCheck className="w-6 h-6 text-blue-500 fill-blue-500/10" />
                                    <div className="w-6 h-5 relative overflow-hidden rounded-sm border border-slate-100">
                                        <NextImage
                                            src="https://flagcdn.com/w40/rw.png"
                                            alt="Rwanda"
                                            fill
                                            className="object-cover"
                                        />
                                    </div>
                                    <span className="text-sm font-medium text-slate-500">{CREATOR_DATA.location}</span>
                                </div>
                                <p className="text-sm font-medium text-slate-600 mt-1 uppercase tracking-wider">
                                    {CREATOR_DATA.role} <span className="text-slate-400">({CREATOR_DATA.specialty})</span>
                                </p>
                            </div>
                            <div className="flex items-center gap-6 pt-2">
                                <div className="flex items-center gap-1.5">
                                    <div className="flex items-center text-yellow-500">
                                        <Star className="w-5 h-5 fill-current" />
                                        <Star className="w-5 h-5 fill-current" />
                                        <Star className="w-5 h-5 fill-current" />
                                        <Star className="w-5 h-5 fill-current" />
                                        <Star className="w-5 h-5 text-yellow-500/30 fill-current" />
                                    </div>
                                    <span className="text-xl font-bold text-slate-900">{CREATOR_DATA.rating}</span>
                                </div>
                                <div className="flex items-center gap-2 text-slate-700">
                                    <MessageSquare className="w-5 h-5 text-slate-400" />
                                    <span className="text-xl font-bold">{CREATOR_DATA.reviewsCount}</span>
                                </div>
                            </div>
                        </div>

                        {/* More About Me Section */}
                        <div className="space-y-6 pt-6 border-t border-slate-50">
                            <h3 className="text-sm font-bold text-slate-900 uppercase tracking-widest">More About Me</h3>

                            <div className="space-y-3">
                                <div className="flex items-center gap-4 text-slate-600 hover:text-primary transition-colors cursor-pointer group">
                                    <div className="w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center group-hover:bg-primary/5 transition-colors">
                                        <Mail className="w-5 h-5" />
                                    </div>
                                    <span className="text-sm font-medium">{CREATOR_DATA.email}</span>
                                </div>
                                <div className="flex items-center gap-4 text-slate-600 hover:text-primary transition-colors cursor-pointer group">
                                    <div className="w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center group-hover:bg-primary/5 transition-colors">
                                        <Instagram className="w-5 h-5" />
                                    </div>
                                    <span className="text-sm font-medium">{CREATOR_DATA.socials.instagram}</span>
                                </div>
                                <div className="flex items-center gap-4 text-slate-600 hover:text-primary transition-colors cursor-pointer group">
                                    <div className="w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center group-hover:bg-primary/5 transition-colors">
                                        <Facebook className="w-5 h-5" />
                                    </div>
                                    <span className="text-sm font-medium">{CREATOR_DATA.socials.facebook}</span>
                                </div>
                                <div className="flex items-center gap-4 text-slate-600 hover:text-primary transition-colors cursor-pointer group">
                                    <div className="w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center group-hover:bg-primary/5 transition-colors">
                                        <Twitter className="w-5 h-5" />
                                    </div>
                                    <span className="text-sm font-medium">{CREATOR_DATA.socials.twitter}</span>
                                </div>
                                <div className="flex items-center gap-4 text-slate-600 hover:text-primary transition-colors cursor-pointer group">
                                    <div className="w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center group-hover:bg-primary/5 transition-colors">
                                        <MapPin className="w-5 h-5" />
                                    </div>
                                    <span className="text-sm font-medium">{CREATOR_DATA.locationDetails}</span>
                                </div>
                            </div>
                        </div>

                        {/* Pricing Details */}
                        <div className="pt-6 border-t border-slate-50">
                            <div className="grid grid-cols-2 gap-4">
                                <div className="flex items-center gap-2">
                                    <DollarSign className="w-4 h-4 text-slate-400" />
                                    <span className="text-sm font-medium text-slate-600">${CREATOR_DATA.pricing.hourly} - hr</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <DollarSign className="w-4 h-4 text-slate-400" />
                                    <span className="text-sm font-medium text-slate-600">${CREATOR_DATA.pricing.fixed} - Fixed Price</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <DollarSign className="w-4 h-4 text-slate-400" />
                                    <span className="text-sm font-medium text-slate-600">${CREATOR_DATA.pricing.project} - Project</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <Briefcase className="w-4 h-4 text-slate-400" />
                                    <span className="text-sm font-medium text-slate-600">Joined March 12, 2025</span>
                                </div>
                            </div>
                        </div>

                        {/* CTA */}
                        <button className="w-full h-14 bg-primary text-white rounded-2xl font-bold text-sm uppercase tracking-widest hover:bg-primary/90 transition-all active:scale-95 shadow-none">
                            Book creator now
                        </button>
                    </div>
                </div>

                {/* RIGHT COLUMN: Details Section */}
                <div className="lg:col-span-8 space-y-8">
                    {/* Overview */}
                    <section className="bg-white rounded-[32px] border border-slate-100 p-8 space-y-6">
                        <h2 className="text-xl font-bold text-slate-900">Overview</h2>
                        <p className="text-slate-600 leading-relaxed font-medium">
                            {CREATOR_DATA.overview}
                        </p>
                    </section>

                    {/* Portfolio */}
                    <section className="bg-white rounded-[32px] border border-slate-100 p-8 space-y-8">
                        <div className="flex items-center justify-between">
                            <h2 className="text-xl font-bold text-slate-900">Portfolio</h2>
                            <button className="text-sm font-bold text-primary hover:underline">View all work</button>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {CREATOR_DATA.portfolio.map((item, index) => (
                                <div 
                                    key={item.id} 
                                    onClick={() => {
                                        setSelectedProjectIndex(index);
                                        setCurrentImageIndex(0);
                                    }}
                                    className="group relative rounded-2xl overflow-hidden aspect-[4/3] bg-slate-100 border border-slate-100 transition-all hover:border-primary/20 cursor-pointer"
                                >
                                    <NextImage
                                        src={item.images[0]}
                                        alt={item.title}
                                        fill
                                        className="object-cover transition-transform duration-500 group-hover:scale-110"
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent flex flex-col justify-end p-6 opacity-0 group-hover:opacity-100 transition-opacity">
                                        <div className="flex items-center justify-between mb-1">
                                            <h3 className="text-white font-bold text-lg">{item.title}</h3>
                                            <span className="text-[10px] bg-white/20 px-2 py-0.5 rounded-full text-white backdrop-blur-sm">
                                                {item.images.length} images
                                            </span>
                                        </div>
                                        <p className="text-white/80 text-xs line-clamp-2 leading-relaxed">
                                            {item.description}
                                        </p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </section>

                    {/* Reviews */}
                    <section className="bg-white rounded-[32px] border border-slate-100 p-8 space-y-8">
                        <div className="flex items-center gap-4 pb-4 border-b border-slate-50">
                            <div className="flex items-center gap-2">
                                <Star className="w-6 h-6 fill-yellow-500 text-yellow-500" />
                                <span className="text-2xl font-bold text-slate-900">{CREATOR_DATA.rating}</span>
                            </div>
                            <span className="text-slate-200">|</span>
                            <span className="text-xl font-bold text-slate-700">{CREATOR_DATA.reviewsCount} Reviews</span>
                        </div>

                        <div className="space-y-6">
                            {CREATOR_DATA.reviews.map((review) => (
                                <div key={review.id} className="p-6 rounded-2xl bg-slate-50/50 border border-slate-100 space-y-4">
                                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                                        <div className="flex items-center gap-3">
                                            <div className="w-12 h-12 rounded-xl border border-slate-200 overflow-hidden relative">
                                                <NextImage
                                                    src={review.avatar}
                                                    alt={review.user}
                                                    fill
                                                    className="object-cover"
                                                />
                                            </div>
                                            <div>
                                                <h4 className="font-bold text-slate-900">{review.user}</h4>
                                                <div className="flex items-center gap-2 mt-0.5">
                                                    <div className="w-4 h-3 relative rounded-sm overflow-hidden border border-slate-200">
                                                        <NextImage
                                                            src="https://flagcdn.com/w40/rw.png"
                                                            alt="Rwanda"
                                                            fill
                                                            className="object-cover"
                                                        />
                                                    </div>
                                                    <p className="text-[11px] font-medium text-slate-500">{review.location} • {review.date}</p>
                                                </div>
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

                        <div className="flex justify-center pt-4">
                            <button className="px-10 h-12 border-2 border-primary/10 text-primary rounded-xl font-bold text-sm hover:bg-primary/5 transition-all outline-none">
                                Show all Reviews
                            </button>
                        </div>
                    </section>
                </div>
            </div>

            {/* Portfolio Project Gallery Lightbox */}
            {selectedProjectIndex !== null && (
                <div 
                    className="fixed inset-0 z-50 bg-black/95 flex flex-col items-center justify-center animate-in fade-in duration-300"
                    onClick={() => setSelectedProjectIndex(null)}
                >
                    {/* Header: Title & Close */}
                    <div className="absolute top-0 inset-x-0 p-8 flex items-center justify-between z-50">
                        <div className="flex flex-col">
                            <h3 className="text-white text-2xl font-bold">{CREATOR_DATA.portfolio[selectedProjectIndex].title}</h3>
                            <p className="text-white/50 text-sm font-medium">
                                Image {currentImageIndex + 1} of {CREATOR_DATA.portfolio[selectedProjectIndex].images.length}
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
                        {/* Navigation Arrows */}
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

                        {/* Neighbor Hint: Previous */}
                        <div className="hidden lg:block w-[15%] h-[70%] opacity-30 grayscale blur-[2px] rounded-2xl overflow-hidden transition-all duration-500 scale-90">
                             <NextImage
                                src={CREATOR_DATA.portfolio[selectedProjectIndex].images[(currentImageIndex - 1 + CREATOR_DATA.portfolio[selectedProjectIndex].images.length) % CREATOR_DATA.portfolio[selectedProjectIndex].images.length]}
                                alt="Previous"
                                fill
                                className="object-cover"
                            />
                        </div>

                        {/* Active Image */}
                        <div className="relative w-full lg:w-[60%] h-full rounded-[32px] overflow-hidden shadow-2xl animate-in zoom-in-95 duration-500">
                            <NextImage
                                src={CREATOR_DATA.portfolio[selectedProjectIndex].images[currentImageIndex]}
                                alt={CREATOR_DATA.portfolio[selectedProjectIndex].title}
                                fill
                                className="object-cover"
                                priority
                            />
                        </div>

                        {/* Neighbor Hint: Next */}
                        <div className="hidden lg:block w-[15%] h-[70%] opacity-30 grayscale blur-[2px] rounded-2xl overflow-hidden transition-all duration-500 scale-90">
                             <NextImage
                                src={CREATOR_DATA.portfolio[selectedProjectIndex].images[(currentImageIndex + 1) % CREATOR_DATA.portfolio[selectedProjectIndex].images.length]}
                                alt="Next"
                                fill
                                className="object-cover"
                            />
                        </div>
                    </div>

                    {/* Footer Info & Thumbnails */}
                    <div className="absolute bottom-10 inset-x-0 flex flex-col items-center gap-8 px-8" onClick={(e) => e.stopPropagation()}>
                        <div className="max-w-3xl text-center">
                            <p className="text-white/80 text-lg leading-relaxed font-medium line-clamp-2">
                                {CREATOR_DATA.portfolio[selectedProjectIndex].description}
                            </p>
                        </div>
                        
                        <div className="flex gap-2">
                            {CREATOR_DATA.portfolio[selectedProjectIndex].images.map((_, index) => (
                                <button
                                    key={index}
                                    onClick={() => setCurrentImageIndex(index)}
                                    className={`transition-all duration-500 rounded-full ${index === currentImageIndex ? "w-10 h-1.5 bg-primary" : "w-1.5 h-1.5 bg-white/20 hover:bg-white/40"}`}
                                />
                            ))}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
