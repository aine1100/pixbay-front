"use client";

import * as React from "react";
import { createPortal } from "react-dom";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";

interface DialogProps {
    open?: boolean;
    onOpenChange?: (open: boolean) => void;
    children: React.ReactNode;
}

const Dialog = ({ open, onOpenChange, children }: DialogProps) => {
    if (!open) return null;
    return <>{children}</>;
};

const DialogContent = React.forwardRef<
    HTMLDivElement,
    React.HTMLAttributes<HTMLDivElement> & { onOpenChange?: (open: boolean) => void }
>(({ className, children, ...props }, ref) => {
    const [mounted, setMounted] = React.useState(false);

    React.useEffect(() => {
        setMounted(true);
        document.body.style.overflow = "hidden";
        return () => {
            document.body.style.overflow = "unset";
        };
    }, []);

    if (!mounted) return null;

    return createPortal(
        <div className="fixed inset-0 z-[110] flex items-center justify-center">
            {/* Backdrop */}
            <div
                className="absolute inset-0 bg-black/40 backdrop-blur-sm animate-in fade-in duration-300"
                onClick={() => props.onOpenChange?.(false)}
            />

            {/* Content */}
            <div
                ref={ref}
                className={cn(
                    "relative z-[120] w-full max-w-lg bg-white shadow-2xl animate-in zoom-in-95 duration-300 rounded-[32px] overflow-hidden border border-slate-100",
                    className
                )}
                {...props}
            >
                {children}
            </div>
        </div>,
        document.body
    );
});
DialogContent.displayName = "DialogContent";

const DialogHeader = ({
    className,
    ...props
}: React.HTMLAttributes<HTMLDivElement>) => (
    <div
        className={cn("flex flex-col space-y-1.5 text-center sm:text-left p-6", className)}
        {...props}
    />
);
DialogHeader.displayName = "DialogHeader";

const DialogTitle = React.forwardRef<
    HTMLHeadingElement,
    React.HTMLAttributes<HTMLHeadingElement>
>(({ className, ...props }, ref) => (
    <h2
        ref={ref}
        className={cn("text-lg font-semibold leading-none tracking-tight", className)}
        {...props}
    />
));
DialogTitle.displayName = "DialogTitle";

const DialogDescription = React.forwardRef<
    HTMLParagraphElement,
    React.HTMLAttributes<HTMLParagraphElement>
>(({ className, ...props }, ref) => (
    <p
        ref={ref}
        className={cn("text-sm text-slate-500", className)}
        {...props}
    />
));
DialogDescription.displayName = "DialogDescription";

const DialogFooter = ({
    className,
    ...props
}: React.HTMLAttributes<HTMLDivElement>) => (
    <div
        className={cn(
            "flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-2 p-6 pt-0",
            className
        )}
        {...props}
    />
);
DialogFooter.displayName = "DialogFooter";

export { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter };
