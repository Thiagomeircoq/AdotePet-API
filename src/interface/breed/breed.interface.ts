export interface BreedDTO {
    id: string;
    name: string;
    species?: {
        id: string,
        name: string;
    };
}

export interface CreateBreedDTO {
    name: string;
    specie_id: string;
}

export interface UpdateBreedDTO {
    id: string;
    name: string;
    specie_id: string;
}

export interface BreedRepository {
    findById(id: string): Promise<BreedDTO | null>;
    findAll(): Promise<BreedDTO[]>;
    findAllBySpecieId(specie_id: string): Promise<BreedDTO[]>;
    create(data: CreateBreedDTO): Promise<BreedDTO>;
    update(data: UpdateBreedDTO): Promise<BreedDTO>;
    delete(id: string): Promise<void>;
    belongsToSpecies(breed_id: string, specie_id: string): Promise<boolean>;
}