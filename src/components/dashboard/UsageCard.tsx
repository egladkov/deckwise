import React from "react";
import { useSubscriptionStore } from "../../stores/subscription.store";

interface UsageCardProps {
  compact?: boolean;
}

export const UsageCard: React.FC<UsageCardProps> = ({ compact = false }) => {
  const { subscription } = useSubscriptionStore();

  if (!subscription) return null;

  const { reviewsUsed, reviewsLimit, revisionsUsed, revisionsLimit } = subscription;

  const formatLimit = (used: number, limit: number) => {
    return limit === -1 ? `${used} / ∞` : `${used} / ${limit}`;
  };

  const reviewsPercentage = reviewsLimit === -1 ? 0 : Math.min(100, Math.round((reviewsUsed / reviewsLimit) * 100));
  const revisionsPercentage = revisionsLimit === -1 ? 0 : Math.min(100, Math.round((revisionsUsed / revisionsLimit) * 100));

  if (compact) {
    return (
      <div className="flex items-center gap-3.5 text-[11px] font-mono text-muted">
        <div className="flex items-center gap-1.5">
          <span>Decks:</span>
          <span className="font-semibold text-navy">
            {formatLimit(reviewsUsed, reviewsLimit)}
          </span>
        </div>
        <div className="w-[1px] h-3 bg-line shrink-0" />
        <div className="flex items-center gap-1.5">
          <span>Revisions:</span>
          <span className="font-semibold text-navy">
            {formatLimit(revisionsUsed, revisionsLimit)}
          </span>
        </div>
      </div>
    );
  }

  return (
    <div className="border border-line rounded-xl bg-paper-warm/40 p-4 font-sans max-w-xs animate-fade-up w-full space-y-4">
      {/* Decks Limit */}
      <div>
        <div className="flex justify-between items-center mb-1.5">
          <span className="text-[11px] text-muted uppercase tracking-wider font-mono">Decks Limit</span>
          <span className="text-xs font-semibold font-mono text-navy">
            {formatLimit(reviewsUsed, reviewsLimit)}
          </span>
        </div>
        {reviewsLimit !== -1 ? (
          <div className="w-full h-1.5 bg-paper-deep rounded-full overflow-hidden border border-line">
            <div
              className="h-full bg-gold transition-all duration-500 rounded-full"
              style={{ width: `${reviewsPercentage}%` }}
            />
          </div>
        ) : (
          <span className="text-[10px] text-sage font-medium tracking-wide">Unlimited uploads</span>
        )}
      </div>

      {/* Revisions Limit */}
      <div>
        <div className="flex justify-between items-center mb-1.5">
          <span className="text-[11px] text-muted uppercase tracking-wider font-mono">Revisions Limit</span>
          <span className="text-xs font-semibold font-mono text-navy">
            {formatLimit(revisionsUsed, revisionsLimit)}
          </span>
        </div>
        {revisionsLimit !== -1 ? (
          <div className="w-full h-1.5 bg-paper-deep rounded-full overflow-hidden border border-line">
            <div
              className="h-full bg-gold transition-all duration-500 rounded-full"
              style={{ width: `${revisionsPercentage}%` }}
            />
          </div>
        ) : (
          <span className="text-[10px] text-sage font-medium tracking-wide">Unlimited revisions</span>
        )}
      </div>
    </div>
  );
};
