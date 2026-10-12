import { httpService } from "../services/httpService";
import {
  LOGIN_URL,
  LOGOUT_URL,
  REGISTER_URL,
  EMAIL_VERIFY,
  FORGET_PASSWORD,
  VERIFY_PASSWORD,
} from "../constants/api";
import type {
  LoginFormData,
  RegistrationFormData,
  VerificationFormData,
  ForgotPasswordFormData,
  ChangePasswordFormData,
} from "../types/auth";

export async function postRegister(data: RegistrationFormData): Promise<void> {
  const signupData = { email: data.email, password: data.password };
  await httpService.post(REGISTER_URL, signupData);
}

export async function postLogin(data: LoginFormData) {
  return httpService.post(LOGIN_URL, data);
}

export async function postLogout(): Promise<void> {
  await httpService.post(LOGOUT_URL, {});
}

export async function postEmailVerify(data: VerificationFormData) {
  return httpService.post(EMAIL_VERIFY, data);
}

export async function postForgotPassword(data: ForgotPasswordFormData) {
  return httpService.post(FORGET_PASSWORD, data);
}

export async function postVerifyPassword(data: ChangePasswordFormData) {
  return httpService.post(VERIFY_PASSWORD, data);
}
