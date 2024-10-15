import { HttpError } from "../../errors/HttpError";
import { RegisterUserDTO, UserRepository } from "../../interface/user/user.interface";
import { UserRepositoryPrisma } from "../../repositories/user/user.repository";
import { PasswordUtil } from "../../utils/password.util";

export class AuthUseCase {
    private userRepository: UserRepository;

    constructor() {
        this.userRepository = new UserRepositoryPrisma();
    }
    
    async register(data: RegisterUserDTO) {
        const emailExists = await this.userRepository.findByEmail(data.email);

        if (emailExists)
            throw new HttpError({ code: 409, message: `Email ${data.email} already exists.` });

        if (data.role_id) {
            const role = await this.roleRepository.findById(data.role_id);
        }


        data.password = await PasswordUtil.hashPassword(data.password);

        return await this.userRepository.create(data);
    }
}