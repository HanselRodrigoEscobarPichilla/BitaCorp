export interface User {
    id_users: number,
    email: string,
    passwords: string,
    roles_id: number
}

export interface UserProfile{
    phone_number: string,
    dpi: string,
    department_id: number,
    gender: string,
    State: string
}

export interface UserResponse{
    id_users: number,
    email: string,
    roles_id: number,
    role_name: string,
    phone_number: string,
    dpi: string,
    department_id: number,
    gender: string,
    State: string
}

export interface CreateUserDTO extends User, Partial<UserProfile> {}