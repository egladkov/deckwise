import React from "react";
import { Check } from "lucide-react";
import { Plan, PlanId } from "../../types";

interface PricingCardProps {
  plan: Plan;
  isCurrent: boolean;
  onSelect: (planId: PlanId) => void;
  loading: boolean;
}

export const PricingCard: React.FC<PricingCardProps> = ({
  plan,
  isCurrent,
  onSelect,
  loading,
}) => {
  const { id, name, priceMonth, features } = plan;

  const cardStyles = {
    free: "border-line bg-paper-warm/30",
    pro: "border-gold bg-paper shadow-[0_0_15px_rgba(201,162,39,0.15)] relative scale-[1.02] sm:scale-105",
    investor: "border-line bg-navy text-chalk",
  };

  const titleStyles = {
    free: "text-navy",
    pro: "text-gold",
    investor: "text-gold",
  };

  const buttonStyles = {
    free: "border border-line bg-paper text-navy hover:bg-paper-warm",
    pro: "bg-gold hover:bg-gold-soft text-navy font-semibold border border-gold-soft/50 shadow-md",
    investor: "bg-gold hover:bg-gold-soft text-navy font-semibold border border-gold-soft/50 shadow-md",
  };

  return (
    <div
      className={`border rounded-2xl p-6 sm:p-8 flex flex-col justify-between transition-all duration-300 hover:shadow-lg animate-fade-up font-sans ${cardStyles[id]}`}
    >
      {id === "pro" && (
        <span className="absolute -top-3.5 left-1/2 -translate-x-1/2 px-3 py-1 bg-gold text-navy text-[10px] uppercase font-mono tracking-widest font-bold rounded-full border border-gold-soft/50 shadow-sm">
          Recommended
        </span>
      )}

      <div>
        {/* Plan Header */}
        <div className="mb-6">
          <h4 className={`text-xl font-display font-bold uppercase tracking-wider ${titleStyles[id]}`}>
            {name}
          </h4>
          <div className="mt-2 flex items-baseline gap-1">
            <span className="text-4xl font-display font-bold">${priceMonth}</span>
            <span className={`text-xs font-mono ${id === "investor" ? "text-chalk/60" : "text-muted"}`}>
              / month
            </span>
          </div>
        </div>

        {/* Feature List */}
        <ul className="space-y-3 mb-8 text-sm">
          {features.map((feature, idx) => (
            <li key={idx} className="flex items-start gap-2.5">
              <Check className={`w-4 h-4 shrink-0 mt-0.5 ${id === "investor" ? "text-gold" : "text-gold"}`} />
              <span className={id === "investor" ? "text-chalk/90" : "text-navy/90"}>{feature}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* Select Button */}
      <button
        onClick={() => onSelect(id)}
        disabled={isCurrent || loading}
        className={`w-full py-3 px-4 rounded-xl text-xs font-semibold uppercase tracking-wider transition-all hover:-translate-y-0.5 disabled:opacity-50 disabled:transform-none ${
          isCurrent 
            ? "border border-line-dark/20 bg-paper-deep text-muted cursor-default hover:bg-paper-deep"
            : buttonStyles[id]
        }`}
      >
        {isCurrent ? "Current Plan" : loading ? "Updating..." : `Select ${name}`}
      </button>
    </div>
  );
};
