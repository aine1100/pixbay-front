import { useQuery } from "@tanstack/react-query";
import { chatService } from "../services/chat.service";

export const useChats = () => {
    return useQuery({
        queryKey: ["chats"],
        queryFn: async () => {
            return await chatService.listChats();
        },
        refetchInterval: 30000, // Poll every 30 seconds
    });
};
