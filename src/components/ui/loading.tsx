"use client";

interface LoadingProps {
    size?: "sm" | "md" | "lg";
    text?: string;
    fullScreen?: boolean;
}

export function Loading({ size = "md", text, fullScreen = false }: LoadingProps) {
    const sizeMap = {
        sm: "h-4 w-4 border-2",
        md: "h-8 w-8 border-3",
        lg: "h-12 w-12 border-4",
    };

    const containerClasses = fullScreen 
        ? "fixed inset-0 flex flex-col items-center justify-center bg-background/80 backdrop-blur-sm z-50"
        : "flex flex-col items-center justify-center p-4 w-full";

    return (
        <div className={containerClasses}>
            <div className="relative">
                {/* Outer ring */}
                <div 
                    className={`${sizeMap[size]} rounded-full border-primary/20`}
                />
                {/* Spinning ring */}
                <div 
                    className={`${sizeMap[size]} rounded-full border-t-primary animate-spin absolute inset-0`}
                />
            </div>
            {text && (
                <p className="mt-4 text-sm font-medium text-muted-foreground animate-pulse">
                    {text}
                </p>
            )}
        </div>
    );
}

// Full page loading shorthand
export function PageLoading() {
    return <Loading fullScreen size="lg" text="Loading Pixbay..." />;
}
