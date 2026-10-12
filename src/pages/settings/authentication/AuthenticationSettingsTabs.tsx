import React from "react";
import { Tabs } from "antd";
import { LogIn } from "lucide-react";
import {
  FaFacebook,
  FaGithub,
  FaGoogle,
  FaLinkedin,
  FaXTwitter,
} from "react-icons/fa6";
import GeneralAuthTab from "./GeneralAuthTab";
import OAuthProviderTab, {
  type OAuthProviderId,
} from "./OAuthProviderTab";

export type AuthSettingsTabKey = "general" | OAuthProviderId;

export const AUTH_SETTINGS_TAB_KEYS: AuthSettingsTabKey[] = [
  "general",
  "google",
  "facebook",
  "github",
  "x",
  "linkedin",
];

const tabLabel = (icon: React.ReactNode, text: string) => (
  <span
    style={{
      display: "inline-flex",
      alignItems: "center",
      gap: 8,
    }}
  >
    {icon}
    {text}
  </span>
);

export type AuthenticationSettingsTabsProps = {
  activeKey: AuthSettingsTabKey;
  onChange: (key: AuthSettingsTabKey) => void;
  rolesList: string[];
  rolesLoading: boolean;
  hasSecrets: Record<OAuthProviderId, boolean>;
};

const AuthenticationSettingsTabs: React.FC<AuthenticationSettingsTabsProps> = ({
  activeKey,
  onChange,
  rolesList,
  rolesLoading,
  hasSecrets,
}) => {
  return (
    <Tabs
      activeKey={activeKey}
      onChange={(key) => onChange(key as AuthSettingsTabKey)}
      destroyInactiveTabPane={false}
      items={[
        {
          key: "general",
          label: tabLabel(
            <LogIn size={14} strokeWidth={1.75} />,
            "General"
          ),
          children: (
            <GeneralAuthTab
              rolesList={rolesList}
              rolesLoading={rolesLoading}
            />
          ),
        },
        {
          key: "google",
          label: tabLabel(
            <FaGoogle style={{ color: "#4285F4", fontSize: 14 }} />,
            "Google"
          ),
          children: (
            <OAuthProviderTab
              provider="google"
              hasClientSecret={hasSecrets.google}
            />
          ),
        },
        {
          key: "facebook",
          label: tabLabel(
            <FaFacebook style={{ color: "#1877F2", fontSize: 14 }} />,
            "Facebook"
          ),
          children: (
            <OAuthProviderTab
              provider="facebook"
              hasClientSecret={hasSecrets.facebook}
            />
          ),
        },
        {
          key: "github",
          label: tabLabel(
            <FaGithub style={{ color: "#181717", fontSize: 14 }} />,
            "GitHub"
          ),
          children: (
            <OAuthProviderTab
              provider="github"
              hasClientSecret={hasSecrets.github}
            />
          ),
        },
        {
          key: "x",
          label: tabLabel(
            <FaXTwitter style={{ color: "#000", fontSize: 14 }} />,
            "X"
          ),
          children: (
            <OAuthProviderTab
              provider="x"
              hasClientSecret={hasSecrets.x}
            />
          ),
        },
        {
          key: "linkedin",
          label: tabLabel(
            <FaLinkedin style={{ color: "#0A66C2", fontSize: 14 }} />,
            "LinkedIn"
          ),
          children: (
            <OAuthProviderTab
              provider="linkedin"
              hasClientSecret={hasSecrets.linkedin}
            />
          ),
        },
      ]}
    />
  );
};

export default AuthenticationSettingsTabs;
