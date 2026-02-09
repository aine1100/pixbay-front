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

const HELP_CATEGORIES = [
    { id: "general", label: "General", icon: HelpCircle },
    { id: "bookings", label: "Bookings", icon: BookOpen },
    { id: "payments", label: "Payments", icon: CreditCard },
    { id: "security", label: "Security", icon: ShieldCheck },
    { id: "contact", label: "Contact Support", icon: MessageCircle },
];

const FAQS = {
    general: [
        { q: "What is Pixbay?", a: "Pixbay is a premium platform connecting clients with professional creators for varied projects, events, and services." },
        { q: "How do I create an account?", a: "You can sign up as a Client or Creator using your email address and completing your profile details." },
        { q: "Is Pixbay free to use?", a: "Signing up and browsing is free. We charge a service fee for successful bookings to maintain the platform." }
    ],
    bookings: [
        { q: "How do I book a creator?", a: "Find a creator you like, select a service, choose your dates, and send a booking request." },
        { q: "Can I cancel a booking?", a: "Yes, cancellations are allowed based on the creator's specific policy stated on their profile." },
        { q: "What happens if a creator declines?", a: "If a request is declined, no charges are made, and you can look for other available creators." }
    ],
    payments: [
        { q: "Which payment methods are supported?", a: "We support major credit/debit cards, bank transfers, and local payment methods in Rwanda." },
        { q: "When is my payment released to the creator?", a: "Funds are held securely by Pixbay and only released after the service is successfully delivered." },
        { q: "Can I get a refund?", a: "Refunds are processed according to our platform policy and the specific cancellation terms of the booking." }
    ],
    security: [
        { q: "How is my data protected?", a: "We use enterprise-grade encryption and follow strict privacy standards to keep your information safe." },
        { q: "Should I pay outside of Pixbay?", a: "No. For your protection, always process payments through our secure platform to ensure refund eligibility." },
        { q: "How do I report a problem?", a: "You can report any suspicious activity or issues directly via the Support tab or on a specific booking." }
    ]
};

export default function HelpPage() {
    const [activeTab, setActiveTab] = useState("general");
    const [searchQuery, setSearchQuery] = useState("");
    const [expandedFaq, setExpandedFaq] = useState<number | null>(null);

    // Support Form States
    const [department, setDepartment] = useState("Customer Support");

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
                    {activeTab !== "contact" ? (
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
                    ) : (
                        <div className="space-y-8 animate-in fade-in slide-in-from-right-4 duration-500">
                            <div className="bg-white rounded-[32px] border border-slate-100 p-8 space-y-8">
                                <div className="space-y-1">
                                    <h2 className="text-lg font-semibold text-slate-900">Contact Support</h2>
                                    <p className="text-[13px] text-slate-500 font-medium">Send us a message and we&apos;ll get back to you as soon as possible.</p>
                                </div>

                                <form className="space-y-6">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div className="space-y-2">
                                            <label className="text-[12px] font-semibold text-slate-400 uppercase tracking-wide px-1">Subject</label>
                                            <input type="text" placeholder="Explain your problem" className="w-full h-12 px-5 bg-white border border-slate-100 rounded-xl text-[13px] font-semibold text-slate-900 outline-none border-border focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all" />
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-[12px] font-semibold text-slate-400 uppercase tracking-wide px-1">Department</label>
                                            <ModernSelect
                                                value={department}
                                                onChange={setDepartment}
                                                options={["Customer Support", "Billing & Payments", "Technical Issue", "Safety & Security"]}
                                            />
                                        </div>
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-[12px] font-semibold text-slate-400 uppercase tracking-wide px-1">Message</label>
                                        <textarea
                                            placeholder="Provide as much detail as possible..."
                                            rows={5}
                                            className="w-full p-5 bg-white border border-slate-100 rounded-xl text-[13px] font-semibold text-slate-900 outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all resize-none"
                                        />
                                    </div>
                                    <button type="button" className="px-10 h-12 bg-primary text-white rounded-xl font-semibold text-[13px] hover:bg-primary/90 transition-all flex items-center gap-2">
                                        Send Message
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
