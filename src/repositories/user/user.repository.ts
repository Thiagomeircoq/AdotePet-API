import { prisma } from "../../database/prisma-client";
import { RegisterUserDTO, UserDTO, UserRepository } from "../../interface/user/user.interface";

class UserRepositoryPrisma implements UserRepository {

    async create(data: RegisterUserDTO): Promise<UserDTO> {
        const result = await prisma.$transaction(async (tx) => {

            const person = await tx.tbperson.create({
                data: {
                    first_name: data.person.first_name,
                    last_name: data.person.last_name,
                    gender: data.person.gender,
                    birthdate: new Date(data.person.birthdate),
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
    
            const rolesToAdd = data.roles && data.roles.length > 0 ? data.roles.map(role => role.role_id) : ['USER'];
    
            const roles = await Promise.all(rolesToAdd.map(async (role) => {
                if (role === 'USER') {
                    return tx.tbrole.findUnique({
                        where: { name: role },
                    });
                } else {
                    return tx.tbrole.findUnique({
                        where: { id: role },
                    });
                }
            }));
    
            await Promise.all(roles.map(role => {
                if (role) {
                    return tx.tbuser_roles.create({
                        data: {
                            user_id: user.id,
                            role_id: role.id,
                        }
                    });
                }
            }));
    
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