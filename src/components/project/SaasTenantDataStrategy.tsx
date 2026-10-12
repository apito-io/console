import React, { useEffect, useId } from "react";
import { Col, Form, Radio, Row, Space, Typography } from "antd";
import type { FormInstance } from "antd";
import ConsoleCard from "../console/ConsoleCard";
import "../console/ConsoleShell.css";
import "./SaasTenantDataStrategy.css";

const { Title, Text } = Typography;

export type SaasTenantDataStrategyProps = {
  form: FormInstance;
  visible: boolean;
  /** Inline radios without diagrams — for dense create flow */
  compact?: boolean;
  /** When false, separate-database-per-tenant stays visible but cannot be selected. */
  perTenantAllowed?: boolean;
};

function DiagramSharedDb({ uid }: { uid: string }) {
  const g = `saas-shared-${uid}`;
  return (
    <svg
      width="100%"
      height="108"
      viewBox="0 0 260 108"
      aria-hidden
      className="saas-diagram-svg"
    >
      <defs>
        <linearGradient id={`${g}-db`} x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#e6f4ff" />
          <stop offset="100%" stopColor="#bae0ff" />
        </linearGradient>
      </defs>
      <rect
        x="8"
        y="6"
        width="244"
        height="96"
        rx="10"
        fill={`url(#${g}-db)`}
        stroke="#1890ff"
        strokeWidth="1.5"
      />
      <text
        x="130"
        y="22"
        textAnchor="middle"
        fill="#0958d9"
        fontSize="10"
        fontWeight="700"
      >
        One database · one set of tables
      </text>
      <rect
        x="20"
        y="30"
        width="220"
        height="64"
        rx="4"
        fill="#ffffff"
        stroke="#69b1ff"
        strokeWidth="1"
      />
      <rect x="20" y="30" width="220" height="18" rx="4" fill="#f0f5ff" />
      <line
        x1="92"
        y1="30"
        x2="92"
        y2="94"
        stroke="#d3e4ff"
        strokeWidth="1"
      />
      <text x="28" y="42" fill="#262626" fontSize="9" fontWeight="600">
        tenant_id
      </text>
      <text x="100" y="42" fill="#262626" fontSize="9" fontWeight="600">
        …your data columns
      </text>
      {[
        { y: 52, id: "tenant_1", fill: "#e6f7ff" },
        { y: 66, id: "tenant_2", fill: "#fff7e6" },
        { y: 80, id: "tenant_3", fill: "#f6ffed" },
      ].map((row) => (
        <g key={row.id}>
          <rect
            x="22"
            y={row.y - 2}
            width="68"
            height="12"
            rx="2"
            fill={row.fill}
            stroke="#91caff"
            strokeWidth="0.75"
          />
          <text
            x="28"
            y={row.y + 7}
            fill="#434343"
            fontSize="8"
            fontFamily="monospace"
          >
            {row.id}
          </text>
          <text x="100" y={row.y + 7} fill="#8c8c8c" fontSize="8">
            rows scoped by id
          </text>
        </g>
      ))}
    </svg>
  );
}

function DiagramPerTenantDb({ uid }: { uid: string }) {
  const g = `saas-silo-${uid}`;
  return (
    <svg
      width="100%"
      height="108"
      viewBox="0 0 260 108"
      aria-hidden
      className="saas-diagram-svg"
    >
      <defs>
        <linearGradient id={`${g}-db`} x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#f6ffed" />
          <stop offset="100%" stopColor="#d9f7be" />
        </linearGradient>
      </defs>
      <text
        x="130"
        y="14"
        textAnchor="middle"
        fill="#389e0d"
        fontSize="10"
        fontWeight="700"
      >
        Each tenant · own database
      </text>
      {[0, 1, 2].map((i) => (
        <g key={i} transform={`translate(${22 + i * 78}, 22)`}>
          <rect
            x="0"
            y="20"
            width="70"
            height="58"
            rx="6"
            fill={`url(#${g}-db)`}
            stroke="#52c41a"
            strokeWidth="1.5"
          />
          <text
            x="35"
            y="52"
            textAnchor="middle"
            fill="#237804"
            fontSize="10"
            fontWeight="600"
          >
            DB
          </text>
          <rect
            x="8"
            y="0"
            width="54"
            height="16"
            rx="4"
            fill="#ffffff"
            stroke="#b7eb8f"
          />
          <text x="35" y="11" textAnchor="middle" fill="#434343" fontSize="8">
            Tenant {i + 1}
          </text>
        </g>
      ))}
    </svg>
  );
}

const SaasTenantDataStrategy: React.FC<SaasTenantDataStrategyProps> = ({
  form,
  visible,
  compact = false,
  perTenantAllowed = false,
}) => {
  const uid = useId().replace(/:/g, "");
  const selected = Form.useWatch("per_tenant_separate_database", form);
  const isSeparateDb = perTenantAllowed && selected === true;

  useEffect(() => {
    if (!visible) return;
    const current = form.getFieldValue("per_tenant_separate_database");
    if (!perTenantAllowed) {
      form.setFieldsValue({ per_tenant_separate_database: false });
      return;
    }
    if (current === undefined || current === null) {
      form.setFieldsValue({ per_tenant_separate_database: false });
    }
  }, [visible, form, perTenantAllowed]);

  if (!visible) return null;

  if (compact) {
    return (
      <div className="saas-strategy-compact">
        <div className="saas-strategy-compact__head">
          <Text strong className="saas-strategy-compact__label">
            Tenant data storage
          </Text>
          <Text type="secondary" className="saas-strategy-compact__sub">
            How Apito isolates customer data for this SaaS project. Auto-provision
            tenant on signup is configured under Authentication settings
            (defaults on when separate DB is selected).
          </Text>
        </div>
        <Form.Item
          name="per_tenant_separate_database"
          rules={[
            {
              required: true,
              message: "Select how tenant data should be stored",
            },
          ]}
          style={{ marginBottom: 0 }}
        >
          <Radio.Group className="saas-strategy-compact__group">
            <label
              className={`saas-strategy-compact__card${!isSeparateDb ? " saas-strategy-compact__card--active saas-strategy-compact__card--shared" : ""}`}
            >
              <Radio value={false} className="saas-strategy-compact__radio" />
              <div className="saas-strategy-compact__body">
                <Text strong className="saas-strategy-compact__title">
                  Shared DB + tenant_id
                </Text>
                <div className="saas-strategy-compact__diagram" aria-hidden>
                  <DiagramSharedDb uid={`${uid}-c`} />
                </div>
                <Text type="secondary" className="saas-strategy-compact__desc">
                  All tenants share tables; rows scoped by tenant id.
                </Text>
              </div>
            </label>
            <label
              className={`saas-strategy-compact__card${isSeparateDb ? " saas-strategy-compact__card--active saas-strategy-compact__card--silo" : ""}${!perTenantAllowed ? " saas-strategy-compact__card--disabled" : ""}`}
            >
              <Radio
                value={true}
                disabled={!perTenantAllowed}
                className="saas-strategy-compact__radio"
              />
              <div className="saas-strategy-compact__body">
                <Text strong className="saas-strategy-compact__title">
                  Separate DB per tenant
                </Text>
                <div className="saas-strategy-compact__diagram" aria-hidden>
                  <DiagramPerTenantDb uid={`${uid}-c`} />
                </div>
                <Text type="secondary" className="saas-strategy-compact__desc">
                  {perTenantAllowed
                    ? "Stronger isolation; more ops for connections and migrations."
                    : "Separate database per tenant is not available for this project."}
                </Text>
              </div>
            </label>
          </Radio.Group>
        </Form.Item>
      </div>
    );
  }

  const sharedOptionClass = [
    "saas-option",
    !isSeparateDb ? "saas-option--selected-shared" : "",
  ]
    .filter(Boolean)
    .join(" ");

  const siloOptionClass = [
    "saas-option",
    isSeparateDb ? "saas-option--selected-silo" : "",
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <ConsoleCard
      className="saas-strategy-card"
      title={
        <Space direction="vertical" size={4}>
          <Title level={4} className="console-section-title">
            How tenant data is stored
          </Title>
          <Text className="saas-strategy-subtitle">
            Isolation model for your SaaS — choose how Apito separates tenant
            data at the database level. Configure signup auto-provision under
            Authentication → General.
          </Text>
        </Space>
      }
    >
      <Form.Item
        name="per_tenant_separate_database"
        rules={[
          {
            required: true,
            message: "Select how tenant data should be stored",
          },
        ]}
        className="console-mb-0"
      >
        <Radio.Group className="saas-radio-group">
          <Row gutter={[16, 16]}>
            <Col xs={24} lg={12}>
              <Radio value={false} className="saas-radio-option">
                <div className={sharedOptionClass}>
                  <Text strong className="saas-option-title">
                    One database for everyone
                  </Text>
                  <div className="saas-option-diagram">
                    <DiagramSharedDb uid={uid} />
                  </div>
                  <span className="saas-option-desc">
                    All tenants share the same database and tables. Every row
                    carries a <strong>tenant id</strong> so data stays separated
                    in queries. Typical choice: lower cost, simpler backups,
                    faster to ship.
                  </span>
                </div>
              </Radio>
            </Col>
            <Col xs={24} lg={12}>
              <Radio value={true} disabled={!perTenantAllowed} className="saas-radio-option">
                <div className={siloOptionClass}>
                  <Text strong className="saas-option-title">
                    Separate database per tenant
                  </Text>
                  <div className="saas-option-diagram">
                    <DiagramPerTenantDb uid={uid} />
                  </div>
                  <span className="saas-option-desc">
                    {perTenantAllowed ? (
                      <>
                    Each tenant gets a dedicated database. Stronger isolation
                    and custom scaling per customer; expect more ops work
                    (connections, provisioning, migrations).
                      </>
                    ) : (
                      <>
                        Separate database per tenant is not available for this
                        project. Use shared tables with a tenant id.
                      </>
                    )}
                  </span>
                </div>
              </Radio>
            </Col>
          </Row>
        </Radio.Group>
      </Form.Item>
    </ConsoleCard>
  );
};

export default SaasTenantDataStrategy;
