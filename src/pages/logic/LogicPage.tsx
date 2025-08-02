import { theme } from "antd";

const LogicPage = () => {
  const { token } = theme.useToken();

  return (
    <div
      style={{
        height: "100%",
        background: token.colorBgLayout,
        padding: "24px",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <div
        style={{
          textAlign: "center",
          color: token.colorTextSecondary,
        }}
      >
        <h2 style={{ color: token.colorText }}>Logic Page</h2>
        <p>Coming Soon...</p>
      </div>
    </div>
  );
};

export default LogicPage;
