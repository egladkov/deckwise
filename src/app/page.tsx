import React from "react";
import Link from "next/link";
import { Sparkles, FileText, CheckCircle2, ShieldAlert, ArrowRight, Zap } from "lucide-react";
import { Logo } from "../components/shared/Logo";
import { Footer } from "../components/shared/Footer";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-ruled bg-paper text-ink font-sans relative overflow-hidden flex flex-col justify-between">
      {/* Top Navigation */}
      <header className="h-20 border-b border-line bg-paper/85 backdrop-blur-md sticky top-0 z-50 flex items-center justify-between px-6 sm:px-12 max-w-7xl w-full mx-auto">
        <Logo href="/" />

        <Link
          href="/login"
          className="px-4 py-2 border border-line bg-paper-warm text-navy hover:border-gold hover:bg-paper rounded-md text-xs font-semibold transition-all duration-300 shadow-sm"
        >
          Sign In
        </Link>
      </header>

      {/* Hero Section */}
      <main className="flex-1 max-w-5xl w-full mx-auto px-6 sm:px-12 py-16 sm:py-24 text-center space-y-8 animate-fade-up">
        {/* Badge */}
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-gold/40 bg-gold/5 text-gold font-mono text-[10px] uppercase tracking-wider shadow-[0_0_10px_rgba(201,162,39,0.1)] mx-auto">
          <Zap className="w-3.5 h-3.5" />
          <span>Instant VC-Grade Review</span>
        </div>

        {/* Hero Headline */}
        <div className="space-y-4 max-w-3xl mx-auto">
          <h1 className="text-4xl sm:text-6xl font-display font-bold text-navy leading-tight tracking-tight">
            Review your pitch deck through the eyes of an investor
          </h1>
          <p className="text-sm sm:text-base text-muted font-sans max-w-2xl mx-auto leading-relaxed">
            Deckwise AI performs automated audits of pitch decks based on venture capital standards. Get detailed slide feedback and lists of investor questions before meeting VCs.
          </p>
        </div>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-2">
          <Link
            href="/register"
            className="w-full sm:w-auto px-5 py-3 bg-navy text-chalk hover:bg-navy-soft hover:-translate-y-0.5 shadow-md shadow-navy/15 hover:shadow-lg hover:shadow-navy/25 rounded-md text-sm font-semibold transition-all duration-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-gold/70 focus-visible:ring-offset-2 focus-visible:ring-offset-paper flex items-center justify-center gap-2"
          >
            <span>Analyze my deck</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
          <Link
            href="/login"
            className="w-full sm:w-auto px-5 py-3 border border-line bg-paper-warm text-navy hover:border-gold hover:bg-paper hover:-translate-y-0.5 rounded-md text-sm font-semibold transition-all duration-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-gold/70 focus-visible:ring-offset-2 focus-visible:ring-offset-paper flex items-center justify-center"
          >
            View pricing
          </Link>
        </div>

        {/* Mock Pitch Deck Preview container */}
        <div className="pt-10 max-w-4xl mx-auto">
          <div className="border border-line rounded-2xl bg-paper p-4 sm:p-6 shadow-2xl relative overflow-hidden">
            <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-transparent via-gold/40 to-transparent" />
            <div className="flex justify-between items-center border-b border-line/50 pb-3 mb-4 text-xs font-mono text-muted">
              <span className="flex items-center gap-1">
                <FileText className="w-4 h-4 text-gold" />
                sample_pitch_deck.pdf
              </span>
              <span className="text-navy font-semibold">Score: 84/100 (Grade B)</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-left text-xs text-navy/90">
              <div className="border border-sage/20 rounded-xl bg-sage/5 p-4 space-y-2">
                <h4 className="font-display font-bold text-sm text-navy flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-sage" /> Strengths
                </h4>
                <p>Clearly articulated market problem and elegant demonstration of the technical solution.</p>
              </div>
              <div className="border border-burgundy/20 rounded-xl bg-burgundy/5 p-4 space-y-2">
                <h4 className="font-display font-bold text-sm text-navy flex items-center gap-1.5">
                  <ShieldAlert className="w-4 h-4 text-burgundy" /> Critical Critiques
                </h4>
                <p>Weak details on the GTM strategy and a superficial analysis of direct competitors.</p>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
}
