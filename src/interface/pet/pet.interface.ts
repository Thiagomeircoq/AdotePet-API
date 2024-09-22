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
    breed?: {
        id: string;
        name: string;
    } | null;
    gender: Gender;
    created_at: Date;
    updated_at: Date;
}

export interface CreatePetDTO {
    name: string;
    specie_id: string;
    color: Color;
    size: Size;
    age: number;
    breed_id?: string;
    gender: Gender;
}

export interface UpdatePetDTO {
    id: string;
    name: string;
    specie_id: string;
    color: Color;
    size: Size;
    breed_id?: string;
    age: number;
    gender: Gender;
}

export interface PetRepository {
    findById(id: string): Promise<PetDTO | null>;
    findAll(): Promise<PetDTO[]>;
    create(data: CreatePetDTO): Promise<PetDTO>;
    update(data: UpdatePetDTO): Promise<PetDTO>;
    delete(id: string): Promise<void>;
}