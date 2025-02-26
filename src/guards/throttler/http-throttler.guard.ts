import { Injectable, Logger } from '@nestjs/common';
import { ThrottlerGuard, ThrottlerRequest } from '@nestjs/throttler';
import * as md5 from 'md5';

@Injectable()
export class HttpThrottlerGuard extends ThrottlerGuard {
	private readonly logger = new Logger(HttpThrottlerGuard.name);

	async handleRequest(requestProps: ThrottlerRequest): Promise<boolean> {
		const { context, limit, ttl } = requestProps;
		const { req, res } = this.getRequestResponse(context);
		if (Array.isArray((this.options as any).ignoreUserAgents)) {
			for (const pattern of (this.options as any).ignoreUserAgents) {
				if (pattern.test(req.headers['user-agent'])) {
					return true;
				}
			}
		}
		const tracker = req.headers['x-forwarded-for'] || req.ip;
		const key = this.generateKeyStore(req.originalUrl, tracker);
		this.logger.log(tracker);
		const ttls = await this.storageService.increment(key, ttl, limit, 0, 'default');
		const nearestExpiryTime = ttls?.totalHits > 0 ? Math.ceil((ttls.timeToExpire - Date.now()) / 1000) : 0;

		if (ttls.totalHits >= limit) {
			res.header('Retry-After', nearestExpiryTime);
			this.throwThrottlingException(context, {
				limit,
				ttl: Math.max(0, limit - ttls.totalHits),
				key,
				tracker,
				totalHits: ttls.totalHits,
				timeToExpire: nearestExpiryTime,
				isBlocked: false,
				timeToBlockExpire: 0,
			});
		}
		res.header(`${this.headerPrefix}-Limit`, limit);
		res.header(`${this.headerPrefix}-Remaining`, Math.max(0, limit - ttls.totalHits));
		res.header(`${this.headerPrefix}-Reset`, nearestExpiryTime);
		return true;
	}

	private generateKeyStore(originalUrl: string, suffix: string) {
		return md5(`${suffix}-${originalUrl}`);
	}
}
