import { create } from "zustand";
import { authService, SignUpInput, SignInInput, ChangePasswordInput } from "../services/auth.service";
import { User } from "../types";
import { useUserStore } from "./user.store";
import { useSubscriptionStore } from "./subscription.store";
import { useDeckStore } from "./deck.store";

export interface AppSession {
  user: User;
}

interface AuthState {
  session: AppSession | null;
  loading: boolean;
  error: string | null;
  isAuthenticated: boolean;
  login: (input: SignInInput) => Promise<boolean>;
  register: (input: SignUpInput) => Promise<boolean>;
  logout: () => Promise<void>;
  restoreSession: () => Promise<void>;
  clearError: () => void;
  deleteAccount: () => Promise<boolean>;
  changePassword: (input: ChangePasswordInput) => Promise<boolean>;
}

export const useAuthStore = create<AuthState>((set) => ({
  session: null,
  loading: false,
  error: null,
  isAuthenticated: false,

  login: async (input) => {
    set({ loading: true, error: null });
    const res = await authService.signIn(input);
    if (res.success) {
      set({ session: { user: res.data }, isAuthenticated: true, loading: false });
      return true;
    } else {
      set({ error: res.error.message, loading: false });
      return false;
    }
  },

  register: async (input) => {
    set({ loading: true, error: null });
    const res = await authService.signUp(input);
    if (res.success) {
      set({ session: { user: res.data }, isAuthenticated: true, loading: false });
      return true;
    } else {
      set({ error: res.error.message, loading: false });
      return false;
    }
  },

  logout: async () => {
    set({ loading: true });
    await authService.signOut();
    
    // Clear all other local state
    useUserStore.getState().clearUser();
    useSubscriptionStore.getState().clearSubscription();
    useDeckStore.getState().clearLocalState();
    
    set({ session: null, isAuthenticated: false, loading: false, error: null });
  },

  restoreSession: async () => {
    set({ loading: true });
    const res = await authService.getCurrentUser();
    if (res.success && res.data) {
      set({ session: { user: res.data }, isAuthenticated: true, loading: false });
    } else {
      set({ session: null, isAuthenticated: false, loading: false });
    }
  },

  clearError: () => set({ error: null }),

  deleteAccount: async () => {
    set({ loading: true, error: null });
    const res = await authService.deleteAccount();
    if (res.success) {
      // Clear all other local state
      useUserStore.getState().clearUser();
      useSubscriptionStore.getState().clearSubscription();
      useDeckStore.getState().clearLocalState();
      
      set({ session: null, isAuthenticated: false, loading: false });
      return true;
    } else {
      set({ error: res.error.message, loading: false });
      return false;
    }
  },

  changePassword: async (input) => {
    set({ loading: true, error: null });
    const res = await authService.changePassword(input);
    set({ loading: false });
    if (res.success) {
      return true;
    } else {
      set({ error: res.error.message });
      return false;
    }
  },
}));
