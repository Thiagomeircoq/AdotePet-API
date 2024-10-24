import { Gender, UserStatus } from '@prisma/client';
import { PersonDTO } from '../person/person.interface';
import { RegisterUserDTO } from '../auth/auth.interface';

export interface UserDTO {
    id: string;
    email: string;
    password: string;
    person_id: string | null;
    status: UserStatus;
    person: PersonDTO | null;
    // user_roles: UserRoleDTO[];
    created_at: Date;
    updated_at: Date;
}

export interface UserRepository {
    create(data: RegisterUserDTO): Promise<UserDTO>;
    findByEmail(email: string): Promise<UserDTO | null>;
}