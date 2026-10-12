import { theme, Layout } from "antd";
import { getProductName, isSqliteBuilderProduct } from "../../utils/env";

const { Footer: AntFooter } = Layout;

const Footer = () => {
  const { token } = theme.useToken();
  const year = new Date().getFullYear();

  return (
    <AntFooter
      style={{
        background: token.colorBgContainer,
        borderTop: `1px solid ${token.colorBorder}`,
        padding: "16px 24px",
        textAlign: "center",
        color: token.colorTextSecondary,
        fontSize: "14px",
      }}
    >
      <div>
        {isSqliteBuilderProduct() ? (
          <>
            {getProductName()} ©{year}.{" "}
            <a href="https://apito.io" target="_blank" rel="noopener noreferrer">
              Powered by Apito
            </a>
          </>
        ) : (
          <>Apito Console V4 ©{year}. Built with React, TypeScript, and Ant Design.</>
        )}
      </div>
    </AntFooter>
  );
};

export default Footer;
