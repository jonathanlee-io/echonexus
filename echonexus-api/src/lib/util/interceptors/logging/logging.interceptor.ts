import {
  CallHandler,
  ExecutionContext,
  Injectable,
  Logger,
  NestInterceptor,
} from '@nestjs/common';
import {Observable} from 'rxjs';

@Injectable()
export class LoggingInterceptor implements NestInterceptor {
  constructor(private readonly logger: Logger) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const request = context.switchToHttp().getRequest();
    this.logger.log(
      `Request on client: ${request?.headers?.['X-Requesting-User-Client-Subdomain'.toLowerCase()]} from IP [${request.ip}] from user <${request?.headers?.['X-Requesting-User-Email'.toLowerCase()] ?? 'anonymous'}> ${request.method} ${request.url}`,
    );
    return next.handle();
  }
}
