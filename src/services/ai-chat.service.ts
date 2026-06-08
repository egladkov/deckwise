import { createClient } from "../lib/supabase/client";
import { AIChatRequest, AIChatResponse, ReviewChatMessage, ServiceResult } from "../types";

export const aiChatService = {
  async getMessages(reviewId: string): Promise<ServiceResult<ReviewChatMessage[]>> {
    try {
      const supabase = createClient();
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        return { success: true, data: [] };
      }

      const { data: rows, error } = await supabase
        .from("review_messages")
        .select("*")
        .eq("review_id", reviewId)
        .eq("user_id", user.id)
        .order("created_at", { ascending: true });

      if (error) {
        return {
          success: false,
          error: { code: "GET_MESSAGES_FAILED", message: error.message },
        };
      }

      const messages = (rows || []).map((row) => ({
        id: row.id,
        reviewId: row.review_id,
        sender: row.role as "user" | "assistant",
        content: row.content,
        createdAt: row.created_at,
      }));

      return { success: true, data: messages };
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : "Failed to load messages.";
      return {
        success: false,
        error: { code: "GET_MESSAGES_FAILED", message },
      };
    }
  },

  async askQuestion(input: {
    reviewId: string;
    question: string;
    reviewContext: AIChatRequest["reviewContext"];
  }): Promise<ServiceResult<AIChatResponse>> {
    try {
      const supabase = createClient();
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        return {
          success: false,
          error: { code: "UNAUTHORIZED", message: "User not logged in." },
        };
      }

      // 1. Save user message to database
      const { error: saveUserError } = await supabase
        .from("review_messages")
        .insert({
          review_id: input.reviewId,
          user_id: user.id,
          role: "user",
          content: input.question,
        });

      if (saveUserError) {
        return {
          success: false,
          error: { code: "SAVE_MESSAGE_FAILED", message: saveUserError.message },
        };
      }

      // 2. Retrieve history
      const historyResult = await this.getMessages(input.reviewId);
      const history = historyResult.success ? historyResult.data : [];

      // 3. Send to API endpoint
      const apiInput: AIChatRequest = {
        reviewId: input.reviewId,
        question: input.question,
        history,
        reviewContext: input.reviewContext,
      };

      const response = await fetch("/api/ai/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(apiInput),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        return {
          success: false,
          error: {
            code: errorData.error?.code || "AI_CHAT_HTTP_ERROR",
            message: errorData.error?.message || `Chat server error: ${response.status}`,
          },
        };
      }

      const result: AIChatResponse = await response.json();

      // 4. Save assistant response
      const { error: saveAssistantError } = await supabase
        .from("review_messages")
        .insert({
          review_id: input.reviewId,
          user_id: user.id,
          role: "assistant",
          content: result.answer,
        });

      if (saveAssistantError) {
        console.error("Failed to save assistant response:", saveAssistantError);
      }

      return { success: true, data: result };
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : "Connection error with AI assistant.";
      return {
        success: false,
        error: {
          code: "AI_CHAT_NETWORK_FAILED",
          message,
        },
      };
    }
  },

  async clearMessages(reviewId: string): Promise<ServiceResult<void>> {
    try {
      const supabase = createClient();
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        return {
          success: false,
          error: { code: "UNAUTHORIZED", message: "User not logged in." },
        };
      }

      const { error } = await supabase
        .from("review_messages")
        .delete()
        .eq("review_id", reviewId)
        .eq("user_id", user.id);

      if (error) {
        return {
          success: false,
          error: { code: "CLEAR_CHAT_FAILED", message: error.message },
        };
      }

      return { success: true, data: undefined };
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : "Failed to clear chat.";
      return {
        success: false,
        error: { code: "CLEAR_CHAT_FAILED", message },
      };
    }
  },
};
