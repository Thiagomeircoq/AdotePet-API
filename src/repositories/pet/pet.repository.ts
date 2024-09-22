import { prisma } from "../../database/prisma-client";
import { CreatePetDTO, PetDTO, PetRepository, UpdatePetDTO } from "../../interface/pet/pet.interface";

class PetRepositoryPrisma implements PetRepository {

    async create(data: CreatePetDTO): Promise<PetDTO> {
        const result = await prisma.tbpets.create({
            data: {
                name: data.name,
                species_id: data.specie_id,
                color: data.color,
                size: data.size,
                breed_id: data.breed_id,
                age: data.age,
                gender: data.gender
            },
            include: {
                species: true,
                breed: true
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
                species: true,
                breed: true
            }
        });

        return result || null;
    }

    async findAll(): Promise<PetDTO[]> {
        const results = await prisma.tbpets.findMany({
            include: {
                species: true,
                breed: true
            },
        });

        return results;
    }

    async update(data: UpdatePetDTO): Promise<PetDTO> {
        const result = await prisma.tbpets.update({
            where: {
                id: data.id
            },
            data: {
                name: data.name,
                species_id: data.specie_id,
                color: data.color,
                size: data.size,
                breed_id: data.breed_id,
                age: data.age,
                gender: data.gender

            },
            include: {
                species: true,
                breed: true
            },
        });

        return result;
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