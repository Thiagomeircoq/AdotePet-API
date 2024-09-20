export interface PetDTO {
    id: number;
    name?: string;
    species?: number;
    color?: number;
    size: number;
    age: number;
    gender: 'M' | 'F';
    created_at: Date;
    updated_at: Date;
}

export interface CreatePetDTO {
    name: string;
    species: number;
    color: number;
    size: number;
    age: number;
    gender: 'M' | 'F';
}

export interface UpdatePetDTO {
    name?: string;
    species?: number;
    color?: number;
    size?: number;
    age?: number;
    gender?: 'M' | 'F';
}