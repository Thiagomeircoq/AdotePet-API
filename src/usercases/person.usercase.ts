import { HttpError } from "../errors/HttpError";
import { PersonCreate, PersonRepository, PersonUpdate } from "../interface/person.interface";
import { PersonRepositoryPrisma } from "../repositories/person.repository";

class PersonUserCase {
    private personRepository: PersonRepository
    constructor() {
        this.personRepository = new PersonRepositoryPrisma;
    }

    async create(data: PersonCreate) {
        const cpfExists = await this.personRepository.findByCpf(data.cpf);

        if (cpfExists)
            throw new HttpError({ code: 409, message: `CPF ${data.cpf} already exists.` });

        const phoneNumberExists = await this.personRepository.findByPhoneNumber(data.phone_number);

        if (phoneNumberExists)
            throw new HttpError({ code: 409, message: `Phone number ${data.phone_number} already exists.` });

        const product = await this.personRepository.create({
            cpf: data.cpf,
            first_name: data.first_name,
            last_name: data.last_name,
            date_of_birth: data.date_of_birth || undefined,
            phone_number: data.phone_number
        });

        return product;
    }

    async findById(id: string) {
        const person = await this.personRepository.findById(id);

        if (!person)
            throw new HttpError({ code: 404, message: `Person with ID ${id} not found.` });

        return person;
    }

    async delete(id: string) {
        await this.findById(id);

        await this.personRepository.delete(id);

        return { message: 'Person successfully deleted' };
    }

    async update(data: PersonUpdate) {
        const personExists = await this.findById(data.id);
    
        const person = await this.personRepository.update(data);

        return person;
    }


}

export { PersonUserCase };