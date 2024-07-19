import { prisma } from "../database/prisma-client";
import { Person, PersonCreate, PersonRepository } from "../interface/person.interface";

class PersonRepositoryPrisma implements PersonRepository {

    async create(data: PersonCreate): Promise<Person> {
        const result = await prisma.tbpersons.create({
            data: {
                cpf: data.cpf,
                first_name: data.first_name,
                last_name: data.last_name,
                date_of_birth: data.date_of_birth || undefined,
                phone_number: data.phone_number
            },
        });

        return result;
    }

}

export { PersonRepositoryPrisma };