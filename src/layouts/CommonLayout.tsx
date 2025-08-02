import { Layout, theme } from "antd";
import { useLocation, Outlet } from "react-router-dom";
import Header from "../components/common/Header";
import Sidebar from "../components/common/Sidebar";

const { Sider, Content } = Layout;

const CommonLayout = () => {
  const { token } = theme.useToken();
  const location = useLocation();

  const currentPath = location.pathname.replace("/", "") || "content";

  return (
    <Layout style={{ minHeight: "100vh", background: token.colorBgLayout }}>
      {/* Left Sidebar Column - Fixed */}
      <Sider
        width={240}
        style={{
          background: token.colorBgContainer,
          borderRight: `1px solid ${token.colorBorder}`,
          position: "fixed",
          left: 0,
          top: 0,
          bottom: 0,
          zIndex: 100,
          overflow: "hidden",
        }}
      >
        <Sidebar />
      </Sider>

      {/* Right Content Column */}
      <Layout style={{ marginLeft: 240 }}>
        {/* Header Component */}
        <Header currentPath={currentPath} />

        {/* Main Content - Scrollable */}
        <Content
          style={{
            background: token.colorBgLayout,
            padding: 0,
            overflowX: "hidden",
            overflowY: "auto",
            height: "calc(100vh - 72px)",
            marginTop: "72px",
          }}
        >
          <Outlet />
        </Content>

        {/* Footer Component - Optional */}
        {/* <Footer /> */}
      </Layout>
    </Layout>
  );
};

export default CommonLayout;
