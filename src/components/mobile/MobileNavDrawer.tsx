import React from "react";
import { Drawer } from "antd";
import "./mobile.css";

interface MobileNavDrawerProps {
  open: boolean;
  onClose: () => void;
  children: React.ReactNode;
}

const MobileNavDrawer: React.FC<MobileNavDrawerProps> = ({
  open,
  onClose,
  children,
}) => {
  return (
    <Drawer
      placement="left"
      width={260}
      open={open}
      onClose={onClose}
      closable={false}
      rootClassName="mobile-nav-drawer"
      styles={{
        body: {
          padding: 0,
          height: "100%",
          overflow: "hidden",
        },
      }}
    >
      {children}
    </Drawer>
  );
};

export default MobileNavDrawer;
