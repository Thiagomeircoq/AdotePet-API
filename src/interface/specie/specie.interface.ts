export interface SpecieDTO {
    id: string;
    name: string;
}

export interface CreateSpecieDTO {
    name: string;
}

export interface UpdatePetDTO {
    name: string;
}

export interface SpecieRepository {
    create(data: CreateSpecieDTO): Promise<SpecieDTO>;
    findById(id: string): Promise<SpecieDTO | null>;
    delete(id: string): Promise<void>;
    findAll(): Promise<SpecieDTO[]>;
}