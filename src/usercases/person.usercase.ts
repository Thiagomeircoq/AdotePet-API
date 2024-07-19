import { PersonCreate, PersonRepository } from "../interface/person.interface";
import { PersonRepositoryPrisma } from "../repositories/person.repository";

class PersonUserCase {
    private personRepository: PersonRepository
    constructor() {
        this.personRepository = new PersonRepositoryPrisma;
    }

    async create(data: PersonCreate) {

        const product = await this.personRepository.create({
            cpf: data.cpf,
            first_name: data.first_name,
            last_name: data.last_name,
            date_of_birth: data.date_of_birth || undefined,
            phone_number: data.phone_number
        });

        return product;
    }


}

export { PersonUserCase };