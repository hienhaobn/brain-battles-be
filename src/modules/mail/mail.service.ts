import { MailerService } from '@nestjs-modules/mailer';
import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { SES } from 'aws-sdk';
import * as ejs from 'ejs';
import { join } from 'path';

import { EEnvKey } from '@constants/env.constant';

import { awsHelper } from '@shared/helpers/aws.helper';

import { EMailSubject } from './mail.constant';
import { IMailForgotPasswordVerify, IMailRegisterVerify } from './mail.interface';

@Injectable()
export class MailService {
	private readonly logger = new Logger(this.constructor.name);

	constructor(
		private readonly configService: ConfigService,
		private readonly mailerService: MailerService,
	) {}

	private async sendMail(
		toAddress: string | string[],
		subject: EMailSubject,
		fileNameTemplate: string,
		data?: ejs.Data,
		bcc?: string | string[],
	) {
		try {
			const messageBody = await ejs.renderFile(join(__dirname, '../../../', `templates/${fileNameTemplate}.ejs`), data);

			const ToAddresses = typeof toAddress === 'string' ? [toAddress] : toAddress;
			const BccAddresses = typeof bcc === 'string' ? [bcc] : bcc;

			const params: SES.SendEmailRequest = {
				Destination: { ToAddresses, BccAddresses },
				Message: {
					Subject: { Charset: 'UTF-8', Data: subject },
					Body: { Html: { Charset: 'UTF-8', Data: messageBody } },
				},
				Source: this.configService.get<string>(EEnvKey.AWS_SES_SEND_FROM),
			};
			await awsHelper.ses.sendEmail(params).promise();
		} catch (error) {
			this.logger.error(error?.message || error);
		}
	}

	async sendRegisterVerify(toAddress: string, data: IMailRegisterVerify) {
		await this.mailerService.sendMail({
			to: toAddress,
			subject: EMailSubject.REGISTER_VERIFY,
			template: 'register-verify',
			context: data,
		});
	}

	sendForgotPasswordVerify(toAddress: string, data?: IMailForgotPasswordVerify) {
		return this.mailerService.sendMail({
			to: toAddress,
			subject: EMailSubject.FORGOT_PASSWORD_VERIFY,
			template: 'forgot-password-verify',
			context: data,
		});
	}

	async sendWelcomeEmail(userEmail: string, username: string, verificationCode: string) {
		await this.mailerService.sendMail({
			to: userEmail,
			subject: 'Welcome to Our Platform!',
			template: 'welcome',
			context: {
				username,
				code: verificationCode,
				supportEmail: 'support@example.com',
			},
		});
	}
}
