import type { ReactNode } from "react";
import SchemaToApiIllustration from "../../components/illustrations/SchemaToApiIllustration";

interface LoginLayoutProps {
  children: ReactNode;
}

const LoginLayout = ({ children }: LoginLayoutProps) => {
  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "stretch",
        justifyContent: "center",
        background: "#ffffff",
        padding: 0,
      }}
    >
      <div
        style={{
          width: "100%",
          maxWidth: "none",
          display: "flex",
          gap: 0,
          alignItems: "stretch",
        }}
      >
        {/* Left login column */}
        <div
          style={{
            flex: "1",
            background: "#ffffff",
            padding: "0",
            minHeight: "100vh",
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          {children}
        </div>

        {/* Right illustration column */}
        <div
          style={{
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
          }}
        >
          <SchemaToApiIllustration />
        </div>
      </div>
    </div>
  );
};

export default LoginLayout;
