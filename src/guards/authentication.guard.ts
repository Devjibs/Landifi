import {
  CanActivate,
  ExecutionContext,
  Injectable,
  Logger,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';
import { Observable } from 'rxjs';

@Injectable()
export class AuthenticationGuard implements CanActivate {
  constructor(
    private jwtService: JwtService,
    private configService: ConfigService,
  ) {}
  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const request = context.switchToHttp().getRequest();
    const token = this.extractTokenFromUser(request);
    if (!token) {
      throw new UnauthorizedException('Invalid token!');
    }

    try {
      const payload = this.jwtService.verify(token, {
        secret: this.configService.get<string>('secrets.jwtSecret'),
      }); 
      request.userId = payload.sub;
    } catch (error) {
      Logger.error(error.message);
      throw new UnauthorizedException('Invalid token!');
    }
    return true;
  }

  private extractTokenFromUser(request: Request): string | undefined {
    return request.headers.authorization?.split(' ')[1];
  }
}
