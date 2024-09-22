import { Gender, Color, Size } from '@prisma/client';

export interface PetDTO {
    id: number;
    name: string;
    color: Color;
    species: {
        id: number,
        name: string;
    };
    size: Size;
    age: number;
    gender: Gender;
    created_at: Date;
    updated_at: Date;
}

export interface CreatePetDTO {
    name: string;
    species: number;
    color: Color;
    size: Size;
    age: number;
    gender: Gender;
}

export interface UpdatePetDTO {
    name?: string;
    species?: number;
    color?: Color;
    size?: Size;
    age?: number;
    gender?: Gender;
}

export interface PetRepository {
    create(data: CreatePetDTO): Promise<PetDTO>;
    findById(id: number): Promise<PetDTO | null>;
    delete(id: number): Promise<void>;
}