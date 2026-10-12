import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { theme } from "antd";
const MediaPage = () => {
    const { token } = theme.useToken();
    return (_jsx("div", { style: {
            height: "100%",
            background: token.colorBgLayout,
            padding: "24px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
        }, children: _jsxs("div", { style: {
                textAlign: "center",
                color: token.colorTextSecondary,
            }, children: [_jsx("h2", { style: { color: token.colorText }, children: "Media Page" }), _jsx("p", { children: "Coming Soon..." })] }) }));
};
export default MediaPage;
