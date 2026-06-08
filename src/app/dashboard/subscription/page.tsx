"use client";

import React, { useEffect } from "react";
import { useSubscriptionStore } from "../../../stores/subscription.store";
import { CurrentPlanCard } from "../../../components/subscription/CurrentPlanCard";
import { PricingCard } from "../../../components/subscription/PricingCard";
import { CreditCard, ShieldCheck } from "lucide-react";
import { PlanId } from "../../../types";

export default function SubscriptionPage() {
  const {
    subscription,
    plans,
    fetchSubscription,
    fetchPlans,
    changePlan,
    loading,
  } = useSubscriptionStore();

  useEffect(() => {
    fetchSubscription();
    fetchPlans();
  }, [fetchSubscription, fetchPlans]);

  const handlePlanSelect = async (planId: PlanId) => {
    if (confirm("Do you want to switch to this plan? (This is a mock operation, no actual payment will be processed)")) {
      await changePlan(planId);
    }
  };

  return (
    <div className="space-y-6 font-sans">
      {/* Title */}
      <div className="flex items-center gap-2 mb-6 animate-fade-up">
        <CreditCard className="w-6 h-6 text-gold" />
        <h1 className="text-2xl sm:text-3xl font-display font-bold text-navy leading-none">
          Manage Subscription
        </h1>
      </div>

      <div className="space-y-8">
        {/* Current subscription status */}
        <CurrentPlanCard />

        {/* Pricing tiers comparison list */}
        <div className="space-y-6">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-gold shrink-0" />
            <h3 className="text-xl font-display font-semibold text-navy">
              Available Pricing Plans
            </h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 items-stretch">
            {plans.map((plan) => (
              <PricingCard
                key={plan.id}
                plan={plan}
                isCurrent={subscription?.planId === plan.id}
                onSelect={handlePlanSelect}
                loading={loading}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
