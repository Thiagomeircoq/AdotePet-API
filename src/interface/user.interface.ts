export interface User {
    id: string;
    username: string;
    email: string;
    password: string;
    person_id: string | null;
    created_at: Date;
    updated_at: Date;
}

export interface UserCreate {
    username: string;
    email: string;
    password: string;
}

export interface UserUpdate extends UserCreate {
    id: string;
}

export interface UserLogin {
    email: string;
    password: string;
}

export interface UpdatePassword {
    password: string;
    newPassword: string;
}

export interface UserRepository {
   create(data: UserCreate): Promise<User>;
   findById(id: string): Promise<User | null>;
   findByEmail(email: string): Promise<User | null>;
   findByUsername(username: string): Promise<User | null>;
   delete(id: string): Promise<void>;
   updatePassword(newPassword: string, id: string): Promise<User>;	
}