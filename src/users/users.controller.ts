import { Controller, Get, Param, Post, Body, Delete, Query, Patch, UseGuards, Request } from '@nestjs/common';
import {UsersService} from './users.service';
// import {JwtAuthGuard} from "../auth/jwt-auth.guard";

@Controller('users')
export class UsersController {
    constructor(private readonly UsersService: UsersService){}
    @Get()
    async getUsers() {
        const users = await this.UsersService.getAllUsers();
        return users
    };

    @Post("login")
    async getUser(@Request() req) : Promise<any> {
        const user = await this.UsersService.findByLogin(req.user);
        return user;
    };
    // @UseGuards(JwtAuthGuard)
    @Get("protected")
    protectedRoute(){
        return this.UsersService.protectedRoute()
    }
   @Get(":id")
   async getUserById(@Param() id:number){
    const user = await this.UsersService.getUserById(id);
    return user
   }
}
