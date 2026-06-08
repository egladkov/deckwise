"use client";

import React, { useState } from "react";
import { useSubscriptionStore } from "../../stores/subscription.store";
import { AlertCircle, CreditCard, Calendar } from "lucide-react";
import { ConfirmDialog } from "../shared/ConfirmDialog";
import { PLANS } from "../../constants";

export const CurrentPlanCard: React.FC = () => {
  const { subscription, cancelSubscription, loading } = useSubscriptionStore();
  const [isCancelDialogOpen, setIsCancelDialogOpen] = useState(false);

  if (!subscription) return null;

  const planInfo = PLANS[subscription.planId];

  const handleCancelClick = () => {
    setIsCancelDialogOpen(true);
  };

  const handleCancelConfirm = async () => {
    setIsCancelDialogOpen(false);
    await cancelSubscription();
  };

  const statusLabels = {
    active: "Active",
    cancelled: "Cancelled (active until end of period)",
    past_due: "Payment Required",
  };

  const statusColors = {
    active: "text-sage bg-sage/5 border-sage/20",
    cancelled: "text-burgundy/80 bg-burgundy/5 border-burgundy/15",
    past_due: "text-burgundy bg-burgundy/5 border-burgundy/20",
  };

  return (
    <div className="border border-line rounded-2xl bg-paper-warm/50 p-6 sm:p-8 animate-fade-up max-w-2xl font-sans">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-line/50 pb-6 mb-6">
        <div>
          <span className="text-xs text-muted uppercase tracking-wider font-mono">Your Subscription</span>
          <h3 className="text-3xl font-display text-navy font-bold mt-1">
            {planInfo.name} Plan
          </h3>
        </div>
        <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold border ${statusColors[subscription.billingStatus]}`}>
          {statusLabels[subscription.billingStatus]}
        </span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-6">
        {/* Billing Period */}
        <div className="flex items-start gap-3">
          <Calendar className="w-5 h-5 text-gold shrink-0 mt-0.5" />
          <div>
            <span className="text-xs text-muted block leading-none">Next Payment</span>
            <span className="text-sm font-semibold text-navy mt-1 block">
              {subscription.billingStatus === "cancelled" ? "Expires: " : ""}
              {new Date(subscription.nextBillingDate).toLocaleDateString("en-US", {
                day: "numeric",
                month: "long",
                year: "numeric",
              })}
            </span>
          </div>
        </div>

        {/* Payment Method */}
        <div className="flex items-start gap-3">
          <CreditCard className="w-5 h-5 text-gold shrink-0 mt-0.5" />
          <div>
            <span className="text-xs text-muted block leading-none">Payment Method</span>
            <span className="text-sm font-semibold text-navy mt-1 block">
              {subscription.planId === "bootstrapper" ? "Mock Payment" : subscription.paymentMethod || "Visa **** 4242"}
            </span>
          </div>
        </div>
      </div>

      {/* Warning if cancelled */}
      {subscription.billingStatus === "cancelled" && (
        <div className="mb-6 flex gap-3 p-4 bg-burgundy/5 border border-burgundy/15 rounded-xl text-burgundy text-xs leading-relaxed">
          <AlertCircle className="w-5 h-5 shrink-0" />
          <p>
            Your subscription has been cancelled. After it expires, your account will revert to the Bootstrapper plan, and some analysis features and histories may become limited.
          </p>
        </div>
      )}

      {/* Action Buttons */}
      {subscription.planId !== "bootstrapper" && subscription.billingStatus === "active" && (
        <div className="flex justify-end pt-4 border-t border-line/50">
          <button
            type="button"
            onClick={handleCancelClick}
            disabled={loading}
            className="px-4 py-2 border border-burgundy/20 hover:bg-burgundy/10 text-burgundy text-xs font-semibold rounded-xl transition-all"
          >
            Cancel Subscription
          </button>
        </div>
      )}

      {/* Confirmation Dialog */}
      <ConfirmDialog
        isOpen={isCancelDialogOpen}
        title="Cancel Subscription?"
        description="You will lose access to detailed reports, deep AI analysis, and the report consultant chat after the billing period ends. You can reverse this action at any time before the expiration date."
        confirmLabel="Yes, Cancel"
        cancelLabel="Keep Subscription"
        isDestructive
        onConfirm={handleCancelConfirm}
        onCancel={() => setIsCancelDialogOpen(false)}
      />
    </div>
  );
};
