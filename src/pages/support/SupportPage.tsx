import React from "react";
import { Alert, Button, Row, Col } from "antd";
import {
  BookOpen,
  Bug,
  Building2,
  Mail,
  MessageCircle,
} from "lucide-react";
import {
  ConsoleCard,
  ConsoleCardTitle,
} from "../../components/console";
import {
  getEnterpriseEmail,
  getSupportEmail,
  isSqliteBuilderProduct,
} from "../../utils/env";
import "../../components/console/ConsoleShell.css";

const SupportPage: React.FC = () => {
  const supportEmail = getSupportEmail();
  const enterpriseEmail = getEnterpriseEmail();
  const sqliteBuilder = isSqliteBuilderProduct();

  return (
    <div className="console-page console-support-page">
      <div className="console-stack console-stack--lg">
        {sqliteBuilder ? (
          <Alert
            type="info"
            showIcon
            message="SQLite Builder is powered by Apito"
            description={
              <div className="console-support-product-note">
                <p>
                  SQLite Builder has a dedicated product team. Apito loves
                  SQLite — that is why we launched SQLite Builder as its own
                  product instead of burying it inside the Apito console.
                </p>
                <p>
                  The engine behind this console is still Apito, so{" "}
                  <strong>support, enterprise sales, and Discord</strong> are
                  the same people and the same inboxes. Use the addresses below.
                </p>
              </div>
            }
          />
        ) : null}

        <Row gutter={[24, 24]}>
          <Col xs={24} lg={14}>
            <div className="console-stack">
              <ConsoleCard
                title={
                  <ConsoleCardTitle icon={Mail} label="Official support" />
                }
              >
                <p className="console-text-block">
                  {sqliteBuilder
                    ? "Product issues, billing questions, and account help for SQLite Builder. Same dedicated inbox as Apito."
                    : "Product issues, billing questions, and account help. We reply on this inbox."}
                </p>
                <p className="console-support-email">
                  <a href={`mailto:${supportEmail}`}>{supportEmail}</a>
                </p>
                <Button
                  type="primary"
                  icon={<Mail size={16} strokeWidth={1.75} />}
                  href={`mailto:${supportEmail}`}
                >
                  Email support
                </Button>
              </ConsoleCard>

              <ConsoleCard
                title={
                  <ConsoleCardTitle
                    icon={Building2}
                    label="Enterprise sales"
                  />
                }
              >
                <p className="console-text-block">
                  {sqliteBuilder
                    ? "Dedicated limits, procurement, and SQLite-heavy studios. Same sales team as Apito — not a separate community inbox."
                    : "Dedicated studio, custom limits, and procurement. Talk to sales — not the community inbox."}
                </p>
                <p className="console-support-email">
                  <a href={`mailto:${enterpriseEmail}`}>{enterpriseEmail}</a>
                </p>
                <Button
                  icon={<Building2 size={16} strokeWidth={1.75} />}
                  href={`mailto:${enterpriseEmail}`}
                >
                  Email sales
                </Button>
              </ConsoleCard>

              <ConsoleCard
                title={
                  <ConsoleCardTitle icon={BookOpen} label="Docs and bugs" />
                }
              >
                <p className="console-text-block">
                  Read the docs, report a bug on GitHub, or ask in Discord.
                  Questions that need a private answer go to support.
                </p>
                <div className="console-inline-row">
                  <Button
                    type="primary"
                    icon={<BookOpen size={16} strokeWidth={1.75} />}
                    href="https://apito.io/docs"
                    target="_blank"
                  >
                    Docs
                  </Button>
                  <Button
                    icon={<Bug size={16} strokeWidth={1.75} />}
                    href="https://github.com/apito-io/engine/issues/new"
                    target="_blank"
                  >
                    Report a bug
                  </Button>
                </div>
              </ConsoleCard>
            </div>
          </Col>

          <Col xs={24} lg={10}>
            <ConsoleCard
              title={
                <ConsoleCardTitle
                  icon={MessageCircle}
                  label="Discord community"
                />
              }
            >
              <p className="console-text-block console-mb-md">
                {sqliteBuilder
                  ? "Live community for SQLite Builder and Apito together. Same server as Join Discord in the sidebar."
                  : "Live community, release notes, and peer help. Same server as Join Discord in the sidebar."}
              </p>
              <div className="console-discord-widget">
                <iframe
                  title="Apito Discord"
                  src="https://discord.com/widget?id=794883412636467221&theme=dark"
                  width="350"
                  height="500"
                  allowTransparency
                  frameBorder={0}
                  sandbox="allow-popups allow-popups-to-escape-sandbox allow-same-origin allow-scripts"
                />
              </div>
            </ConsoleCard>
          </Col>
        </Row>
      </div>
    </div>
  );
};

export default SupportPage;
