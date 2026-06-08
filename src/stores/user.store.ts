import { create } from "zustand";
import { userService } from "../services/user.service";
import { authService } from "../services/auth.service";
import { User, UserProfile } from "../types";

interface UserState {
  user: User | null;
  loading: boolean;
  error: string | null;
  fetchUser: () => Promise<void>;
  updateProfile: (data: Partial<UserProfile>) => Promise<boolean>;
  clearUser: () => void;
}

export const useUserStore = create<UserState>((set) => ({
  user: null,
  loading: false,
  error: null,

  fetchUser: async () => {
    set({ loading: true, error: null });
    
    // Fetch auth user first to get id, email, createdAt
    const userRes = await authService.getCurrentUser();
    if (!userRes.success || !userRes.data) {
      set({ error: userRes.success ? "Not logged in" : userRes.error.message, loading: false });
      return;
    }

    const authUser = userRes.data;

    // Fetch profile
    const profileRes = await userService.getCurrentProfile();
    if (profileRes.success) {
      const profile = profileRes.data || undefined;
      const userWithProfile: User = {
        ...authUser,
        profile,
      };
      set({ user: userWithProfile, loading: false });
    } else {
      set({ error: profileRes.error.message, loading: false });
    }
  },

  updateProfile: async (data) => {
    set({ loading: true, error: null });
    const res = await userService.updateProfile(data);
    if (res.success) {
      const userRes = await authService.getCurrentUser();
      if (userRes.success && userRes.data) {
        const userWithProfile: User = {
          ...userRes.data,
          profile: res.data,
        };
        set({ user: userWithProfile, loading: false });
      } else {
        set({ loading: false });
      }
      return true;
    } else {
      set({ error: res.error.message, loading: false });
      return false;
    }
  },

  clearUser: () => set({ user: null, error: null }),
}));
