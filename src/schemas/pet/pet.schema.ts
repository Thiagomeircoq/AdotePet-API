import { z } from "zod";
import { Gender, Color, Size } from "@prisma/client";
import zodToJsonSchema from "zod-to-json-schema";

export const PetSchema = z.object({
    name: z.string().min(1, { message: "Name is required" }),
    species: z.string().min(1, { message: "Species is required" }),
    breed: z.string().min(1, { message: "Breed is required" }),
    color: z.nativeEnum(Color, { message: "Invalid color" }),
    size: z.nativeEnum(Size, { message: "Invalid size" }),
    age: z
        .string()
        .transform((val) => Number(val))
        .refine((val) => !isNaN(val), { message: "Age must be a number" }),

    gender: z.nativeEnum(Gender, { message: "Gender must be either 'M' or 'F'" }),
});

export const petJsonSchema = zodToJsonSchema(PetSchema);