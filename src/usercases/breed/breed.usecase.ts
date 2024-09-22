import { HttpError } from "../../errors/HttpError";
import { BreedRepository, CreateBreedDTO, UpdateBreedDTO } from "../../interface/breed/breed.interface";
import { SpecieRepository } from "../../interface/specie/specie.interface";
import { BreedRepositoryPrisma } from "../../repositories/breed/breed.repository";
import { SpecieRepositoryPrisma } from "../../repositories/specie/specie.repository";

class BreedUseCase {
    private breedRepository: BreedRepository
    private speciesRepository: SpecieRepository

    constructor() {
        this.breedRepository = new BreedRepositoryPrisma;
        this.speciesRepository = new SpecieRepositoryPrisma;
    }

    async findById(id: string) {
        if (!id)
            throw new HttpError({ code: 400, message: 'Breed ID is required.' });

        const breed = await this.breedRepository.findById(id);

        if (!breed)
            throw new HttpError({ code: 404, message: `Breed with ID ${id} not found.` });

        return breed;
    }

    async findAll() {
        const breeds = await this.breedRepository.findAll();

        if (!breeds)
            throw new HttpError({ code: 404, message: 'No Breeds found.' });

        return breeds;
    }

    async findAllBySpecieId(specie_id: string) {
        if (!specie_id)
            throw new HttpError({ code: 400, message: 'Specie ID is required.' });

        const specie = await this.speciesRepository.findById(specie_id);

        if (!specie)
            throw new HttpError({ code: 404, message: `Specie with ID ${specie_id} not found.` });

        const breeds = await this.breedRepository.findAllBySpecieId(specie_id);

        if (!breeds)
            throw new HttpError({ code: 404, message: 'No Breeds found for this Specie.' });

        return breeds;
    }

    async create(data: CreateBreedDTO) {
        const { name, specie_id } = data;

        const breed = await this.breedRepository.create({
            name,
            specie_id
        });

        return breed;
    }

    async delete(id: string) {
        await this.findById(id);

        await this.breedRepository.delete(id);

        return { message: 'breed successfully deleted' };
    }

    async update(data: UpdateBreedDTO) {
        const { id, specie_id } = data;

        await this.findById(id);

        const speciesExists = await this.speciesRepository.findById(specie_id);

        if (!speciesExists)
            throw new HttpError({ code: 404, message: `Specie with ID ${specie_id} not found.` });

        const breed = await this.breedRepository.update(data);

        return breed;
    }

}

export { BreedUseCase };