import { z } from "zod";

export const registerSchema = z.object({
    role: z.enum(["Client", "Creator", "Admin"], {
        error: "Please select a role",
    }),
    firstName: z.string().min(2, "First name must be at least 2 characters"),
    lastName: z.string().min(2, "Last name must be at least 2 characters"),
    emailOrPhone: z.string().min(5, "Please enter a valid email or phone number"),
    password: z.string().min(8, "Password must be at least 8 characters"),
    confirmPassword: z.string().min(8, "Please confirm your password"),
}).refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
});

export type RegisterSchema = z.infer<typeof registerSchema>;
