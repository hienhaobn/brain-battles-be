import { TransportType } from '@nestjs-modules/mailer/dist/interfaces/mailer-options.interface';
import { ConfigService } from '@nestjs/config';

import { EEnvKey } from '@constants/env.constant';

export const mailerConfigFactory = (configService: ConfigService): TransportType => ({
	service: configService.get<string>(EEnvKey.MAIL_SERVICE),
	host: configService.get<string>(EEnvKey.MAIL_HOST),
	port: configService.get<number>(EEnvKey.MAIL_PORT),
	secure: configService.get<boolean>(EEnvKey.MAIL_SECURE, false),
	auth: {
		user: configService.get<string>(EEnvKey.MAIL_ACCOUNT),
		pass: configService.get<string>(EEnvKey.MAIL_PASSWORD),
	},
	tls: {
		rejectUnauthorized: configService.get<boolean>(EEnvKey.MAIL_TLS_REJECT_UNAUTHORIZED, true),
	},
	from: {
		address: configService.get<string>(EEnvKey.MAIL_FROM_ADDRESS),
		name: configService.get<string>(EEnvKey.MAIL_FROM_NAME),
	},
});
