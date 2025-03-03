import { Body, Controller, Query, Req } from '@nestjs/common';
import { ApiOkResponse, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Request } from 'express';

import { MailService } from '@modules/mail/mail.service';

import { HttpGet, HttpPost } from '@shared/decorators/controller/http-methods.decorator';
import { HttpResponse } from '@shared/decorators/controller/http-response.decorator';
import { AuthException } from '@shared/exceptions/http-exceptions/auth.exception';
import { httpExDocResponse } from '@shared/exceptions/http.exception';

import { AuthService } from './auth.service';
import {
	ChangePasswordBodyDto,
	ForgotPasswordBodyDto,
	LoginBodyDto,
	RefreshTokenBodyDto,
	RegisterBodyDto,
	VerifyBodyRequest,
} from './dtos/auth-request.dto';
import { LoginResDto, RefreshTokenResDto } from './dtos/auth-response.dto';

@Controller('auth')
@ApiTags('Auth')
export class AuthController {
	constructor(
		private readonly authService: AuthService,
		private readonly mailService: MailService,
	) {}

	@HttpPost('login', { isPublic: true })
	// @ApiOkResponse({ type: LoginResDto })
	@ApiResponse({ status: 201, type: LoginResDto })
	login(@Body() body: LoginBodyDto) {
		return this.authService.login(body);
	}

	@HttpPost('register', { isPublic: true })
	async register(@Body() body: RegisterBodyDto) {
		await this.authService.register(body);
	}

	@HttpGet('verify', { isPublic: true })
	verify(@Query() query: VerifyBodyRequest) {
		return this.authService.verify(query);
	}

	@HttpPost('refresh-token', { isPublic: true })
	@ApiOkResponse({ type: RefreshTokenResDto })
	refreshToken(@Body() body: RefreshTokenBodyDto) {
		return this.authService.refreshJwtToken(body.refreshToken);
	}

	@HttpPost('forgot-password', { isPublic: true })
	async forgotPassword(@Body() body: ForgotPasswordBodyDto) {
		await this.authService.forgotPassword(body.email);
	}

	// TODO guard
	@HttpPost('change-password')
	@ApiOkResponse({ type: LoginResDto })
	changePassword(@Body() body: ChangePasswordBodyDto, @Req() request: Request) {
		const user = request.user;
		return this.authService.changePassword(user.userId, body);
	}

	@HttpPost('test', { exValidateBody: true, isPublic: true })
	@HttpResponse({
		success: { type: LoginResDto, status: 200, isPagination: true, addClassSerializer: true },
		exceptions: [
			httpExDocResponse(AuthException.LoginThirdParty, 'BAD_REQUEST', 'has-error'),
			httpExDocResponse(AuthException.General, 'BAD_REQUEST', 'email-already'),
		],
	})
	test() {
		return;
	}

	@HttpPost('test-mail', { isPublic: true })
	testMail() {
		return this.mailService.sendWelcomeEmail('hienhao021198@gmail.com', 'Hien Hao', '123456');
	}
}
