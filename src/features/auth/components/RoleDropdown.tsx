"use client";

import { Check, ChevronDown, User, Camera } from "lucide-react";
import { useState, useRef, useEffect } from "react";
import { cn } from "@/lib/utils";

interface Role {
  id: "Client" | "Creator" | "Admin";
  label: string;
  icon: React.ReactNode;
}

const roles: Role[] = [
  {
    id: "Client",
    label: "Client",
    icon: <User className="w-4 h-4" />
  },
  {
    id: "Creator",
    label: "Creator",
    icon: <Camera className="w-4 h-4" />
  },
  // {
  //   id: "Admin",
  //   label: "Admin",
  //   icon: <ShieldCheck className="w-4 h-4" />
  // },
];

interface RoleDropdownProps {
  value: "Client" | "Creator" | "Admin";
  onChange: (value: "Client" | "Creator" | "Admin") => void;
}

export function RoleDropdown({ value, onChange }: RoleDropdownProps) {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const selectedRole = roles.find((r) => r.id === value) || roles[0];

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="relative w-full" ref={containerRef}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className={cn(
          "flex items-center justify-between w-full h-10 px-4 rounded-xl border bg-input transition-all text-sm",
          isOpen 
            ? "border-primary" 
            : "border-border hover:border-border/80"
        )}
      >
        <div className="flex items-center gap-2 text-foreground font-medium">
          <span className="text-muted-foreground/60">{selectedRole.icon}</span>
          <span>{selectedRole.label}</span>
        </div>
        <ChevronDown className={cn("w-4 h-4 text-muted-foreground transition-transform duration-200", isOpen && "rotate-180")} />
      </button>

      {isOpen && (
        <div className="absolute top-full left-0 right-0 mt-2 p-1 bg-white border border-border shadow-lg rounded-xl z-50 animate-in fade-in slide-in-from-top-1 duration-200">
          {roles.map((role) => (
            <button
              key={role.id}
              type="button"
              onClick={() => {
                onChange(role.id);
                setIsOpen(false);
              }}
              className={cn(
                "flex items-center justify-between w-full px-3 py-2 rounded-lg transition-colors text-sm",
                value === role.id
                  ? "bg-primary/5 text-primary font-semibold"
                  : "text-muted-foreground hover:bg-slate-50 hover:text-foreground"
              )}
            >
              <div className="flex items-center gap-2">
                <span className={cn("transition-colors", value === role.id ? "text-primary" : "text-muted-foreground/60")}>
                  {role.icon}
                </span>
                <span>{role.label}</span>
              </div>
              {value === role.id && <Check className="w-4 h-4 text-primary" />}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
