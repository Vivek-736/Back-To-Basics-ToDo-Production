import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { verifyToken } from '@clerk/backend';

@Injectable()
export class ClerkAuthGuard implements CanActivate {
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const authHeader = request.headers['authorization'] || request.headers['Authorization'];

    if (!authHeader || typeof authHeader !== 'string') {
      throw new UnauthorizedException('Authorization header is missing');
    }

    const [bearer, token] = authHeader.split(' ');
    if (bearer !== 'Bearer' || !token) {
      throw new UnauthorizedException('Malformed authorization header');
    }

    const secretKey = process.env.CLERK_SECRET_KEY;
    if (!secretKey) {
      throw new UnauthorizedException('CLERK_SECRET_KEY is not configured on server');
    }

    try {
      const verifiedPayload = await verifyToken(token, {
        secretKey,
      });

      if (!verifiedPayload || !verifiedPayload.sub) {
        throw new UnauthorizedException('Invalid token payload');
      }

      // Attach user information to request
      request.user = {
        userId: verifiedPayload.sub,
        ...verifiedPayload,
      };

      return true;
    } catch (err: any) {
      // Fallback for development/testing if token is a direct user id
      if (process.env.NODE_ENV !== 'production' && token.startsWith('user_')) {
        request.user = { userId: token };
        return true;
      }
      throw new UnauthorizedException(`Authentication failed: ${err.message || err}`);
    }
  }
}