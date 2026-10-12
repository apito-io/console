import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Tabs, Typography } from "antd";
import AuthenticationSettingsForm from "./AuthenticationSettingsForm";
import AppUsersTab from "./AppUsersTab";
const { Paragraph, Title } = Typography;
const AuthenticationSettingsPage = () => {
    return (_jsxs("div", { style: { maxWidth: "1200px", margin: "0 auto" }, children: [_jsx(Title, { level: 4, style: { marginBottom: 8 }, children: "Authentication" }), _jsx(Paragraph, { type: "secondary", style: { marginBottom: 24 }, children: "Manage app end-users and configure project sign-in methods (password with email or phone, and optional Google OAuth)." }), _jsx(Tabs, { defaultActiveKey: "users", items: [
                    {
                        key: "users",
                        label: "Users",
                        children: _jsx(AppUsersTab, {}),
                    },
                    {
                        key: "settings",
                        label: "Authentication Settings",
                        children: _jsx(AuthenticationSettingsForm, {}),
                    },
                ] })] }));
};
export default AuthenticationSettingsPage;
