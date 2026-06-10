export type PlanId = "free" | "bootstrapper" | "pre-seed" | "seed" | "series-a";


export type ReviewStatus =
  | "draft"
  | "uploading"
  | "extracting"
  | "analyzing"
  | "completed"
  | "failed";

export interface UserProfile {
  name: string;
  email: string;
  companyName: string;
  industry: string;
  startupStage: string;
  website: string;
  preferredLanguage: string;
}

export interface User {
  id: string;
  email: string;
  name: string;
  createdAt: string;
  profile?: UserProfile;
}

export interface Subscription {
  planId: PlanId;
  reviewsLimit: number;
  reviewsUsed: number;
  revisionsLimit: number;
  revisionsUsed: number;
  deepAnalysis: boolean;
  chatWithReport: boolean;
  portfolioMode?: boolean;
  billingStatus: "active" | "cancelled" | "past_due";
  nextBillingDate: string;
  paymentMethod?: string;
}

export interface Plan {
  id: PlanId;
  name: string;
  description: string;
  priceMonth: number;
  reviewsLimit: number;
  revisionsLimit: number;
  deepAnalysis: boolean;
  chatWithReport: boolean;
  portfolioMode?: boolean;
  features: string[];
}

export interface SlideFeedback {
  slideNumber: number;
  score: number;
  title?: string;
  issues: string[];
  recommendations: string[];
}

export interface DeckReview {
  id: string;
  fileName: string;
  createdAt: string;
  status: ReviewStatus;
  overallScore: number;
  grade: "A" | "B" | "C" | "D" | "F";
  summary: string;
  strengths: string[];
  weaknesses: string[];
  missingSignals: string[];
  investorQuestions: string[];
  slideFeedback: SlideFeedback[];
  startupContext?: {
    startupName: string;
    industry: string;
    stage: string;
    targetRaise: string;
    targetInvestors: string;
    comment?: string;
  };
}

export interface ReviewChatMessage {
  id: string;
  reviewId: string;
  sender: "user" | "assistant";
  content: string;
  createdAt: string;
}

export interface MockSession {
  token: string;
  user: User;
  createdAt: string;
}

export type ServiceResult<T> =
  | {
      success: true;
      data: T;
    }
  | {
      success: false;
      error: {
        code: string;
        message: string;
      };
    };

export interface AIReviewRequest {
  fileName: string;
  startupContext: {
    startupName: string;
    industry: string;
    stage: string;
    targetRaise: string;
    targetInvestors: string;
    comment?: string;
  };
  deckTextContent: string;
}

export interface AIReviewResponse {
  review: Omit<DeckReview, "id" | "createdAt" | "status" | "fileName">;
}

export interface AIChatRequest {
  reviewId: string;
  question: string;
  history: ReviewChatMessage[];
  reviewContext: Omit<DeckReview, "slideFeedback">;
}

export interface AIChatResponse {
  answer: string;
}

export interface LoginInput {
  email: string;
  password: string;
}

export interface RegisterInput {
  name: string;
  email: string;
  password: string;
}
