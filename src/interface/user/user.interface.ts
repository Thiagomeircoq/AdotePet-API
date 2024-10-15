import { Gender, UserStatus } from '@prisma/client';
import { PersonDTO } from '../person/person.interface';

export interface UserDTO {
    id: string;
    password: string;
    person_id: string | null;
    status: UserStatus;
    person: PersonDTO | null;
    // user_roles: UserRoleDTO[];
    created_at: Date;
    updated_at: Date;
}

export interface RegisterUserDTO {
    email: string;
    password: string;
    status: UserStatus;
    role_id: string | null;
    person: {
        first_name: string;
        last_name: string;
        gender: Gender;
        birthdate: string;
        profile_picture?: string;
    };
    roles?: { role_id: string }[];
    permissions?: string[];
}

export interface UserRepository {
    create(data: RegisterUserDTO): Promise<UserDTO>;
    findByEmail(email: string): Promise<UserDTO | null>;
}