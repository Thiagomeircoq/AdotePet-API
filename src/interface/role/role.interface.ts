export interface RoleDTO {
    id: string;
    name: string;
    created_at: Date;
    updated_at: Date;
}

export interface RoleRepository {
    findById(id: string): Promise<RoleDTO | null>;
    findByName(name: string): Promise<RoleDTO | null>;
}