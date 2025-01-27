import { DynamicModule, Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { AuthService } from './services/auth.service';
import { IAuthConfig } from './interfaces/auth.interface';
import { PermissionGuard } from './guards/permission.guard';

@Module({})
export class AuthModule {
  static register(config: IAuthConfig): DynamicModule {
    return {
      module: AuthModule,
      imports: [
        JwtModule.register({
          secret: config.jwtSecret,
          signOptions: { expiresIn: config.jwtExpiresIn || '15m' },
        }),
      ],
      providers: [
        {
          provide: 'AUTH_CONFIG',
          useValue: config,
        },
        AuthService,
        PermissionGuard,
      ],
      exports: [AuthService, PermissionGuard],
    };
  }
}
