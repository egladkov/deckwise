import { createClient } from "../lib/supabase/client";
import { DeckReview, ServiceResult } from "../types";

export type CreateReviewInput = {
  fileName: string;
  startupContext?: DeckReview["startupContext"];
};

export const deckReviewService = {
  async createDraft(input: CreateReviewInput): Promise<ServiceResult<DeckReview>> {
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

      const draftRow = mapDeckReviewToRow({
        fileName: input.fileName,
        status: "draft",
        overallScore: 0,
        grade: "F",
        summary: "",
        strengths: [],
        weaknesses: [],
        missingSignals: [],
        investorQuestions: [],
        slideFeedback: [],
        startupContext: input.startupContext,
      });
      draftRow.user_id = user.id;

      const { data: newRow, error } = await supabase
        .from("deck_reviews")
        .insert(draftRow)
        .select()
        .single();

      if (error) {
        return {
          success: false,
          error: { code: "CREATE_DRAFT_FAILED", message: error.message },
        };
      }

      return { success: true, data: mapDeckReviewRow(newRow) };
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : "Failed to create review draft.";
      return {
        success: false,
        error: { code: "CREATE_DRAFT_FAILED", message },
      };
    }
  },

  async saveReview(review: DeckReview): Promise<ServiceResult<DeckReview>> {
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

      const updateRow = mapDeckReviewToRow(review);
      updateRow.user_id = user.id;

      const { data: updatedRow, error } = await supabase
        .from("deck_reviews")
        .upsert(updateRow)
        .select()
        .single();

      if (error) {
        return {
          success: false,
          error: { code: "SAVE_REVIEW_FAILED", message: error.message },
        };
      }

      return { success: true, data: mapDeckReviewRow(updatedRow) };
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : "Failed to save review.";
      return {
        success: false,
        error: { code: "SAVE_REVIEW_FAILED", message },
      };
    }
  },

  async getReviews(): Promise<ServiceResult<DeckReview[]>> {
    try {
      const supabase = createClient();
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        return { success: true, data: [] };
      }

      const { data: rows, error } = await supabase
        .from("deck_reviews")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false });

      if (error) {
        return {
          success: false,
          error: { code: "GET_REVIEWS_FAILED", message: error.message },
        };
      }

      const list = (rows || []).map(mapDeckReviewRow);
      return { success: true, data: list };
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : "Failed to load review history.";
      return {
        success: false,
        error: { code: "GET_REVIEWS_FAILED", message },
      };
    }
  },

  async getReviewById(id: string): Promise<ServiceResult<DeckReview | null>> {
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

      const { data: row, error } = await supabase
        .from("deck_reviews")
        .select("*")
        .eq("id", id)
        .eq("user_id", user.id)
        .single();

      if (error) {
        if (error.code === "PGRST116") {
          return { success: true, data: null };
        }
        return {
          success: false,
          error: { code: "GET_REVIEW_FAILED", message: error.message },
        };
      }

      return { success: true, data: mapDeckReviewRow(row) };
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : "Failed to load review.";
      return {
        success: false,
        error: { code: "GET_REVIEW_FAILED", message },
      };
    }
  },

  async updateReview(id: string, data: Partial<DeckReview>): Promise<ServiceResult<DeckReview>> {
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

      const updateRow = mapDeckReviewToRow(data);

      const { data: row, error } = await supabase
        .from("deck_reviews")
        .update(updateRow)
        .eq("id", id)
        .eq("user_id", user.id)
        .select()
        .single();

      if (error) {
        return {
          success: false,
          error: { code: "UPDATE_REVIEW_FAILED", message: error.message },
        };
      }

      return { success: true, data: mapDeckReviewRow(row) };
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : "Failed to update review.";
      return {
        success: false,
        error: { code: "UPDATE_REVIEW_FAILED", message },
      };
    }
  },

  async deleteReview(id: string): Promise<ServiceResult<void>> {
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
        .from("deck_reviews")
        .delete()
        .eq("id", id)
        .eq("user_id", user.id);

      if (error) {
        return {
          success: false,
          error: { code: "DELETE_REVIEW_FAILED", message: error.message },
        };
      }

      return { success: true, data: undefined };
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : "Failed to delete review.";
      return {
        success: false,
        error: { code: "DELETE_REVIEW_FAILED", message },
      };
    }
  },

  async clearReviews(): Promise<ServiceResult<void>> {
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
        .from("deck_reviews")
        .delete()
        .eq("user_id", user.id);

      if (error) {
        return {
          success: false,
          error: { code: "CLEAR_REVIEWS_FAILED", message: error.message },
        };
      }

      return { success: true, data: undefined };
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : "Failed to clear history.";
      return {
        success: false,
        error: { code: "CLEAR_REVIEWS_FAILED", message },
      };
    }
  },
};

/* eslint-disable-next-line @typescript-eslint/no-explicit-any */
function mapDeckReviewRow(row: any): DeckReview {
  return {
    id: row.id,
    fileName: row.file_name,
    createdAt: row.created_at,
    status: row.status,
    overallScore: row.overall_score || 0,
    grade: row.grade || "F",
    summary: row.summary || "",
    strengths: Array.isArray(row.strengths) ? row.strengths : [],
    weaknesses: Array.isArray(row.weaknesses) ? row.weaknesses : [],
    missingSignals: Array.isArray(row.missing_signals) ? row.missing_signals : [],
    investorQuestions: Array.isArray(row.investor_questions) ? row.investor_questions : [],
    slideFeedback: Array.isArray(row.slide_feedback) ? row.slide_feedback : [],
    startupContext: row.startup_name ? {
      startupName: row.startup_name,
      industry: row.industry || "",
      stage: row.stage || "",
      targetRaise: row.target_raise || "",
      targetInvestors: row.target_investors || "",
      comment: row.user_comment || "",
    } : undefined,
  };
}

/* eslint-disable-next-line @typescript-eslint/no-explicit-any */
function mapDeckReviewToRow(review: any) {
  const row: Record<string, unknown> = {};
  if (review.id !== undefined) row.id = review.id;
  if (review.fileName !== undefined) row.file_name = review.fileName;
  if (review.status !== undefined) row.status = review.status;
  if (review.overallScore !== undefined) row.overall_score = review.overallScore;
  if (review.grade !== undefined) row.grade = review.grade;
  if (review.summary !== undefined) row.summary = review.summary;
  
  if (review.strengths !== undefined) row.strengths = review.strengths;
  if (review.weaknesses !== undefined) row.weaknesses = review.weaknesses;
  if (review.missingSignals !== undefined) row.missing_signals = review.missingSignals;
  if (review.investorQuestions !== undefined) row.investor_questions = review.investorQuestions;
  if (review.slideFeedback !== undefined) row.slide_feedback = review.slideFeedback;

  if (review.startupContext !== undefined) {
    if (review.startupContext) {
      row.startup_name = review.startupContext.startupName;
      row.industry = review.startupContext.industry;
      row.stage = review.startupContext.stage;
      row.target_raise = review.startupContext.targetRaise;
      row.target_investors = review.startupContext.targetInvestors;
      row.user_comment = review.startupContext.comment;
    } else {
      row.startup_name = null;
      row.industry = null;
      row.stage = null;
      row.target_raise = null;
      row.target_investors = null;
      row.user_comment = null;
    }
  }

  return row;
}
