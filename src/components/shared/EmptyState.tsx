import React from "react";
import { LucideIcon } from "lucide-react";

interface EmptyStateProps {
  title: string;
  description: string;
  icon: LucideIcon;
  actionLabel?: string;
  onAction?: () => void;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  title,
  description,
  icon: Icon,
  actionLabel,
  onAction,
}) => {
  return (
    <div className="flex flex-col items-center justify-center border border-dashed border-line rounded-2xl p-10 text-center bg-paper-warm/20 max-w-xl mx-auto my-8 animate-fade-up">
      <div className="flex items-center justify-center w-14 h-14 rounded-full bg-paper-deep text-gold mb-4 shadow-sm">
        <Icon className="w-7 h-7" />
      </div>
      <h3 className="text-xl font-display text-navy font-semibold mb-2">{title}</h3>
      <p className="text-sm text-muted font-sans max-w-md mb-6 leading-relaxed">
        {description}
      </p>
      {actionLabel && onAction && (
        <button
          onClick={onAction}
          className="px-5 py-2.5 bg-navy hover:bg-navy-soft text-chalk text-sm font-sans font-medium rounded-xl transition-all hover:-translate-y-0.5 border border-line-dark shadow-md"
        >
          {actionLabel}
        </button>
      )}
    </div>
  );
};
