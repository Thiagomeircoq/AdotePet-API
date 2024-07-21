import { HttpError } from "../errors/HttpError";
import { UpdatePassword, UserRepository } from "../interface/user.interface";
import { UserRepositoryPrisma } from "../repositories/user.repository";
import { PasswordUtil } from "../utils/password.util";

class UserUseCase {
    private userRepository: UserRepository

    constructor() {
        this.userRepository = new UserRepositoryPrisma;
    }

    async findById(id: string) {
        if (!id)
            throw new HttpError({ code: 400, message: 'User ID is required.' });

        const user = await this.userRepository.findById(id);

        if (!user)
            throw new HttpError({ code: 404, message: `User with ID ${id} not found.` });

        return user;
    }

    async delete(id: string) {
        await this.findById(id);

        await this.userRepository.delete(id);

        return { message: 'User successfully deleted' };
    }

    async updatePassword(data: UpdatePassword, id: string) {
        const user = await this.findById(id);

        const isPasswordValid = await PasswordUtil.verifyPassword(data.password, user.password);

        if (!isPasswordValid)
            throw new HttpError({ code: 401, message: 'Invalid password.' });

        const hashedNewPassword = await PasswordUtil.hashPassword(data.newPassword);

        const updatedPassword = await this.userRepository.updatePassword(hashedNewPassword, id);

        if (!updatedPassword)
            throw new HttpError({ code: 500, message: 'Failed to update password.' });
        
        return { message: 'Password updated successfully' };
    }

}

export { UserUseCase };