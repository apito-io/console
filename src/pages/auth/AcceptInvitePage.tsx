import { Alert, Button, Form, Input, Typography } from "antd";
import { useEffect, useMemo, useState } from "react";
import { Link as RouterLink } from "../../router/navigation";
import { httpService } from "../../services/httpService";
import { assetUrl } from "../../utils/url";
import { getLogoPath, getProductName } from "../../utils/env";
import LoginLayout from "./LoginLayout";
import "../../components/console/ConsoleShell.css";

const { Title, Text, Paragraph } = Typography;

interface InviteProject {
  project_id?: string;
  project_name?: string;
  invite_status?: string;
}

interface InvitePayload {
  email?: string;
  status?: string;
  expires_at?: string;
  needs_password?: boolean;
  message?: string;
  projects?: InviteProject[];
}

function tokenFromLocation(): string {
  if (typeof window === "undefined") return "";
  return new URLSearchParams(window.location.search).get("token") || "";
}

const AcceptInvitePage = () => {
  const token = useMemo(() => tokenFromLocation(), []);
  const [loading, setLoading] = useState(true);
  const [accepting, setAccepting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [payload, setPayload] = useState<InvitePayload | null>(null);
  const [form] = Form.useForm<{ secret: string }>();

  useEffect(() => {
    if (!token) {
      setError("Missing invite token");
      setLoading(false);
      return;
    }
    let cancelled = false;
    httpService
      .get<InvitePayload>(`/auth/v2/invite/${encodeURIComponent(token)}`)
      .then((res) => {
        if (!cancelled) setPayload(res.data);
      })
      .catch((err: { response?: { data?: { message?: string }; status?: number } }) => {
        if (cancelled) return;
        const status = err.response?.status;
        if (status === 410) setError("This invitation has expired");
        else setError(err.response?.data?.message || "Invite not found");
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [token]);

  const status = payload?.status || "";
  const accepted = status === "accepted";
  const expired = status === "expired";
  const invited = status === "invited";

  const handleAccept = async (values?: { secret?: string }) => {
    setError(null);
    setAccepting(true);
    try {
      const res = await httpService.post<InvitePayload>(
        `/auth/v2/invite/${encodeURIComponent(token)}/accept`,
        { secret: values?.secret || "" },
      );
      setPayload(res.data);
    } catch (err: unknown) {
      const ax = err as { response?: { data?: { message?: string }; status?: number } };
      if (ax.response?.status === 410) setError("This invitation has expired");
      else setError(ax.response?.data?.message || "Could not accept invite");
    } finally {
      setAccepting(false);
    }
  };

  return (
    <LoginLayout>
      <div className="login-form-shell">
        <div className="login-form-header">
          <img
            src={assetUrl(getLogoPath())}
            alt={`${getProductName()} Logo`}
            className="login-logo"
          />
          <Title level={1} className="login-title">
            {accepted ? "Invite accepted" : expired ? "Invite expired" : "Accept invite"}
          </Title>
        </div>

        {error ? <Alert type="error" showIcon message={error} style={{ marginBottom: 16 }} /> : null}
        {loading ? <Text type="secondary">Loading invite…</Text> : null}

        {!loading && payload ? (
          <>
            {payload.email ? (
              <Paragraph>
                Invited as <Text strong>{payload.email}</Text>
              </Paragraph>
            ) : null}
            {payload.projects?.length ? (
              <Paragraph type="secondary">
                {(payload.projects || [])
                  .map((p) => p.project_name || p.project_id)
                  .filter(Boolean)
                  .join(", ")}
              </Paragraph>
            ) : null}

            {accepted ? (
              <Alert
                type="success"
                showIcon
                message="Accepted"
                description="You can log in and open the project."
                style={{ marginBottom: 16 }}
              />
            ) : null}

            {expired ? (
              <Alert
                type="warning"
                showIcon
                message="This invitation expired"
                description="Ask a project admin to send a new invite."
                style={{ marginBottom: 16 }}
              />
            ) : null}

            {invited && payload.needs_password ? (
              <Form form={form} layout="vertical" onFinish={handleAccept}>
                <Form.Item
                  name="secret"
                  label="Choose a password"
                  rules={[{ required: true, min: 8, message: "At least 8 characters" }]}
                >
                  <Input.Password autoComplete="new-password" />
                </Form.Item>
                <Button type="primary" htmlType="submit" loading={accepting} block>
                  Accept invite
                </Button>
              </Form>
            ) : null}

            {invited && !payload.needs_password ? (
              <Button type="primary" loading={accepting} onClick={() => void handleAccept()} block>
                Accept invite
              </Button>
            ) : null}

            <Paragraph style={{ marginTop: 24 }}>
              <RouterLink to="/auth/login">Go to login</RouterLink>
            </Paragraph>
          </>
        ) : null}
      </div>
    </LoginLayout>
  );
};

export default AcceptInvitePage;
