import { Gender, Color, Size } from '@prisma/client';

export interface PetDTO {
    id: string;
    name: string;
    color: Color;
    species: {
        id: string,
        name: string;
    };
    size: Size;
    age: number;
    breed?: string | null;
    gender: Gender;
    created_at: Date;
    updated_at: Date;
}

export interface CreatePetDTO {
    name: string;
    species: string;
    color: Color;
    size: Size;
    age: number;
    breed?: string;
    gender: Gender;
}

export interface UpdatePetDTO {
    name?: string;
    species?: string;
    color?: Color;
    size?: Size;
    breed?: string;
    age?: number;
    gender?: Gender;
}

export interface PetRepository {
    create(data: CreatePetDTO): Promise<PetDTO>;
    findById(id: string): Promise<PetDTO | null>;
    delete(id: string): Promise<void>;
}