"use client";

import { useState, useRef, useEffect } from "react";
import {
    Search,
    MessageCircle,
    BookOpen,
    CreditCard,
    ShieldCheck,
    ChevronRight,
    ChevronDown,
    Plus,
    Minus,
    Send,
    ExternalLink,
    Mail,
    Phone,
    HelpCircle,
    Check
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useSubmitTicket, useMyTickets } from "@/features/user/hooks/useSupport";
import { toast } from "react-hot-toast";

const HELP_CATEGORIES = [
    { id: "general", label: "General", icon: HelpCircle },
    { id: "bookings", label: "Managing Bookings", icon: BookOpen },
    { id: "payments", label: "Earnings & Payouts", icon: CreditCard },
    { id: "security", label: "Security", icon: ShieldCheck },
    { id: "tickets", label: "My Support Requests", icon: MessageCircle },
    { id: "contact", label: "Contact Support", icon: Send },
];

const FAQS = {
    general: [
        { q: "How does Pixbay work for creators?", a: "Pixbay allows you to showcase your portfolio, set your own rates, and receive booking requests from clients looking for premium creative services." },
        { q: "How do I optimize my profile?", a: "High-quality portfolio images, detailed service descriptions, and prompt responses to inquiries help you rank higher and attract more clients." },
        { q: "Can I use Pixbay for free?", a: "Listing your services is free. We only charge a small platform fee on successful bookings." }
    ],
    bookings: [
        { q: "How do I handle booking requests?", a: "You'll receive notifications for new requests. You can review details, message the client, and choose to accept or decline." },
        { q: "What is the check-in process?", a: "For on-site sessions, use the check-in feature to record your attendance and ensure smooth payment processing." },
        { q: "How do I deliver final files?", a: "Once the work is complete, use the 'Add Project Images' feature in the booking details to deliver final results safely." }
    ],
    payments: [
        { q: "When will I get paid?", a: "Payments are processed once the project is completed and the client acknowledges delivery. Funds usually reach your account within 3-5 business days." },
        { q: "How do I set my payout method?", a: "Go to Settings > Payments to configure your preferred bank account or mobile money details for payouts." },
        { q: "What are the platform fees?", a: "Pixbay charges a standard percentage fee to cover secure payment processing, marketing, and platform maintenance." }
    ],
    security: [
        { q: "Is my portfolio protected?", a: "We implement measures to prevent unauthorised downloads of your high-resolution portfolio images until a booking is confirmed." },
        { q: "Should I communicate outside Pixbay?", a: "For your safety, always keep communication and payments within Pixbay to benefit from our protection and support." },
        { q: "How do I report a suspicious client?", a: "If you encounter any unprofessional or suspicious behavior, use the 'Report' button on the client's profile or contact support immediately." }
    ]
};

export default function CreatorHelpPage() {
    const [activeTab, setActiveTab] = useState("general");
    const [searchQuery, setSearchQuery] = useState("");
    const [expandedFaq, setExpandedFaq] = useState<number | null>(null);

    // Pagination State
    const [currentPage, setCurrentPage] = useState(1);
    const TICKETS_PER_PAGE = 5;

    // Support Form States
    const [department, setDepartment] = useState("Creator Support");
    const [subject, setSubject] = useState("");
    const [message, setMessage] = useState("");
    const submitTicket = useSubmitTicket();
    const { data: ticketsData, isLoading: isTicketsLoading } = useMyTickets();
    const tickets = ticketsData?.data || [];

    // Paginated Tickets
    const totalPages = Math.ceil(tickets.length / TICKETS_PER_PAGE);
    const paginatedTickets = tickets.slice(
        (currentPage - 1) * TICKETS_PER_PAGE,
        currentPage * TICKETS_PER_PAGE
    );

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await submitTicket.mutateAsync({
                subject,
                message,
                priority: department === "Safety & Security" ? "HIGH" : "NORMAL",
            });
            setSubject("");
            setMessage("");
            toast.success("Support ticket submitted successfully!");
            setActiveTab("tickets");
        } catch (error) {
            // Error handled by hook or manually
        }
    };

    // Reset page when data changes
    useEffect(() => {
        setCurrentPage(1);
    }, [tickets.length]);

    return (
        <div className="max-w-[1400px] mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700 pb-20">
            {/* Header & Search Hero */}
            <div className="bg-white rounded-[32px] border border-slate-100 p-8 py-16 text-center space-y-8 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full -mr-32 -mt-32 blur-3xl" />
                <div className="absolute bottom-0 left-0 w-64 h-64 bg-primary/5 rounded-full -ml-32 -mb-32 blur-3xl" />

                <div className="relative space-y-4 max-w-2xl mx-auto">
                    <h1 className="text-3xl font-semibold text-slate-900 tracking-tight">How can we help you?</h1>
                    <p className="text-[14px] text-slate-500 font-medium">Search our knowledge base or browse categories below to find answers.</p>

                    <div className="relative mt-10">
                        <Search className="absolute left-6 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                        <input
                            type="text"
                            placeholder="Search for questions, topics, or keywords..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full h-14 pl-16 pr-8 bg-white border border-slate-100 rounded-xl text-[14px] font-medium text-slate-900 outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all "
                        />
                    </div>
                </div>
            </div>

            <div className="flex flex-col lg:flex-row gap-8 items-start">
                {/* Left Sidebar Navigation */}
                <div className="w-full lg:w-72 bg-white rounded-[32px] border border-slate-100 p-4 space-y-1 shrink-0">
                    {HELP_CATEGORIES.map((tab) => {
                        const IsActive = activeTab === tab.id;
                        return (
                            <button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id)}
                                className={cn(
                                    "w-full flex items-center gap-4 px-5 h-14 rounded-2xl transition-all group",
                                    IsActive
                                        ? "bg-slate-50 text-slate-900"
                                        : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                                )}
                            >
                                <tab.icon className={cn(
                                    "w-5 h-5 transition-colors",
                                    IsActive ? "text-slate-900" : "text-slate-400 group-hover:text-slate-900"
                                )} />
                                <span className="text-[14px] font-medium">{tab.label}</span>
                                {IsActive && <ChevronRight className="w-4 h-4 ml-auto text-slate-900" />}
                            </button>
                        );
                    })}
                </div>

                {/* Right Content Area */}
                <div className="flex-1 space-y-8">
                    {activeTab === "tickets" ? (
                        <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-500">
                            <div className="bg-white rounded-[32px] border border-slate-100 p-8">
                                <h2 className="text-lg font-semibold text-slate-900 mb-6">My Support Requests</h2>
                                {isTicketsLoading ? (
                                    <div className="py-12 text-center text-slate-500 font-medium">Loading your tickets...</div>
                                ) : tickets.length === 0 ? (
                                    <div className="py-12 text-center text-slate-500 font-medium">
                                        You haven&apos;t submitted any support requests yet.
                                    </div>
                                ) : (
                                    <>
                                        <div className="space-y-4">
                                            {paginatedTickets.map((ticket: any) => (
                                                <div key={ticket.id} className="p-6 bg-slate-50 rounded-[24px] border border-slate-100 space-y-3">
                                                    <div className="flex flex-wrap items-center justify-between gap-4">
                                                        <div className="space-y-1">
                                                            <h3 className="text-[15px] font-semibold text-slate-900">{ticket.subject}</h3>
                                                            <p className="text-[12px] text-slate-400 font-medium">
                                                                ID: {ticket.id} • {new Date(ticket.createdAt).toLocaleDateString()}
                                                            </p>
                                                        </div>
                                                        <div className="flex items-center gap-3">
                                                            <span className={cn(
                                                                "px-3 py-1 rounded-full text-[11px] font-semibold uppercase tracking-wider",
                                                                ticket.status === "RESOLVED" ? "bg-green-100 text-green-600" :
                                                                    ticket.status === "IN_PROGRESS" ? "bg-blue-100 text-blue-600" : "bg-orange-100 text-orange-600"
                                                            )}>
                                                                {ticket.status}
                                                            </span>
                                                            <span className={cn(
                                                                "px-3 py-1 rounded-full text-[11px] font-semibold uppercase tracking-wider",
                                                                ticket.priority === "HIGH" || ticket.priority === "URGENT" ? "bg-red-100 text-red-600" : "bg-slate-200 text-slate-600"
                                                            )}>
                                                                {ticket.priority}
                                                            </span>
                                                        </div>
                                                    </div>
                                                    <p className="text-[14px] text-slate-600 font-medium line-clamp-2">{ticket.message}</p>

                                                    {!ticket.adminNotified && ticket.notificationError && (
                                                        <div className="flex items-start gap-2 p-3 bg-red-50 border border-red-100 rounded-xl text-red-600 text-[12px] font-semibold">
                                                            <ShieldCheck className="w-4 h-4 mt-0.5 shrink-0" />
                                                            <div className="space-y-0.5">
                                                                <p>Admin notification failed: {ticket.notificationError}</p>
                                                                <p className="opacity-70">Our system will keep retrying. Don&apos;t worry, your ticket is saved.</p>
                                                            </div>
                                                        </div>
                                                    )}

                                                    {ticket.adminNotified ? (
                                                        <div className="flex items-center gap-1.5 text-green-600 text-[12px] font-semibold">
                                                            <Check className="w-4 h-4" />
                                                            Admin Notified Successfully
                                                        </div>
                                                    ) : !ticket.notificationError ? (
                                                        <div className="flex items-center gap-1.5 text-slate-400 text-[12px] font-semibold">
                                                            <Send className="w-4 h-4 animate-pulse" />
                                                            Notification in process...
                                                        </div>
                                                    ) : null}
                                                </div>
                                            ))}
                                        </div>

                                        {/* Pagination Controls */}
                                        {totalPages > 1 && (
                                            <div className="mt-8 flex items-center justify-between border-t border-slate-100 pt-6">
                                                <p className="text-[13px] text-slate-500 font-medium">
                                                    Showing <span className="text-slate-900">{(currentPage - 1) * TICKETS_PER_PAGE + 1}</span> to <span className="text-slate-900">{Math.min(currentPage * TICKETS_PER_PAGE, tickets.length)}</span> of <span className="text-slate-900">{tickets.length}</span> tickets
                                                </p>
                                                <div className="flex items-center gap-2">
                                                    <button
                                                        onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                                                        disabled={currentPage === 1}
                                                        className="w-10 h-10 rounded-xl border border-slate-100 flex items-center justify-center text-slate-600 hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                                                    >
                                                        <ChevronRight className="w-4 h-4 rotate-180" />
                                                    </button>
                                                    <div className="flex items-center gap-1">
                                                        {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                                                            <button
                                                                key={page}
                                                                onClick={() => setCurrentPage(page)}
                                                                className={cn(
                                                                    "w-10 h-10 rounded-xl text-[13px] font-semibold transition-all",
                                                                    currentPage === page
                                                                        ? "bg-primary text-white"
                                                                        : "text-slate-600 hover:bg-slate-50"
                                                                )}
                                                            >
                                                                {page}
                                                            </button>
                                                        ))}
                                                    </div>
                                                    <button
                                                        onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                                                        disabled={currentPage === totalPages}
                                                        className="w-10 h-10 rounded-xl border border-slate-100 flex items-center justify-center text-slate-600 hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                                                    >
                                                        <ChevronRight className="w-4 h-4" />
                                                    </button>
                                                </div>
                                            </div>
                                        )}
                                    </>
                                )}
                            </div>
                        </div>
                    ) : activeTab === "contact" ? (
                        <div className="space-y-8 animate-in fade-in slide-in-from-right-4 duration-500">
                            <div className="bg-white rounded-[32px] border border-slate-100 p-8 space-y-8">
                                <div className="space-y-1">
                                    <h2 className="text-lg font-semibold text-slate-900">Contact Support</h2>
                                    <p className="text-[13px] text-slate-500 font-medium">Send us a message and we&apos;ll get back to you as soon as possible.</p>
                                </div>

                                <form onSubmit={handleSubmit} className="space-y-6">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div className="space-y-2">
                                            <label className="text-[12px] font-semibold text-slate-400 uppercase tracking-wide px-1">Subject</label>
                                            <input
                                                type="text"
                                                placeholder="Explain your problem"
                                                value={subject}
                                                onChange={(e) => setSubject(e.target.value)}
                                                required
                                                className="w-full h-12 px-5 bg-white border border-slate-100 rounded-xl text-[13px] font-semibold text-slate-900 outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-[12px] font-semibold text-slate-400 uppercase tracking-wide px-1">Department</label>
                                            <ModernSelect
                                                value={department}
                                                onChange={setDepartment}
                                                options={["Creator Support", "Earnings & Payouts", "Technical Issue", "Safety & Security"]}
                                            />
                                        </div>
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-[12px] font-semibold text-slate-400 uppercase tracking-wide px-1">Message</label>
                                        <textarea
                                            placeholder="Provide as much detail as possible..."
                                            rows={5}
                                            value={message}
                                            onChange={(e) => setMessage(e.target.value)}
                                            required
                                            className="w-full p-5 bg-white border border-slate-100 rounded-xl text-[13px] font-semibold text-slate-900 outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all resize-none"
                                        />
                                    </div>
                                    <button
                                        type="submit"
                                        disabled={submitTicket.isPending}
                                        className="px-10 h-12 bg-primary text-white rounded-xl font-semibold text-[13px] hover:bg-primary/90 transition-all flex items-center gap-2 disabled:opacity-50"
                                    >
                                        {submitTicket.isPending ? "Sending..." : "Send Message"}
                                        <Send className="w-4 h-4" />
                                    </button>
                                </form>
                            </div>

                            {/* Other contact methods */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <ContactMethod
                                    icon={<Mail className="w-5 h-5 text-primary" />}
                                    title="Email Support"
                                    value="support@pixbay.com"
                                    description="Average response time: 2-4 hours"
                                />
                                <ContactMethod
                                    icon={<Phone className="w-5 h-5 text-primary" />}
                                    title="Call Us"
                                    value="+250 788 123 456"
                                    description="Mon - Fri, 9:00 AM - 6:00 PM"
                                />
                            </div>
                        </div>
                    ) : (
                        <div className="space-y-6">
                            <div className="flex items-center justify-between px-1">
                                <h2 className="text-xl font-semibold text-slate-900 capitalize">{activeTab} FAQ</h2>
                                <button className="text-[13px] font-semibold text-primary hover:underline flex items-center gap-1.5 transition-all">
                                    View all
                                    <ExternalLink className="w-3.5 h-3.5" />
                                </button>
                            </div>

                            <div className="space-y-4">
                                {(FAQS[activeTab as keyof typeof FAQS] || []).map((faq, index) => {
                                    const isExpanded = expandedFaq === index;
                                    return (
                                        <div
                                            key={index}
                                            className={cn(
                                                "bg-white border transition-all duration-300 rounded-[24px]",
                                                isExpanded ? "border-slate-200" : "border-slate-100"
                                            )}
                                        >
                                            <button
                                                onClick={() => setExpandedFaq(isExpanded ? null : index)}
                                                className="w-full flex items-center justify-between p-6 text-left group"
                                            >
                                                <span className="text-[15px] font-semibold text-slate-900 pr-8">{faq.q}</span>
                                                <div className={cn(
                                                    "w-8 h-8 rounded-full flex items-center justify-center transition-all",
                                                    isExpanded ? "bg-primary text-white" : "bg-slate-50 text-slate-400 group-hover:bg-slate-100"
                                                )}>
                                                    {isExpanded ? <Minus className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
                                                </div>
                                            </button>
                                            <div className={cn(
                                                "overflow-hidden transition-all duration-300 ease-in-out px-6",
                                                isExpanded ? "max-h-40 pb-6 opacity-100" : "max-h-0 opacity-0"
                                            )}>
                                                <p className="text-[14px] text-slate-500 font-medium leading-relaxed">
                                                    {faq.a}
                                                </p>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>

                            {/* Contact CTA */}
                            <div className="bg-slate-900 rounded-[32px] p-10 flex flex-col md:flex-row items-center justify-between gap-8 sm:px-12 relative overflow-hidden group">
                                <div className="absolute top-0 left-0 w-64 h-64 bg-primary/20 rounded-full blur-[100px] -ml-32 -mt-32 transition-all duration-700 group-hover:scale-125" />
                                <div className="space-y-2 relative z-10 text-center md:text-left">
                                    <h3 className="text-xl font-semibold text-white">Still need help?</h3>
                                    <p className="text-slate-400 font-medium text-[14px]">Our support team is available 24/7 to assist you.</p>
                                </div>
                                <button
                                    onClick={() => setActiveTab("contact")}
                                    className="px-8 h-12 bg-white text-slate-900 rounded-2xl font-semibold text-[13px] hover:bg-slate-50 transition-all relative z-10 whitespace-nowrap"
                                >
                                    Contact Support
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

function ContactMethod({ icon, title, value, description }: { icon: React.ReactNode, title: string, value: string, description: string }) {
    return (
        <div className="bg-white rounded-[32px] border border-slate-100 p-8 flex items-start gap-6 group hover:border-slate-200 transition-all">
            <div className="w-12 h-12 rounded-2xl bg-primary/5 flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform">
                {icon}
            </div>
            <div className="space-y-1">
                <h4 className="text-[13px] font-semibold text-slate-400 uppercase tracking-wide">{title}</h4>
                <p className="text-lg font-semibold text-slate-900">{value}</p>
                <p className="text-[13px] text-slate-500 font-medium">{description}</p>
            </div>
        </div>
    );
}

function ModernSelect({ value, onChange, options }: { value: string, onChange: (val: string) => void, options: string[] }) {
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    return (
        <div className="relative" ref={dropdownRef}>
            <button
                type="button"
                onClick={() => setIsOpen(!isOpen)}
                className={cn(
                    "w-full h-12 px-5 bg-white border border-slate-100 rounded-xl text-[13px] font-semibold text-slate-900 flex items-center justify-between transition-all outline-none",
                    isOpen ? "border-primary ring-2 ring-primary/20" : "hover:border-slate-300"
                )}
            >
                <span>{value}</span>
                <ChevronDown className={cn("w-4 h-4 text-slate-400 transition-transform duration-300", isOpen && "rotate-180")} />
            </button>

            {isOpen && (
                <div className="absolute top-[calc(100%+8px)] left-0 right-0 p-1.5 bg-white border border-slate-100 rounded-2xl z-50 animate-in fade-in slide-in-from-top-2 duration-200">
                    {options.map((option) => (
                        <button
                            key={option}
                            type="button"
                            onClick={() => {
                                onChange(option);
                                setIsOpen(false);
                            }}
                            className={cn(
                                "w-full px-4 py-2.5 rounded-xl text-[13px] font-semibold text-left flex items-center justify-between transition-colors",
                                value === option
                                    ? "bg-primary/5 text-primary"
                                    : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                            )}
                        >
                            <span>{option}</span>
                            {value === option && <Check className="w-4 h-4" />}
                        </button>
                    ))}
                </div>
            )}
        </div>
    );
}
