import { jsx as _jsx } from "react/jsx-runtime";
import LoginLayout from "./LoginLayout";
import LoginPageContent from "./LoginPageContent";
const LoginPage = () => {
    return (_jsx(LoginLayout, { children: _jsx(LoginPageContent, {}) }));
};
export default LoginPage;
