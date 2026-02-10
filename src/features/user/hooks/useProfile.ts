import { useQuery } from "@tanstack/react-query";
import { userService } from "../services/user.service";
import { useUserStore } from "../store/userStore";
import { useEffect } from "react";

export const useProfile = () => {
    const { setUser } = useUserStore();

    const query = useQuery({
        queryKey: ["user", "me"],
        queryFn: async () => {
            const data = await userService.getMe();
            return data.data || data;
        },
        retry: false,
    });

    useEffect(() => {
        if (query.data) {
            setUser(query.data);
        }
    }, [query.data, setUser]);

    return query;
};
