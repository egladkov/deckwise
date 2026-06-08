import { create } from "zustand";
import { STORAGE_KEYS } from "../constants";
import { storageService } from "../services/storage.service";

interface UIState {
  sidebarOpen: boolean;
  theme: "light" | "dark";
  setSidebarOpen: (open: boolean) => void;
  toggleSidebar: () => void;
  setTheme: (theme: "light" | "dark") => void;
}

export const useUIStore = create<UIState>((set) => ({
  sidebarOpen: true,
  theme: (storageService.get<"light" | "dark">(STORAGE_KEYS.THEME)) || "light",

  setSidebarOpen: (open) => set({ sidebarOpen: open }),
  toggleSidebar: () => set((state) => ({ sidebarOpen: !state.sidebarOpen })),
  
  setTheme: (theme) => {
    storageService.set(STORAGE_KEYS.THEME, theme);
    set({ theme });
  },
}));
