import { z } from "zod";
import zodToJsonSchema from "zod-to-json-schema";

export const BreedSchema = z.object({
    name: z.string().min(1, { message: "Name is required" }),
    specie_id: z.string().min(1, { message: "Specie is required" }),
});

export const breedJsonSchema = zodToJsonSchema(BreedSchema);