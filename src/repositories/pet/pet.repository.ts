import { prisma } from "../../database/prisma-client";
import { CreatePetDTO, PetDTO, PetRepository } from "../../interface/pet/pet.interface";

class PetRepositoryPrisma implements PetRepository {

    async create(data: CreatePetDTO): Promise<PetDTO> {
        const result = await prisma.tbpets.create({
            data: {
                name: data.name,
                species_id: data.species,
                color: data.color,
                size: data.size,
                breed_id: data.breed,
                age: data.age,
                gender: data.gender
            },
            include: {
                species: true,
            }
        });

        return result;
    }

    async findById(id: string): Promise<PetDTO|null> {
        const result = await prisma.tbpets.findUnique({
            where: {
                id: id
            },
            include: {
                species: true
            }
        });

        return result || null;
    }

    async delete(id: string): Promise<void> {
        await prisma.tbpets.delete({
            where: {
                id: id
            },
        });

        return;
    }

}

export { PetRepositoryPrisma };