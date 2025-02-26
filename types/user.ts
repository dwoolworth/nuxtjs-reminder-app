// types/user.ts
export interface User {
    _id: string;
    email: string;
    firstName: string;
    lastName: string;
    roles: string[];
    __v: number;
}

export interface UserApiResponse {
    users: User[];
    total: number;
}
