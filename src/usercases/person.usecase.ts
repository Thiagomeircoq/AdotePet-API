import { HttpError } from "../errors/HttpError";
import { PersonCreate, PersonRepository, PersonUpdate } from "../interface/person.interface";
import { UserRepository } from "../interface/user.interface";
import { PersonRepositoryPrisma } from "../repositories/person.repository";
import { UserRepositoryPrisma } from "../repositories/user.repository";

class PersonUseCase {
    private personRepository: PersonRepository
    private userRepository: UserRepository

    constructor() {
        this.personRepository = new PersonRepositoryPrisma;
        this.userRepository = new UserRepositoryPrisma;
    }

    async create(data: PersonCreate, userId: string) {
        const { cpf, phone_number, first_name, last_name, date_of_birth } = data;

        const cpfExists = await this.personRepository.findByCpf(cpf);
        if (cpfExists)
            throw new HttpError({ code: 409, message: `CPF ${cpf} already exists.` });

        const phoneNumberExists = await this.personRepository.findByPhoneNumber(data.phone_number);
        if (phoneNumberExists)
            throw new HttpError({ code: 409, message: `Phone number ${data.phone_number} already exists.` });

        const userAssociation = await this.userRepository.findById(userId);
        if (userAssociation && userAssociation.person_id)
            throw new HttpError({ code: 409, message: `User already has a person associated` });

        const person = await this.personRepository.create({
            cpf,
            first_name,
            last_name,
            date_of_birth: date_of_birth || undefined,
            phone_number
        }, userId);

        return person;
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
        await this.findById(data.id);

        const cpfExists = await this.personRepository.findByCpf(data.cpf, data.id);
        if (cpfExists)
            throw new HttpError({ code: 409, message: `CPF ${data.cpf} already exists.` });

        const phoneNumberExists = await this.personRepository.findByPhoneNumber(data.phone_number, data.id);
        if (phoneNumberExists)
            throw new HttpError({ code: 409, message: `Phone number ${data.phone_number} already exists.` });

        const person = await this.personRepository.update(data);

        return person;
    }


}

export { PersonUseCase };