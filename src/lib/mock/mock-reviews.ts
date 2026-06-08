import { DeckReview } from "../../types";

export const MOCK_REVIEWS: DeckReview[] = [
  {
    id: "rev_8f293b",
    fileName: "deckwise_pitch_deck_v1.pdf",
    createdAt: "2026-06-02T14:32:00Z",
    status: "completed",
    overallScore: 84,
    grade: "B",
    summary: "The Deckwise AI pitch deck demonstrates a solid understanding of the manual and time-consuming pitch deck analysis process faced by VC funds and accelerators. The market opportunity appears significant, and the product addresses a genuine pain point. However, the financial model and unit economics require more detailed elaboration before proceeding with the fundraising round.",
    strengths: [
      "Clearly articulated problem and value proposition.",
      "Impressive AI-driven product demonstration.",
      "Experienced technical team with relevant background."
    ],
    weaknesses: [
      "The total addressable market (TAM) is estimated too aggressively without a bottom-up SOM/SAM breakdown.",
      "Unit economics do not account for customer acquisition costs (CAC) over the long run.",
      "Competitive analysis is shallow and misses key indirect competitors."
    ],
    missingSignals: [
      "International market expansion plan (GTM strategy).",
      "Breakdown of funding allocation (Use of Funds)."
    ],
    investorQuestions: [
      "How do you plan to maintain LTV/CAC above 3 as you scale?",
      "What is your defensibility strategy (moat) against generic LLM providers?",
      "What conversion rate from free uploads to paid reviews are you currently observing?"
    ],
    startupContext: {
      startupName: "Deckwise AI",
      industry: "AI SaaS",
      stage: "Pre-seed",
      targetRaise: "$500,000",
      targetInvestors: "Venture angels, early-stage funds",
      comment: "We automate pitch deck analysis for founders and investors."
    },
    slideFeedback: [
      {
        slideNumber: 1,
        score: 90,
        title: "Title Slide",
        issues: [],
        recommendations: [
          "Excellent minimalist design. The slogan hits the mark perfectly."
        ]
      },
      {
        slideNumber: 2,
        score: 85,
        title: "Problem",
        issues: [
          "Too much text on the slide."
        ],
        recommendations: [
          "Use infographics to show time spent by VC analysts reviewing decks manually."
        ]
      },
      {
        slideNumber: 3,
        score: 80,
        title: "Market (TAM)",
        issues: [
          "Market size is estimated at $100B, but lacks focus on the VC analysis market specifically."
        ],
        recommendations: [
          "Show SAM (serviceable addressable market of VC/accelerators) and SOM (obtainable market in the first 2 years)."
        ]
      },
      {
        slideNumber: 4,
        score: 72,
        title: "Business Model",
        issues: [
          "It's unclear how the cost of analysis will scale down with volume."
        ],
        recommendations: [
          "Detail the OpenAI API and infrastructure costs per analysis."
        ]
      }
    ]
  }
];
