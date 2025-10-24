import { Injectable, CanActivate, ExecutionContext, UnauthorizedException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Observable } from 'rxjs';
import { IS_PUBLIC_KEY } from './public.decorator';

@Injectable()
export class BearerAuthGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean> {
    // Check if route is marked as public
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    if (isPublic) {
      return true;
    }

    const request = context.switchToHttp().getRequest();
    const authHeader = request.headers['authorization'];

    if (!authHeader) {
      throw new UnauthorizedException(
        'Missing Authorization header. Please provide a Bearer token.',
      );
    }

    if (!authHeader.startsWith('Bearer ')) {
      throw new UnauthorizedException(
        'Invalid Authorization header format. Expected: Bearer <token>',
      );
    }

    const token = authHeader.substring(7); // Remove 'Bearer ' prefix

    if (!token || token.trim().length === 0) {
      throw new UnauthorizedException('Bearer token is empty');
    }

    // Store the token in the request for later use by tools
    request.runalyzeToken = token;

    return true;
  }
}
