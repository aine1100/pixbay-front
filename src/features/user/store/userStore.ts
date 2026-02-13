import { create } from "zustand";
import { authStorage } from "@/lib/auth-storage";

interface UserProfile {
    id: string;
    email?: string;
    firstName: string;
    lastName: string;
    role: string;
    avatar?: string;
    profilePicture?: string;
}

interface UserStore {
    user: UserProfile | null;
    setUser: (user: UserProfile | null) => void;
}

export const useUserStore = create<UserStore>((set) => ({
    user: authStorage.getUserFromToken() as UserProfile | null,
    setUser: (user: UserProfile | null) => set({ user }),
}));
