import { jsx as _jsx } from "react/jsx-runtime";
import { theme, Layout } from "antd";
const { Footer: AntFooter } = Layout;
const Footer = () => {
    const { token } = theme.useToken();
    return (_jsx(AntFooter, { style: {
            background: token.colorBgContainer,
            borderTop: `1px solid ${token.colorBorder}`,
            padding: "16px 24px",
            textAlign: "center",
            color: token.colorTextSecondary,
            fontSize: "14px",
        }, children: _jsx("div", { children: "Apito Console V4 \u00A92024. Built with React, TypeScript, and Ant Design." }) }));
};
export default Footer;
