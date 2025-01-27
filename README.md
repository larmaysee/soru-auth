# @soru/auth

A flexible authentication library for NestJS applications with role-based access control and permissions management.

## Features

- JWT-based authentication
- Role-based access control (RBAC)
- Granular permissions system
- Easy integration with any NestJS project
- Configurable token expiration
- Refresh token support

## Installation

```bash
npm install @soru/auth
```

## Quick Start

1. Import and configure the AuthModule in your app.module.ts:

```typescript
import { AuthModule } from '@soru/auth';

@Module({
  imports: [
    AuthModule.register({
      jwtSecret: 'your-secret-key',
      jwtExpiresIn: '15m',
      refreshTokenExpiresIn: '7d',
    }),
  ],
})
export class AppModule {}
```

2. Protect your routes with permissions:

```typescript
import { RequirePermissions } from '@soru/auth';

@Controller('users')
export class UsersController {
  @RequirePermissions('users:create')
  @Post()
  createUser() {
    // Implementation
  }
}
```

## API Reference

### AuthModule

The main module that provides authentication functionality.

```typescript
AuthModule.register(config: IAuthConfig)
```

### IAuthConfig

Configuration options for the auth module:

```typescript
interface IAuthConfig {
  jwtSecret: string;
  jwtExpiresIn?: string;
  refreshTokenExpiresIn?: string;
}
```

### AuthService

Service for handling authentication operations:

```typescript
class AuthService {
  generateTokens(user: IAuthUser): Promise<IAuthResponse>;
  validateToken(token: string): Promise<IAuthUser>;
}
```

### Decorators

- `@RequirePermissions(...permissions: string[])`

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

MIT
