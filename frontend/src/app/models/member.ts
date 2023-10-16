import { Type } from "class-transformer";
import 'reflect-metadata';

export enum Role {
    Member = 0,
    Manager = 1,
    Admin = 2
}

export class Member {
    pseudo?: string;
    password?: string;
    fullName?: string;
    @Type(() => Date)
    birthDate?: Date;
    role: Role = Role.Member;
    token?: string;

    public get roleAsString(): string {
        return Role[this.role];
    }

    get display(): string {
        return `${this.pseudo} (${this.birthDate ? this.age + ' years old' : 'age unknown'})`;
    }

    get age(): number | undefined {
        if (!this.birthDate)
            return undefined;
        var today = new Date();
        var age = today.getFullYear() - this.birthDate.getFullYear();
        today.setFullYear(today.getFullYear() - age);
        if (this.birthDate > today) age--;
        return age;
    }
}
