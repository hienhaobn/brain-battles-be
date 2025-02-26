import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import { CustomRepositoryModule } from '@core/repository';

import { JwtAuthModule } from '@modules/auth/jwt-auth/jwt-auth.module';
import { UserModule } from '@modules/user/user.module';
import { UserRepository } from '@modules/user/user.repository';

import loginTPConfig from '../config/login-third-party.config';
import { LoginTwitterController } from './login-twitter.controller';
import { LoginTwitterService } from './login-twitter.service';

@Module({
	imports: [
		HttpModule,
		ConfigModule.forFeature(loginTPConfig),
		CustomRepositoryModule.forFeature([UserRepository]),
		JwtAuthModule,
		UserModule,
	],
	providers: [LoginTwitterService],
	controllers: [LoginTwitterController],
})
export class LoginTwitterModule {}
