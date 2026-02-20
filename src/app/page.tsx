"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { authStorage } from "@/lib/auth-storage";
import { Loading } from "@/components/ui/loading";

export default function Home() {
    const router = useRouter();

    useEffect(() => {
        if (authStorage.isAuthenticated()) {
            const user = authStorage.getUserFromToken();
            const dashboardPath = user?.role === "CREATOR" ? "/creator" : "/client";
            router.replace(dashboardPath);
        } else {
            router.replace("/login");
        }
    }, [router]);

    return (
        <div className="min-h-screen flex items-center justify-center bg-white">
            <Loading size="lg" />
        </div>
    );
}
