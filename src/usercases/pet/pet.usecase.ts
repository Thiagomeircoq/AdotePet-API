import { CreatePetDTO, PetRepository } from "../../interface/pet/pet.interface";
import { PetRepositoryPrisma } from "../../repositories/pet/pet.repository";
import { HttpError } from "../../errors/HttpError";

class PetUseCase {
    private petRepository: PetRepository

    constructor() {
        this.petRepository = new PetRepositoryPrisma;
    }

    async findById(id: number) {
        if (!id)
            throw new HttpError({ code: 400, message: 'Pet ID is required.' });

        const pet = await this.petRepository.findById(id);

        if (!pet)
            throw new HttpError({ code: 404, message: `Pet with ID ${id} not found.` });

        return pet;
    }

    async create(data: CreatePetDTO) {
        const { name, species, color, size, age, gender } = data;

        const person = await this.petRepository.create({
            name,
            species,
            color,
            size,
            age,
            gender
        });

        return person;
    }

    async delete(id: number) {
        await this.findById(id);

        await this.petRepository.delete(id);

        return { message: 'Pet successfully deleted' };
    }

}

export { PetUseCase };