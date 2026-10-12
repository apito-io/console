import React, { useMemo } from "react";
import { useQueryClient } from "@tanstack/react-query";
import {
  ConsoleExtensionsProvider,
  useConsoleExtensions,
} from "../../contexts/ConsoleExtensionsContext";
import { useSchemaDraftOverlay } from "../../hooks/useSchemaDraftOverlay";
import { invalidateSchemaDraft } from "../../lib/schemaCache";

/** Mounts the shared pending-draft overlay for Models, Content badges, and Schema Changes. */
export function SchemaDraftExtensions({ children }: { children: React.ReactNode }) {
  const parent = useConsoleExtensions();
  const overlay = useSchemaDraftOverlay();
  const queryClient = useQueryClient();
  const value = useMemo(
    () => ({
      ...parent,
      schemaDraftOverlay: overlay,
      onSchemaMutationCompleted: async () => {
        await parent.onSchemaMutationCompleted?.();
        await invalidateSchemaDraft(queryClient);
      },
    }),
    [parent, overlay, queryClient]
  );
  return <ConsoleExtensionsProvider value={value}>{children}</ConsoleExtensionsProvider>;
}
