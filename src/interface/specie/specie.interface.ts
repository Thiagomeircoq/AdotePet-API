export interface SpecieDTO {
    id: string;
    name: string;
}

export interface CreateSpecieDTO {
    name: string;
}

export interface UpdateSpecieDTO {
    id: string;
    name: string;
}

export interface SpecieRepository {
    create(data: CreateSpecieDTO): Promise<SpecieDTO>;
    findById(id: string): Promise<SpecieDTO | null>;
    delete(id: string): Promise<void>;
    findAll(): Promise<SpecieDTO[]>;
    update(data: UpdateSpecieDTO): Promise<SpecieDTO>;
}