import { HttpError } from "../../errors/HttpError";
import { RoleRepository } from "../../interface/role/role.interface";
import { RegisterUserDTO, UserRepository } from "../../interface/user/user.interface";
import { RoleRepositoryPrisma } from "../../repositories/role/role.repository";
import { UserRepositoryPrisma } from "../../repositories/user/user.repository";
import { PasswordUtil } from "../../utils/password.util";

export class AuthUseCase {
    private userRepository: UserRepository;
    private roleRepository: RoleRepository;

    constructor() {
        this.userRepository = new UserRepositoryPrisma();
        this.roleRepository = new RoleRepositoryPrisma();
    }
    
    async register(data: RegisterUserDTO) {
        const [emailExists, role] = await Promise.all([
            this.userRepository.findByEmail(data.email),
            data.role_id ? this.roleRepository.findById(data.role_id) : Promise.resolve(null)
        ]);
    
        if (emailExists) {
            throw new HttpError({ code: 409, message: `Email ${data.email} already exists.` });
        }
    
        if (data.role_id && !role) {
            throw new HttpError({ code: 409, message: `Role with ID ${data.role_id} does not exist.` });
        }
    
        data.password = await PasswordUtil.hashPassword(data.password);
    
        return this.userRepository.create(data);
    }
}