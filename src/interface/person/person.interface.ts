import { Gender } from "@prisma/client";

export interface PersonDTO {
    id: string;
    first_name: string;
    last_name: string;
    gender: Gender;
    birthdate: Date;
    cpf: string;
    profile_picture: string | null;
    about: string | null;
    created_at: Date;
    updated_at: Date;
}

export interface PersonRepository {
    findByCpf(cpf: string): Promise<PersonDTO | null>;
}