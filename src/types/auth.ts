export interface LoginFormData {
  email: string;
  password: string;
}

export interface RegistrationFormData {
  email: string;
  password: string;
  confirmSecret?: string;
}

export interface VerificationFormData {
  email: string;
  code: string;
}

export interface ForgotPasswordFormData {
  email: string;
}

export interface ChangePasswordFormData {
  password: string;
  token: string;
}

export interface TokenData {
  project_access?: string;
  sub?: string;
  project_role?: string;
  iss?: string;
  'cognito:username'?: string;
  is_super_admin?: string;
  project_plan?: string;
  aud?: string;
  event_id?: string;
  project_id?: string;
  token_use?: string;
  auth_time?: number;
  exp?: number;
  iat?: number;
  account?: string;
  email?: string;
  project_type?: number;
  project_name?: string;
}

export interface LocationState {
  from: string;
}

export interface AuthContextType {
  isAuthenticated: () => boolean;
  readJWTToken: () => string | null;
  decodeTokenData: () => TokenData | null;
  handleSigninAPI: (data: LoginFormData) => Promise<string | undefined>;
  handleSignupAPI: (data: RegistrationFormData) => Promise<string | undefined>;
  handleLogoutAPI: () => Promise<void>;
  handleEmailVerifyAPI: (data: VerificationFormData) => Promise<string | undefined>;
  handleForgotPasswordRequestAPI: (data: ForgotPasswordFormData) => Promise<string | undefined>;
  handleForgotPasswordConfirmationAPI: (data: ChangePasswordFormData) => Promise<string | undefined>;
  handleLogout: () => Promise<void>;
  handleGoogleLogin: () => Promise<void>;
  handleGithubLogin: () => Promise<void>;
  loading: boolean;
  navigateFrom: string;
} 