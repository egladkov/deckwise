import { Plan, PlanId } from "../types";

export const STORAGE_KEYS = {
  AUTH_SESSION: "deckwise.auth.session",
  USER_PROFILE: "deckwise.user.profile",
  SUBSCRIPTION: "deckwise.subscription",
  SETTINGS: "deckwise.settings",
  THEME: "deckwise.theme",
};

export const PLANS: Record<PlanId, Plan> = {
  bootstrapper: {
    id: "bootstrapper",
    name: "Bootstrapper",
    description: "Basic review for pre-revenue ideas",
    priceMonth: 14.99,
    reviewsLimit: 1,
    revisionsLimit: 2,
    deepAnalysis: false,
    chatWithReport: false,
    features: [
      "Full investor readiness score",
      "Problem & solution slide audit",
      "Top 5 weak-spot flags",
      "PDF export of feedback memo",
    ],
  },
  "pre-seed": {
    id: "pre-seed",
    name: "Pre-Seed Round",
    description: "Deep analysis for early traction startups",
    priceMonth: 19.99,
    reviewsLimit: 3,
    revisionsLimit: 6,
    deepAnalysis: true,
    chatWithReport: true,
    features: [
      "Everything in Bootstrapper",
      "TAM/SAM/SOM validation",
      "GTM & acquisition slide review",
      "Competitive landscape check",
    ],
  },
  seed: {
    id: "seed",
    name: "Seed Round",
    description: "Advanced financial model checks & VC matching insights",
    priceMonth: 24.99,
    reviewsLimit: 8,
    revisionsLimit: 15,
    deepAnalysis: true,
    chatWithReport: true,
    features: [
      "Everything in Pre-Seed",
      "CAC/LTV & burn rate stress test",
      "Use-of-funds & runway math audit",
      "VC thesis alignment hints",
    ],
  },
  "series-a": {
    id: "series-a",
    name: "Series A+",
    description: "Unlimited deck iterations for active fundraising teams",
    priceMonth: 29.99,
    reviewsLimit: -1, // Unlimited
    revisionsLimit: -1, // Unlimited
    deepAnalysis: true,
    chatWithReport: true,
    portfolioMode: true,
    features: [
      "Everything in Seed Round",
      "Unlimited uploads & re-scores",
      "Team workspace & shared memos",
      "Priority review queue",
    ],
  },
};
