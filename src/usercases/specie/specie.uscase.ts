import { HttpError } from "../../errors/HttpError";
import { CreateSpecieDTO, SpecieRepository, UpdateSpecieDTO } from "../../interface/specie/specie.interface";
import { SpecieRepositoryPrisma } from "../../repositories/specie/specie.repository";

class SpecieUseCase {
    private specieRepository: SpecieRepository

    constructor() {
        this.specieRepository = new SpecieRepositoryPrisma;
    }

    async findById(id: string) {
        if (!id)
            throw new HttpError({ code: 400, message: 'Specie ID is required.' });

        const specie = await this.specieRepository.findById(id);

        if (!specie)
            throw new HttpError({ code: 404, message: `Specie with ID ${id} not found.` });

        return specie;
    }

    async findAll() {
        const species = await this.specieRepository.findAll();

        if (!species)
            throw new HttpError({ code: 404, message: 'No species found.' });

        return species;
    }

    async create(data: CreateSpecieDTO) {
        const { name } = data;

        const specie = await this.specieRepository.create({
            name
        });

        return specie;
    }

    async delete(id: string) {
        await this.findById(id);

        await this.specieRepository.delete(id);

        return { message: 'Specie successfully deleted' };
    }

    async update(data: UpdateSpecieDTO) {
        await this.findById(data.id);

        const pet = await this.specieRepository.update(data);

        return pet;
    }

}

export { SpecieUseCase };