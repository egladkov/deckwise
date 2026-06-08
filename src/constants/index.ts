import { Plan, PlanId } from "../types";

export const STORAGE_KEYS = {
  AUTH_SESSION: "deckwise.auth.session",
  USER_PROFILE: "deckwise.user.profile",
  SUBSCRIPTION: "deckwise.subscription",
  SETTINGS: "deckwise.settings",
  THEME: "deckwise.theme",
};

export const PLANS: Record<PlanId, Plan> = {
  free: {
    id: "free",
    name: "Free",
    priceMonth: 0,
    reviewsLimit: 1,
    deepAnalysis: false,
    chatWithReport: false,
    features: [
      "1 Pitch Deck Review",
      "Basic feedback report",
      "Overall investor grade",
      "No AI chat assistant",
      "Community support",
    ],
  },
  pro: {
    id: "pro",
    name: "Pro",
    priceMonth: 49,
    reviewsLimit: 10,
    deepAnalysis: true,
    chatWithReport: true,
    features: [
      "10 Pitch Deck Reviews / mo",
      "Detailed slide-by-slide feedback",
      "AI chat assistant about report",
      "Strengths & weaknesses analysis",
      "Priority email support",
    ],
  },
  investor: {
    id: "investor",
    name: "Investor",
    priceMonth: 199,
    reviewsLimit: 50,
    deepAnalysis: true,
    chatWithReport: true,
    portfolioMode: true,
    features: [
      "50 Pitch Deck Reviews / mo",
      "All Pro tier features",
      "Portfolio mode & comparisons",
      "Custom investor questions checklist",
      "Dedicated account manager",
      "Shared team access",
    ],
  },
};
