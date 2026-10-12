import React, { useEffect, useMemo, useState } from "react";
import { Button, Form, message } from "antd";
import { useQueryClient } from "@tanstack/react-query";
import { useAuth } from "../../../contexts/AuthContext";
import {
  type UpdateProjectAuthenticationInput,
  useGetProjectAuthenticationQuery,
  useGetProjectRolesQuery,
  useUpdateProjectAuthenticationSettingsMutation,
} from "../../../generated_gql/tanstack-query";
import { settingsKeys } from "../../../lib/queryKeys";
import AuthenticationSettingsTabs, {
  type AuthSettingsTabKey,
} from "./AuthenticationSettingsTabs";
import {
  OAUTH_PROVIDER_META,
  type OAuthProviderId,
} from "./OAuthProviderTab";

const OAUTH_PROVIDERS: OAuthProviderId[] = [
  "google",
  "facebook",
  "github",
  "x",
  "linkedin",
];

function buildOAuthTabInput(
  provider: OAuthProviderId,
  values: Record<string, unknown>
): UpdateProjectAuthenticationInput {
  const meta = OAUTH_PROVIDER_META[provider];
  const input: UpdateProjectAuthenticationInput = {
    [meta.enableField]: Boolean(values[meta.enableField]),
    [meta.clientIdField]: String(values[meta.clientIdField] ?? "").trim(),
    [meta.redirectUriField]: String(values[meta.redirectUriField] ?? "").trim(),
  };
  const secret = String(values[meta.clientSecretField] ?? "").trim();
  if (secret !== "") {
    input[meta.clientSecretField as keyof UpdateProjectAuthenticationInput] =
      secret as never;
  }
  return input;
}

const AuthenticationSettingsForm: React.FC = () => {
  const [form] = Form.useForm();
  const [activeTab, setActiveTab] = useState<AuthSettingsTabKey>("general");
  const queryClient = useQueryClient();
  const { decodeTokenData } = useAuth();
  const tokenData = decodeTokenData();
  const projectId = tokenData?.project_id ?? "";

  const { data, isLoading: loading } = useGetProjectAuthenticationQuery(
    { _id: projectId },
    { enabled: Boolean(projectId) }
  );

  const { data: rolesData, isLoading: rolesLoading } =
    useGetProjectRolesQuery();

  const rolesList = rolesData?.currentProject?.roles
    ? Object.keys(rolesData.currentProject.roles)
    : [];

  const { mutateAsync: saveSettings, isPending: saving } =
    useUpdateProjectAuthenticationSettingsMutation({
      onSuccess: () => {
        message.success("Authentication settings saved");
        void queryClient.invalidateQueries({
          queryKey: settingsKeys.authentication(),
        });
      },
      onError: (e) =>
        message.error(
          e instanceof Error
            ? e.message
            : "Failed to save authentication settings"
        ),
    });

  const snapshot = data?.getProject?.authentication_settings;

  const hasSecrets = useMemo(
    () => ({
      google: Boolean(snapshot?.has_google_client_secret),
      facebook: Boolean(snapshot?.has_facebook_client_secret),
      github: Boolean(snapshot?.has_github_client_secret),
      x: Boolean(snapshot?.has_x_client_secret),
      linkedin: Boolean(snapshot?.has_linkedin_client_secret),
    }),
    [snapshot]
  );

  const initial = useMemo(() => {
    if (!snapshot) {
      return {
        enable_general_auth: true,
        enable_google_auth: false,
        enable_facebook_auth: false,
        enable_github_auth: false,
        enable_x_auth: false,
        enable_linkedin_auth: false,
        general_authentication_method: "email",
        google_client_id: "",
        google_oauth_redirect_uri: "",
        facebook_client_id: "",
        facebook_oauth_redirect_uri: "",
        github_client_id: "",
        github_oauth_redirect_uri: "",
        x_client_id: "",
        x_oauth_redirect_uri: "",
        linkedin_client_id: "",
        linkedin_oauth_redirect_uri: "",
        default_registration_role: "",
      };
    }
    return {
      enable_general_auth: Boolean(snapshot.enable_general_auth),
      enable_google_auth: Boolean(snapshot.enable_google_auth),
      enable_facebook_auth: Boolean(snapshot.enable_facebook_auth),
      enable_github_auth: Boolean(snapshot.enable_github_auth),
      enable_x_auth: Boolean(snapshot.enable_x_auth),
      enable_linkedin_auth: Boolean(snapshot.enable_linkedin_auth),
      general_authentication_method:
        snapshot.general_authentication_method || "email",
      google_client_id: snapshot.google_client_id ?? "",
      google_oauth_redirect_uri: snapshot.google_oauth_redirect_uri ?? "",
      facebook_client_id: snapshot.facebook_client_id ?? "",
      facebook_oauth_redirect_uri: snapshot.facebook_oauth_redirect_uri ?? "",
      github_client_id: snapshot.github_client_id ?? "",
      github_oauth_redirect_uri: snapshot.github_oauth_redirect_uri ?? "",
      x_client_id: snapshot.x_client_id ?? "",
      x_oauth_redirect_uri: snapshot.x_oauth_redirect_uri ?? "",
      linkedin_client_id: snapshot.linkedin_client_id ?? "",
      linkedin_oauth_redirect_uri: snapshot.linkedin_oauth_redirect_uri ?? "",
      default_registration_role: snapshot.default_registration_role ?? "",
    };
  }, [snapshot]);

  useEffect(() => {
    form.setFieldsValue(initial);
  }, [form, initial]);

  const onFinish = async (values: Record<string, unknown>) => {
    let input: UpdateProjectAuthenticationInput;

    if (activeTab === "general") {
      const defaultRole = String(
        values.default_registration_role ?? ""
      ).trim();
      input = {
        enable_general_auth: Boolean(values.enable_general_auth),
        general_authentication_method: String(
          values.general_authentication_method || "email"
        ),
        default_registration_role: defaultRole === "" ? null : defaultRole,
      };
    } else if (OAUTH_PROVIDERS.includes(activeTab)) {
      input = buildOAuthTabInput(activeTab, values);
    } else {
      return;
    }

    await saveSettings({ input });
  };

  return (
    <div className="console-form-narrow">
      <Form
        form={form}
        layout="vertical"
        onFinish={onFinish}
        disabled={loading && !snapshot}
        className="console-stack"
      >
        <AuthenticationSettingsTabs
          activeKey={activeTab}
          onChange={setActiveTab}
          rolesList={rolesList}
          rolesLoading={rolesLoading}
          hasSecrets={hasSecrets}
        />
        <Button type="primary" htmlType="submit" loading={saving}>
          Save
        </Button>
      </Form>
    </div>
  );
};

export default AuthenticationSettingsForm;
