"use client";

import React, { useEffect, useState, useRef } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useDeckStore } from "../../../../stores/deck.store";
import { useSubscriptionStore } from "../../../../stores/subscription.store";
import { ReportScore } from "../../../../components/review/ReportScore";
import { ReviewSummary } from "../../../../components/review/ReviewSummary";
import { SlideFeedback } from "../../../../components/review/SlideFeedback";
import { InvestorQuestions } from "../../../../components/review/InvestorQuestions";
import {
  ArrowLeft,
  MessageSquare,
  Sparkles,
  Send,
  Lock,
  Loader2,
  Trash2,
  RefreshCw,
} from "lucide-react";
import { ConfirmDialog } from "../../../../components/shared/ConfirmDialog";

export default function ReviewDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;

  const {
    currentReview,
    fetchReviewById,
    deleteReview,
    chatMessages,
    fetchChatMessages,
    askQuestion,
    clearChat,
    chatLoading,
    chatError,
    loading,
    error,
  } = useDeckStore();

  const { subscription, fetchSubscription } = useSubscriptionStore();

  const [activeTab, setActiveTab] = useState<"summary" | "slides" | "questions">("summary");
  const [questionText, setQuestionText] = useState("");
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    fetchSubscription();
    if (id) {
      fetchReviewById(id);
      fetchChatMessages(id);
    }
  }, [id, fetchReviewById, fetchChatMessages, fetchSubscription]);

  // Scroll chat down on new messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chatMessages]);

  const handleDeleteConfirm = async () => {
    setDeleteDialogOpen(false);
    const success = await deleteReview(id);
    if (success) {
      router.push("/dashboard/reviews");
    }
  };

  const handleSendQuestion = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!questionText.trim() || chatLoading) return;

    const query = questionText;
    setQuestionText("");
    await askQuestion(id, query);
  };

  if (loading) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center font-sans">
        <Loader2 className="w-8 h-8 animate-spin text-gold mb-3" />
        <span className="text-xs text-muted font-mono uppercase tracking-wider animate-pulse">
          Loading report...
        </span>
      </div>
    );
  }

  if (error || !currentReview) {
    return (
      <div className="min-h-[50vh] flex flex-col items-center justify-center font-sans text-center max-w-md mx-auto space-y-4">
        <h3 className="text-2xl font-display font-bold text-navy">Report not found</h3>
        <p className="text-sm text-muted">
          The requested pitch deck review was deleted or never existed.
        </p>
        <Link
          href="/dashboard/reviews"
          className="px-4 py-2 border border-line bg-paper hover:bg-paper-warm text-navy text-xs font-semibold rounded-xl"
        >
          Back to history
        </Link>
      </div>
    );
  }

  const isChatDisabled = subscription?.planId === "free";

  return (
    <div className="space-y-6 font-sans">
      {/* Top action bar */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-line/60 pb-5 animate-fade-up">
        <div className="flex items-center gap-3">
          <Link
            href="/dashboard/reviews"
            className="p-2 border border-line rounded-xl bg-paper hover:bg-paper-warm text-navy transition-colors shrink-0"
          >
            <ArrowLeft className="w-4 h-4" />
          </Link>
          <div>
            <span className="text-[10px] text-muted font-mono uppercase tracking-wider block">AI Audit Report</span>
            <h1 className="text-xl sm:text-2xl font-display font-bold text-navy leading-none break-all max-w-[280px] sm:max-w-[500px]">
              {currentReview.startupContext?.startupName || "Project Audit"}
            </h1>
          </div>
        </div>

        <div className="flex items-center gap-2 self-stretch sm:self-auto justify-end">
          <button
            onClick={() => setDeleteDialogOpen(true)}
            className="p-2.5 rounded-xl border border-line bg-paper text-burgundy hover:bg-burgundy/10 transition-colors"
            title="Delete report"
          >
            <Trash2 className="w-4 h-4" />
          </button>
          
          <Link
            href="/dashboard/new-review"
            className="inline-flex items-center gap-2 px-4 py-2.5 bg-paper hover:bg-paper-warm text-navy text-xs font-semibold rounded-xl border border-line shadow-sm transition-all"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Analyze Again</span>
          </Link>
        </div>
      </div>

      {/* Main Two-Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        {/* Left column: Report (2/3 width) */}
        <div className="lg:col-span-2 space-y-6">
          {/* Section Score Card */}
          <ReportScore score={currentReview.overallScore} grade={currentReview.grade} />

          {/* Navigation Tabs */}
          <div className="flex border-b border-line">
            <button
              onClick={() => setActiveTab("summary")}
              className={`px-4 py-3 text-xs font-semibold uppercase tracking-wider border-b-2 transition-all ${
                activeTab === "summary"
                  ? "border-gold text-navy font-bold"
                  : "border-transparent text-muted hover:text-navy"
              }`}
            >
              VC Summary
            </button>
            <button
              onClick={() => setActiveTab("slides")}
              className={`px-4 py-3 text-xs font-semibold uppercase tracking-wider border-b-2 transition-all ${
                activeTab === "slides"
                  ? "border-gold text-navy font-bold"
                  : "border-transparent text-muted hover:text-navy"
              }`}
            >
              Slides ({currentReview.slideFeedback.length})
            </button>
            <button
              onClick={() => setActiveTab("questions")}
              className={`px-4 py-3 text-xs font-semibold uppercase tracking-wider border-b-2 transition-all ${
                activeTab === "questions"
                  ? "border-gold text-navy font-bold"
                  : "border-transparent text-muted hover:text-navy"
              }`}
            >
              Preparation
            </button>
          </div>

          {/* Tab Views */}
          {activeTab === "summary" && (
            <ReviewSummary
              summary={currentReview.summary}
              strengths={currentReview.strengths}
              weaknesses={currentReview.weaknesses}
              missingSignals={currentReview.missingSignals}
            />
          )}

          {activeTab === "slides" && (
            <SlideFeedback slides={currentReview.slideFeedback} />
          )}

          {activeTab === "questions" && (
            <InvestorQuestions questions={currentReview.investorQuestions} />
          )}
        </div>

        {/* Right column: AI Chat Sidebar (1/3 width) */}
        <div className="lg:sticky lg:top-20 space-y-6">
          <div className="border border-line rounded-2xl bg-paper p-5 flex flex-col h-[550px] shadow-sm">
            {/* Chat header */}
            <div className="flex items-center gap-2 border-b border-line/60 pb-3 mb-3 shrink-0">
              <MessageSquare className="w-5 h-5 text-gold" />
              <div>
                <h4 className="font-display font-semibold text-navy text-base">AI Analyst</h4>
                <span className="text-[10px] text-muted font-mono uppercase tracking-wider block">Report Consultation</span>
              </div>
            </div>

            {/* Chat Messages flow */}
            <div className="flex-1 overflow-y-auto space-y-3 pr-1 py-2 text-xs">
              {chatMessages.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-center p-4 text-muted space-y-2">
                  <Sparkles className="w-8 h-8 text-gold/60 animate-pulse" />
                  <p className="font-sans leading-relaxed">
                    Ask the AI about the report details! For example:<br />
                    <span className="italic">"How can I improve the market slide?"</span> or <span className="italic">"What objections might investors have regarding our CAC?"</span>
                  </p>
                </div>
              ) : (
                chatMessages.map((msg) => (
                  <div
                    key={msg.id}
                    className={`flex flex-col p-3 rounded-xl max-w-[85%] ${
                      msg.sender === "user"
                        ? "bg-paper-deep text-navy ml-auto border border-line"
                        : "bg-navy-soft/5 text-navy mr-auto border border-line-dark/10"
                    }`}
                  >
                    <span className="font-mono text-[9px] uppercase tracking-wider text-muted mb-1 font-semibold">
                      {msg.sender === "user" ? "You" : "Deckwise Analyst"}
                    </span>
                    <p className="font-sans leading-relaxed whitespace-pre-wrap">{msg.content}</p>
                  </div>
                ))
              )}
              {chatLoading && (
                <div className="flex items-center gap-2 text-muted bg-paper p-3 rounded-xl border border-line mr-auto max-w-[85%] animate-pulse">
                  <Loader2 className="w-3.5 h-3.5 animate-spin text-gold shrink-0" />
                  <span>Typing response...</span>
                </div>
              )}
              {chatError && (
                <div className="p-3 rounded-xl bg-burgundy/5 border border-burgundy/15 text-burgundy text-[11px] leading-relaxed">
                  {chatError}
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Chat Input or Upgrade prompt */}
            {isChatDisabled ? (
              <div className="mt-4 border-t border-line/65 pt-4 shrink-0 flex flex-col items-center justify-center text-center space-y-3 bg-paper-warm/30 p-3 rounded-xl border border-line">
                <Lock className="w-7 h-7 text-gold shrink-0" />
                <div>
                  <h5 className="font-semibold text-navy text-xs uppercase tracking-wider">Chat Locked</h5>
                  <p className="text-[10px] text-muted leading-tight mt-1 max-w-[180px]">
                    Access to the AI report consultant is only available on Pro and Investor plans.
                  </p>
                </div>
                <Link
                  href="/dashboard/subscription"
                  className="px-3.5 py-2 bg-gold hover:bg-gold-soft text-navy text-[10px] uppercase font-mono font-bold rounded-lg border border-gold-soft/50 shadow-sm"
                >
                  Upgrade Plan
                </Link>
              </div>
            ) : (
              <form onSubmit={handleSendQuestion} className="mt-3 pt-3 border-t border-line/60 shrink-0 flex gap-2">
                <input
                  type="text"
                  placeholder="Ask AI a question..."
                  value={questionText}
                  onChange={(e) => setQuestionText(e.target.value)}
                  disabled={chatLoading}
                  className="flex-1 px-3 py-2.5 border border-line rounded-xl bg-paper text-navy placeholder:text-muted/50 focus:border-gold focus:outline-none text-xs transition-colors"
                />
                <button
                  type="submit"
                  disabled={!questionText.trim() || chatLoading}
                  className="p-2.5 bg-navy hover:bg-navy-soft disabled:bg-paper-deep text-chalk hover:text-gold disabled:text-muted rounded-xl border border-line-dark shadow-sm transition-all shrink-0"
                >
                  <Send className="w-4 h-4" />
                </button>
              </form>
            )}
          </div>
        </div>
      </div>

      {/* Delete Confirmation */}
      <ConfirmDialog
        isOpen={deleteDialogOpen}
        title="Delete this review?"
        description="This will permanently delete the report and chat history from IndexedDB. This action cannot be undone."
        confirmLabel="Yes, delete"
        cancelLabel="Cancel"
        isDestructive
        onConfirm={handleDeleteConfirm}
        onCancel={() => setDeleteDialogOpen(false)}
      />
    </div>
  );
}
