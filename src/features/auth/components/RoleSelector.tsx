"use client";

import { User, Camera, ShieldCheck, Check } from "lucide-react";
import { cn } from "@/lib/utils";

interface RoleOption {
    id: "Client" | "Creator" | "Admin";
    label: string;
    icon: React.ReactNode;
}

const roles: RoleOption[] = [
    { id: "Client", label: "Client", icon: <User className="w-5 h-5 text-primary" /> },
    { id: "Creator", label: "Creator", icon: <Camera className="w-5 h-5 text-muted-foreground" /> },
    { id: "Admin", label: "Admin", icon: <ShieldCheck className="w-5 h-5 text-muted-foreground" /> },
];

interface RoleSelectorProps {
    value: string;
    onChange: (value: "Client" | "Creator" | "Admin") => void;
}

export function RoleSelector({ value, onChange }: RoleSelectorProps) {
  return (
    <div className="grid grid-cols-3 gap-5">
      {roles.map((role) => (
        <button
          key={role.id}
          type="button"
          onClick={() => onChange(role.id)}
          className={cn(
            "flex flex-col items-center justify-center gap-3 p-4 rounded-2xl border-2 transition-all h-28 group relative overflow-hidden",
            value === role.id
              ? "border-primary bg-primary/5 shadow-md shadow-primary/10 scale-[1.02]"
              : "border-zinc-100 bg-zinc-50 hover:border-zinc-200 hover:bg-zinc-100/50"
          )}
        >
          {value === role.id && (
            <div className="absolute top-2 right-2">
              <div className="bg-primary text-white p-0.5 rounded-full">
                <Check className="w-3 h-3" />
              </div>
            </div>
          )}
          <div className={cn(
            "p-3 rounded-xl transition-all",
            value === role.id 
              ? "bg-white text-primary shadow-sm shadow-primary/20" 
              : "bg-white text-zinc-400 group-hover:text-zinc-600 shadow-sm"
          )}>
            {role.icon}
          </div>
          <span className={cn(
            "text-sm font-bold tracking-tight",
            value === role.id ? "text-primary text-opacity-100" : "text-zinc-500 group-hover:text-zinc-700"
          )}>
            {role.label}
          </span>
        </button>
      ))}
    </div>
  );
}
