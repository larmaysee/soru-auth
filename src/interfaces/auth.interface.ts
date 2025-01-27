export interface IAuthUser {
  id: string | number;
  email: string;
  roles?: string[];
  permissions?: string[];
}

export interface IAuthConfig {
  jwtSecret: string;
  jwtExpiresIn?: string;
  refreshTokenExpiresIn?: string;
}

export interface IPermission {
  id: string;
  name: string;
  description?: string;
  resource: string;
  action: 'create' | 'read' | 'update' | 'delete' | 'manage';
}

export interface IRole {
  id: string;
  name: string;
  description?: string;
  permissions: string[]; // Permission IDs
}

export interface IAuthResponse {
  accessToken: string;
  refreshToken?: string;
  user: IAuthUser;
}
