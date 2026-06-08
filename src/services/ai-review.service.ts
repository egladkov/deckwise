import { AIReviewRequest, AIReviewResponse, ServiceResult } from "../types";

export const aiReviewService = {
  async analyzeDeck(input: AIReviewRequest): Promise<ServiceResult<AIReviewResponse>> {
    try {
      const response = await fetch("/api/ai/review", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(input),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        return {
          success: false,
          error: {
            code: errorData.error?.code || "AI_ANALYSIS_HTTP_ERROR",
            message: errorData.error?.message || `Server responded with error: ${response.status}`,
          },
        };
      }

      const result = await response.json();
      return { success: true, data: result };
    } catch (error: any) {
      return {
        success: false,
        error: {
          code: "AI_ANALYSIS_NETWORK_FAILED",
          message: error.message || "Network error while analyzing presentation.",
        },
      };
    }
  },
};
