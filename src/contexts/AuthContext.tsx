import React, { createContext, useContext, useState } from "react";
import type { ReactNode } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useCookies } from "react-cookie";
import { jwtDecode } from "jwt-decode";
import { httpService, deleteAllCookies } from "../services/httpService";
import {
  LOGIN_URL,
  LOGOUT_URL,
  REGISTER_URL,
  EMAIL_VERIFY,
  FORGET_PASSWORD,
  VERIFY_PASSWORD,
  GOOGLE_LOGIN_URL,
  GITHUB_LOGIN_URL,
} from "../constants/api";
import type {
  LoginFormData,
  RegistrationFormData,
  VerificationFormData,
  ForgotPasswordFormData,
  ChangePasswordFormData,
  TokenData,
  LocationState,
  AuthContextType,
} from "../types/auth";

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [cookies] = useCookies(["userToken"]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const locState = location.state as LocationState;
  const navigateFrom = locState?.from || "/";

  const isAuthenticated = (): boolean => {
    return !(cookies.userToken === undefined || cookies.userToken === null);
  };

  const readJWTToken = (): string | null => {
    if (cookies.userToken === undefined || cookies.userToken === null) {
      return null;
    }
    return cookies?.userToken;
  };

  const decodeTokenData = (): TokenData | null => {
    const token = readJWTToken();
    if (token === null) {
      return null;
    }
    try {
      return jwtDecode<TokenData>(token);
    } catch (error) {
      console.error("Error decoding token:", error);
      return null;
    }
  };

  const handleSignupAPI = async (
    data: RegistrationFormData
  ): Promise<string | undefined> => {
    const signupData = {
      email: data.email,
      password: data.password,
    };
    setLoading(true);
    try {
      await httpService.post(REGISTER_URL, signupData);
      window.localStorage.setItem("verifyEmail", signupData.email);
      setLoading(false);
      navigate("/verify");
      return undefined;
    } catch (err: unknown) {
      setLoading(false);
      if (err && typeof err === 'object' && 'response' in err) {
        const error = err as { response?: { status?: number; data?: { message?: string } } };
        if (error.response && Number(error.response.status) === 400) {
          return error.response.data?.message;
        }
      }
      return "An error occurred during registration";
    }
  };

  const handleSigninAPI = async (
    data: LoginFormData
  ): Promise<string | undefined> => {
    setLoading(true);
    try {
      const response = await httpService.post(LOGIN_URL, data);
      if (Number(response.status) === 200) {
        setLoading(false);
        navigate("/");
        window.location.reload();
        return undefined;
      }
    } catch (err: unknown) {
      setLoading(false);
      if (err && typeof err === 'object' && 'response' in err) {
        const error = err as { response?: { data?: { message?: string } } };
        return error.response?.data?.message || "Login failed";
      }
      return "Login failed";
    }
  };

  const handleLogoutAPI = async (): Promise<void> => {
    try {
      await httpService.post(LOGOUT_URL, {});
    } catch (error) {
      console.log("Logout error:", error);
    }
    await deleteAllCookies();
    setLoading(false);
    navigate("/login");
  };

  const handleEmailVerifyAPI = async (
    data: VerificationFormData
  ): Promise<string | undefined> => {
    setLoading(true);
    try {
      const response = await httpService.post(EMAIL_VERIFY, data);
      if (Number(response.status) === 200) {
        setLoading(false);
        navigate("/");
        window.location.reload();
        return undefined;
      }
    } catch (err: unknown) {
      setLoading(false);
      if (err && typeof err === 'object' && 'response' in err) {
        const error = err as { response?: { status?: number; data?: { message?: string } } };
        if (error.response && Number(error.response.status) === 400) {
          return error.response.data?.message;
        }
      }
      return "Verification failed";
    }
  };

  const handleForgotPasswordRequestAPI = async (
    data: ForgotPasswordFormData
  ): Promise<string | undefined> => {
    setLoading(true);
    try {
      const response = await httpService.post(FORGET_PASSWORD, data);
      if (Number(response.status) === 200) {
        setLoading(false);
        navigate("/change-password");
        return undefined;
      }
    } catch (err: unknown) {
      setLoading(false);
      if (err && typeof err === 'object' && 'response' in err) {
        const error = err as { response?: { status?: number; data?: { message?: string } } };
        if (error.response && Number(error.response.status) === 400) {
          return error.response.data?.message;
        }
      }
      return "Password reset request failed";
    }
  };

  const handleForgotPasswordConfirmationAPI = async (
    data: ChangePasswordFormData
  ): Promise<string | undefined> => {
    setLoading(true);
    try {
      const response = await httpService.post(VERIFY_PASSWORD, data);
      if (Number(response.status) === 200) {
        setLoading(false);
        navigate("/login");
        return undefined;
      }
    } catch (err: unknown) {
      setLoading(false);
      if (err && typeof err === 'object' && 'response' in err) {
        const error = err as { response?: { status?: number; data?: { message?: string } } };
        if (error.response && Number(error.response.status) === 400) {
          return error.response.data?.message;
        }
      }
      return "Password change failed";
    }
  };

  const handleLogout = async (): Promise<void> => {
    await handleLogoutAPI();
    navigate("/login");
  };

  const handleGoogleLogin = async (): Promise<void> => {
    try {
      setLoading(true);
      const response = await httpService.get(GOOGLE_LOGIN_URL);
      if (response.status === 200 && response.data.message) {
        // Backend returns the OAuth URL, redirect to it
        window.location.href = response.data.message;
      }
    } catch (error) {
      setLoading(false);
      console.error("Google login error:", error);
    }
  };

  const handleGithubLogin = async (): Promise<void> => {
    try {
      setLoading(true);
      const response = await httpService.get(GITHUB_LOGIN_URL);
      if (response.status === 200 && response.data.message) {
        // Backend returns the OAuth URL, redirect to it
        window.location.href = response.data.message;
      }
    } catch (error) {
      setLoading(false);
      console.error("GitHub login error:", error);
    }
  };

  const value: AuthContextType = {
    isAuthenticated,
    readJWTToken,
    decodeTokenData,
    handleSigninAPI,
    handleSignupAPI,
    handleLogoutAPI,
    handleEmailVerifyAPI,
    handleForgotPasswordRequestAPI,
    handleForgotPasswordConfirmationAPI,
    handleLogout,
    handleGoogleLogin,
    handleGithubLogin,
    loading,
    navigateFrom,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
