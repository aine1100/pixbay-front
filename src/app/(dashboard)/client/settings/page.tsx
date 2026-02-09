"use client";

import { useState, useRef, useEffect } from "react";
import {
    User,
    Bell,
    Sliders,
    Shield,
    PenLine,
    MapPin,
    Calendar,
    ChevronRight,
    Edit3,
    Smartphone,
    Mail,
    Globe,
    Lock,
    Eye,
    EyeOff,
    Laptop,
    Tablet,
    LogOut,
    ChevronDown,
    Check
} from "lucide-react";
import NextImage from "next/image";
import { cn } from "@/lib/utils";

const SETTINGS_TABS = [
    { id: "profile", label: "My Profile", icon: User },
    { id: "notifications", label: "Notifications", icon: Bell },
    { id: "preferences", label: "Preferences", icon: Sliders },
    { id: "security", label: "Password and Security", icon: Shield },
];

export default function SettingsPage() {
    const [activeTab, setActiveTab] = useState("profile");

    // Preference States
    const [language, setLanguage] = useState("English (US)");
    const [currency, setCurrency] = useState("USD ($)");

    return (
        <div className="max-w-[1400px] mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
            <div>
                <h1 className="text-2xl font-semibold text-slate-900 tracking-tight">Settings</h1>
            </div>

            <div className="flex flex-col lg:flex-row gap-8 items-start">
                {/* Left Sidebar Navigation */}
                <div className="w-full lg:w-72 bg-white rounded-[32px] border border-slate-100 p-4 space-y-1">
                    {SETTINGS_TABS.map((tab) => {
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
                <div className="flex-1 space-y-8 pb-20">
                    {activeTab === "profile" && (
                        <>
                            {/* My Profile Section */}
                            <div className="space-y-4">
                                <h2 className="text-lg font-semibold text-slate-900 px-1">My Profile</h2>
                                <div className="bg-white rounded-[32px] border border-slate-100 p-8 flex items-center justify-between group">
                                    <div className="flex items-center gap-6">
                                        <div className="w-20 h-20 rounded-full overflow-hidden border-2 border-slate-50 relative">
                                            <NextImage
                                                src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=200"
                                                alt="Alena SHIMA"
                                                fill
                                                className="object-cover"
                                            />
                                        </div>
                                        <div className="space-y-1">
                                            <h3 className="text-lg font-semibold text-slate-900">Alena SHIMA</h3>
                                            <p className="text-[13px] text-slate-500 font-medium">University Student (University of Kigali)</p>
                                            <div className="flex items-center gap-1.5 text-[13px] text-slate-400 font-medium">
                                                <MapPin className="w-3.5 h-3.5 text-slate-400" />
                                                <span>Kigali, Rwanda</span>
                                            </div>
                                        </div>
                                    </div>
                                    <button className="flex items-center gap-2 px-5 h-10 bg-primary/10 text-primary rounded-xl font-semibold text-[13px] hover:bg-blue-100 transition-all">
                                        Edit
                                        <Edit3 className="w-4 h-4" />
                                    </button>
                                </div>
                            </div>

                            {/* Personal Info Section */}
                            <div className="bg-white rounded-[32px] border border-slate-100 p-8 space-y-8">
                                <div className="flex items-center justify-between">
                                    <h2 className="text-lg font-semibold text-slate-900">Personal Info</h2>
                                    <button className="flex items-center gap-2 px-5 h-10 bg-primary/10 text-primary rounded-xl font-semibold text-[13px] hover:bg-blue-100 transition-all">
                                        Edit
                                        <Edit3 className="w-4 h-4" />
                                    </button>
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-y-8 gap-x-12">
                                    <InfoItem label="First Name" value="Alena" />
                                    <InfoItem label="Last Name" value="SHEMA" />
                                    <InfoItem label="Gender" value="Male" />
                                    <InfoItem label="Role" value="Client" />
                                    <InfoItem label="email address" value="yvanshema@gmail.com" />
                                    <InfoItem label="Phone" value="+250 793 829 033" />
                                    <InfoItem
                                        label="Date of Birth"
                                        value="Feb 12,1999"
                                        icon={<Calendar className="w-4 h-4 text-slate-400" />}
                                    />
                                </div>
                            </div>

                            {/* Address Section */}
                            <div className="bg-white rounded-[32px] border border-slate-100 p-8 space-y-8">
                                <div className="flex items-center justify-between">
                                    <h2 className="text-lg font-semibold text-slate-900">Address</h2>
                                    <button className="flex items-center gap-2 px-5 h-10 bg-primary/10 text-primary rounded-xl font-semibold text-[13px] hover:bg-blue-100 transition-all">
                                        Edit
                                        <Edit3 className="w-4 h-4" />
                                    </button>
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-y-8 gap-x-12">
                                    <InfoItem label="Country" value="Rwanda" />
                                    <InfoItem label="Province" value="Kigali City Province" />
                                    <InfoItem label="City" value="Kigali city" />
                                    <InfoItem label="Postal code" value="00000" />
                                </div>
                            </div>
                        </>
                    )}

                    {activeTab === "notifications" && (
                        <div className="space-y-8">
                            {/* Communication preferences */}
                            <div className="bg-white rounded-[32px] border border-slate-100 p-8 space-y-8">
                                <div className="space-y-1">
                                    <h2 className="text-lg font-semibold text-slate-900">Notifications</h2>
                                    <p className="text-[13px] text-slate-500 font-medium">Manage how you receive updates and alerts.</p>
                                </div>

                                <div className="space-y-6">
                                    <NotificationToggle
                                        title="Email Notifications"
                                        description="Receive updates, booking confirmations, and messages via email."
                                        icon={<Mail className="w-5 h-5 text-slate-400" />}
                                        defaultChecked={true}
                                    />
                                    <NotificationToggle
                                        title="Push Notifications"
                                        description="Receive instant alerts on your mobile device or browser."
                                        icon={<Smartphone className="w-5 h-5 text-slate-400" />}
                                        defaultChecked={true}
                                    />
                                    <NotificationToggle
                                        title="Marketing Updates"
                                        description="Receive news, promotions, and product updates."
                                        icon={<Globe className="w-5 h-5 text-slate-400" />}
                                        defaultChecked={false}
                                    />
                                </div>
                            </div>

                            {/* Specific Categories */}
                            <div className="bg-white rounded-[32px] border border-slate-100 p-8 space-y-8">
                                <h3 className="text-md font-semibold text-slate-900">Activity Notifications</h3>
                                <div className="space-y-6">
                                    <SimpleToggle title="New Messages" description="When someone sends you a message" defaultChecked={true} />
                                    <SimpleToggle title="Booking Requests" description="When a creator accepts or declines a request" defaultChecked={true} />
                                    <SimpleToggle title="Payment Updates" description="Notifications about successful payments and invoices" defaultChecked={true} />
                                    <SimpleToggle title="Review Reminders" description="Helpful nudges to review your recent bookings" defaultChecked={false} />
                                </div>
                            </div>
                        </div>
                    )}

                    {activeTab === "preferences" && (
                        <div className="space-y-8">
                            {/* Localization */}
                            <div className="bg-white rounded-[32px] border border-slate-100 p-8 space-y-8">
                                <div className="space-y-1">
                                    <h2 className="text-lg font-semibold text-slate-900">Preferences</h2>
                                    <p className="text-[13px] text-slate-500 font-medium">Personalize your Pixbay experience.</p>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                    <div className="space-y-2">
                                        <label className="text-[12px] font-semibold text-slate-400 uppercase tracking-wide px-1">Language</label>
                                        <ModernSelect
                                            value={language}
                                            onChange={setLanguage}
                                            options={["English (US)", "French", "Swahili", "Kinyarwanda"]}
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-[12px] font-semibold text-slate-400 uppercase tracking-wide px-1">Currency</label>
                                        <ModernSelect
                                            value={currency}
                                            onChange={setCurrency}
                                            options={["USD ($)", "RWF (FRw)", "EUR (€)"]}
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* Privacy */}
                            <div className="bg-white rounded-[32px] border border-slate-100 p-8 space-y-8">
                                <h3 className="text-md font-semibold text-slate-900">Privacy Settings</h3>
                                <div className="space-y-6">
                                    <SimpleToggle title="Public Profile" description="Allow creators and others to find your profile in search results" defaultChecked={true} />
                                    <SimpleToggle title="Show Online Status" description="Let others see when you are active on the platform" defaultChecked={true} />
                                    <SimpleToggle title="Data Sharing" description="Help us improve by sharing anonymous usage data" defaultChecked={false} />
                                </div>
                            </div>
                        </div>
                    )}

                    {activeTab === "security" && (
                        <div className="space-y-8">
                            {/* Password Update */}
                            <div className="bg-white rounded-[32px] border border-slate-100 p-8 space-y-8">
                                <div className="space-y-1">
                                    <h2 className="text-lg font-semibold text-slate-900">Password and Security</h2>
                                    <p className="text-[13px] text-slate-500 font-medium">Keep your account secure with a strong password.</p>
                                </div>

                                <form className="max-w-md space-y-5">
                                    <div className="space-y-2">
                                        <label className="text-[12px] font-semibold text-slate-400 uppercase tracking-wide px-1">Current Password</label>
                                        <div className="relative">
                                            <input type="password" placeholder="••••••••" className="w-full h-12 px-5 bg-white border border-slate-100 rounded-xl text-[13px] font-semibold text-slate-900 outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all " />
                                            <EyeOff className="absolute right-4 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-slate-400 cursor-pointer" />
                                        </div>
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-[12px] font-semibold text-slate-400 uppercase tracking-wide px-1">New Password</label>
                                        <div className="relative">
                                            <input type="password" placeholder="••••••••" className="w-full h-12 px-5 bg-white border border-slate-100 rounded-xl text-[13px] font-semibold text-slate-900 outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all " />
                                            <EyeOff className="absolute right-4 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-slate-400 cursor-pointer" />
                                        </div>
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-[12px] font-semibold text-slate-400 uppercase tracking-wide px-1">Confirm New Password</label>
                                        <div className="relative">
                                            <input type="password" placeholder="••••••••" className="w-full h-12 px-5 bg-white border border-slate-100 rounded-xl text-[13px] font-semibold text-slate-900 outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all " />
                                            <EyeOff className="absolute right-4 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-slate-400 cursor-pointer" />
                                        </div>
                                    </div>
                                    <button type="button" className="px-8 h-12 bg-primary text-white rounded-xl font-semibold text-[13px] hover:bg-primary/90 transition-all ">
                                        Update Password
                                    </button>
                                </form>
                            </div>

                            {/* Login Sessions */}
                            <div className="bg-white rounded-[32px] border border-slate-100 p-8 space-y-8">
                                <h3 className="text-md font-semibold text-slate-900">Active Sessions</h3>
                                <div className="space-y-6">
                                    <SessionItem
                                        device="MacBook Pro"
                                        location="Kigali, Rwanda"
                                        time="Active now"
                                        isCurrent={true}
                                        icon={<Laptop className="w-5 h-5 text-slate-400" />}
                                    />
                                    <SessionItem
                                        device="iPhone 15 Pro"
                                        location="Kigali, Rwanda"
                                        time="2 days ago"
                                        isCurrent={false}
                                        icon={<Smartphone className="w-5 h-5 text-slate-400" />}
                                    />
                                    <SessionItem
                                        device="iPad Air"
                                        location="Rubavu, Rwanda"
                                        time="5 days ago"
                                        isCurrent={false}
                                        icon={<Tablet className="w-5 h-5 text-slate-400" />}
                                    />
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

function InfoItem({ label, value, icon }: { label: string, value: string, icon?: React.ReactNode }) {
    return (
        <div className="space-y-1.5">
            <p className="text-[12px] font-semibold text-slate-400 uppercase tracking-wide">{label}</p>
            <div className="flex items-center gap-2">
                {icon}
                <p className="text-[14px] font-semibold text-slate-900">{value}</p>
            </div>
        </div>
    );
}

function NotificationToggle({ title, description, icon, defaultChecked }: { title: string, description: string, icon: React.ReactNode, defaultChecked: boolean }) {
    const [checked, setChecked] = useState(defaultChecked);
    return (
        <div className="flex items-center justify-between group">
            <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center group-hover:bg-slate-100 transition-colors">
                    {icon}
                </div>
                <div className="space-y-0.5">
                    <h4 className="text-[14px] font-semibold text-slate-900">{title}</h4>
                    <p className="text-[13px] text-slate-500 font-medium leading-relaxed max-w-sm">{description}</p>
                </div>
            </div>
            <button
                onClick={() => setChecked(!checked)}
                className={cn(
                    "w-11 h-6 rounded-full p-1 transition-all",
                    checked ? "bg-primary" : "bg-slate-200"
                )}
            >
                <div className={cn(
                    "w-4 h-4 bg-white rounded-full transition-all",
                    checked ? "translate-x-5" : "translate-x-0"
                )} />
            </button>
        </div>
    );
}

function SimpleToggle({ title, description, defaultChecked }: { title: string, description: string, defaultChecked: boolean }) {
    const [checked, setChecked] = useState(defaultChecked);
    return (
        <div className="flex items-center justify-between">
            <div className="space-y-0.5">
                <h4 className="text-[14px] font-semibold text-slate-900">{title}</h4>
                <p className="text-[13px] text-slate-500 font-medium">{description}</p>
            </div>
            <button
                onClick={() => setChecked(!checked)}
                className={cn(
                    "w-11 h-6 rounded-full p-1 transition-all",
                    checked ? "bg-primary" : "bg-slate-200"
                )}
            >
                <div className={cn(
                    "w-4 h-4 bg-white rounded-full transition-all",
                    checked ? "translate-x-5" : "translate-x-0"
                )} />
            </button>
        </div>
    );
}

function SessionItem({ device, location, time, isCurrent, icon }: { device: string, location: string, time: string, isCurrent: boolean, icon: React.ReactNode }) {
    return (
        <div className="flex items-center justify-between group">
            <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center group-hover:bg-slate-100 transition-colors">
                    {icon}
                </div>
                <div className="space-y-0.5">
                    <div className="flex items-center gap-2">
                        <h4 className="text-[14px] font-semibold text-slate-900">{device}</h4>
                        {isCurrent && <span className="text-[10px] font-semibold bg-green-50 text-green-600 px-1.5 py-0.5 rounded-md">Current</span>}
                    </div>
                    <p className="text-[13px] text-slate-500 font-medium">{location} • {time}</p>
                </div>
            </div>
            {!isCurrent && (
                <button className="p-2 text-slate-400 hover:text-primary transition-colors">
                    <LogOut className="w-5 h-5" />
                </button>
            )}
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
