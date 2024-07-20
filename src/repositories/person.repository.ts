import { prisma } from "../database/prisma-client";
import { Person, PersonCreate, PersonRepository, PersonUpdate } from "../interface/person.interface";

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

    async findById(id: string): Promise<Person | null> {
        const result = await prisma.tbpersons.findUnique({
            where: {
                id: id
            },
        });

        return result || null;
    }

    async findByCpf(cpf: string): Promise<Person | null> {
        const result = await prisma.tbpersons.findUnique({
            where: {
                cpf: cpf
            },
        });

        return result || null;
    }

    async findByPhoneNumber(phone_number: string): Promise<Person | null> {
        const result = await prisma.tbpersons.findUnique({
            where: {
                phone_number: phone_number
            },
        });

        return result || null;
    }

    async delete(id: string): Promise<void> {
        await prisma.tbpersons.delete({
            where: {
                id: id
            },
        });

        return;
    }

    async update(data: PersonUpdate): Promise<Person> {
        const result = await prisma.tbpersons.update({
            where: {
                id: data.id
            },
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