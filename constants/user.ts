import { Role } from './role';

export class User {
    id: number;
    name: string;
    email: string;
    password: string;
    role: Role;

    constructor(id: number, name: string, email: string, password: string, role: Role) {
        this.id = id;
        this.name = name;
        this.email = email;
        this.password = password;
        this.role = role;
    }
}
