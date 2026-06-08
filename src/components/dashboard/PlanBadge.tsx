import React from "react";
import { PlanId } from "../../types";

interface PlanBadgeProps {
  planId: PlanId;
  className?: string;
}

export const PlanBadge: React.FC<PlanBadgeProps> = ({ planId, className = "" }) => {
  const styles = {
    bootstrapper: "bg-paper-deep text-navy border-line",
    "pre-seed": "bg-gold/10 text-gold border-gold/40 shadow-[0_0_8px_rgba(201,162,39,0.15)] font-semibold",
    seed: "bg-navy-soft/10 text-navy-soft border-navy-soft/30 font-semibold",
    "series-a": "bg-navy text-gold border-gold/50 shadow-md font-semibold",
  };

  const labels = {
    bootstrapper: "Bootstrapper",
    "pre-seed": "Pre-Seed Round",
    seed: "Seed Round",
    "series-a": "Series A+",
  };

  return (
    <span
      className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-mono border uppercase tracking-wider ${styles[planId] || styles.bootstrapper} ${className}`}
    >
      {labels[planId] || planId} Plan
    </span>
  );
};
