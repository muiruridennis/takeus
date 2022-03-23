import { IsString, IsNotEmpty, IsEmail } from 'class-validator';

export class RegisterUserstDTO {

    firstName: string;
    lastName: string;
    password: string;
    email: string;
}