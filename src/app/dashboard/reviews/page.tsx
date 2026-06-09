"use client";

import React, { useEffect, useState } from "react";
import { useDeckStore } from "../../../stores/deck.store";
import { ReviewCard } from "../../../components/dashboard/ReviewCard";
import { EmptyState } from "../../../components/shared/EmptyState";
import { ConfirmDialog } from "../../../components/shared/ConfirmDialog";
import { History, Sparkles, Filter, ArrowUpDown } from "lucide-react";
import { useRouter } from "next/navigation";

export default function ReviewsPage() {
  const router = useRouter();
  const { reviews, fetchReviews, deleteReview, loading } = useDeckStore();

  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [filterStatus, setFilterStatus] = useState<"all" | "completed" | "failed">("all");
  const [sortBy, setSortBy] = useState<"newest" | "best" | "worst">("newest");

  useEffect(() => {
    fetchReviews();
  }, [fetchReviews]);

  const handleDeleteClick = (id: string, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDeleteId(id);
  };

  const handleConfirmDelete = async () => {
    if (deleteId) {
      await deleteReview(deleteId);
      setDeleteId(null);
    }
  };

  // Filtering and sorting
  const filteredReviews = reviews
    .filter((rev) => {
      if (filterStatus === "all") return true;
      return rev.status === filterStatus;
    })
    .sort((a, b) => {
      if (sortBy === "newest") {
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      }
      if (sortBy === "best") {
        return b.overallScore - a.overallScore;
      }
      if (sortBy === "worst") {
        return a.overallScore - b.overallScore;
      }
      return 0;
    });

  return (
    <div className="space-y-6 font-sans">
      {/* Title */}
      <div className="flex items-center gap-2 mb-6 animate-fade-up">
        <History className="w-6 h-6 text-gold" />
        <h1 className="text-2xl sm:text-3xl font-display font-bold text-navy leading-none">
          Review History
        </h1>
      </div>

      {/* Filter and sorting toolbar */}
      {reviews.length > 0 && (
        <div className="border border-line rounded-2xl bg-paper p-4 flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center animate-fade-up">
          {/* Status Filters */}
          <div className="flex items-center gap-2 flex-wrap">
            <Filter className="w-4 h-4 text-muted shrink-0" />
            <button
              onClick={() => setFilterStatus("all")}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold uppercase tracking-wider border transition-all ${
                filterStatus === "all"
                  ? "bg-navy text-chalk border-line-dark"
                  : "bg-paper text-muted border-line hover:text-navy"
              }`}
            >
              All
            </button>
            <button
              onClick={() => setFilterStatus("completed")}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold uppercase tracking-wider border transition-all ${
                filterStatus === "completed"
                  ? "bg-navy text-chalk border-line-dark"
                  : "bg-paper text-muted border-line hover:text-navy"
              }`}
            >
              Completed
            </button>
            <button
              onClick={() => setFilterStatus("failed")}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold uppercase tracking-wider border transition-all ${
                filterStatus === "failed"
                  ? "bg-navy text-chalk border-line-dark"
                  : "bg-paper text-muted border-line hover:text-navy"
              }`}
            >
              Failed
            </button>
          </div>

          {/* Sorting */}
          <div className="flex items-center gap-2 w-full sm:w-auto">
            <ArrowUpDown className="w-4 h-4 text-muted shrink-0" />
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="w-full sm:w-auto px-3 py-2 border border-line rounded-lg bg-paper text-navy focus:border-gold focus:outline-none text-xs font-semibold transition-colors"
            >
              <option value="newest">Newest first</option>
              <option value="best">Highest score</option>
              <option value="worst">Lowest score</option>
            </select>
          </div>
        </div>
      )}

      {/* Main List */}
      {loading ? (
        <div className="space-y-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-20 bg-paper-warm/30 rounded-2xl border border-line animate-pulse" />
          ))}
        </div>
      ) : filteredReviews.length === 0 ? (
        <EmptyState
          title={reviews.length === 0 ? "History is empty" : "No results found"}
          description={
            reviews.length === 0
              ? "Upload a presentation file (PDF, Word, or PowerPoint) in the 'New Review' section to have the AI analyze your project."
              : "Try changing your filters or sorting options."
          }
          icon={Sparkles}
          actionLabel={reviews.length === 0 ? "Start Review" : undefined}
          onAction={reviews.length === 0 ? () => router.push("/dashboard/new-review") : undefined}
        />
      ) : (
        <div className="space-y-3">
          {filteredReviews.map((rev) => (
            <ReviewCard key={rev.id} review={rev} onDelete={handleDeleteClick} />
          ))}
        </div>
      )}

      {/* Delete Confirmation Dialog */}
      <ConfirmDialog
        isOpen={!!deleteId}
        title="Delete this review?"
        description="This action will delete the AI report and all chat history for this review from the IndexedDB database. This action cannot be undone."
        confirmLabel="Yes, delete"
        cancelLabel="Cancel"
        isDestructive
        onConfirm={handleConfirmDelete}
        onCancel={() => setDeleteId(null)}
      />
    </div>
  );
}
