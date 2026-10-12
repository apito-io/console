import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

export interface ShellStoreState {
  sidebarOpenKeys: string[];
  setSidebarOpenKeys: (keys: string[]) => void;
  sidebarCollapsed: boolean;
  toggleSidebarCollapsed: () => void;
  /** Last synced auth subject — when it changes, ShellUserSync resets sidebar prefs. */
  shellUserId: string | null;
  setShellUserId: (id: string | null) => void;
}

export const useShellStore = create<ShellStoreState>()(
  persist(
    (set) => ({
      sidebarOpenKeys: ["projects"],
      setSidebarOpenKeys: (keys) => set({ sidebarOpenKeys: keys }),
      sidebarCollapsed: false,
      toggleSidebarCollapsed: () =>
        set((s) => ({ sidebarCollapsed: !s.sidebarCollapsed })),
      shellUserId: null,
      setShellUserId: (id) => set({ shellUserId: id }),
    }),
    {
      name: "apito:shell:v1",
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        sidebarOpenKeys: state.sidebarOpenKeys,
        sidebarCollapsed: state.sidebarCollapsed,
        shellUserId: state.shellUserId,
      }),
    }
  )
);
