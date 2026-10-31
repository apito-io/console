import React, { useEffect, useState } from "react";
import { Alert, Button, List, Typography } from "antd";
import { Wallet } from "lucide-react";
import { useNavigate } from "@tanstack/react-router";
import { useAuth } from "../../../contexts/AuthContext";
import { ConsoleCard, ConsoleCardTitle } from "../../../components/console";
import { httpService } from "../../../services/httpService";

type ProviderRow = {
  provider_id?: string;
  label?: string;
  plugin_id?: string;
  flows?: string[];
};

const PaymentProvidersPage: React.FC = () => {
  const navigate = useNavigate();
  const { decodeTokenData } = useAuth();
  const projectId = decodeTokenData()?.project_id ?? "";
  const [rows, setRows] = useState<ProviderRow[]>([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!projectId) return;
    let cancelled = false;
    setLoading(true);
    void httpService
      .get(`/system/v1/payments/projects/${encodeURIComponent(projectId)}/providers`)
      .then((res) => {
        if (!cancelled) setRows((res.data?.providers as ProviderRow[]) || []);
      })
      .catch((err: unknown) => {
        if (!cancelled) setError(err instanceof Error ? err.message : "Could not load providers");
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [projectId]);

  if (!projectId) {
    return <Alert type="warning" showIcon message="Select a project to see payment providers." />;
  }

  return (
    <ConsoleCard title={<ConsoleCardTitle icon={Wallet} label="Payment providers" />}>
      <Typography.Paragraph type="secondary">
        Providers appear here after their plugin is activated for this project. Credentials stay on the plugin settings page.
      </Typography.Paragraph>
      {error ? <Alert type="error" showIcon message={error} style={{ marginBottom: 16 }} /> : null}
      <List
        loading={loading}
        dataSource={rows}
        locale={{ emptyText: "No payment provider is activated." }}
        renderItem={(row) => (
          <List.Item
            actions={[
              <Button
                key="settings"
                type="link"
                onClick={() =>
                  void navigate({
                    to: "/console/settings/plugins/$pluginName",
                    params: { pluginName: row.plugin_id || "" },
                  })
                }
              >
                Plugin settings
              </Button>,
            ]}
          >
            <List.Item.Meta
              title={row.label || row.provider_id}
              description={(row.flows || []).join(", ") || row.provider_id}
            />
          </List.Item>
        )}
      />
    </ConsoleCard>
  );
};

export default PaymentProvidersPage;
