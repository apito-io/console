import { httpService } from "../services/httpService";
import { LOGIN_URL, LOGOUT_URL, REGISTER_URL, EMAIL_VERIFY, FORGET_PASSWORD, VERIFY_PASSWORD, } from "../constants/api";
export async function postRegister(data) {
    const signupData = { email: data.email, password: data.password };
    await httpService.post(REGISTER_URL, signupData);
}
export async function postLogin(data) {
    return httpService.post(LOGIN_URL, data);
}
export async function postLogout() {
    await httpService.post(LOGOUT_URL, {});
}
export async function postEmailVerify(data) {
    return httpService.post(EMAIL_VERIFY, data);
}
export async function postForgotPassword(data) {
    return httpService.post(FORGET_PASSWORD, data);
}
export async function postVerifyPassword(data) {
    return httpService.post(VERIFY_PASSWORD, data);
}
