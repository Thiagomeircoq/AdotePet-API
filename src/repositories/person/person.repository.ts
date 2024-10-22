import { prisma } from "../../database/prisma-client";
import { PersonDTO, PersonRepository } from "../../interface/person/person.interface";

class PersonRepositoryPrisma implements PersonRepository {

    async findByCpf(cpf: string): Promise<PersonDTO|null> {
        const result = await prisma.tbperson.findUnique({
            where: {
                cpf: cpf
            }
        });

        return result || null;
    }

}

export { PersonRepositoryPrisma };