import { apiClient, executeApiCall } from './client';
import { User } from '../types';

export interface LoginRequest {
  email: string;
  password?: string;
  rememberMe?: boolean;
}

export interface RegisterRequest {
  name: string;
  email: string;
  password?: string;
}

export interface AuthResponse {
  user: User;
  token: string;
  expiresIn: number;
}

const mockUser: User = {
  id: 'usr-1',
  name: 'Alex Rivera',
  email: 'alex.rivera@nexora.io',
  role: 'Engineering Lead & Architect',
  team: 'Adaptive Workspace Engineering',
};

export const authApi = {
  /**
   * POST /api/auth/login
   * Proposed Spring Boot endpoint: AuthController.login(@RequestBody LoginDTO dto)
   */
  async login(credentials: LoginRequest): Promise<AuthResponse> {
    return executeApiCall<AuthResponse>(
      () => apiClient.post('/auth/login', credentials),
      async () => {
        // Mock fallback
        await new Promise((resolve) => setTimeout(resolve, 300));
        return {
          user: {
            ...mockUser,
            email: credentials.email || mockUser.email,
            name: credentials.email ? credentials.email.split('@')[0].replace('.', ' ') : mockUser.name,
          },
          token: 'demo-jwt-token-eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9',
          expiresIn: 86400,
        };
      }
    );
  },

  /**
   * POST /api/auth/register
   * Proposed Spring Boot endpoint: AuthController.register(@RequestBody RegisterDTO dto)
   */
  async register(data: RegisterRequest): Promise<AuthResponse> {
    return executeApiCall<AuthResponse>(
      () => apiClient.post('/auth/register', data),
      async () => {
        await new Promise((resolve) => setTimeout(resolve, 350));
        return {
          user: {
            ...mockUser,
            name: data.name,
            email: data.email,
          },
          token: 'demo-jwt-token-registered-891028',
          expiresIn: 86400,
        };
      }
    );
  },

  /**
   * GET /api/auth/me
   */
  async getCurrentUser(): Promise<User> {
    return executeApiCall<User>(
      () => apiClient.get('/auth/me'),
      () => mockUser
    );
  },
};
