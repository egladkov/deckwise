import React from "react";
import { ScoreCard } from "../dashboard/ScoreCard";

interface ReportScoreProps {
  score: number;
  grade: "A" | "B" | "C" | "D" | "F";
}

export const ReportScore: React.FC<ReportScoreProps> = ({ score, grade }) => {
  // Compute section scores based on overall score with slight variation
  const problemScore = Math.min(100, Math.max(0, score + 4));
  const marketScore = Math.min(100, Math.max(0, score - 8));
  const modelScore = Math.min(100, Math.max(0, score - 5));
  const teamScore = Math.min(100, Math.max(0, score + 2));

  const criteria = [
    { label: "Problem & Solution", value: problemScore, color: "bg-gold" },
    { label: "Market Size (TAM)", value: marketScore, color: "bg-gold" },
    { label: "Business Model", value: modelScore, color: "bg-gold" },
    { label: "Startup Team", value: teamScore, color: "bg-gold" },
  ];

  return (
    <div className="space-y-6 animate-fade-up font-sans">
      {/* Overall Score */}
      <ScoreCard score={score} grade={grade} />

      {/* Criteria Breakdown */}
      <div className="border border-line rounded-2xl bg-paper p-5 sm:p-6 space-y-4">
        <h4 className="text-xl font-display font-semibold text-navy mb-2">Criteria Breakdown</h4>
        
        <div className="space-y-3.5">
          {criteria.map((crit, idx) => (
            <div key={idx} className="space-y-1">
              <div className="flex justify-between items-center text-xs">
                <span className="font-semibold text-navy">{crit.label}</span>
                <span className="font-mono font-bold text-navy">{crit.value} / 100</span>
              </div>
              <div className="w-full h-2 bg-paper-deep rounded-full overflow-hidden border border-line/60">
                <div
                  className={`h-full ${crit.color} rounded-full transition-all duration-1000 ease-out`}
                  style={{ width: `${crit.value}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
