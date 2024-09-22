import { prisma } from "../../database/prisma-client";
import { CreateSpecieDTO, SpecieDTO, SpecieRepository } from "../../interface/specie/specie.interface";

class SpecieRepositoryPrisma implements SpecieRepository {

    async create(data: CreateSpecieDTO): Promise<SpecieDTO> {
        const result = await prisma.tbspecies.create({
            data: {
                name: data.name,
            }
        });

        return result;
    }

    async findById(id: string): Promise<SpecieDTO|null> {
        const result = await prisma.tbspecies.findUnique({
            where: {
                id: id
            }
        });

        return result || null;
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