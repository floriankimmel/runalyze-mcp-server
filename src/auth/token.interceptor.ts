import { Injectable, NestInterceptor, ExecutionContext, CallHandler } from '@nestjs/common';
import { Observable } from 'rxjs';

export const RUNALYZE_TOKEN_KEY = 'runalyze_token';

/**
 * Interceptor that extracts the Runalyze API token from the request
 * and makes it available to tools via the MCP context
 */
@Injectable()
export class TokenInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const request = context.switchToHttp().getRequest();

    // The token was already extracted and validated by BearerAuthGuard
    // Store it in a way that MCP tools can access it
    if (request.runalyzeToken) {
      // Store in request context for MCP tools to access
      request.mcpContext = request.mcpContext || {};
      request.mcpContext[RUNALYZE_TOKEN_KEY] = request.runalyzeToken;
    }

    return next.handle();
  }
}
