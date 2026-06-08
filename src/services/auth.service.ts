import { createClient } from "../lib/supabase/client";
import { User as AuthUser, ServiceResult } from "../types";

export type SignUpInput = {
  name: string;
  email: string;
  password: string;
  confirmPassword?: string;
};

export type SignInInput = {
  email: string;
  password: string;
};

export type ChangePasswordInput = {
  current?: string;
  new: string;
};

export const authService = {
  async signUp(input: SignUpInput): Promise<ServiceResult<AuthUser>> {
    try {
      const supabase = createClient();
      
      // Perform Supabase signUp
      const { data, error } = await supabase.auth.signUp({
        email: input.email,
        password: input.password,
        options: {
          data: {
            name: input.name,
          },
        },
      });

      if (error) {
        return {
          success: false,
          error: { code: "SIGNUP_FAILED", message: error.message },
        };
      }

      if (!data.user) {
        return {
          success: false,
          error: { code: "SIGNUP_FAILED", message: "User creation failed." },
        };
      }

      const user: AuthUser = {
        id: data.user.id,
        email: data.user.email || input.email,
        name: input.name,
        createdAt: data.user.created_at,
        profile: {
          name: input.name,
          email: data.user.email || input.email,
          companyName: "",
          industry: "",
          startupStage: "Idea",
          website: "",
          preferredLanguage: "en",
        },
      };

      return { success: true, data: user };
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : "Registration failed.";
      return {
        success: false,
        error: { code: "SIGNUP_FAILED", message },
      };
    }
  },

  async signIn(input: SignInInput): Promise<ServiceResult<AuthUser>> {
    try {
      const supabase = createClient();
      
      const { data, error } = await supabase.auth.signInWithPassword({
        email: input.email,
        password: input.password,
      });

      if (error) {
        return {
          success: false,
          error: { code: "SIGNIN_FAILED", message: error.message },
        };
      }

      if (!data.user) {
        return {
          success: false,
          error: { code: "SIGNIN_FAILED", message: "Login failed." },
        };
      }

      const name = data.user.user_metadata?.name || data.user.email?.split("@")[0] || "User";

      // Also get profile info from profiles table
      const { data: profileRow } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", data.user.id)
        .single();

      const user: AuthUser = {
        id: data.user.id,
        email: data.user.email || input.email,
        name: profileRow?.name || name,
        createdAt: data.user.created_at,
        profile: profileRow
          ? {
              name: profileRow.name || name,
              email: profileRow.email || data.user.email || input.email,
              companyName: profileRow.company_name || "",
              industry: profileRow.industry || "",
              startupStage: profileRow.startup_stage || "Idea",
              website: profileRow.website || "",
              preferredLanguage: profileRow.preferred_language || "en",
            }
          : {
              name: name,
              email: data.user.email || input.email,
              companyName: "",
              industry: "",
              startupStage: "Idea",
              website: "",
              preferredLanguage: "en",
            },
      };

      return { success: true, data: user };
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : "Sign in failed.";
      return {
        success: false,
        error: { code: "SIGNIN_FAILED", message },
      };
    }
  },

  async signOut(): Promise<ServiceResult<void>> {
    try {
      const supabase = createClient();
      const { error } = await supabase.auth.signOut();
      if (error) {
        return {
          success: false,
          error: { code: "SIGNOUT_FAILED", message: error.message },
        };
      }
      return { success: true, data: undefined };
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : "Sign out failed.";
      return {
        success: false,
        error: { code: "SIGNOUT_FAILED", message },
      };
    }
  },

  async getCurrentUser(): Promise<ServiceResult<AuthUser | null>> {
    try {
      const supabase = createClient();
      const {
        data: { user: authUser },
      } = await supabase.auth.getUser();

      if (!authUser) {
        return { success: true, data: null };
      }

      // Fetch user profile from DB
      const { data: profileRow } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", authUser.id)
        .single();

      const name = authUser.user_metadata?.name || authUser.email?.split("@")[0] || "User";

      const user: AuthUser = {
        id: authUser.id,
        email: authUser.email || "",
        name: profileRow?.name || name,
        createdAt: authUser.created_at,
        profile: profileRow
          ? {
              name: profileRow.name || name,
              email: profileRow.email || authUser.email || "",
              companyName: profileRow.company_name || "",
              industry: profileRow.industry || "",
              startupStage: profileRow.startup_stage || "Idea",
              website: profileRow.website || "",
              preferredLanguage: profileRow.preferred_language || "en",
            }
          : {
              name: name,
              email: authUser.email || "",
              companyName: "",
              industry: "",
              startupStage: "Idea",
              website: "",
              preferredLanguage: "en",
            },
      };

      return { success: true, data: user };
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : "Failed to retrieve user.";
      return {
        success: false,
        error: { code: "GET_CURRENT_USER_FAILED", message },
      };
    }
  },

  async changePassword(input: ChangePasswordInput): Promise<ServiceResult<void>> {
    try {
      const supabase = createClient();
      const { error } = await supabase.auth.updateUser({
        password: input.new,
      });

      if (error) {
        return {
          success: false,
          error: { code: "CHANGE_PASSWORD_FAILED", message: error.message },
        };
      }

      return { success: true, data: undefined };
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : "Failed to change password.";
      return {
        success: false,
        error: { code: "CHANGE_PASSWORD_FAILED", message },
      };
    }
  },

  async deleteAccount(): Promise<ServiceResult<void>> {
    try {
      const response = await fetch("/api/account/delete", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        return {
          success: false,
          error: {
            code: errorData.error?.code || "DELETE_ACCOUNT_FAILED",
            message: errorData.error?.message || `Server responded with error: ${response.status}`,
          },
        };
      }

      return { success: true, data: undefined };
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : "Failed to call account deletion API.";
      return {
        success: false,
        error: {
          code: "DELETE_ACCOUNT_FAILED",
          message,
        },
      };
    }
  },
};
