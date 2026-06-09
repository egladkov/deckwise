import React from "react";
import Link from "next/link";
import { FileText, Calendar, ChevronRight, Eye, Trash2 } from "lucide-react";
import { DeckReview } from "../../types";

interface ReviewCardProps {
  review: DeckReview;
  onDelete: (id: string, e: React.MouseEvent) => void;
}

export const ReviewCard: React.FC<ReviewCardProps> = ({ review, onDelete }) => {
  const { id, fileName, createdAt, status, overallScore, grade, startupContext } = review;

  const dateFormatted = new Date(createdAt).toLocaleDateString("en-US", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  const gradeColors = {
    A: "text-sage bg-sage/5 border-sage/20",
    B: "text-gold bg-gold/5 border-gold/20",
    C: "text-gold-soft bg-gold-soft/5 border-gold-soft/20",
    D: "text-burgundy/80 bg-burgundy/5 border-burgundy/15",
    F: "text-burgundy bg-burgundy/5 border-burgundy/20",
  };

  const statusLabels = {
    draft: "Draft",
    uploading: "Uploading...",
    extracting: "Extracting text...",
    analyzing: "AI Analysis...",
    completed: "Ready",
    failed: "Failed",
  };

  const statusStyles = {
    draft: "bg-paper-deep text-navy border-line",
    uploading: "bg-paper-deep text-navy border-line animate-pulse",
    extracting: "bg-paper-deep text-gold border-gold/20 animate-pulse",
    analyzing: "bg-gold/10 text-gold border-gold/30 animate-pulse",
    completed: "bg-sage/10 text-sage border-sage/20",
    failed: "bg-burgundy/10 text-burgundy border-burgundy/20",
  };

  const isPending = ["uploading", "extracting", "analyzing"].includes(status);

  return (
    <div className="border border-line rounded-2xl bg-paper hover:bg-paper-warm/40 p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 transition-all hover:-translate-y-0.5 hover:shadow-md animate-fade-up font-sans">
      <div className="flex items-start gap-4">
        {/* Grade Icon */}
        {status === "completed" ? (
          <div className={`w-14 h-14 rounded-xl border flex flex-col items-center justify-center font-display font-bold shrink-0 ${gradeColors[grade]}`}>
            <span className="text-[8px] uppercase tracking-wider font-mono text-muted/80 leading-none mb-0.5">Grade</span>
            <span className="text-2xl leading-none">{grade}</span>
          </div>
        ) : (
          <div className="w-14 h-14 rounded-xl border border-line bg-paper-warm/50 flex items-center justify-center text-muted shrink-0">
            <FileText className="w-7 h-7" />
          </div>
        )}

        {/* Content Info */}
        <div className="space-y-1">
          <h4 className="font-semibold text-navy leading-snug break-all max-w-[280px] sm:max-w-[400px]">
            {startupContext?.startupName ? `${startupContext.startupName} — ` : ""}
            {fileName}
          </h4>
          <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-muted">
            <span className="flex items-center gap-1">
              <Calendar className="w-3.5 h-3.5" />
              {dateFormatted}
            </span>
            <span className={`inline-flex items-center px-2 py-0.5 rounded-full border text-[10px] uppercase font-mono tracking-wider ${statusStyles[status]}`}>
              {statusLabels[status]}
            </span>
            {status === "completed" && (
              <span className="font-mono text-navy font-semibold">
                Score: {overallScore}/100
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex items-center gap-2 self-stretch sm:self-auto justify-end border-t border-line sm:border-0 pt-3 sm:pt-0">
        <button
          onClick={(e) => onDelete(id, e)}
          className="p-2.5 rounded-xl border border-line bg-paper text-burgundy hover:bg-burgundy/10 transition-colors shrink-0"
          title="Delete review"
        >
          <Trash2 className="w-4 h-4" />
        </button>

        {status === "completed" ? (
          <Link
            href={`/dashboard/reviews/${id}`}
            className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-navy hover:bg-navy-soft text-chalk text-xs font-medium rounded-xl border border-line-dark shadow-sm transition-all hover:-translate-y-0.5"
          >
            <Eye className="w-3.5 h-3.5 text-gold" />
            <span>Open Report</span>
            <ChevronRight className="w-3.5 h-3.5 text-muted" />
          </Link>
        ) : isPending ? (
          <Link
            href={`/dashboard/new-review`}
            className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-2 px-4 py-2.5 border border-line bg-paper-warm/50 text-navy text-xs font-medium rounded-xl animate-pulse cursor-pointer"
          >
            <span>View Progress</span>
          </Link>
        ) : (
          <div className="text-xs text-muted px-4 py-2 bg-paper-deep rounded-xl border border-line">
            Incomplete
          </div>
        )}
      </div>
    </div>
  );
};
