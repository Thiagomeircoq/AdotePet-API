import { ZodError, ZodIssue } from 'zod'

const formatZodIssue = (issue: ZodIssue): string => {
    const { path, message } = issue;
    const pathString = path.join('.');
    if (message == 'Required') return `${pathString}: ${message}`;
    return `${message}`;
};

export const formatZodError = (error: ZodError): string => {
    const { issues } = error;
    return issues.map(formatZodIssue).join('; ');
};