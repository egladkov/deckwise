import React from "react";
import { useSubscriptionStore } from "../../stores/subscription.store";

interface UsageCardProps {
  compact?: boolean;
}

export const UsageCard: React.FC<UsageCardProps> = ({ compact = false }) => {
  const { subscription } = useSubscriptionStore();

  if (!subscription) return null;

  const { reviewsUsed, reviewsLimit } = subscription;
  const percentage = Math.min(100, Math.round((reviewsUsed / reviewsLimit) * 100));

  if (compact) {
    return (
      <div className="flex items-center gap-2 text-xs font-mono text-muted">
        <span>Limit:</span>
        <span className="font-semibold text-navy">
          {reviewsUsed}/{reviewsLimit}
        </span>
        <div className="w-16 h-1.5 bg-paper-deep rounded-full overflow-hidden border border-line/50">
          <div
            className="h-full bg-gold transition-all duration-300"
            style={{ width: `${percentage}%` }}
          />
        </div>
      </div>
    );
  }

  return (
    <div className="border border-line rounded-xl bg-paper-warm/40 p-4 font-sans max-w-xs animate-fade-up">
      <div className="flex justify-between items-center mb-1.5">
        <span className="text-xs text-muted uppercase tracking-wider font-mono">Reviews Limit</span>
        <span className="text-sm font-semibold font-mono text-navy">
          {reviewsUsed} / {reviewsLimit}
        </span>
      </div>
      <div className="w-full h-2 bg-paper-deep rounded-full overflow-hidden border border-line mb-1">
        <div
          className="h-full bg-gold transition-all duration-500 rounded-full"
          style={{ width: `${percentage}%` }}
        />
      </div>
      <p className="text-[11px] text-muted leading-tight">
        Used {percentage}% of the limit. Upgrade your plan for more reviews.
      </p>
    </div>
  );
};
