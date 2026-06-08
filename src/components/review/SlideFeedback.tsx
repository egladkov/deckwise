"use client";

import React, { useState } from "react";
import { ChevronDown, ChevronUp, AlertCircle, Sparkles, CheckCircle2 } from "lucide-react";
import { SlideFeedback as SlideFeedbackType } from "../../types";

interface SlideFeedbackProps {
  slides: SlideFeedbackType[];
}

export const SlideFeedback: React.FC<SlideFeedbackProps> = ({ slides }) => {
  const [openSlides, setOpenSlides] = useState<Record<number, boolean>>({
    1: true, // Open the first slide by default
  });

  const toggleSlide = (slideNum: number) => {
    setOpenSlides((prev) => ({
      ...prev,
      [slideNum]: !prev[slideNum],
    }));
  };

  const getScoreColor = (score: number) => {
    if (score >= 90) return "text-sage bg-sage/5 border-sage/20";
    if (score >= 75) return "text-gold bg-gold/5 border-gold/20";
    return "text-burgundy bg-burgundy/5 border-burgundy/20";
  };

  return (
    <div className="space-y-3 font-sans animate-fade-up">
      {slides.map((slide) => {
        const isOpen = !!openSlides[slide.slideNumber];
        const scoreStyle = getScoreColor(slide.score);

        return (
          <div
            key={slide.slideNumber}
            className={`border rounded-2xl overflow-hidden bg-paper transition-all ${
              isOpen ? "border-gold/30 shadow-sm" : "border-line hover:border-gold/40"
            }`}
          >
            {/* Header Accordion */}
            <div
              onClick={() => toggleSlide(slide.slideNumber)}
              className="flex items-center justify-between p-4 cursor-pointer hover:bg-paper-warm/30 select-none"
            >
              <div className="flex items-center gap-3">
                {/* Slide Number Badge */}
                <div className="w-10 h-10 rounded-xl bg-navy text-gold flex items-center justify-center font-mono font-bold border border-gold/20 shrink-0">
                  {slide.slideNumber}
                </div>
                <div>
                  <h5 className="font-semibold text-navy text-sm sm:text-base leading-tight">
                    {slide.title || `Slide ${slide.slideNumber}`}
                  </h5>
                  <span className="text-[10px] text-muted font-mono uppercase tracking-wider block mt-0.5">Slide Breakdown</span>
                </div>
              </div>

              <div className="flex items-center gap-4">
                {/* Score */}
                <div className={`px-2.5 py-1 rounded-lg border font-mono text-xs font-semibold ${scoreStyle}`}>
                  {slide.score} / 100
                </div>
                {/* Toggle Icon */}
                <div className="text-navy">
                  {isOpen ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
                </div>
              </div>
            </div>

            {/* Accordion Body */}
            {isOpen && (
              <div className="border-t border-line/50 p-5 bg-paper-warm/25 space-y-4 animate-fade-up text-xs leading-relaxed text-navy/90">
                {/* Issues section */}
                {slide.issues.length > 0 ? (
                  <div>
                    <div className="flex items-center gap-1.5 text-burgundy font-semibold mb-2">
                      <AlertCircle className="w-4 h-4 shrink-0" />
                      <h6>Identified Issues</h6>
                    </div>
                    <ul className="space-y-1.5 pl-5 list-disc">
                      {slide.issues.map((issue, i) => (
                        <li key={i}>{issue}</li>
                      ))}
                    </ul>
                  </div>
                ) : (
                  <div className="flex items-center gap-1.5 text-sage font-semibold">
                    <CheckCircle2 className="w-4 h-4 shrink-0" />
                    <span>No issues detected. Excellent slide design.</span>
                  </div>
                )}

                {/* Recommendations section */}
                {slide.recommendations.length > 0 && (
                  <div className="pt-2 border-t border-line/30">
                    <div className="flex items-center gap-1.5 text-gold font-semibold mb-2">
                      <Sparkles className="w-4 h-4 shrink-0" />
                      <h6>Improvement Recommendations</h6>
                    </div>
                    <ul className="space-y-1.5 pl-5 list-disc">
                      {slide.recommendations.map((rec, i) => (
                        <li key={i}>{rec}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
};
