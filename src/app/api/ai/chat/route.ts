import { NextResponse } from "next/server";
import { AIChatRequest } from "../../../../types";

export async function POST(request: Request) {
  try {
    const body: AIChatRequest = await request.json();
    const { question, history, reviewContext } = body;

    if (!question || !reviewContext) {
      return NextResponse.json(
        { error: { code: "BAD_REQUEST", message: "Incomplete request parameters." } },
        { status: 400 }
      );
    }

    const apiKey = process.env.OPENAI_API_KEY;
    const model = process.env.OPENAI_CHAT_MODEL || "gpt-4o-mini";

    // If API key is missing, generate a smart mock response
    if (!apiKey) {
      console.warn("OPENAI_API_KEY is not defined. Falling back to mockup chat assistant.");
      const answer = generateMockChatResponse(question, reviewContext);
      return NextResponse.json({ answer });
    }

    // Assemble messages for OpenAI
    const systemPrompt = `You are a professional VC analyst and startup advisor.
The user is asking a question about a pitch deck review report for the startup "${reviewContext.startupContext?.startupName || "their startup"}".
Here is the context of the pitch deck review:
- Overall Score: ${reviewContext.overallScore}/100 (Grade: ${reviewContext.grade})
- Summary: ${reviewContext.summary}
- Strengths: ${reviewContext.strengths.join("; ")}
- Weaknesses: ${reviewContext.weaknesses.join("; ")}
- Missing Signals: ${reviewContext.missingSignals.join("; ")}
- Investor Questions: ${reviewContext.investorQuestions.join("; ")}

Answer the user's questions strictly in English. Keep your advice actionable, clear, professional, and VC-minded. Refer directly to the strengths/weaknesses in the report.`;

    const messages = [
      { role: "system", content: systemPrompt },
      ...history.map((msg) => ({
        role: msg.sender === "user" ? ("user" as const) : ("assistant" as const),
        content: msg.content,
      })),
      { role: "user", content: question },
    ];

    const apiResponse = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: model,
        messages,
        temperature: 0.5,
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
    const answer = rawData.choices?.[0]?.message?.content || "Sorry, I could not generate a response.";

    return NextResponse.json({ answer });
  } catch (error: any) {
    console.error("API /api/ai/chat error:", error);
    return NextResponse.json(
      { error: { code: "SERVER_ERROR", message: error.message || "Server error in chat." } },
      { status: 500 }
    );
  }
}

function generateMockChatResponse(question: string, context: Omit<AIChatRequest["reviewContext"], "slideFeedback">) {
  const qLower = question.toLowerCase();
  const startupName = context.startupContext?.startupName || "your startup";

  if (qLower.includes("market") || qLower.includes("tam") || qLower.includes("sam") || qLower.includes("size")) {
    return `Regarding the market size for ${startupName}: The report notes that the TAM estimation appears too aggressive. For investors, it's crucial to see a bottom-up calculation based on your average contract value and the number of target customers in SAM/SOM, rather than just referencing Gartner or McKinsey reports. I recommend recalculating this slide using your subscription pricing as a base.`;
  }

  if (qLower.includes("weak") || qLower.includes("con") || qLower.includes("problem") || qLower.includes("minus")) {
    return `The main areas for improvement (weaknesses) identified in the report for ${startupName}:
1. The unit economics and customer acquisition cost (CAC) are poorly detailed.
2. The Go-To-Market (GTM) distribution model is described too superficially.
3. The breakdown of funding allocation (Use of Funds) is missing.
To fix this, I recommend adding a slide with a 3-year financial projection showing exactly how the requested investment will help the startup reach profitability.`;
  }

  if (qLower.includes("strength") || qLower.includes("pro") || qLower.includes("good") || qLower.includes("plus")) {
    return `The strengths of your presentation include:
- A clearly formulated value proposition and a clean solution to the market problem.
- A neat, concise slide design that is easy to read.
- Relevant founder background mentioned in the context.
Investors will appreciate that you get straight to the product's core. Try to reinforce this effect by making other sections just as concise.`;
  }

  if (qLower.includes("econ") || qLower.includes("cac") || qLower.includes("ltv") || qLower.includes("monet") || qLower.includes("price")) {
    return `Unit economics are critical for the ${context.startupContext?.stage || "Pre-seed"} stage. Investors will want to see:
1. Conversion rates from visits to sign-ups and to paying customers.
2. Customer Acquisition Cost (CAC) by channel.
3. Customer Lifetime Value (LTV) and the LTV/CAC ratio (ideally >3).
Add these calculations to the 'Business Model' slide to prove the viability of your business.`;
  }

  if (qLower.includes("invest") || qLower.includes("round") || qLower.includes("money") || qLower.includes("raise") || qLower.includes("fund")) {
    return `You plan to raise ${context.startupContext?.targetRaise || "funding"} from "${context.startupContext?.targetInvestors || "angels/funds"}". During the meeting, you will definitely be asked questions from the report:
1. Which specific metrics will this money help you achieve?
2. What runway will this investment secure?
Make sure to prepare a "Use of Funds" slide with a pie chart detailing expenditures (product development, marketing, operations).`;
  }

  // Default response
  return `Thank you for your question regarding the report for ${startupName}! Overall, the investor grade for the presentation is ${context.overallScore}/100 (Grade: ${context.grade}). 
You asked: "${question}".
To improve this aspect, focus on the following recommendations from the report:
- Address the critical weaknesses: ${context.weaknesses[0] || "refine financial slides"}.
- Add missing signals: ${context.missingSignals[0] || "a detailed GTM strategy"}.
If you have a specific slide you are unsure about, I can help you rewrite it!`;
}
