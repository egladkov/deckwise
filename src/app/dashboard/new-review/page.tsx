"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useDeckStore } from "../../../stores/deck.store";
import { useSubscriptionStore } from "../../../stores/subscription.store";
import { UploadDeckCard } from "../../../components/dashboard/UploadDeckCard";
import { FormSection } from "../../../components/shared/FormSection";
import { ArrowLeft, Sparkles, Loader2, Play } from "lucide-react";
import Link from "next/link";

export default function NewReviewPage() {
  const router = useRouter();
  const { runAnalysis, analysisStatus, error, loading, reviews, fetchReviews } = useDeckStore();
  const { fetchSubscription, subscription } = useSubscriptionStore();

  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [formData, setFormData] = useState({
    startupName: "",
    industry: "",
    stage: "Pre-seed",
    targetRaise: "",
    targetInvestors: "",
    comment: "",
  });

  useEffect(() => {
    fetchSubscription();
    fetchReviews();
  }, [fetchSubscription, fetchReviews]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (file: File | null) => {
    setSelectedFile(file);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedFile) return;

    const review = await runAnalysis(selectedFile, formData);
    if (review) {
      router.push(`/dashboard/reviews/${review.id}`);
    }
  };

  const isRevision = reviews.some(
    (r) =>
      r.startupContext?.startupName?.toLowerCase().trim() ===
      formData.startupName.toLowerCase().trim()
  );

  let limitReached = false;
  let limitMessage = "";

  if (subscription && formData.startupName.trim()) {
    if (isRevision) {
      if (subscription.revisionsLimit !== -1 && subscription.revisionsUsed >= subscription.revisionsLimit) {
        limitReached = true;
        limitMessage = `Revisions limit reached (${subscription.revisionsUsed}/${subscription.revisionsLimit}) for "${formData.startupName.trim()}". Please upgrade your subscription.`;
      }
    } else {
      if (subscription.reviewsLimit !== -1 && subscription.reviewsUsed >= subscription.reviewsLimit) {
        limitReached = true;
        limitMessage = `Plan decks limit reached (${subscription.reviewsUsed}/${subscription.reviewsLimit}). Please upgrade your subscription or upload a revision of an existing deck.`;
      }
    }
  }

  const stages = [
    "Idea",
    "Pre-seed",
    "Seed",
    "Series A",
    "Series B+",
    "Bootstrap / Profitable",
  ];

  const isAnalyzing = ["uploading", "extracting", "analyzing", "generating"].includes(analysisStatus);

  if (isAnalyzing) {
    const statusMessages = {
      uploading: "Uploading presentation file to temporary memory...",
      extracting: "Extracting text layers and slide structures...",
      analyzing: "Running AI audit based on venture capital standards...",
      generating: "Generating detailed report and investor questions...",
      completed: "Done! Redirecting to report...",
      failed: "Analysis failed.",
      idle: "",
    };

    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center font-sans max-w-xl mx-auto text-center space-y-6 animate-fade-up">
        {/* Animated Scanning Area */}
        <div className="relative w-48 h-48 border border-line rounded-2xl bg-paper-warm/30 overflow-hidden flex items-center justify-center shadow-inner">
          <div className="absolute inset-x-0 h-0.5 bg-gold/60 shadow-[0_0_10px_rgba(201,162,39,0.8)] animate-scan" />
          <div className="w-16 h-16 rounded-xl bg-navy text-gold flex items-center justify-center border border-gold/30">
            <Sparkles className="w-8 h-8 animate-pulse-gold" />
          </div>
        </div>

        <div className="space-y-2">
          <h2 className="text-2xl font-display font-bold text-navy leading-none">
            Analyzing your project
          </h2>
          <p className="text-xs text-muted font-mono uppercase tracking-widest animate-pulse">
            {analysisStatus === "uploading" ? "Step 1 of 3" : analysisStatus === "extracting" ? "Step 2 of 3" : "Step 3 of 3"}
          </p>
          <p className="text-sm text-navy max-w-md mx-auto pt-2">
            {statusMessages[analysisStatus as keyof typeof statusMessages] || "Processing..."}
          </p>
        </div>

        <div className="flex items-center justify-center gap-2 text-xs text-muted">
          <Loader2 className="w-4 h-4 animate-spin text-gold" />
          <span>Please do not close this tab. This may take up to 15 seconds.</span>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 font-sans">
      {/* Header Back */}
      <div className="flex items-center gap-3 animate-fade-up">
        <Link
          href="/dashboard"
          className="p-2 border border-line rounded-xl bg-paper hover:bg-paper-warm text-navy transition-colors shrink-0"
        >
          <ArrowLeft className="w-4 h-4" />
        </Link>
        <div>
          <span className="text-xs text-muted font-mono uppercase tracking-wider block">New Review</span>
          <h1 className="text-2xl sm:text-3xl font-display font-bold text-navy leading-none">
            Launch VC Audit
          </h1>
        </div>
      </div>

      {/* Main Form container */}
      <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
        {/* Left column: Context */}
        <div className="lg:col-span-2 space-y-6">
          <FormSection
            title="Startup Context"
            description="Provide startup context details. This helps the AI calibrate investor expectations specifically for your industry and stage."
          >
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Startup Name */}
              <div>
                <label className="block text-xs font-semibold text-navy uppercase tracking-wider mb-1.5">
                  Startup Name
                </label>
                <input
                  type="text"
                  name="startupName"
                  required
                  placeholder="e.g. Deckwise AI"
                  value={formData.startupName}
                  onChange={handleChange}
                  className="w-full px-3 py-2.5 border border-line rounded-xl bg-paper text-navy placeholder:text-muted/40 focus:border-gold focus:outline-none text-sm transition-colors"
                />
              </div>

              {/* Industry */}
              <div>
                <label className="block text-xs font-semibold text-navy uppercase tracking-wider mb-1.5">
                  Industry / Niche
                </label>
                <input
                  type="text"
                  name="industry"
                  required
                  placeholder="e.g. AI SaaS, B2B SaaS"
                  value={formData.industry}
                  onChange={handleChange}
                  className="w-full px-3 py-2.5 border border-line rounded-xl bg-paper text-navy placeholder:text-muted/40 focus:border-gold focus:outline-none text-sm transition-colors"
                />
              </div>

              {/* Stage */}
              <div>
                <label className="block text-xs font-semibold text-navy uppercase tracking-wider mb-1.5">
                  Current Startup Stage
                </label>
                <select
                  name="stage"
                  value={formData.stage}
                  onChange={handleChange}
                  className="w-full px-3 py-2.5 border border-line rounded-xl bg-paper text-navy focus:border-gold focus:outline-none text-sm transition-colors"
                >
                  {stages.map((st) => (
                    <option key={st} value={st}>
                      {st}
                    </option>
                  ))}
                </select>
              </div>

              {/* Target Raise */}
              <div>
                <label className="block text-xs font-semibold text-navy uppercase tracking-wider mb-1.5">
                  Target Raise Amount
                </label>
                <input
                  type="text"
                  name="targetRaise"
                  required
                  placeholder="e.g. $500,000"
                  value={formData.targetRaise}
                  onChange={handleChange}
                  className="w-full px-3 py-2.5 border border-line rounded-xl bg-paper text-navy placeholder:text-muted/40 focus:border-gold focus:outline-none text-sm transition-colors"
                />
              </div>

              {/* Target Investors */}
              <div className="sm:col-span-2">
                <label className="block text-xs font-semibold text-navy uppercase tracking-wider mb-1.5">
                  Target Investors
                </label>
                <input
                  type="text"
                  name="targetInvestors"
                  required
                  placeholder="e.g. AI angel investors, US pre-seed VCs"
                  value={formData.targetInvestors}
                  onChange={handleChange}
                  className="w-full px-3 py-2.5 border border-line rounded-xl bg-paper text-navy placeholder:text-muted/40 focus:border-gold focus:outline-none text-sm transition-colors"
                />
              </div>

              {/* Optional Comment */}
              <div className="sm:col-span-2">
                <label className="block text-xs font-semibold text-navy uppercase tracking-wider mb-1.5">
                  Comment for AI Analyst (optional)
                </label>
                <textarea
                  name="comment"
                  rows={3}
                  placeholder="Describe any specific concerns, focal points, or slides you'd like the AI to examine closely."
                  value={formData.comment}
                  onChange={handleChange}
                  className="w-full px-3 py-2.5 border border-line rounded-xl bg-paper text-navy placeholder:text-muted/40 focus:border-gold focus:outline-none text-sm transition-colors resize-none"
                />
              </div>
            </div>
          </FormSection>
        </div>

        {/* Right column: PDF Upload & Launch button */}
        <div className="space-y-6">
          <div className="border border-line rounded-2xl bg-paper-warm/50 p-6 flex flex-col justify-between min-h-[300px]">
            <div>
              <h3 className="text-xl font-display font-semibold text-navy mb-4">Presentation File</h3>
              <UploadDeckCard
                onFileSelect={handleFileChange}
                selectedFile={selectedFile}
              />
            </div>

            {error && (
              <p className="mt-4 text-xs font-medium text-burgundy bg-burgundy/5 px-3 py-1.5 rounded-lg border border-burgundy/20 animate-fade-up">
                {error}
              </p>
            )}

            {subscription && limitReached && (
              <p className="mt-4 text-xs font-medium text-burgundy bg-burgundy/5 px-3 py-1.5 rounded-lg border border-burgundy/20 animate-fade-up">
                {limitMessage}
              </p>
            )}

            <button
              type="submit"
              disabled={
                !selectedFile ||
                loading ||
                limitReached
              }
              className="mt-6 w-full py-4 bg-navy hover:bg-navy-soft disabled:bg-paper-deep text-chalk hover:text-gold disabled:text-muted text-xs font-semibold uppercase tracking-wider rounded-xl border border-line-dark shadow-md transition-all hover:-translate-y-0.5 flex items-center justify-center gap-2"
            >
              <Play className="w-4 h-4" />
              <span>Launch AI Analysis</span>
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}
