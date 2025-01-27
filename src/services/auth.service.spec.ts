import { Test, TestingModule } from '@nestjs/testing';
import { JwtService } from '@nestjs/jwt';
import { AuthService } from './auth.service';
import { IAuthConfig } from '../interfaces/auth.interface';

describe('AuthService', () => {
  let service: AuthService;
  let jwtService: JwtService;

  const mockConfig: IAuthConfig = {
    jwtSecret: 'test-secret',
    jwtExpiresIn: '15m',
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: JwtService,
          useValue: {
            signAsync: jest.fn().mockResolvedValue('test-token'),
            verifyAsync: jest.fn().mockResolvedValue({
              sub: '1',
              email: 'test@example.com',
              roles: ['user'],
              permissions: ['read'],
            }),
          },
        },
        {
          provide: 'AUTH_CONFIG',
          useValue: mockConfig,
        },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
    jwtService = module.get<JwtService>(JwtService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('generateTokens', () => {
    it('should generate access and refresh tokens', async () => {
      const user = {
        id: '1',
        email: 'test@example.com',
        roles: ['user'],
        permissions: ['read'],
      };

      const result = await service.generateTokens(user);

      expect(result).toHaveProperty('accessToken');
      expect(result).toHaveProperty('refreshToken');
      expect(result).toHaveProperty('user');
      expect(jwtService.signAsync).toHaveBeenCalledTimes(2);
    });
  });

  describe('validateToken', () => {
    it('should validate and return user data from token', async () => {
      const token = 'valid-token';

      const result = await service.validateToken(token);

      expect(result).toHaveProperty('id', '1');
      expect(result).toHaveProperty('email', 'test@example.com');
      expect(jwtService.verifyAsync).toHaveBeenCalledWith(token, {
        secret: mockConfig.jwtSecret,
      });
    });

    it('should return null for invalid token', async () => {
      jest
        .spyOn(jwtService, 'verifyAsync')
        .mockRejectedValueOnce(new Error('Invalid token'));

      const result = await service.validateToken('invalid-token');

      expect(result).toBeNull();
    });
  });
});
