import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';

import { MailerConfigModule } from './config/mailer-config.module';
import { MailService } from './mail.service';

@Module({
	imports: [HttpModule, MailerConfigModule],
	providers: [MailService],
	exports: [MailService],
})
export class MailModule {}
