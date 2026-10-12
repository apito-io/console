import React, { createContext, useContext, useState } from "react";
import type { ReactNode } from "react";
import { useLocation, useNavigate } from "../router/navigation";
import { useCookies } from "react-cookie";
import { jwtDecode } from "jwt-decode";
import { deleteAllCookies } from "../services/cookieUtils";
import { queryClient } from "../lib/queryClient";
import { redirectAfterAuth } from "../utils/authRedirect";
import * as authApi from "../api/authApi";
import { getConsoleDomain } from "../utils/env";
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
      await authApi.postRegister(data);
      window.localStorage.setItem("verifyEmail", signupData.email);
      if (typeof window !== "undefined" && window.posthog) {
        window.posthog.capture("signup_completed", {
          auth_method: "password",
          product: "app",
        });
      }
      setLoading(false);
      navigate("/verify");
      return undefined;
    } catch (err: unknown) {
      setLoading(false);
      if (err && typeof err === "object" && "response" in err) {
        const error = err as {
          response?: { status?: number; data?: { message?: string } };
        };
        if (error.response && Number(error.response.status) === 400) {
          return error.response.data?.message;
        }
      }
      return "An error occurred during registration";
    }
  };

  const identifyFromToken = () => {
    try {
      const tokenData = decodeTokenData();
      const userId = tokenData?.sub || tokenData?.account;
      if (userId && typeof window !== "undefined" && window.posthog) {
        window.posthog.identify(String(userId), {
          product: "app",
          domain: getConsoleDomain(),
          cross_product_user: true,
        });
      }
    } catch {
      /* ignore analytics failures */
    }
  };

  const handleSigninAPI = async (
    data: LoginFormData
  ): Promise<string | undefined> => {
    setLoading(true);
    try {
      const response = await authApi.postLogin(data);
      if (Number(response.status) === 200) {
        setLoading(false);
        identifyFromToken();
        if (typeof window !== "undefined" && window.posthog) {
          window.posthog.capture("user_auth", {
            auth_method: "password",
            success: true,
            product: "app",
          });
        }
        redirectAfterAuth(navigateFrom);
        return undefined;
      }
      // If response status is not 200, treat as error
      setLoading(false);
      return response.data?.message || "Login failed";
    } catch (err: unknown) {
      setLoading(false);
      console.error("Login error details:", err);
      
      if (err && typeof err === "object" && "response" in err) {
        const error = err as { 
          response?: { 
            data?: { 
              message?: string;
              error?: string;
            };
            status?: number;
            statusText?: string;
          } 
        };
        
        // Try to get error message from different possible locations
        const errorMessage = error.response?.data?.message || 
                           error.response?.data?.error || 
                           error.response?.statusText ||
                           `Login failed with status ${error.response?.status}`;
        
        console.log("Extracted error message:", errorMessage);
        return errorMessage;
      }
      return "Login failed";
    }
  };

  const handleLogoutAPI = async (): Promise<void> => {
    try {
      await authApi.postLogout();
    } catch (error) {
      console.log("Logout error:", error);
    }
    try {
      if (typeof window !== "undefined" && window.posthog) {
        window.posthog.reset();
      }
    } catch {
      /* ignore */
    }
    await deleteAllCookies();
    queryClient.clear();
    setLoading(false);
    navigate("/auth/login");
  };

  const handleEmailVerifyAPI = async (
    data: VerificationFormData
  ): Promise<string | undefined> => {
    setLoading(true);
    try {
      const response = await authApi.postEmailVerify(data);
      if (Number(response.status) === 200) {
        setLoading(false);
        redirectAfterAuth(navigateFrom);
        return undefined;
      }
    } catch (err: unknown) {
      setLoading(false);
      if (err && typeof err === "object" && "response" in err) {
        const error = err as {
          response?: { status?: number; data?: { message?: string } };
        };
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
      const response = await authApi.postForgotPassword(data);
      if (Number(response.status) === 200) {
        setLoading(false);
        navigate("/change-password");
        return undefined;
      }
    } catch (err: unknown) {
      setLoading(false);
      if (err && typeof err === "object" && "response" in err) {
        const error = err as {
          response?: { status?: number; data?: { message?: string } };
        };
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
      const response = await authApi.postVerifyPassword(data);
      if (Number(response.status) === 200) {
        setLoading(false);
        navigate("/auth/login");
        return undefined;
      }
    } catch (err: unknown) {
      setLoading(false);
      if (err && typeof err === "object" && "response" in err) {
        const error = err as {
          response?: { status?: number; data?: { message?: string } };
        };
        if (error.response && Number(error.response.status) === 400) {
          return error.response.data?.message;
        }
      }
      return "Password change failed";
    }
  };

  const handleLogout = async (): Promise<void> => {
    await handleLogoutAPI();
    navigate("/auth/login");
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
