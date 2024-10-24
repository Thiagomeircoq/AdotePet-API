import { prisma } from "../../database/prisma-client";
import { RegisterUserDTO } from "../../interface/auth/auth.interface";
import { UserDTO, UserRepository } from "../../interface/user/user.interface";

class UserRepositoryPrisma implements UserRepository {

    async create(data: RegisterUserDTO): Promise<UserDTO> {
        const result = await prisma.$transaction(async (tx) => {

            const person = await tx.tbperson.create({
                data: {
                    first_name: data.person.first_name,
                    last_name: data.person.last_name,
                    cpf: data.person.cpf,
                    gender: data.person.gender,
                    birthdate: new Date(data.person.birthdate),
                    about: data.person.about,
                    profile_picture: data.person.profile_picture || null,
                }
            });
    
            const user = await tx.tbuser.create({
                data: {
                    email: data.email,
                    password: data.password,
                    status: data.status,
                    person_id: person.id,
                }
            });

            const roleToAdd = data.role_id || 'USER';

            const role = await (roleToAdd === 'USER'
                ? tx.tbrole.findUnique({ where: { name: 'USER' } })
                : tx.tbrole.findUnique({ where: { id: roleToAdd } })
            );
    
            if (role) {
                await tx.tbuser_roles.create({
                    data: {
                        user_id: user.id,
                        role_id: role.id,
                    }
                });
            }
    
            return {
                id: user.id,
                password: user.password,
                person_id: user.person_id,
                status: user.status,
                person: person,
                created_at: user.created_at,
                updated_at: user.updated_at,
            };
        });
    
        return result;
    }

    async findByEmail(email: string): Promise<UserDTO|null> {
        const result = await prisma.tbuser.findUnique({
            where: {
                email: email
            },
            include: {
                person: true,
            },
        });

        return result || null;
    }

}

export { UserRepositoryPrisma };