import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
  Inject,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../../prisma/prisma.service';
import { IS_PUBLIC_KEY } from '../../common/decorators/public.decorator';

@Injectable()
export class JwtAuthGuard implements CanActivate {
  constructor(
    @Inject(Reflector) private readonly reflector: Reflector,
    @Inject(JwtService) private readonly jwtService: JwtService,
    @Inject(PrismaService) private readonly prisma: PrismaService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    if (isPublic) {
      return true;
    }

    const request = context.switchToHttp().getRequest();
    const token = this.extractTokenFromHeader(request);

    if (!token) {
      throw new UnauthorizedException('You are not logged in. Please log in to get access.');
    }

    try {
      const payload = await this.jwtService.verifyAsync(token, {
        secret: process.env.JWT_SECRET || 'super-secret-jwt-key-clothing-store-2026',
      });

      const user = await this.prisma.user.findUnique({
        where: { id: payload.id },
      });

      if (!user) {
        throw new UnauthorizedException('The user belonging to this token no longer exists.');
      }

      if (!user.isActive) {
        throw new UnauthorizedException('This user account is inactive.');
      }

      // Check if password was changed after token was issued
      if (user.passwordChangedAt && payload.iat) {
        const changedTimestamp = Math.floor(user.passwordChangedAt.getTime() / 1000);
        if (payload.iat < changedTimestamp) {
          throw new UnauthorizedException('User recently changed password! Please log in again.');
        }
      }

      request.user = user;
      return true;
    } catch (err: any) {
      if (err instanceof UnauthorizedException) {
        throw err;
      }
      throw new UnauthorizedException('Invalid or expired token.');
    }
  }

  private extractTokenFromHeader(request: any): string | undefined {
    // 1. Next.js custom 'token' header (Priority 1)
    if (request.headers.token) {
      return request.headers.token as string;
    }

    // 2. Standard Authorization: Bearer <token> (Priority 2)
    const authHeader = request.headers.authorization;
    if (authHeader && typeof authHeader === 'string') {
      const [type, token] = authHeader.split(' ');
      if (type === 'Bearer' && token) {
        return token;
      }
      return authHeader; // In case bare token was passed in Authorization
    }

    return undefined;
  }
}
