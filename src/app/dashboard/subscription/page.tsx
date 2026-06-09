"use client";

import React, { useEffect, useState } from "react";
import { useSubscriptionStore } from "../../../stores/subscription.store";
import { CurrentPlanCard } from "../../../components/subscription/CurrentPlanCard";
import { PricingCard } from "../../../components/subscription/PricingCard";
import { PaymentModal } from "../../../components/subscription/PaymentModal";
import { CreditCard, ShieldCheck } from "lucide-react";
import { PlanId, Plan } from "../../../types";

export default function SubscriptionPage() {
  const {
    subscription,
    plans,
    fetchSubscription,
    fetchPlans,
    changePlan,
    loading,
  } = useSubscriptionStore();

  const [selectedPlanForPayment, setSelectedPlanForPayment] = useState<Plan | null>(null);

  useEffect(() => {
    fetchSubscription();
    fetchPlans();
  }, [fetchSubscription, fetchPlans]);

  const handlePlanSelect = (planId: PlanId) => {
    const targetPlan = plans.find((p) => p.id === planId);
    if (targetPlan) {
      setSelectedPlanForPayment(targetPlan);
    }
  };

  const handlePaymentConfirm = async () => {
    if (selectedPlanForPayment) {
      await changePlan(selectedPlanForPayment.id);
      setSelectedPlanForPayment(null);
    }
  };

  const handlePaymentCancel = () => {
    setSelectedPlanForPayment(null);
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

      <PaymentModal
        isOpen={selectedPlanForPayment !== null}
        plan={selectedPlanForPayment}
        onConfirm={handlePaymentConfirm}
        onCancel={handlePaymentCancel}
      />
    </div>
  );
}

