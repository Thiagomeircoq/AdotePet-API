export interface Person {
    id: string;
    cpf: string;
    first_name: string;
    last_name: string;
    date_of_birth?: Date | null;
    phone_number: string;
    created_at: Date;
    updated_at: Date;
}

export interface PersonCreate {
    cpf: string;
    first_name: string;
    last_name: string;
    date_of_birth?: string;
    phone_number: string;
}

export interface PersonUpdate extends PersonCreate {
    id: string;
}

export interface PersonRepository {
   create(data: PersonCreate): Promise<Person>;
   findByCpf(cpf: string): Promise<Person | null>;
   findByPhoneNumber(phone_number: string): Promise<Person | null>;
   findById(id: string): Promise<Person | null>;
   delete(id: string): Promise<void>;
   update(data: PersonUpdate): Promise<Person>;
}