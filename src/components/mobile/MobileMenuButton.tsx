import React from "react";
import { Menu } from "lucide-react";
import "./mobile.css";

interface MobileMenuButtonProps {
  onClick: () => void;
}

const MobileMenuButton: React.FC<MobileMenuButtonProps> = ({ onClick }) => {
  return (
    <button
      type="button"
      className="mobile-menu-button"
      aria-label="Open navigation"
      onClick={onClick}
    >
      <Menu size={20} strokeWidth={1.75} />
    </button>
  );
};

export default MobileMenuButton;
