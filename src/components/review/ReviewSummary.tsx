import React from "react";
import { CheckCircle2, AlertTriangle, EyeOff, FileText } from "lucide-react";

interface ReviewSummaryProps {
  summary: string;
  strengths: string[];
  weaknesses: string[];
  missingSignals: string[];
}

export const ReviewSummary: React.FC<ReviewSummaryProps> = ({
  summary,
  strengths,
  weaknesses,
  missingSignals,
}) => {
  return (
    <div className="space-y-6 font-sans animate-fade-up">
      {/* Executive Summary */}
      <div className="border border-line rounded-2xl bg-paper-warm/40 p-6">
        <div className="flex items-center gap-2 mb-3">
          <FileText className="w-5 h-5 text-gold shrink-0" />
          <h4 className="text-xl font-display font-semibold text-navy">Executive Summary</h4>
        </div>
        <p className="text-sm text-navy/90 leading-relaxed font-sans">{summary}</p>
      </div>

      {/* Grid of Strengths, Weaknesses and Missing Signals */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Strengths */}
        <div className="border border-sage/20 rounded-2xl bg-sage/5 p-5">
          <div className="flex items-center gap-2 mb-3 text-sage">
            <CheckCircle2 className="w-5 h-5 shrink-0" />
            <h5 className="font-display font-bold text-lg text-navy">Strengths</h5>
          </div>
          <ul className="space-y-2.5 text-xs text-navy/90 leading-relaxed">
            {strengths.map((str, idx) => (
              <li key={idx} className="flex items-start gap-1.5">
                <span className="text-sage font-bold shrink-0 mt-0.5">•</span>
                <span>{str}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Weaknesses */}
        <div className="border border-burgundy/20 rounded-2xl bg-burgundy/5 p-5">
          <div className="flex items-center gap-2 mb-3 text-burgundy">
            <AlertTriangle className="w-5 h-5 shrink-0" />
            <h5 className="font-display font-bold text-lg text-navy">Weaknesses</h5>
          </div>
          <ul className="space-y-2.5 text-xs text-navy/90 leading-relaxed">
            {weaknesses.map((weak, idx) => (
              <li key={idx} className="flex items-start gap-1.5">
                <span className="text-burgundy font-bold shrink-0 mt-0.5">•</span>
                <span>{weak}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Missing Signals */}
        <div className="border border-line-dark/20 rounded-2xl bg-navy-soft/5 p-5">
          <div className="flex items-center gap-2 mb-3 text-navy">
            <EyeOff className="w-5 h-5 shrink-0" />
            <h5 className="font-display font-bold text-lg text-navy">Missing Signals</h5>
          </div>
          <ul className="space-y-2.5 text-xs text-navy/90 leading-relaxed">
            {missingSignals.map((sig, idx) => (
              <li key={idx} className="flex items-start gap-1.5">
                <span className="text-navy font-bold shrink-0 mt-0.5">•</span>
                <span>{sig}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};
