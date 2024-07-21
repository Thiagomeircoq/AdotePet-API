import { HttpError } from "../errors/HttpError";
import { User, UserCreate, UserLogin, UserRepository } from "../interface/user.interface";
import { UserRepositoryPrisma } from "../repositories/user.repository";
import { PasswordUtil } from "../utils/password.util";

class AuthUseCase {
    private userRepository: UserRepository
    
    constructor() {
        this.userRepository = new UserRepositoryPrisma;
    }

    async create(data: UserCreate) {
        const emailExists = await this.userRepository.findByEmail(data.email);

        if (emailExists)
            throw new HttpError({ code: 409, message: `Email ${data.email} already exists.` });

        const usernameExists = await this.userRepository.findByUsername(data.username);

        if (usernameExists)
            throw new HttpError({ code: 409, message: `Username ${data.username} already exists.` });

        const hashedPassword = await PasswordUtil.hashPassword(data.password);

        const user = await this.userRepository.create({
            username: data.username,
            email: data.email,
            password: hashedPassword
        });

        return user;
    }

    async verifyCredentials(data: UserLogin): Promise<User | null> {
        const user = await this.userRepository.findByEmail(data.email);

        if (!user)
            throw new HttpError({ code: 401, message: 'Email not found.' });

        const isPasswordValid = await PasswordUtil.verifyPassword(data.password, user.password);

        if (!isPasswordValid)
            throw new HttpError({ code: 401, message: 'Invalid password.' });

        return user;
    }


}

export { AuthUseCase };