import { create } from "zustand";
import { deckReviewService } from "../services/deck-review.service";
import { fileService } from "../services/file.service";
import { pdfService } from "../services/pdf.service";
import { aiReviewService } from "../services/ai-review.service";
import { aiChatService } from "../services/ai-chat.service";
import { subscriptionService } from "../services/subscription.service";
import { DeckReview, ReviewChatMessage, ReviewStatus } from "../types";

interface DeckState {
  reviews: DeckReview[];
  currentReview: DeckReview | null;
  chatMessages: ReviewChatMessage[];
  loading: boolean;
  chatLoading: boolean;
  analysisStatus: ReviewStatus | "generating" | "idle";
  error: string | null;
  chatError: string | null;

  fetchReviews: () => Promise<void>;
  fetchReviewById: (id: string) => Promise<boolean>;
  deleteReview: (id: string) => Promise<boolean>;
  clearReviews: () => Promise<boolean>;
  runAnalysis: (
    file: File,
    startupContext: {
      startupName: string;
      industry: string;
      stage: string;
      targetRaise: string;
      targetInvestors: string;
      comment?: string;
    }
  ) => Promise<DeckReview | null>;

  fetchChatMessages: (reviewId: string) => Promise<void>;
  askQuestion: (reviewId: string, question: string) => Promise<boolean>;
  clearChat: (reviewId: string) => Promise<boolean>;
  clearLocalState: () => void;
}

export const useDeckStore = create<DeckState>((set, get) => ({
  reviews: [],
  currentReview: null,
  chatMessages: [],
  loading: false,
  chatLoading: false,
  analysisStatus: "idle",
  error: null,
  chatError: null,

  fetchReviews: async () => {
    set({ loading: true, error: null });
    const res = await deckReviewService.getReviews();
    if (res.success) {
      set({ reviews: res.data, loading: false });
    } else {
      set({ error: res.error.message, loading: false });
    }
  },

  fetchReviewById: async (id) => {
    set({ loading: true, error: null });
    const res = await deckReviewService.getReviewById(id);
    if (res.success && res.data) {
      set({ currentReview: res.data, loading: false });
      return true;
    } else {
      set({
        error: res.success ? "Review not found." : res.error.message,
        loading: false,
      });
      return false;
    }
  },

  deleteReview: async (id) => {
    set({ loading: true, error: null });
    const res = await deckReviewService.deleteReview(id);
    if (res.success) {
      set((state) => ({
        reviews: state.reviews.filter((r) => r.id !== id),
        currentReview: state.currentReview?.id === id ? null : state.currentReview,
        loading: false,
      }));
      return true;
    } else {
      set({ error: res.error.message, loading: false });
      return false;
    }
  },

  clearReviews: async () => {
    set({ loading: true, error: null });
    const res = await deckReviewService.clearReviews();
    if (res.success) {
      set({ reviews: [], currentReview: null, chatMessages: [], loading: false });
      return true;
    } else {
      set({ error: res.error.message, loading: false });
      return false;
    }
  },

  runAnalysis: async (file, startupContext) => {
    set({ error: null, analysisStatus: "uploading" });

    // 1. File validation
    const validationRes = fileService.validateDeckFile(file);
    if (!validationRes.success) {
      set({ error: validationRes.error.message, analysisStatus: "failed" });
      return null;
    }

    // 2. Validate subscription limits
    const canRunRes = await subscriptionService.canRunReview(startupContext.startupName);
    if (!canRunRes.success || !canRunRes.data) {
      set({
        error: "You have exceeded your plan's review limits. Please upgrade your subscription.",
        analysisStatus: "failed",
      });
      return null;
    }

    let draftReview: DeckReview | null = null;
    try {
      // 3. Create draft in DB with "uploading" status
      const draftRes = await deckReviewService.createDraft({
        fileName: file.name,
        startupContext,
      });

      if (!draftRes.success) {
        set({ error: draftRes.error.message, analysisStatus: "failed" });
        return null;
      }

      draftReview = draftRes.data;
      set({ currentReview: draftReview });

      // Simulate file upload delay
      await new Promise((resolve) => setTimeout(resolve, 800));

      // 4. Text extraction (status "extracting")
      set({ analysisStatus: "extracting" });
      await deckReviewService.updateReview(draftReview.id, { status: "extracting" });

      const textRes = await pdfService.extractText(file);
      if (!textRes.success) {
        const errMsg = textRes.error.message;
        await deckReviewService.updateReview(draftReview.id, { status: "failed" });
        set({ error: errMsg, analysisStatus: "failed" });
        return null;
      }

      const extractedText = textRes.data;

      // 5. Send for AI analysis (status "analyzing")
      set({ analysisStatus: "analyzing" });
      await deckReviewService.updateReview(draftReview.id, { status: "analyzing" });

      const aiRes = await aiReviewService.analyzeDeck({
        fileName: file.name,
        startupContext,
        deckTextContent: extractedText,
      });

      if (!aiRes.success) {
        const errMsg = aiRes.error.message;
        await deckReviewService.updateReview(draftReview.id, { status: "failed" });
        set({ error: errMsg, analysisStatus: "failed" });
        return null;
      }

      // 6. Save final report (status "completed")
      const aiReport = aiRes.data.review;
      const completedReview: DeckReview = {
        ...draftReview,
        status: "completed",
        overallScore: aiReport.overallScore,
        grade: aiReport.grade,
        summary: aiReport.summary,
        strengths: aiReport.strengths,
        weaknesses: aiReport.weaknesses,
        missingSignals: aiReport.missingSignals,
        investorQuestions: aiReport.investorQuestions,
        slideFeedback: aiReport.slideFeedback,
      };

      await deckReviewService.saveReview(completedReview);

      // 7. Increment subscription usage
      await subscriptionService.incrementReviewUsage(startupContext.startupName);

      set((state) => ({
        reviews: [completedReview, ...state.reviews],
        currentReview: completedReview,
        analysisStatus: "completed",
      }));

      return completedReview;
    } catch (err: unknown) {
      const errMsg = err instanceof Error ? err.message : "An unexpected error occurred during analysis.";
      if (draftReview) {
        await deckReviewService.updateReview(draftReview.id, { status: "failed" });
      }
      set({ error: errMsg, analysisStatus: "failed" });
      return null;
    }
  },

  fetchChatMessages: async (reviewId) => {
    set({ chatLoading: true, chatError: null });
    const res = await aiChatService.getMessages(reviewId);
    if (res.success) {
      set({ chatMessages: res.data, chatLoading: false });
    } else {
      set({ chatError: res.error.message, chatLoading: false });
    }
  },

  askQuestion: async (reviewId, question) => {
    const { currentReview } = get();
    if (!currentReview) return false;

    set({ chatLoading: true, chatError: null });
    
    const reviewContext = {
      id: currentReview.id,
      fileName: currentReview.fileName,
      createdAt: currentReview.createdAt,
      status: currentReview.status,
      overallScore: currentReview.overallScore,
      grade: currentReview.grade,
      summary: currentReview.summary,
      strengths: currentReview.strengths,
      weaknesses: currentReview.weaknesses,
      missingSignals: currentReview.missingSignals,
      investorQuestions: currentReview.investorQuestions,
      startupContext: currentReview.startupContext,
    };

    const res = await aiChatService.askQuestion({
      reviewId,
      question,
      reviewContext,
    });

    if (res.success) {
      const updatedMsgs = await aiChatService.getMessages(reviewId);
      if (updatedMsgs.success) {
        set({ chatMessages: updatedMsgs.data, chatLoading: false });
      } else {
        set({ chatLoading: false });
      }
      return true;
    } else {
      set({ chatError: res.error.message, chatLoading: false });
      return false;
    }
  },

  clearChat: async (reviewId) => {
    set({ chatLoading: true, chatError: null });
    const res = await aiChatService.clearMessages(reviewId);
    if (res.success) {
      set({ chatMessages: [], chatLoading: false });
      return true;
    } else {
      set({ chatError: res.error.message, chatLoading: false });
      return false;
    }
  },

  clearLocalState: () => set({
    reviews: [],
    currentReview: null,
    chatMessages: [],
    loading: false,
    chatLoading: false,
    analysisStatus: "idle",
    error: null,
    chatError: null
  }),
}));
