import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { userService } from "../services/user.service";
import { toast } from "react-hot-toast";

export const useUserSessions = (page = 1) => {
    return useQuery({
        queryKey: ["userSessions", page],
        queryFn: () => userService.getSessions(page),
    });
};

export const useUpdateProfile = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (data: any) => userService.updateProfile(data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["user"] });
            toast.success("Profile updated successfully!");
        },
        onError: (error: any) => {
            toast.error(error?.response?.data?.message || "Failed to update profile");
        }
    });
};

export const useRevokeSession = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (sessionId: string) => userService.revokeSession(sessionId),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["userSessions"] });
            toast.success("Session revoked successfully");
        },
        onError: (error: any) => {
            toast.error(error?.response?.data?.message || "Failed to revoke session");
        }
    });
};
