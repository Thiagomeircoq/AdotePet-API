import { z } from 'zod';

const passwordValidation = (password: string) => {
    const errors: string[] = [];
    if (!/[A-Z]/.test(password))
        errors.push("Password must contain at least one uppercase letter");

    if (!/[a-z]/.test(password))
        errors.push("Password must contain at least one lowercase letter");

    if (!/[0-9]/.test(password))
        errors.push("Password must contain at least one number");

    if (!/[^A-Za-z0-9]/.test(password))
        errors.push("Password must contain at least one special character");

    if (/(012|123|234|345|456|567|678|789|890|abc|bcd|cde|def|efg|fgh|ghi|hij|ijk|jkl|klm|lmn|mno|nop|opq|pqr|qrs|rst|stu|tuv|uvw|vwx|wxy|xyz|ABC|BCD|CDE|DEF|EFG|FGH|GHI|HIJ|IJK|JKL|KLM|LMN|MNO|NOP|OPQ|PQR|QRS|RST|STU|UVW|VWX|WXY|XYZ)/.test(password))
        errors.push("Password must not contain sequential characters");

    return errors;
};

export const UserSchema = z.object({
    username: z.string()
        .min(1, { message: "Username is required" }),
    email: z.string()
        .min(1, { message: "Email is required" })
        .email({ message: "Invalid email address" }),
    password: z.string()
        .min(8, { message: "Password must be at least 8 characters long" }),
    password_confirm: z.string()
        .min(1, { message: "Password confirmation is required" })
}).superRefine((data, ctx) => {
    const passwordErrors = passwordValidation(data.password);
    if (passwordErrors.length > 0) {
        passwordErrors.forEach(error => ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: error,
            path: ['password']
        }));
    }
    if (data.password !== data.password_confirm) {
        ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: "Passwords must match",
            path: ['password_confirm']
        });
    }
});

export const PasswordUpdate = z.object({
    newPassword: z.string()
        .min(8, { message: "Password must be at least 8 characters long" }),
    password: z.string()
        .min(1, { message: "Old password is required" }),
}).superRefine((data, ctx) => {
    const passwordErrors = passwordValidation(data.newPassword);
    if (passwordErrors.length > 0) {
        passwordErrors.forEach(error => ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: error,
            path: ['newPassword']
        }));
    }
});