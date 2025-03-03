import { MailerModule } from '@nestjs-modules/mailer';
import { HandlebarsAdapter } from '@nestjs-modules/mailer/dist/adapters/handlebars.adapter';
import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { join } from 'path';

import { EEnvKey } from '@constants/env.constant';

import { mailerConfigFactory } from './mailer.config';

@Module({
	imports: [
		MailerModule.forRootAsync({
			imports: [ConfigModule],
			useFactory: async (configService: ConfigService) => ({
				transport: mailerConfigFactory(configService),
				template: {
					dir: join(process.cwd(), 'src/modules/mail/templates'),
					adapter: new HandlebarsAdapter(),
					options: {
						strict: true,
					},
				},
				defaults: {
					from: configService.get<string>(EEnvKey.MAIL_FROM_ADDRESS),
				},
			}),
			inject: [ConfigService],
		}),
	],
})
export class MailerConfigModule {}
