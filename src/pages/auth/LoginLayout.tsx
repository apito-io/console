import type { ReactNode } from "react";
import SchemaToApiIllustration from "../../components/illustrations/SchemaToApiIllustration";
import { isSqliteBuilderProduct } from "../../utils/env";
import "../../components/console/ConsoleShell.css";

interface LoginLayoutProps {
  children: ReactNode;
}

const LoginLayout = ({ children }: LoginLayoutProps) => {
  return (
    <div className="login-layout">
      <div className="login-layout-inner">
        <div className="login-layout-main">
          {children}
          {isSqliteBuilderProduct() ? (
            <p className="login-powered-by" style={{ textAlign: "center", marginTop: 16 }}>
              <a href="https://apito.io" target="_blank" rel="noopener noreferrer">
                Powered by Apito
              </a>
            </p>
          ) : null}
        </div>
        <div className="login-layout-illustration">
          <SchemaToApiIllustration />
        </div>
      </div>
    </div>
  );
};

export default LoginLayout;
