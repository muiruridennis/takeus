import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { ConfigModule } from '@nestjs/config';
import { DatabaseModule } from './database/database.module';
 import { AuthModule } from './auth/auth.module';
 import { PostsModule } from './posts/posts.module';
import * as Joi from 'joi';

@Module({
  imports: [ UsersModule, DatabaseModule, AuthModule, PostsModule, ConfigModule.forRoot({
    validationSchema: Joi.object({
      DB_TYPE : Joi.string().required(),
      POSTGRES_HOST: Joi.string().required(),
      POSTGRES_PORT: Joi.number().required(),
      POSTGRES_USER: Joi.string().required(),
      POSTGRES_PASSWORD: Joi.string().required(),
      POSTGRES_DB: Joi.string().required(),
      PORT: Joi.number(),
      JWT_SECRET: Joi.string().required(),
      TOKEN_EXPIRATION_TIME: Joi.string().required(),
      JWT_REFRESH_TOKEN_SECRET: Joi.string().required(),
      JWT_REFRESH_TOKEN_EXPIRATION_TIME: Joi.string().required(),
    })
  }),
 
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
