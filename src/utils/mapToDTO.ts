export function mapToDTO<T, U>(prismaObject: T[], dto: (obj: T) => U): U[];
export function mapToDTO<T, U>(prismaObject: T, dto: (obj: T) => U): U;

export function mapToDTO<T, U>(prismaObject: T | T[], dto: (obj: T) => U): U | U[] {
    if (Array.isArray(prismaObject)) {
        return prismaObject.map(item => dto(item));
    }
    return dto(prismaObject);
}