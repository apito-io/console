import { Button, message } from "antd";
import { Copy } from "lucide-react";
import "./ProjectStartGuide.css";

const STEPS = [
  {
    step: "1",
    title: "Install the Apito CLI",
    detail: "Installs the apito command on macOS and Linux.",
    copyLabel: "Copy install command",
    text: "curl -fsSL https://get.apito.io/install.sh | bash",
  },
  {
    step: "2",
    title: "Set up Apito MCP",
    detail:
      "Opens this console, approves access, and writes a client config with no token in it.",
    copyLabel: "Copy MCP command",
    text: "apito mcp connect",
  },
  {
    step: "3",
    title: "Paste this prompt",
    detail: "Give this to your agent after MCP is connected.",
    copyLabel: "Copy prompt",
    text: "Build me a SaaS financial tracker. Each tenant is a household. Add accounts, transactions, categories, and monthly budgets. Use Apito MCP to create the models and keep each household's data separate.",
  },
] as const;

async function copyStep(text: string) {
  try {
    await navigator.clipboard.writeText(text);
    message.success("Copied");
  } catch {
    message.error("Could not copy");
  }
}

export default function ProjectStartGuide() {
  return (
    <section className="project-start-guide" aria-label="Start with the CLI">
      <h3 className="mono-section-title">Start with the CLI</h3>
      <p className="mono-section-desc">
        Install the CLI, connect MCP, then paste the prompt.
      </p>
      <div className="project-start-guide-grid">
        {STEPS.map((step) => (
          <article key={step.step} className="project-start-guide-card">
            <div className="project-start-guide-step">{step.step}</div>
            <h4 className="project-start-guide-title">{step.title}</h4>
            <p className="project-start-guide-detail">{step.detail}</p>
            <pre className="project-start-guide-text">{step.text}</pre>
            <Button
              size="small"
              icon={<Copy size={14} strokeWidth={1.75} />}
              onClick={() => copyStep(step.text)}
            >
              {step.copyLabel}
            </Button>
          </article>
        ))}
      </div>
    </section>
  );
}
