import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import SchemaToApiIllustration from "../../components/illustrations/SchemaToApiIllustration";
const LoginLayout = ({ children }) => {
    return (_jsx("div", { style: {
            minHeight: "100vh",
            display: "flex",
            alignItems: "stretch",
            justifyContent: "center",
            background: "#ffffff",
            padding: 0,
        }, children: _jsxs("div", { style: {
                width: "100%",
                maxWidth: "none",
                display: "flex",
                gap: 0,
                alignItems: "stretch",
            }, children: [_jsx("div", { style: {
                        flex: "1",
                        background: "#ffffff",
                        padding: "0",
                        minHeight: "100vh",
                        display: "flex",
                        flexDirection: "column",
                        justifyContent: "center",
                        alignItems: "center",
                    }, children: children }), _jsx("div", { style: {
                        flex: 1,
                        backgroundImage: "radial-gradient(#ebedf0 1px, transparent 1px)",
                        backgroundSize: "20px 20px",
                        border: "1px solid #f0f0f0",
                        padding: "32px",
                        position: "relative",
                        display: "flex",
                        flexDirection: "column",
                        justifyContent: "space-between",
                        minHeight: "100vh",
                    }, children: _jsx(SchemaToApiIllustration, {}) })] }) }));
};
export default LoginLayout;
