import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import {
  IAuthConfig,
  IAuthResponse,
  IAuthUser,
} from '../interfaces/auth.interface';

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly config: IAuthConfig,
  ) {}

  async generateTokens(user: IAuthUser): Promise<IAuthResponse> {
    const payload = {
      sub: user.id,
      email: user.email,
      roles: user.roles,
      permissions: user.permissions,
    };

    const [accessToken, refreshToken] = await Promise.all([
      this.jwtService.signAsync(payload, {
        secret: this.config.jwtSecret,
        expiresIn: this.config.jwtExpiresIn || '15m',
      }),
      this.jwtService.signAsync(payload, {
        secret: this.config.jwtSecret,
        expiresIn: this.config.refreshTokenExpiresIn || '7d',
      }),
    ]);

    return {
      accessToken,
      refreshToken,
      user,
    };
  }

  async validateToken(token: string): Promise<IAuthUser> {
    try {
      const payload = await this.jwtService.verifyAsync(token, {
        secret: this.config.jwtSecret,
      });

      return {
        id: payload.sub,
        email: payload.email,
        roles: payload.roles,
        permissions: payload.permissions,
      };
    } catch {
      return null;
    }
  }
}
