import React from "react";
import { Form, Input, Switch, Typography } from "antd";
import { ConsoleCard } from "../../../components/console";

const { Link } = Typography;

export type OAuthProviderId =
  | "google"
  | "facebook"
  | "github"
  | "x"
  | "linkedin";

type OAuthProviderMeta = {
  enableField: string;
  enableLabel: string;
  clientIdField: string;
  clientIdPlaceholder: string;
  redirectUriField: string;
  redirectUriPlaceholder: string;
  redirectUriExtra: string;
  clientSecretField: string;
  docsHref: string;
  docsLabel: string;
  cardTitle: string;
};

export const OAUTH_PROVIDER_META: Record<OAuthProviderId, OAuthProviderMeta> = {
  google: {
    enableField: "enable_google_auth",
    enableLabel: "Enable Google",
    clientIdField: "google_client_id",
    clientIdPlaceholder: "e.g. xxx.apps.googleusercontent.com",
    redirectUriField: "google_oauth_redirect_uri",
    redirectUriPlaceholder:
      "https://your-app.example.com/auth/google/callback",
    redirectUriExtra:
      "Must match exactly one URI in Google Cloud Console → Credentials → your OAuth client → Authorized redirect URIs.",
    clientSecretField: "google_client_secret",
    docsHref:
      "https://developers.google.com/identity/protocols/oauth2/web-server#creatingclient",
    docsLabel: "Google OAuth client setup",
    cardTitle: "Google sign-in",
  },
  facebook: {
    enableField: "enable_facebook_auth",
    enableLabel: "Enable Facebook",
    clientIdField: "facebook_client_id",
    clientIdPlaceholder: "App ID from Meta Developer Console",
    redirectUriField: "facebook_oauth_redirect_uri",
    redirectUriPlaceholder:
      "https://your-app.example.com/auth/facebook/callback",
    redirectUriExtra:
      "Must match a Valid OAuth Redirect URI in Meta Developer Console → Facebook Login → Settings.",
    clientSecretField: "facebook_client_secret",
    docsHref:
      "https://developers.facebook.com/docs/facebook-login/guides/advanced/manual-flow",
    docsLabel: "Facebook Login setup",
    cardTitle: "Facebook sign-in",
  },
  github: {
    enableField: "enable_github_auth",
    enableLabel: "Enable GitHub",
    clientIdField: "github_client_id",
    clientIdPlaceholder: "OAuth App client ID",
    redirectUriField: "github_oauth_redirect_uri",
    redirectUriPlaceholder:
      "https://your-app.example.com/auth/github/callback",
    redirectUriExtra:
      "Must match the Authorization callback URL on your GitHub OAuth App.",
    clientSecretField: "github_client_secret",
    docsHref:
      "https://docs.github.com/en/apps/oauth-apps/building-oauth-apps/creating-an-oauth-app",
    docsLabel: "GitHub OAuth App setup",
    cardTitle: "GitHub sign-in",
  },
  x: {
    enableField: "enable_x_auth",
    enableLabel: "Enable X",
    clientIdField: "x_client_id",
    clientIdPlaceholder: "OAuth 2.0 Client ID",
    redirectUriField: "x_oauth_redirect_uri",
    redirectUriPlaceholder: "https://your-app.example.com/auth/x/callback",
    redirectUriExtra:
      "Must match a Callback URI / Redirect URL in the X Developer Portal app settings.",
    clientSecretField: "x_client_secret",
    docsHref: "https://developer.x.com/en/docs/authentication/oauth-2-0",
    docsLabel: "X OAuth 2.0 setup",
    cardTitle: "X sign-in",
  },
  linkedin: {
    enableField: "enable_linkedin_auth",
    enableLabel: "Enable LinkedIn",
    clientIdField: "linkedin_client_id",
    clientIdPlaceholder: "Client ID from LinkedIn Developer Portal",
    redirectUriField: "linkedin_oauth_redirect_uri",
    redirectUriPlaceholder:
      "https://your-app.example.com/auth/linkedin/callback",
    redirectUriExtra:
      "Must match an Authorized redirect URL on your LinkedIn app Auth settings.",
    clientSecretField: "linkedin_client_secret",
    docsHref:
      "https://learn.microsoft.com/en-us/linkedin/shared/authentication/authorization-code-flow",
    docsLabel: "LinkedIn OAuth setup",
    cardTitle: "LinkedIn sign-in",
  },
};

export type OAuthProviderTabProps = {
  provider: OAuthProviderId;
  hasClientSecret: boolean;
};

const OAuthProviderTab: React.FC<OAuthProviderTabProps> = ({
  provider,
  hasClientSecret,
}) => {
  const meta = OAUTH_PROVIDER_META[provider];

  return (
    <ConsoleCard title={meta.cardTitle}>
      <Form.Item
        name={meta.enableField}
        label={meta.enableLabel}
        valuePropName="checked"
      >
        <Switch />
      </Form.Item>
      <Form.Item name={meta.clientIdField} label="OAuth client ID">
        <Input placeholder={meta.clientIdPlaceholder} />
      </Form.Item>
      <Form.Item
        name={meta.redirectUriField}
        label="Authorized redirect URI"
        extra={meta.redirectUriExtra}
      >
        <Input placeholder={meta.redirectUriPlaceholder} />
      </Form.Item>
      <Form.Item
        name={meta.clientSecretField}
        label="OAuth client secret"
        extra={
          hasClientSecret
            ? "Leave blank to keep the existing secret."
            : `Required for first-time configuration when ${meta.enableLabel.replace("Enable ", "")} is enabled.`
        }
      >
        <Input.Password placeholder="Leave blank to keep existing" />
      </Form.Item>
      <Link href={meta.docsHref} target="_blank" rel="noreferrer">
        {meta.docsLabel}
      </Link>
    </ConsoleCard>
  );
};

export default OAuthProviderTab;
