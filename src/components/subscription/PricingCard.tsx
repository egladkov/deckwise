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
  const { id, name, description, priceMonth, reviewsLimit, revisionsLimit, features } = plan;

  // Highlight Pre-Seed card
  const isHighlighted = id === "pre-seed";

  // Format limits string
  let limitsText = "";
  if (reviewsLimit === -1 && revisionsLimit === -1) {
    limitsText = "Unlimited decks & revisions";
  } else {
    const deckUnit = reviewsLimit === 1 ? "deck" : "decks";
    limitsText = `${reviewsLimit} ${deckUnit}  •  ${revisionsLimit} revisions/mo`;
  }

  return (
    <div
      className={`border rounded-2xl p-6 sm:p-7 flex flex-col justify-between transition-all duration-300 relative font-sans ${
        isHighlighted
          ? "border-gold/60 bg-paper shadow-[0_12px_24px_rgba(201,162,39,0.08)] scale-[1.01] sm:scale-102 ring-1 ring-gold/30"
          : "border-line bg-paper/50 hover:bg-paper-warm/30 hover:border-line/80"
      }`}
    >
      {/* MOST SELECTED Badge for Pre-Seed */}
      {isHighlighted && (
        <span className="absolute -top-3 left-6 px-3 py-1 bg-navy text-gold text-[9px] uppercase font-mono tracking-widest font-bold rounded shadow-md border border-gold/30">
          Most Selected
        </span>
      )}

      <div>
        {/* Card Header */}
        <div className="mb-4">
          <h4 className="text-xl sm:text-2xl font-display font-semibold text-navy leading-none">
            {name}
          </h4>
          <p className="text-[12px] text-muted mt-1.5 leading-relaxed min-h-[32px]">
            {description}
          </p>
          
          <div className="mt-3 flex items-baseline gap-1">
            <span className="text-3xl sm:text-4xl font-display font-bold text-navy">
              ${priceMonth.toFixed(2)}
            </span>
            <span className="text-xs font-sans text-muted">/mo</span>
          </div>
        </div>

        {/* Limit Badge */}
        <div className="mb-5">
          <span className="inline-block bg-[#f0e6cb]/65 text-[#8b6508] border border-[#d4c59b]/60 px-2.5 py-0.5 rounded text-[10px] font-sans font-medium tracking-wide uppercase">
            {limitsText}
          </span>
        </div>

        {/* Feature List */}
        <ul className="space-y-3.5 mb-8 text-xs sm:text-sm">
          {features.map((feature, idx) => (
            <li key={idx} className="flex items-start gap-2.5">
              <Check className="w-4 h-4 text-sage shrink-0 mt-0.5" />
              <span className="text-navy/90 leading-normal">{feature}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* Choose/Select Button */}
      <button
        onClick={() => onSelect(id)}
        disabled={isCurrent || loading}
        className={`w-full py-3.5 px-4 rounded-xl text-xs font-semibold uppercase tracking-wider transition-all duration-200 hover:-translate-y-0.5 disabled:opacity-50 disabled:transform-none ${
          isCurrent
            ? "border border-line-dark/20 bg-paper-deep text-muted cursor-default hover:-translate-y-0"
            : isHighlighted
            ? "bg-navy hover:bg-navy-soft text-chalk hover:text-gold border border-navy-soft shadow-md font-bold"
            : "bg-paper-warm/60 hover:bg-paper-warm text-navy border border-line-dark/10"
        }`}
      >
        {isCurrent
          ? "Current Plan"
          : loading
          ? "Updating..."
          : `Choose ${name}`}
      </button>
    </div>
  );
};
