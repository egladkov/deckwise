import React from "react";
import { PlanId } from "../../types";

interface PlanBadgeProps {
  planId: PlanId;
  className?: string;
}

export const PlanBadge: React.FC<PlanBadgeProps> = ({ planId, className = "" }) => {
  const styles = {
    free: "bg-paper-deep text-navy border-line",
    pro: "bg-gold/10 text-gold border-gold/40 shadow-[0_0_8px_rgba(201,162,39,0.2)] font-semibold",
    investor: "bg-navy text-gold border-gold/50 shadow-md font-semibold",
  };

  const labels = {
    free: "Free Plan",
    pro: "Pro Plan",
    investor: "Investor Plan",
  };

  return (
    <span
      className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-mono border uppercase tracking-wider ${styles[planId]} ${className}`}
    >
      {labels[planId]}
    </span>
  );
};
