import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { UserRepository } from './user-repository';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateUserDto } from "./models/createUserDto";
import { LoginDto } from "./models/loginDto";
import * as bcrypt from 'bcrypt';
// import * as argon2 from "argon2";


@Injectable()
export class UsersService {
    constructor(
        @InjectRepository(UserRepository)
        private UserRepository: UserRepository
    ) { }

    async findByLogin({ email, password }: LoginDto) {
        const user = await this.UserRepository.findOne({ where: { email } });

        if (!user) {
            throw new HttpException('Invalid credentials', HttpStatus.UNAUTHORIZED);
        }

        // compare passwords    
        const isMatch = await bcrypt.compare(password, user.password);
        // const isMatch = await argon2.verify(password, user.password);

        if (!isMatch) {
            throw new HttpException('Invalid credentials', HttpStatus.UNAUTHORIZED);
        }

        return user;
    }

    async getAllUsers() {
        const users = await this.UserRepository.find();
        return users;
    };
    async getById(id: number) {
        const user = await this.UserRepository.findOne({ id });
        if (user) {
            return user;
        }
        throw new HttpException('User with this id does not exist', HttpStatus.NOT_FOUND);
    }

    async getByEmail(email: string) {
        const user = await this.UserRepository.findOne({ email });
        if (user) {
            return user;
        }
        throw new HttpException('User with this email does not exist', HttpStatus.NOT_FOUND);
    }


    // async createUser(userData: CreateUserDto) {
    //     const { firstName, lastName, password, email } = userData;

    //     // check if the user exists in the db    
    //     const userExists = await this.UserRepository.findOne({
    //         where: { email }
    //     });
    //     if (userExists) {
    //         throw new HttpException('User already exists', HttpStatus.BAD_REQUEST);
    //     }

    //     const newUser = await this.UserRepository.create({ firstName, lastName, password, email });
    //     await this.UserRepository.save(newUser);
    //     return newUser;
    // }
    protectedRoute() {
        return "this is a protected Route"
    }

    async getUserById(userId: number) {
        const foundUser = await this.UserRepository.findOne(userId);
        if (!foundUser) {
            throw new HttpException(`User  not found`, HttpStatus.NOT_FOUND);

        }
        return foundUser;

    };

    async createNewUser(userData: CreateUserDto) {
        const newUser = await this.UserRepository.create(userData);
        await this.UserRepository.save(newUser);
        return newUser;
    }

    async setCurrentRefreshToken(refreshToken: string, userId: number) {
        const currentHashedRefreshToken = await bcrypt.hash(refreshToken, 10);
        await this.UserRepository.update(userId, {
            currentHashedRefreshToken
        });
    }
}
