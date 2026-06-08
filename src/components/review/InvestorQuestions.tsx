"use client";

import React, { useState } from "react";
import { HelpCircle, CheckSquare, Square } from "lucide-react";

interface InvestorQuestionsProps {
  questions: string[];
}

export const InvestorQuestions: React.FC<InvestorQuestionsProps> = ({ questions }) => {
  const [prepared, setPrepared] = useState<Record<number, boolean>>({});

  const togglePrepared = (idx: number) => {
    setPrepared((prev) => ({
      ...prev,
      [idx]: !prev[idx],
    }));
  };

  return (
    <div className="border border-line rounded-2xl bg-paper-warm/40 p-6 font-sans animate-fade-up">
      <div className="flex items-center gap-2 mb-4">
        <HelpCircle className="w-5 h-5 text-gold shrink-0" />
        <h4 className="text-xl font-display font-semibold text-navy">Investor Questions to Prepare For</h4>
      </div>
      <p className="text-xs text-muted mb-4 leading-relaxed">
        The AI analyzed the weak points of your presentation and compiled a list of tough questions you are likely to face during your pitch session. Check off the ones you are prepared to answer.
      </p>

      <div className="space-y-2.5">
        {questions.map((question, idx) => {
          const isDone = !!prepared[idx];
          return (
            <div
              key={idx}
              onClick={() => togglePrepared(idx)}
              className={`flex items-start gap-3 p-3.5 rounded-xl border cursor-pointer select-none transition-all ${
                isDone
                  ? "border-sage/30 bg-sage/5 text-navy/70"
                  : "border-line bg-paper hover:border-gold/40 hover:bg-paper-warm/20"
              }`}
            >
              <div className="shrink-0 mt-0.5">
                {isDone ? (
                  <CheckSquare className="w-5 h-5 text-sage" />
                ) : (
                  <Square className="w-5 h-5 text-muted hover:text-navy" />
                )}
              </div>
              <span className={`text-xs sm:text-sm font-medium ${isDone ? "line-through text-muted" : "text-navy"}`}>
                {question}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
};
