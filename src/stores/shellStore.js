import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
export const useShellStore = create()(persist((set) => ({
    sidebarOpenKeys: ["projects"],
    setSidebarOpenKeys: (keys) => set({ sidebarOpenKeys: keys }),
    sidebarCollapsed: false,
    toggleSidebarCollapsed: () => set((s) => ({ sidebarCollapsed: !s.sidebarCollapsed })),
    shellUserId: null,
    setShellUserId: (id) => set({ shellUserId: id }),
}), {
    name: "apito:shell:v1",
    storage: createJSONStorage(() => localStorage),
    partialize: (state) => ({
        sidebarOpenKeys: state.sidebarOpenKeys,
        sidebarCollapsed: state.sidebarCollapsed,
        shellUserId: state.shellUserId,
    }),
}));
