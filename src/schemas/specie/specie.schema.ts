import { z } from "zod";
import zodToJsonSchema from "zod-to-json-schema";

export const SpecieSchema = z.object({
    name: z.string().min(1, { message: "Name is required" }),
});

export const specieJsonSchema = zodToJsonSchema(SpecieSchema);