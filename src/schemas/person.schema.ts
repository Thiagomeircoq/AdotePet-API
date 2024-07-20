import { z } from 'zod';
import { cpf as cpfValidator } from 'cpf-cnpj-validator';

export const PersonSchema = z.object({
    cpf: z.string()
        .min(1, { message: "CPF is required" })
        .refine((cpf) => cpfValidator.isValid(cpf), { message: "Invalid CPF" }),
    first_name: z.string().min(1, { message: "First Name is required" }),
    last_name: z.string().min(1, { message: "Last Name is required" }),
    date_of_birth: z.string()
        .min(1, { message: "Date of Birth is required" })
        .refine((date) => /^\d{4}-\d{2}-\d{2}$/.test(date), { message: "Invalid date format, should be YYYY-MM-DD" }),
    phone_number: z.string()
        .min(11, { message: "Phone Number must be 11 characters long" })
        .max(11, { message: "Phone Number must be 11 characters long" }),
});
