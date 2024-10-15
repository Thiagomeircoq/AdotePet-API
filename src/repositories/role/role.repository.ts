import { prisma } from "../../database/prisma-client";
import { RoleDTO, RoleRepository } from "../../interface/role/role.interface";

class RoleRepositoryPrisma implements RoleRepository {

    async findById(id: string): Promise<RoleDTO|null> {
        const result = await prisma.tbrole.findUnique({
            where: {
                id: id
            }
        });

        return result || null;
    }

    async findByName(name: string): Promise<RoleDTO|null> {
        const result = await prisma.tbrole.findUnique({
            where: {
                name: name
            }
        });

        return result || null;
    }

}

export { RoleRepositoryPrisma };