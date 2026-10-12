import React from "react";
import { useParams } from "../../../router/navigation";
import { useConsoleRouteContext } from "../../../contexts/ConsoleRouteContext";
import Contents from "./Contents";

interface ConsoleContext {
  selectedModel: string | null;
  models: Array<{
    id: string;
    name: string;
    fields: Record<string, unknown>[];
    created_at: string;
    updated_at: string;
  }>;
}

const ContentsContainer: React.FC = () => {
  const params = useParams();
  const context = useConsoleRouteContext() as ConsoleContext | null;

  const modelName = params.model || context?.selectedModel || "";

  return <Contents modelName={modelName} />;
};

export default ContentsContainer;
