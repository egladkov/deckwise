/**
 * MVP helper to simulate extracting text from various document formats (PDF, Word, PowerPoint).
 */
export async function extractDocumentText(file: File): Promise<string> {
  // Simulate extraction latency (1.5 seconds)
  await new Promise((resolve) => setTimeout(resolve, 1500));

  if (!file) {
    throw new Error("No file provided for extraction");
  }

  const fileNameLower = file.name.toLowerCase();
  let formatLabel = "PDF";
  let contentStructure = "Slide";

  if (fileNameLower.endsWith(".doc") || fileNameLower.endsWith(".docx")) {
    formatLabel = "WORD DOCUMENT";
    contentStructure = "Section";
  } else if (fileNameLower.endsWith(".ppt") || fileNameLower.endsWith(".pptx")) {
    formatLabel = "POWERPOINT PRESENTATION";
    contentStructure = "Slide";
  }

  // Return a mock extracted text representation tailored to the document format
  const mockTextContent = `
    ${formatLabel} PITCH DECK: ${file.name}
    Format: ${formatLabel}
    Size: ${file.size} bytes
    
    ${contentStructure} 1: Header & Tagline
    Deckwise AI. Automated Investor-Grade Pitch Deck Reviews. TAM, unit economics, GTM, and financials scored instantly before you pitch to VCs.
    
    ${contentStructure} 2: The Problem
    Founders spend weeks getting feedback on their decks. VCs waste hundreds of hours screening bad decks. There is no automated, standard quality check tool for pitch decks.
    
    ${contentStructure} 3: The Solution
    An AI SaaS that scores decks in seconds. It parses input documents, rates them on key VC metrics, provides slide-by-slide feedback, and offers an AI analyst chatbot for immediate improvement tips.
    
    ${contentStructure} 4: Market Opportunity (TAM)
    Global VC market: $600B+ yearly. Startup ecosystem: 100k+ new startups annually. Direct TAM (VC + Accelerators + Founders): $2.5B market opportunity.
    
    ${contentStructure} 5: Business Model & Unit Economics
    Pricing: Free trial tier, $49/mo Pro tier (for active founders), $199/mo Investor tier (for funds and syndicates).
    CAC is currently $15, LTV is estimated at $350 (over 7 months average retention). Unit Economics look very strong.
    
    ${contentStructure} 6: Technology Moat
    Proprietary parsing engine (PDF/Word/PPTX to structured JSON). Fine-tuned AI models calibrated on successful decks. Integration into VC pipeline.
    
    ${contentStructure} 7: Team
    Ivan Gladkoborodov, CEO (Ex-founder, VC advisor). Technical Lead, PhD in AI. Frontend Engineer, UI designer.
    
    ${contentStructure} 8: Financials & Ask
    Raising $500,000 for 12 months runway. Allocate: 60% engineering, 25% marketing, 15% operations. Expected milestones: 5k monthly active users, $40k MRR.
  `;

  return mockTextContent.trim();
}
