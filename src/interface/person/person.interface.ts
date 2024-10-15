import { Gender } from "@prisma/client";

export interface PersonDTO {
    id: string;
    first_name: string;
    last_name: string;
    gender: Gender;
    birthdate: Date;
    profile_picture: string | null;
    created_at: Date;
    updated_at: Date;
}