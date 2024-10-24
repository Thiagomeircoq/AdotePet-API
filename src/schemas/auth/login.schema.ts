import { z } from 'zod'
import zodToJsonSchema from "zod-to-json-schema";

export const LoginSchema = z.object({
    email: z.string().min(1, { message: "Email is required" }),
    password: z.string().min(1, { message: "Password is required" }),
});

export const loginJsonSchema = zodToJsonSchema(LoginSchema);