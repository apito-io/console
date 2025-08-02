import { theme, Layout } from "antd";

const { Footer: AntFooter } = Layout;

const Footer = () => {
  const { token } = theme.useToken();

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
        Apito Console V4 ©2024. Built with React, TypeScript, and Ant Design.
      </div>
    </AntFooter>
  );
};

export default Footer; 