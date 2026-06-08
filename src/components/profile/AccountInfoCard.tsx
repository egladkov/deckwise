"use client";

import React, { useEffect } from "react";
import { useAuthStore } from "../../stores/auth.store";
import { useSubscriptionStore } from "../../stores/subscription.store";
import { Key, Calendar, CreditCard, Shield } from "lucide-react";
import { PlanBadge } from "../dashboard/PlanBadge";

export const AccountInfoCard: React.FC = () => {
  const { session } = useAuthStore();
  const { subscription, fetchSubscription } = useSubscriptionStore();

  useEffect(() => {
    fetchSubscription();
  }, [fetchSubscription]);

  const dateFormatted = session?.user?.createdAt
    ? new Date(session.user.createdAt).toLocaleDateString("en-US", {
        day: "numeric",
        month: "long",
        year: "numeric",
      })
    : "Unknown";

  return (
    <div className="border border-line rounded-2xl bg-paper-warm/50 p-6 sm:p-8 animate-fade-up max-w-2xl font-sans">
      <div className="mb-6">
        <h3 className="text-2xl font-display text-navy mb-1">Account Info</h3>
        <p className="text-sm text-muted">System metadata and security settings of your account.</p>
      </div>

      <div className="space-y-4">
        {/* Account ID */}
        <div className="flex items-center justify-between border-b border-line/50 pb-3">
          <div className="flex items-center gap-3">
            <Key className="w-5 h-5 text-gold shrink-0" />
            <div>
              <span className="text-xs text-muted block leading-none">Account ID</span>
              <span className="text-sm font-mono text-navy font-semibold mt-1 block">
                {session?.user?.id || "N/A"}
              </span>
            </div>
          </div>
        </div>

        {/* Registration Date */}
        <div className="flex items-center justify-between border-b border-line/50 pb-3">
          <div className="flex items-center gap-3">
            <Calendar className="w-5 h-5 text-gold shrink-0" />
            <div>
              <span className="text-xs text-muted block leading-none">Registration Date</span>
              <span className="text-sm text-navy font-semibold mt-1 block">{dateFormatted}</span>
            </div>
          </div>
        </div>

        {/* Current Plan */}
        <div className="flex items-center justify-between border-b border-line/50 pb-3">
          <div className="flex items-center gap-3">
            <CreditCard className="w-5 h-5 text-gold shrink-0" />
            <div>
              <span className="text-xs text-muted block leading-none">Current Subscription</span>
              <div className="mt-1.5 flex items-center gap-2">
                {subscription && <PlanBadge planId={subscription.planId} />}
              </div>
            </div>
          </div>
        </div>

        {/* Auth Level */}
        <div className="flex items-center justify-between pb-1">
          <div className="flex items-center gap-3">
            <Shield className="w-5 h-5 text-gold shrink-0" />
            <div>
              <span className="text-xs text-muted block leading-none">Access Level</span>
              <span className="text-sm text-navy font-semibold mt-1 block">
                {subscription?.planId === "series-a" ? "Series A+ (Full Access)" : subscription?.planId === "seed" ? "Seed Access" : subscription?.planId === "pre-seed" ? "Pre-Seed Access" : "Basic Access"}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
