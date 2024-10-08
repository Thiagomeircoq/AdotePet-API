import { prisma } from "../../database/prisma-client";
import { CreateBreedDTO, BreedDTO, BreedRepository, UpdateBreedDTO } from "../../interface/breed/breed.interface";

class BreedRepositoryPrisma implements BreedRepository {

    async create(data: CreateBreedDTO): Promise<BreedDTO> {
        const result = await prisma.tbbreed.create({
            data: {
                name: data.name,
                species_id: data.specie_id
            },
            include: {
                species: true
            }
        });

        return result;
    }

    async findAll(): Promise<BreedDTO[]> {
        const results = await prisma.tbbreed.findMany({
            include: {
                species: true,
            },
        });

        return results;
    }

    async findById(id: string): Promise<BreedDTO|null> {
        const result = await prisma.tbbreed.findUnique({
            where: {
                id: id
            },
            include: {
                species: true,
            },
        });

        return result || null;
    }

    async findAllBySpecieId(specie_id: string): Promise<BreedDTO[]> {
        const results = await prisma.tbbreed.findMany({
            where: {
                species_id: specie_id
            },
            include: {
                species: true,
            },
        });

        return results;
    }

    async belongsToSpecies(breed_id: string, specie_id: string): Promise<boolean> {
        const breed = await prisma.tbbreed.findUnique({
            where: { id: breed_id },
            select: { species_id: true }
        });

        return breed?.species_id === specie_id;
    }

    async update(data: UpdateBreedDTO): Promise<BreedDTO> {
        const result = await prisma.tbbreed.update({
            where: {
                id: data.id
            },
            data: {
                name: data.name,
                species_id: data.specie_id
            },
            include: {
                species: true,
            },
        });

        return result;
    }

    async delete(id: string): Promise<void> {
        await prisma.tbbreed.delete({
            where: {
                id: id
            },
        });

        return;
    }

}

export { BreedRepositoryPrisma };