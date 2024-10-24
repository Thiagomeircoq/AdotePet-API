import { Gender, UserStatus } from "@prisma/client";

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
        cpf: string;
        profile_picture?: string;
        about?: string;
    };
    roles?: { role_id: string }[];
    permissions?: string[];
}

export interface LoginUserDTO {
    email: string;
    password: string;
}