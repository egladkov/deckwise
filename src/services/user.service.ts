import { createClient } from "../lib/supabase/client";
import { ServiceResult, UserProfile } from "../types";

export type UpdateProfileInput = Partial<UserProfile>;

export const userService = {
  async getCurrentProfile(): Promise<ServiceResult<UserProfile | null>> {
    try {
      const supabase = createClient();
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        return { success: true, data: null };
      }

      const { data: profileRow, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", user.id)
        .single();

      if (error && error.code !== "PGRST116") { // PGRST116 is code for no rows returned
        return {
          success: false,
          error: { code: "GET_PROFILE_FAILED", message: error.message },
        };
      }

      if (!profileRow) {
        return { success: true, data: null };
      }

      const profile: UserProfile = {
        name: profileRow.name || "",
        email: profileRow.email || user.email || "",
        companyName: profileRow.company_name || "",
        industry: profileRow.industry || "",
        startupStage: profileRow.startup_stage || "Idea",
        website: profileRow.website || "",
        preferredLanguage: profileRow.preferred_language || "en",
      };

      return { success: true, data: profile };
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : "Failed to retrieve profile.";
      return {
        success: false,
        error: { code: "GET_PROFILE_FAILED", message },
      };
    }
  },

  async updateProfile(data: UpdateProfileInput): Promise<ServiceResult<UserProfile>> {
    try {
      const supabase = createClient();
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        return {
          success: false,
          error: { code: "UNAUTHORIZED", message: "User not found in system." },
        };
      }

      // Map app-level CamelCase properties to db-level snake_case columns
      const updateData: Record<string, unknown> = {};
      if (data.name !== undefined) updateData.name = data.name;
      if (data.email !== undefined) updateData.email = data.email;
      if (data.companyName !== undefined) updateData.company_name = data.companyName;
      if (data.industry !== undefined) updateData.industry = data.industry;
      if (data.startupStage !== undefined) updateData.startup_stage = data.startupStage;
      if (data.website !== undefined) updateData.website = data.website;
      if (data.preferredLanguage !== undefined) updateData.preferred_language = data.preferredLanguage;

      const { data: profileRow, error } = await supabase
        .from("profiles")
        .update(updateData)
        .eq("id", user.id)
        .select()
        .single();

      if (error) {
        return {
          success: false,
          error: { code: "UPDATE_PROFILE_FAILED", message: error.message },
        };
      }

      const profile: UserProfile = {
        name: profileRow.name || "",
        email: profileRow.email || user.email || "",
        companyName: profileRow.company_name || "",
        industry: profileRow.industry || "",
        startupStage: profileRow.startup_stage || "Idea",
        website: profileRow.website || "",
        preferredLanguage: profileRow.preferred_language || "en",
      };

      // Also update auth user metadata name if name was updated
      if (data.name) {
        await supabase.auth.updateUser({
          data: { name: data.name },
        });
      }

      return { success: true, data: profile };
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : "Failed to update profile.";
      return {
        success: false,
        error: { code: "UPDATE_PROFILE_FAILED", message },
      };
    }
  },
};
