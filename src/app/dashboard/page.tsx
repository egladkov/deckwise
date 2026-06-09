"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useDeckStore } from "../../stores/deck.store";
import { useUserStore } from "../../stores/user.store";
import { useSubscriptionStore } from "../../stores/subscription.store";
import { ReviewCard } from "../../components/dashboard/ReviewCard";
import { EmptyState } from "../../components/shared/EmptyState";
import { ConfirmDialog } from "../../components/shared/ConfirmDialog";
import {
  Sparkles,
  History,
  TrendingUp,
  Award,
  PlusCircle,
  FileCheck,
} from "lucide-react";

export default function OverviewPage() {
  const router = useRouter();
  const { user, fetchUser } = useUserStore();
  const { subscription, fetchSubscription } = useSubscriptionStore();
  const { reviews, fetchReviews, deleteReview, loading } = useDeckStore();

  const [deleteId, setDeleteId] = useState<string | null>(null);

  useEffect(() => {
    fetchUser();
    fetchSubscription();
    fetchReviews();
  }, [fetchUser, fetchSubscription, fetchReviews]);

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

  // Compute KPI stats
  const completedReviews = reviews.filter((r) => r.status === "completed");
  const averageScore =
    completedReviews.length > 0
      ? Math.round(
          completedReviews.reduce((sum, r) => sum + r.overallScore, 0) /
            completedReviews.length
        )
      : 0;

  const latestReviewDate =
    reviews.length > 0
      ? new Date(reviews[0].createdAt).toLocaleDateString("en-US", {
          day: "numeric",
          month: "short",
        })
      : "—";

  return (
    <div className="space-y-8 font-sans">
      {/* Welcome banner */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-paper-warm/40 border border-line rounded-2xl p-6 sm:p-8 animate-fade-up">
        <div>
          <h1 className="text-3xl font-display font-bold text-navy leading-none mb-2">
            Hello, {user?.name || "founder"}!
          </h1>
          <p className="text-sm text-muted">
            Welcome to Deckwise AI. Let's prepare your pitch deck for meetings with investors.
          </p>
        </div>
        <Link
          href="/dashboard/new-review"
          className="inline-flex items-center gap-2 px-5 py-3 bg-navy hover:bg-navy-soft text-chalk text-xs font-semibold uppercase tracking-wider rounded-xl border border-line-dark shadow-md transition-all hover:-translate-y-0.5 shrink-0"
        >
          <PlusCircle className="w-4 h-4 text-gold" />
          <span>New Review</span>
        </Link>
      </div>

      {/* KPI stats grid */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        {/* Total analyses */}
        <div className="border border-line rounded-2xl bg-paper p-5 flex items-center gap-4 shadow-sm animate-fade-up">
          <div className="w-12 h-12 rounded-xl bg-gold/10 text-gold border border-gold/20 flex items-center justify-center shrink-0">
            <FileCheck className="w-6 h-6" />
          </div>
          <div>
            <span className="text-xs text-muted block font-mono uppercase tracking-wider leading-none">Total Reviews</span>
            <span className="text-2xl font-bold text-navy mt-1 block font-mono">
              {completedReviews.length}
            </span>
          </div>
        </div>

        {/* Average score */}
        <div className="border border-line rounded-2xl bg-paper p-5 flex items-center gap-4 shadow-sm animate-fade-up">
          <div className="w-12 h-12 rounded-xl bg-gold/10 text-gold border border-gold/20 flex items-center justify-center shrink-0">
            <Award className="w-6 h-6" />
          </div>
          <div>
            <span className="text-xs text-muted block font-mono uppercase tracking-wider leading-none">Average Score</span>
            <span className="text-2xl font-bold text-navy mt-1 block font-mono">
              {averageScore > 0 ? `${averageScore}/100` : "—"}
            </span>
          </div>
        </div>

        {/* Limit remaining */}
        <div className="border border-line rounded-2xl bg-paper p-5 flex items-center gap-4 shadow-sm animate-fade-up">
          <div className="w-12 h-12 rounded-xl bg-gold/10 text-gold border border-gold/20 flex items-center justify-center shrink-0">
            <TrendingUp className="w-6 h-6" />
          </div>
          <div>
            <span className="text-xs text-muted block font-mono uppercase tracking-wider leading-none">Plan Limits</span>
            <span className="text-[13px] font-bold text-navy mt-1.5 block font-mono leading-tight">
              {subscription ? (
                subscription.reviewsLimit === -1 ? (
                  "Unlimited"
                ) : (
                  <>
                    Decks: {subscription.reviewsUsed}/{subscription.reviewsLimit}
                    <br />
                    Revisions: {subscription.revisionsUsed}/{subscription.revisionsLimit}
                  </>
                )
              ) : "—"}
            </span>
          </div>
        </div>
      </div>

      {/* Recent Reviews section */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <History className="w-5 h-5 text-gold" />
            <h3 className="text-xl font-display font-semibold text-navy">Recent Reviews</h3>
          </div>
          {reviews.length > 3 && (
            <Link
              href="/dashboard/reviews"
              className="text-xs font-semibold text-gold hover:text-gold-soft transition-colors"
            >
              View all history
            </Link>
          )}
        </div>

        {loading ? (
          <div className="space-y-3">
            {[1, 2].map((i) => (
              <div key={i} className="h-20 bg-paper-warm/30 rounded-2xl border border-line animate-pulse" />
            ))}
          </div>
        ) : reviews.length === 0 ? (
          <EmptyState
            title="Review history is empty"
            description="Upload your first startup pitch deck (PDF, Word, or PowerPoint) to run an automated VC audit."
            icon={Sparkles}
            actionLabel="Start Review"
            onAction={() => router.push("/dashboard/new-review")}
          />
        ) : (
          <div className="space-y-3">
            {reviews.slice(0, 3).map((rev) => (
              <ReviewCard key={rev.id} review={rev} onDelete={handleDeleteClick} />
            ))}
          </div>
        )}
      </div>

      {/* Delete Confirmation Dialog */}
      <ConfirmDialog
        isOpen={!!deleteId}
        title="Delete this review?"
        description="This action will delete the AI report and the entire chat history associated with this review from the IndexedDB database. This action cannot be undone."
        confirmLabel="Yes, delete"
        cancelLabel="Cancel"
        isDestructive
        onConfirm={handleConfirmDelete}
        onCancel={() => setDeleteId(null)}
      />
    </div>
  );
}
