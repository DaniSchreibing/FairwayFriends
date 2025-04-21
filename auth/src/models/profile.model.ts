import * as roles from './roles.enum';

export interface Profile {
    firstname: string;
    lastname: string;
    age: number;
    userID: string;
    role: roles.UserRole;
}