import { Injectable, HttpStatus, HttpException } from '@nestjs/common';
import { UsersService } from "../users/users.service";
import { JwtService } from "@nestjs/jwt";
import { RegisterUserstDTO } from "./dto/register-user.dto";
// import { LoginUserDto } from "../users/dto/LoginUserDto"
import * as bcrypt from "bcrypt";
import { PostgresErrorCode } from "./postgresErrorCodes.enum";
import { TokenPayload } from "./tokenPayload.interface";
import { ConfigService } from "@nestjs/config"

@Injectable()
export class AuthService {
    constructor(
        private usersService: UsersService,
        private jwtService: JwtService,
        private configService: ConfigService
    ) { }

    protectedRoute() {
        return this.usersService.protectedRoute()
    }

    public async register(registrationData: RegisterUserstDTO) {
        const hashedPassword = await bcrypt.hash(registrationData.password, 10);
        try {
            const createdUser = await this.usersService.createNewUser({
                ...registrationData,
                password: hashedPassword
            });
            createdUser.password = undefined;
            return createdUser;
        } catch (error) {
            if (error?.code === PostgresErrorCode.UniqueViolation) {
                throw new HttpException('User with that email already exists', HttpStatus.BAD_REQUEST);
            }
            throw new HttpException('Something went wrong', HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    public async getAuthenticatedUser(email: string, plainTextPassword: string) {
        try {
            const user = await this.usersService.getByEmail(email);
            await this.verifyPassword(plainTextPassword, user.password);
            user.password = undefined;
            return user;
        } catch (error) {
            throw new HttpException('Wrong credentials provided', HttpStatus.BAD_REQUEST);
        }
    }

    private async verifyPassword(plainTextPassword: string, hashedPassword: string) {
        const passwordIsMatching = await bcrypt.compare(
            plainTextPassword,
            hashedPassword
        );
        if (!passwordIsMatching) {
            throw new HttpException('Wrong credentials provided', HttpStatus.BAD_REQUEST);
        }
    }

    public getCookieWithJwtToken(userId: number) {
        const payload: TokenPayload = { userId };
        const token = this.jwtService.sign(payload);
        return (
        `Authentication=${token}; HttpOnly; Path=/; Max-Age=${this.configService.get('TOKEN_EXPIRATION_TIME')}`
        )
    }

    public getCookieForLogOut() {
        return `Authentication=; HttpOnly; Path=/; Max-Age=0`;
      }


}
