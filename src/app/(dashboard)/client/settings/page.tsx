"use client";

import { useState, useRef, useEffect, useMemo } from "react";
import {
    User as UserIcon,
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
import { useProfile } from "@/features/user/hooks/useProfile";
import { useUpdateProfile, useUserSessions, useRevokeSession } from "@/features/user/hooks/useUser";
import { Loading } from "@/components/ui/loading";
import { authService } from "@/features/auth/services/auth.service";
import { toast } from "react-hot-toast";

const SETTINGS_TABS = [
    { id: "profile", label: "My Profile", icon: UserIcon },
    { id: "notifications", label: "Notifications", icon: Bell },
    { id: "preferences", label: "Preferences", icon: Sliders },
    { id: "security", label: "Password and Security", icon: Shield },
];

export default function SettingsPage() {
    const [activeTab, setActiveTab] = useState("profile");
    const [isEditingProfile, setIsEditingProfile] = useState(false);
    const [isEditingAddress, setIsEditingAddress] = useState(false);
    const [editedUser, setEditedUser] = useState<any>(null);

    // Preference States
    const [language, setLanguage] = useState("English (US)");
    const [currency, setCurrency] = useState("USD ($)");

    const { data: profile, isLoading: isProfileLoading } = useProfile();
    const { data: sessions, isLoading: isSessionsLoading } = useUserSessions();
    const updateProfile = useUpdateProfile();
    const revokeSession = useRevokeSession();


    // Sync preferences when profile loads
    useEffect(() => {
        if (profile?.preferences) {
            if (profile.preferences.language) setLanguage(profile.preferences.language);
            if (profile.preferences.currency) setCurrency(profile.preferences.currency);
        }
    }, [profile]);

    // Initialize/Sync editedUser when starting to edit
    useEffect(() => {
        if (profile && (isEditingProfile || isEditingAddress) && !editedUser) {
            setEditedUser({ ...profile });
        }
    }, [profile, isEditingProfile, isEditingAddress, editedUser]);

    const handleUpdate = async (data?: any) => {
        try {
            const rawData = data || editedUser;
            // Filter out read-only fields that Prisma might complain about
            const { 
                id, email, role, isVerified, isActive, createdAt, updatedAt, 
                passwordHash, resetToken, resetTokenExpires, otp, otpExpires, 
                lastLoginAt, creatorProfile, ...updateData 
            } = rawData;

            await updateProfile.mutateAsync(updateData);
            setIsEditingProfile(false);
            setIsEditingAddress(false);
            setEditedUser(null);
        } catch (error) {
            // Error handled by hook toast
        }
    };

    if (isProfileLoading) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[400px]">
                <Loading size="lg" />
                <p className="mt-4 text-sm font-medium text-slate-500">Loading your settings...</p>
            </div>
        );
    }

    const userData = profile || {};
    const fullName = `${userData.firstName || ""} ${userData.lastName || ""}`.trim() || "User";

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
                                        <div className="w-20 h-20 rounded-full overflow-hidden border-2 border-slate-50 relative bg-slate-100">
                                            {userData.profilePicture ? (
                                                <NextImage
                                                    src={userData.profilePicture}
                                                    alt={fullName}
                                                    fill
                                                    className="object-cover"
                                                />
                                            ) : (
                                                <div className="w-full h-full flex items-center justify-center text-2xl font-bold text-slate-400">
                                                    {userData.firstName?.[0]}{userData.lastName?.[0]}
                                                </div>
                                            )}
                                        </div>
                                        <div className="space-y-1">
                                            <h3 className="text-lg font-semibold text-slate-900">{fullName}</h3>
                                            <p className="text-[13px] text-slate-500 font-medium">{userData.role || "Client"}</p>
                                            <div className="flex items-center gap-1.5 text-[13px] text-slate-400 font-medium">
                                                <MapPin className="w-3.5 h-3.5 text-slate-400" />
                                                <span>{userData.city || "Not set"}, {userData.country || ""}</span>
                                            </div>
                                        </div>
                                    </div>
                                    <button className="flex items-center gap-2 px-5 h-10 bg-primary/10 text-primary rounded-xl font-semibold text-[13px] hover:bg-primary/20 transition-all">
                                        Edit
                                        <Edit3 className="w-4 h-4" />
                                    </button>
                                </div>
                            </div>

                            {/* Personal Info Section */}
                            <div className="bg-white rounded-[32px] border border-slate-100 p-8 space-y-8">
                                <div className="flex items-center justify-between">
                                    <h2 className="text-lg font-semibold text-slate-900">Personal Info</h2>
                                    <button 
                                        onClick={() => {
                                            if (isEditingProfile) {
                                                handleUpdate();
                                            } else {
                                                setIsEditingProfile(true);
                                            }
                                        }}
                                        className="flex items-center gap-2 px-5 h-10 bg-primary/10 text-primary rounded-xl font-semibold text-[13px] hover:bg-primary/20 transition-all"
                                    >
                                        {isEditingProfile ? "Save Changes" : "Edit"}
                                        {isEditingProfile ? <Check className="w-4 h-4" /> : <Edit3 className="w-4 h-4" />}
                                    </button>
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-y-8 gap-x-12">
                                    {isEditingProfile ? (
                                        <>
                                            <div className="space-y-1.5">
                                                <p className="text-[12px] font-semibold text-slate-400 uppercase tracking-wide">First Name</p>
                                                <input 
                                                    type="text" 
                                                    value={editedUser?.firstName || ""} 
                                                    onChange={(e) => setEditedUser({ ...editedUser, firstName: e.target.value })}
                                                    className="w-full h-10 px-3 bg-white border border-slate-200 rounded-lg text-sm focus:border-primary outline-none"
                                                />
                                            </div>
                                            <div className="space-y-1.5">
                                                <p className="text-[12px] font-semibold text-slate-400 uppercase tracking-wide">Last Name</p>
                                                <input 
                                                    type="text" 
                                                    value={editedUser?.lastName || ""} 
                                                    onChange={(e) => setEditedUser({ ...editedUser, lastName: e.target.value })}
                                                    className="w-full h-10 px-3 bg-white border border-slate-200 rounded-lg text-sm focus:border-primary outline-none"
                                                />
                                            </div>
                                            <div className="space-y-1.5">
                                                <p className="text-[12px] font-semibold text-slate-400 uppercase tracking-wide">Gender</p>
                                                <ModernSelect 
                                                    value={editedUser?.gender || "Select Gender"} 
                                                    onChange={(val) => setEditedUser({ ...editedUser, gender: val })}
                                                    options={["Male", "Female", "Other"]}
                                                />
                                            </div>
                                            <div className="space-y-1.5">
                                                <p className="text-[12px] font-semibold text-slate-400 uppercase tracking-wide">Phone Number</p>
                                                <input 
                                                    type="text" 
                                                    value={editedUser?.phoneNumber || ""} 
                                                    onChange={(e) => setEditedUser({ ...editedUser, phoneNumber: e.target.value })}
                                                    className="w-full h-10 px-3 bg-white border border-slate-200 rounded-lg text-sm focus:border-primary outline-none"
                                                />
                                            </div>
                                        </>
                                    ) : (
                                        <>
                                            <InfoItem label="First Name" value={userData.firstName || "---"} />
                                            <InfoItem label="Last Name" value={userData.lastName || "---"} />
                                            <InfoItem label="Gender" value={userData.gender || "Not specified"} />
                                            <InfoItem label="Role" value={userData.role || "Client"} />
                                            <InfoItem label="email address" value={userData.email || "---"} />
                                            <InfoItem label="Phone Number" value={userData.phoneNumber || "Not set"} />
                                            <InfoItem
                                                label="Date of Birth"
                                                value={userData.dateOfBirth ? new Date(userData.dateOfBirth).toLocaleDateString() : "Not set"}
                                                icon={<Calendar className="w-4 h-4 text-slate-400" />}
                                            />
                                        </>
                                    )}
                                </div>
                            </div>

                            {/* Address Section */}
                            <div className="bg-white rounded-[32px] border border-slate-100 p-8 space-y-8">
                                <div className="flex items-center justify-between">
                                    <h2 className="text-lg font-semibold text-slate-900">Address</h2>
                                    <button 
                                        onClick={() => {
                                            if (isEditingAddress) {
                                                handleUpdate();
                                            } else {
                                                setIsEditingAddress(true);
                                            }
                                        }}
                                        className="flex items-center gap-2 px-5 h-10 bg-primary/10 text-primary rounded-xl font-semibold text-[13px] hover:bg-primary/20 transition-all"
                                    >
                                        {isEditingAddress ? "Save Changes" : "Edit"}
                                        {isEditingAddress ? <Check className="w-4 h-4" /> : <Edit3 className="w-4 h-4" />}
                                    </button>
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-y-8 gap-x-12">
                                    {isEditingAddress ? (
                                        <>
                                            <div className="space-y-1.5">
                                                <p className="text-[12px] font-semibold text-slate-400 uppercase tracking-wide">Country</p>
                                                <input 
                                                    type="text" 
                                                    value={editedUser?.country || ""} 
                                                    onChange={(e) => setEditedUser({ ...editedUser, country: e.target.value })}
                                                    className="w-full h-10 px-3 bg-white border border-slate-200 rounded-lg text-sm focus:border-primary outline-none"
                                                />
                                            </div>
                                            <div className="space-y-1.5">
                                                <p className="text-[12px] font-semibold text-slate-400 uppercase tracking-wide">City</p>
                                                <input 
                                                    type="text" 
                                                    value={editedUser?.city || ""} 
                                                    onChange={(e) => setEditedUser({ ...editedUser, city: e.target.value })}
                                                    className="w-full h-10 px-3 bg-white border border-slate-200 rounded-lg text-sm focus:border-primary outline-none"
                                                />
                                            </div>
                                        </>
                                    ) : (
                                        <>
                                            <InfoItem label="Country" value={userData.country || "Not set"} />
                                            <InfoItem label="City" value={userData.city || "Not set"} />
                                        </>
                                    )}
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
                                        checked={userData.preferences?.notifications?.email ?? true}
                                        onChange={(checked) => handleUpdate({
                                            preferences: {
                                                ...userData.preferences,
                                                notifications: { ...userData.preferences?.notifications, email: checked }
                                            }
                                        })}
                                    />
                                    <NotificationToggle
                                        title="Push Notifications"
                                        description="Receive instant alerts on your mobile device or browser."
                                        icon={<Smartphone className="w-5 h-5 text-slate-400" />}
                                        checked={userData.preferences?.notifications?.push ?? true}
                                        onChange={(checked) => handleUpdate({
                                            preferences: {
                                                ...userData.preferences,
                                                notifications: { ...userData.preferences?.notifications, push: checked }
                                            }
                                        })}
                                    />
                                    <NotificationToggle
                                        title="Marketing Updates"
                                        description="Receive news, promotions, and product updates."
                                        icon={<Globe className="w-5 h-5 text-slate-400" />}
                                        checked={userData.preferences?.notifications?.marketing ?? false}
                                        onChange={(checked) => handleUpdate({
                                            preferences: {
                                                ...userData.preferences,
                                                notifications: { ...userData.preferences?.notifications, marketing: checked }
                                            }
                                        })}
                                    />
                                </div>
                            </div>

                            {/* Activity Notifications */}
                            <div className="bg-white rounded-[32px] border border-slate-100 p-8 space-y-8">
                                <h3 className="text-md font-semibold text-slate-900">Activity Notifications</h3>
                                <div className="space-y-6">
                                    <SimpleToggle
                                        title="New Messages"
                                        description="When someone sends you a message"
                                        checked={userData.preferences?.notifications?.messages ?? true}
                                        onChange={(checked) => handleUpdate({
                                            preferences: {
                                                ...userData.preferences,
                                                notifications: { ...userData.preferences?.notifications, messages: checked }
                                            }
                                        })}
                                    />
                                    <SimpleToggle
                                        title="Booking Requests"
                                        description="When a creator accepts or declines a request"
                                        checked={userData.preferences?.notifications?.bookings ?? true}
                                        onChange={(checked) => handleUpdate({
                                            preferences: {
                                                ...userData.preferences,
                                                notifications: { ...userData.preferences?.notifications, bookings: checked }
                                            }
                                        })}
                                    />
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
                                            onChange={(val) => {
                                                setLanguage(val);
                                                handleUpdate({ preferences: { ...userData.preferences, language: val } });
                                            }}
                                            options={["English (US)", "French", "Swahili", "Kinyarwanda"]}
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-[12px] font-semibold text-slate-400 uppercase tracking-wide px-1">Currency</label>
                                        <ModernSelect
                                            value={currency}
                                            onChange={(val) => {
                                                setCurrency(val);
                                                handleUpdate({ preferences: { ...userData.preferences, currency: val } });
                                            }}
                                            options={["USD ($)", "RWF (FRw)", "EUR (€)"]}
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* Privacy */}
                            <div className="bg-white rounded-[32px] border border-slate-100 p-8 space-y-8">
                                <h3 className="text-md font-semibold text-slate-900">Privacy Settings</h3>
                                <div className="space-y-6">
                                    <SimpleToggle
                                        title="Public Profile"
                                        description="Allow creators and others to find your profile in search results"
                                        checked={userData.preferences?.privacy?.publicProfile ?? true}
                                        onChange={(checked) => handleUpdate({
                                            preferences: {
                                                ...userData.preferences,
                                                privacy: { ...userData.preferences?.privacy, publicProfile: checked }
                                            }
                                        })}
                                    />
                                    <SimpleToggle
                                        title="Show Online Status"
                                        description="Let others see when you are active on the platform"
                                        checked={userData.preferences?.privacy?.showOnline ?? true}
                                        onChange={(checked) => handleUpdate({
                                            preferences: {
                                                ...userData.preferences,
                                                privacy: { ...userData.preferences?.privacy, showOnline: checked }
                                            }
                                        })}
                                    />
                                </div>
                            </div>
                        </div>
                    )}

                    {activeTab === "security" && (
                        <div className="space-y-8">
                            {/* Password Section */}
                            <div className="bg-white rounded-[32px] border border-slate-100 p-8 space-y-8">
                                <div className="space-y-1">
                                    <h2 className="text-lg font-semibold text-slate-900">Password and Security</h2>
                                    <p className="text-[13px] text-slate-500 font-medium">Keep your account secure.</p>
                                </div>

                                <div className="p-4 bg-blue-50/50 rounded-2xl border border-blue-100/50 flex items-start gap-4">
                                    <div className="w-10 h-10 rounded-xl bg-blue-100/50 flex items-center justify-center shrink-0">
                                        <Shield className="w-5 h-5 text-primary" />
                                    </div>
                                    <div className="space-y-1">
                                        <h4 className="text-[14px] font-semibold text-slate-900">OTP Verification</h4>
                                        <p className="text-[13px] text-slate-500 font-medium leading-relaxed">
                                            For your security, password updates require OTP verification. You'll be asked to verify your identity via email.
                                        </p>
                                        <button
                                            onClick={async () => {
                                                if (userData.email) {
                                                    try {
                                                        await authService.forgotPassword(userData.email);
                                                        toast.success("Security code sent to your email!");
                                                    } catch (error: any) {
                                                        toast.error(error.message || "Failed to send code");
                                                    }
                                                }
                                            }}
                                            className="mt-2 text-[13px] font-semibold text-primary hover:underline"
                                        >
                                            Update Password via OTP
                                        </button>
                                    </div>
                                </div>
                            </div>

                            {/* Active Sessions */}
                            <div className="bg-white rounded-[32px] border border-slate-100 p-8 space-y-8">
                                <h3 className="text-md font-semibold text-slate-900">Active Sessions</h3>
                                <div className="space-y-6">
                                    {sessions && sessions.length > 0 ? (
                                        sessions.map((session: any) => (
                                            <SessionItem
                                                key={session.id}
                                                device={session.deviceInfo || "Unknown Device"}
                                                location={session.ipAddress || "Unknown Location"}
                                                time={new Date(session.createdAt).toLocaleString()}
                                                isCurrent={false} // Currently not tracking current session ID
                                                icon={
                                                    session.deviceInfo?.toLowerCase().includes("mobile") ? <Smartphone className="w-5 h-5 text-slate-400" /> :
                                                    session.deviceInfo?.toLowerCase().includes("tablet") ? <Tablet className="w-5 h-5 text-slate-400" /> :
                                                    <Laptop className="w-5 h-5 text-slate-400" />
                                                }
                                                onRevoke={() => revokeSession.mutate(session.id)}
                                            />
                                        ))
                                    ) : (
                                        <p className="text-sm text-slate-500">No active sessions found. Log in again to track new sessions.</p>
                                    )}
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

// Sub-components
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

function NotificationToggle({ title, description, icon, checked, onChange }: { title: string, description: string, icon: React.ReactNode, checked: boolean, onChange: (checked: boolean) => void }) {
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
                onClick={() => onChange(!checked)}
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

function SimpleToggle({ title, description, checked, onChange }: { title: string, description: string, checked: boolean, onChange: (checked: boolean) => void }) {
    return (
        <div className="flex items-center justify-between">
            <div className="space-y-0.5">
                <h4 className="text-[14px] font-semibold text-slate-900">{title}</h4>
                <p className="text-[13px] text-slate-500 font-medium">{description}</p>
            </div>
            <button
                onClick={() => onChange(!checked)}
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

function SessionItem({ device, location, time, isCurrent, icon, onRevoke }: { device: string, location: string, time: string, isCurrent: boolean, icon: React.ReactNode, onRevoke?: () => void }) {
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
            {!isCurrent && onRevoke && (
                <button 
                    onClick={onRevoke}
                    className="p-2 text-slate-400 hover:text-red-500 transition-colors"
                >
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
