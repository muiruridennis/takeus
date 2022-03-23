import { Controller, Post, HttpException, HttpStatus, Body, Req, Res, HttpCode, UseGuards, Get, Param, } from '@nestjs/common';
import { CreateUserDto } from "../users/models/createUserDto";
import { AuthService } from "./auth.service";
import { LoginDto } from "../users/models/loginDto"
import { JwtAuthGuard } from './jwt-auth.guard';
import { Response } from 'express';
import RequestWithUser from "./requestWithUser.interface";
import { LocalAuthenticationGuard } from './localAuthentication.guard';


@Controller('auth')
export class AuthController {
    constructor(private AuthService: AuthService) { };
    @HttpCode(200) // we use  @HttpCode(200) because NestJS responds with 201 Created for POST requests by default
    @UseGuards(LocalAuthenticationGuard)
    @Post('login')
    async logIn(@Req() request: RequestWithUser, @Res() response: Response) {
        const { user } = request;
        const cookie = this.AuthService.getCookieWithJwtToken(user.id);
        response.setHeader('Set-Cookie', cookie);// the token created is sent to the client by setting the cookie header 
        user.password = undefined;
        return response.send({ user, cookie }); // When the browser receives this response, it sets the cookie so that it can use it later
    };

    @UseGuards(JwtAuthGuard)
    @Post('logout')
    async logOut(@Req() request: RequestWithUser, @Res() response: Response) {
        response.setHeader('Set-Cookie', this.AuthService.getCookieForLogOut());
        return response.sendStatus(200);
    }


    @Post('register')
    async register(@Body() registrationData: CreateUserDto) {
        return this.AuthService.register(registrationData);
    };

    @UseGuards(JwtAuthGuard)
    @Get("loggeduser")
    authenticate(@Req() request: RequestWithUser) {
        const user = request.user;
        user.password = undefined;
        return user;
    }




    // @Post('register')
    // public async register(@Body() CreateUserstDTO: CreateUserstDTO) {
    //     const result = await this.AuthService.register(CreateUserstDTO,);
    //     if (!result.success) {
    //         throw new HttpException(result.message, HttpStatus.BAD_REQUEST);
    //     }
    //     return result;
    // }


    // @Post('login')
    // public async login(@Body() loginUserDto: LoginUserDto) {
    //     return await this.AuthService.login(loginUserDto);
    // }
}
