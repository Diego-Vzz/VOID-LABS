import { SystemRolesTuple } from "./users.interface";
import { z } from "zod";

export const UserSchema = {
    Create: {
        body: z.object({
            username: z.string()
                .min(4, "Must be between 4 and 16 characters.")
                .max(16, "Must be between 4 and 16 characters."),
            email: z.string()
                .email("Invalid email")
                .max(250, "Maximum 250 characters allowed."),
            password: z.string()
                .min(6, "Must be between 6 and 255 characters.")
                .max(255, "Must be between 6 and 255 characters."),
            role: z.enum(SystemRolesTuple, 'Please select a role.'),
            active: z.boolean().optional(),
        })
    },
}
