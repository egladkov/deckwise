import React from "react";

interface ScoreCardProps {
  score: number;
  grade: "A" | "B" | "C" | "D" | "F";
  className?: string;
}

export const ScoreCard: React.FC<ScoreCardProps> = ({ score, grade, className = "" }) => {
  // SVG circle with radius 40 has length 2 * PI * 40 ≈ 251.3
  const circumference = 251.2;
  const strokeDashoffset = circumference - (score / 100) * circumference;

  const gradeColors = {
    A: "text-sage border-sage/20 bg-sage/5",
    B: "text-gold border-gold/20 bg-gold/5",
    C: "text-gold-soft border-gold-soft/20 bg-gold-soft/5",
    D: "text-burgundy/80 border-burgundy/15 bg-burgundy/5",
    F: "text-burgundy border-burgundy/20 bg-burgundy/5",
  };

  return (
    <div className={`border border-line rounded-2xl bg-paper-warm/50 p-6 flex flex-col sm:flex-row items-center justify-between gap-6 shadow-sm font-sans ${className} animate-fade-up`}>
      <div className="text-center sm:text-left">
        <span className="text-xs text-muted uppercase tracking-wider font-mono">Investment Readiness</span>
        <h3 className="text-3xl font-display text-navy font-bold mt-1 mb-2">Overall Readiness Score</h3>
        <p className="text-sm text-muted max-w-sm leading-relaxed">
          This score represents how ready your presentation is to be shown to professional venture capitalists and angel investors.
        </p>
      </div>

      <div className="flex items-center gap-6 shrink-0">
        {/* SVG Circular Progress */}
        <div className="relative w-28 h-28 flex items-center justify-center">
          <svg className="w-full h-full transform -rotate-90">
            {/* Background Circle */}
            <circle
              cx="56"
              cy="56"
              r="40"
              className="stroke-paper-deep fill-none"
              strokeWidth="8"
            />
            {/* Foreground Circle */}
            <circle
              cx="56"
              cy="56"
              r="40"
              className="stroke-gold fill-none transition-all duration-1000 ease-out"
              strokeWidth="8"
              strokeDasharray={circumference}
              strokeDashoffset={strokeDashoffset}
              strokeLinecap="round"
            />
          </svg>
          <div className="absolute flex flex-col items-center justify-center font-mono">
            <span className="text-3xl font-bold text-navy leading-none">{score}</span>
            <span className="text-[10px] text-muted uppercase tracking-wider mt-0.5">of 100</span>
          </div>
        </div>

        {/* Grade Letter */}
        <div className={`w-20 h-20 rounded-2xl border flex flex-col items-center justify-center shrink-0 ${gradeColors[grade]}`}>
          <span className="text-[10px] uppercase font-mono tracking-widest text-muted/80 leading-none mb-1">Grade</span>
          <span className="text-4xl font-display font-bold leading-none">{grade}</span>
        </div>
      </div>
    </div>
  );
};
