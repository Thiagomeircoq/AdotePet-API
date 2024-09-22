import { z } from "zod";
import { Gender, Color, Size } from "@prisma/client";

export const PetSchema = z.object({
    name: z.string().min(1, { message: "Name is required" }),
    species: z
        .string()
        .transform((val) => Number(val))
        .refine((val) => !isNaN(val), { message: "Species must be a number" }),
    color: z.enum(Object.values(Color) as [Color, ...Color[]], {
        message: "Invalid color",
    }),
    size: z.enum(Object.values(Size) as [Size, ...Size[]], {
        message: "Invalid size",
    }),
    age: z
        .string()
        .transform((val) => Number(val))
        .refine((val) => !isNaN(val), { message: "Age must be a number" }),
    gender: z.enum(Object.values(Gender) as [Gender, ...Gender[]], {
        message: "Gender must be either 'M' or 'F'",
    }),
});
