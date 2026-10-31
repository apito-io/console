import { Dropdown } from "antd";
import type { MenuProps } from "antd";
import { HelpCircle } from "lucide-react";
import { getEnterpriseEmail, getSupportEmail } from "../../utils/env";

const DOCS_URL = "https://apito.io/docs";
const BUG_URL = "https://github.com/apito-io/engine/issues/new";
const QUESTION_URL = "https://github.com/apito-io/engine/discussions/new?category=q-a";
const DISCORD_URL = "https://discord.gg/Xb7p2ddC6E";

function openExternal(url: string) {
  window.open(url, "_blank", "noopener,noreferrer");
}

function openFeedback() {
  const surveyId = window.env?.VITE_POSTHOG_SURVEY_ID;
  const posthog = window.posthog as { displaySurvey?: (id: string) => void } | undefined;
  if (surveyId && posthog?.displaySurvey) {
    posthog.displaySurvey(surveyId);
    return;
  }
  window.location.href = `mailto:${getSupportEmail()}?subject=${encodeURIComponent("Apito feedback")}`;
}

export default function HelpMenu({ showSales = false }: { showSales?: boolean }) {
  const items: MenuProps["items"] = [
    { key: "docs", label: "Docs", onClick: () => openExternal(DOCS_URL) },
    { key: "bug", label: "Report a bug", onClick: () => openExternal(BUG_URL) },
    { key: "question", label: "Ask a question", onClick: () => openExternal(QUESTION_URL) },
    { key: "discord", label: "Discord", onClick: () => openExternal(DISCORD_URL) },
    {
      key: "email",
      label: "Email support",
      onClick: () => {
        window.location.href = `mailto:${getSupportEmail()}`;
      },
    },
    ...(showSales
      ? [
          {
            key: "sales",
            label: "Talk to sales",
            onClick: () => {
              window.location.href = `mailto:${getEnterpriseEmail()}`;
            },
          },
        ]
      : []),
    { key: "feedback", label: "Send feedback", onClick: openFeedback },
  ];

  return (
    <Dropdown menu={{ items }} trigger={["click"]} placement="topLeft">
      <button type="button" className="console-nav-item" aria-label="Help">
        <span className="console-nav-item-main">
          <HelpCircle size={16} strokeWidth={1.75} />
          <span>Help</span>
        </span>
      </button>
    </Dropdown>
  );
}
