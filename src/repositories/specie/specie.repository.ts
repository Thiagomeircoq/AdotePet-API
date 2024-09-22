import { prisma } from "../../database/prisma-client";
import { CreateSpecieDTO, SpecieDTO, SpecieRepository, UpdateSpecieDTO } from "../../interface/specie/specie.interface";

class SpecieRepositoryPrisma implements SpecieRepository {

    async create(data: CreateSpecieDTO): Promise<SpecieDTO> {
        const result = await prisma.tbspecies.create({
            data: {
                name: data.name,
            }
        });

        return result;
    }

    async findAll(): Promise<SpecieDTO[]> {
        return await prisma.tbspecies.findMany();
    }

    async findById(id: string): Promise<SpecieDTO|null> {
        const result = await prisma.tbspecies.findUnique({
            where: {
                id: id
            }
        });

        return result || null;
    }

    async update(data: UpdateSpecieDTO): Promise<SpecieDTO> {
        const result = await prisma.tbspecies.update({
            where: {
                id: data.id
            },
            data: {
                name: data.name
            },
        });

        return result;
    }

    async delete(id: string): Promise<void> {
        await prisma.tbspecies.delete({
            where: {
                id: id
            },
        });

        return;
    }

}

export { SpecieRepositoryPrisma };