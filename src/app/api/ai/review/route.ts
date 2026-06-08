import { NextResponse } from "next/server";
import { AIReviewRequest, DeckReview } from "../../../../types";

export async function POST(request: Request) {
  try {
    const body: AIReviewRequest = await request.json();
    const { fileName, startupContext, deckTextContent } = body;

    if (!fileName || !startupContext) {
      return NextResponse.json(
        { error: { code: "BAD_REQUEST", message: "Incomplete request data." } },
        { status: 400 }
      );
    }

    const apiKey = process.env.OPENAI_API_KEY;
    const model = process.env.OPENAI_REVIEW_MODEL || "gpt-4o-mini";

    // If API key is not defined, return a realistic mock report based on the startup context
    if (!apiKey) {
      console.warn("OPENAI_API_KEY is not defined. Falling back to mockup review generator.");
      const mockResult = generateMockReview(startupContext);
      return NextResponse.json(mockResult);
    }

    // Request to OpenAI
    const systemPrompt = `You are an expert venture capitalist (VC) and pitch deck analyst.
Analyze the provided pitch deck text content and startup context.
Return a structured JSON object detailing the review results.

The JSON schema must strictly match this structure:
{
  "review": {
    "overallScore": number (between 0 and 100),
    "grade": "A" | "B" | "C" | "D" | "F",
    "summary": "string summarizing the findings in English",
    "strengths": ["string in English detailing a strength"],
    "weaknesses": ["string in English detailing a weakness"],
    "missingSignals": ["string in English of missing signals"],
    "investorQuestions": ["string in English of hard questions a VC might ask"],
    "slideFeedback": [
      {
        "slideNumber": number,
        "score": number (between 0 and 100),
        "title": "string slide title in English",
        "issues": ["string issue in English"],
        "recommendations": ["string recommendation in English"]
      }
    ]
  }
}
All text fields MUST be in English. Keep critiques constructive, sharp, and investor-grade.`;

    const userPrompt = `Startup Context:
Name: ${startupContext.startupName}
Industry: ${startupContext.industry}
Stage: ${startupContext.stage}
Target Raise: ${startupContext.targetRaise}
Target Investors: ${startupContext.targetInvestors}
Founder's Comment: ${startupContext.comment || "None"}

Pitch Deck Text Content:
${deckTextContent}`;

    const apiResponse = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: model,
        response_format: { type: "json_object" },
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: userPrompt },
        ],
        temperature: 0.3,
      }),
    });

    if (!apiResponse.ok) {
      const errorDetail = await apiResponse.json().catch(() => ({}));
      return NextResponse.json(
        {
          error: {
            code: "OPENAI_API_ERROR",
            message: errorDetail.error?.message || `OpenAI API returned status ${apiResponse.status}`,
          },
        },
        { status: 500 }
      );
    }

    const rawData = await apiResponse.json();
    const assistantContentString = rawData.choices?.[0]?.message?.content;

    if (!assistantContentString) {
      return NextResponse.json(
        { error: { code: "EMPTY_AI_RESPONSE", message: "AI returned an empty response." } },
        { status: 500 }
      );
    }

    const parsedJson = JSON.parse(assistantContentString);

    if (!parsedJson.review || typeof parsedJson.review.overallScore !== "number") {
      return NextResponse.json(
        { error: { code: "INVALID_AI_SCHEMA", message: "AI response structure failed validation." } },
        { status: 500 }
      );
    }

    return NextResponse.json(parsedJson);
  } catch (error: any) {
    console.error("API /api/ai/review error:", error);
    return NextResponse.json(
      { error: { code: "SERVER_ERROR", message: error.message || "Server error during analysis." } },
      { status: 500 }
    );
  }
}

function generateMockReview(context: {
  startupName: string;
  industry: string;
  stage: string;
  targetRaise: string;
  targetInvestors: string;
  comment?: string;
}) {
  // Base score generation
  const score = Math.floor(Math.random() * 20) + 70; // 70-89
  let grade: "A" | "B" | "C" | "D" | "F" = "B";
  if (score >= 90) grade = "A";
  else if (score >= 80) grade = "B";
  else if (score >= 70) grade = "C";
  else if (score >= 60) grade = "D";

  return {
    review: {
      overallScore: score,
      grade,
      summary: `The pitch deck for ${context.startupName} in the ${context.industry} industry is well-developed for the ${context.stage} stage. The project is seeking a round of ${context.targetRaise}. The value proposition is clear to an investor, but key business scalability risks and the Go-To-Market (GTM) distribution model are not fully addressed.`,
      strengths: [
        `The product clearly solves a pronounced problem in the ${context.industry} market.`,
        `The requested investment amount (${context.targetRaise}) is aligned with the current stage of development (${context.stage}).`,
        `There is a strong alignment with target investors: ${context.targetInvestors}.`
      ],
      weaknesses: [
        "Lacks deep unit economics analysis (CAC, LTV, Payback Period).",
        "The monetization model looks standard and requires validation with early traction metrics.",
        "Weak justification for TAM/SAM/SOM sizing on the market size slide."
      ],
      missingSignals: [
        "Detailed plan for allocation of funds (Use of Funds) by spending categories.",
        "Hiring plan for key team members over the next 12 months."
      ],
      investorQuestions: [
        "What are your current customer acquisition costs (CAC) for paying users?",
        "What defensibility barriers do you create to protect your product from large tech companies?",
        "How will your unit economics scale when expanding into other target countries?"
      ],
      slideFeedback: [
        {
          slideNumber: 1,
          score: 88,
          title: "Introduction & Brand",
          issues: ["The startup slogan is too generic."],
          recommendations: ["Refocus the slogan to highlight your unique value proposition."]
        },
        {
          slideNumber: 2,
          score: 82,
          title: "Market Problem",
          issues: ["No quantitative data on the cost or impact of the problem."],
          recommendations: ["Add charts showing time or monetary losses incurred by clients handling this manually."]
        },
        {
          slideNumber: 3,
          score: 75,
          title: "Product & Solution",
          issues: ["Too many complex technical details on the product architecture."],
          recommendations: ["Replace complex diagrams with clean interface screenshots showing core value in 3 seconds."]
        },
        {
          slideNumber: 4,
          score: score - 5,
          title: "Market Size (TAM/SAM/SOM)",
          issues: ["Market sizing figures are taken from general reports without bottom-up calculations."],
          recommendations: ["Add a bottom-up estimation based on how many potential customers you can reach via your channels."]
        },
        {
          slideNumber: 5,
          score: score - 8,
          title: "Business Model",
          issues: ["Subscription model is not broken down by pricing tiers."],
          recommendations: ["Show pricing structure and average contract value (ACV) per customer."]
        }
      ]
    }
  };
}
