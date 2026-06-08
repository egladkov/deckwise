import React from "react";
import { AlertTriangle } from "lucide-react";

interface ConfirmDialogProps {
  isOpen: boolean;
  title: string;
  description: string;
  confirmLabel: string;
  cancelLabel?: string;
  isDestructive?: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}

export const ConfirmDialog: React.FC<ConfirmDialogProps> = ({
  isOpen,
  title,
  description,
  confirmLabel,
  cancelLabel = "Cancel",
  isDestructive = false,
  onConfirm,
  onCancel,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-navy/60 backdrop-blur-sm transition-opacity" 
        onClick={onCancel}
      />

      {/* Modal content */}
      <div className="relative w-full max-w-md overflow-hidden rounded-2xl border border-line bg-paper p-6 shadow-2xl animate-fade-up font-sans">
        <div className="flex items-start gap-4">
          <div className={`p-3 rounded-full shrink-0 ${isDestructive ? "bg-burgundy/10 text-burgundy" : "bg-gold/10 text-gold"}`}>
            <AlertTriangle className="h-6 w-6" />
          </div>
          <div>
            <h3 className="text-xl font-display text-navy font-semibold mb-2">{title}</h3>
            <p className="text-sm text-muted leading-relaxed mb-6">{description}</p>
          </div>
        </div>

        <div className="flex items-center justify-end gap-3">
          <button
            type="button"
            onClick={onCancel}
            className="px-4 py-2 border border-line rounded-xl text-sm font-medium text-navy bg-paper hover:bg-paper-warm transition-colors"
          >
            {cancelLabel}
          </button>
          <button
            type="button"
            onClick={onConfirm}
            className={`px-4 py-2 rounded-xl text-sm font-medium text-chalk shadow-md transition-all hover:-translate-y-0.5 ${
              isDestructive 
                ? "bg-burgundy hover:bg-burgundy/90 border border-burgundy/40" 
                : "bg-navy hover:bg-navy-soft border border-line-dark"
            }`}
          >
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
};
