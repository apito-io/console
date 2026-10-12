import React, { createContext, useContext, useEffect, useRef, useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { useAuth } from "../contexts/AuthContext";
import {
  subscribeNotifySystem,
  SystemEventType,
  type SystemNotifyPayload,
} from "../lib/systemSubscriptionClient";
import {
  pluginRegistryKeys,
  projectKeys,
  schemaKeys,
} from "../lib/queryKeys";

export type SchemaPublishProgressEvent = {
  changesetId: string;
  done: number;
  total: number;
  status: string;
  receivedAt: number;
};

type SystemNotificationsContextValue = {
  connected: boolean;
  /** Latest schema_publish_progress websocket payload (null until first event). */
  schemaPublishProgress: SchemaPublishProgressEvent | null;
};

const SystemNotificationsContext = createContext<SystemNotificationsContextValue>({
  connected: false,
  schemaPublishProgress: null,
});

function parseSchemaPublishProgress(
  evt: SystemNotifyPayload
): SchemaPublishProgressEvent | null {
  if ((evt.type ?? "") !== SystemEventType.SchemaPublishProgress) {
    return null;
  }
  const raw = evt.message ?? "";
  if (!raw) return null;
  try {
    const parsed = JSON.parse(raw) as {
      changeset_id?: string;
      done?: number;
      total?: number;
      status?: string;
    };
    const done = typeof parsed.done === "number" ? parsed.done : 0;
    const total = typeof parsed.total === "number" ? parsed.total : 0;
    return {
      changesetId: parsed.changeset_id ?? "",
      done,
      total,
      status: parsed.status ?? "",
      receivedAt: Date.now(),
    };
  } catch {
    return null;
  }
}

function invalidateForEvent(
  queryClient: ReturnType<typeof useQueryClient>,
  evt: SystemNotifyPayload
) {
  const type = evt.type ?? "";
  switch (type) {
    case SystemEventType.SchemaExecutionUpdated:
    case SystemEventType.SchemaPublishProgress:
      void queryClient.invalidateQueries({ queryKey: schemaKeys.all });
      break;
    case SystemEventType.PluginStatusChanged:
      void queryClient.invalidateQueries({ queryKey: pluginRegistryKeys.all });
      break;
    case SystemEventType.ProjectCreated:
    case SystemEventType.ProjectUpdated:
      void queryClient.invalidateQueries({ queryKey: projectKeys.all });
      break;
    default:
      break;
  }
}

export const SystemNotificationsProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const queryClient = useQueryClient();
  const { isAuthenticated } = useAuth();
  const [connected, setConnected] = useState(false);
  const [schemaPublishProgress, setSchemaPublishProgress] =
    useState<SchemaPublishProgressEvent | null>(null);
  const handlerRef = useRef<(evt: SystemNotifyPayload) => void>(() => {});

  handlerRef.current = (evt) => {
    const progress = parseSchemaPublishProgress(evt);
    if (progress) {
      setSchemaPublishProgress(progress);
    }
    invalidateForEvent(queryClient, evt);
  };

  const authed = isAuthenticated();

  useEffect(() => {
    if (!authed) {
      setConnected(false);
      return;
    }

    const dispose = subscribeNotifySystem(
      (evt) => handlerRef.current(evt),
      setConnected
    );

    return () => {
      dispose();
      setConnected(false);
    };
  }, [authed, queryClient]);

  return (
    <SystemNotificationsContext.Provider value={{ connected, schemaPublishProgress }}>
      {children}
    </SystemNotificationsContext.Provider>
  );
};

/** Returns whether the notifySystem websocket is connected. */
export function useSystemNotificationsState(): SystemNotificationsContextValue {
  return useContext(SystemNotificationsContext);
}
