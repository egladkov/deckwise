/**
 * MVP helper to simulate extracting text from PDF file.
 * In a production environment, this would use a library like pdfjs-dist or pdf-parse.
 */
export async function extractPdfText(file: File): Promise<string> {
  // Simulate extraction latency (1.5 seconds)
  await new Promise((resolve) => setTimeout(resolve, 1500));

  if (!file) {
    throw new Error("No file provided for extraction");
  }

  // Return a mock extracted text representation that the OpenAI API can analyze
  const mockTextContent = `
    PITCH DECK: ${file.name}
    Size: ${file.size} bytes
    
    Slide 1: Header & Tagline
    Deckwise AI. Automated Investor-Grade Pitch Deck Reviews. TAM, unit economics, GTM, and financials scored instantly before you pitch to VCs.
    
    Slide 2: The Problem
    Founders spend weeks getting feedback on their decks. VCs waste hundreds of hours screening bad decks. There is no automated, standard quality check tool for pitch decks.
    
    Slide 3: The Solution
    An AI SaaS that scores decks in seconds. It parses PDFs, rates them on key VC metrics, provides slide-by-slide feedback, and offers an AI analyst chatbot for immediate improvement tips.
    
    Slide 4: Market Opportunity (TAM)
    Global VC market: $600B+ yearly. Startup ecosystem: 100k+ new startups annually. Direct TAM (VC + Accelerators + Founders): $2.5B market opportunity.
    
    Slide 5: Business Model & Unit Economics
    Pricing: Free trial tier, $49/mo Pro tier (for active founders), $199/mo Investor tier (for funds and syndicates).
    CAC is currently $15, LTV is estimated at $350 (over 7 months average retention). Unit Economics look very strong.
    
    Slide 6: Technology Moat
    Proprietary parsing engine (PDF to structured JSON). Fine-tuned AI models calibrated on successful decks. Integration into VC pipeline.
    
    Slide 7: Team
    Ivan Gladkoborodov, CEO (Ex-founder, VC advisor). Technical Lead, PhD in AI. Frontend Engineer, UI designer.
    
    Slide 8: Financials & Ask
    Raising $500,000 for 12 months runway. Allocate: 60% engineering, 25% marketing, 15% operations. Expected milestones: 5k monthly active users, $40k MRR.
  `;

  return mockTextContent.trim();
}
