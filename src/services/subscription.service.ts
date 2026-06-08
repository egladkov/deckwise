import { createClient } from "../lib/supabase/client";
import { PLANS } from "../constants";
import { Plan, PlanId, ServiceResult, Subscription } from "../types";

export const subscriptionService = {
  async getCurrentSubscription(): Promise<ServiceResult<Subscription>> {
    try {
      const supabase = createClient();
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        // Fallback to default free plan if user is not authenticated
        const defaultSub: Subscription = {
          planId: "free",
          reviewsLimit: PLANS.free.reviewsLimit,
          reviewsUsed: 0,
          deepAnalysis: PLANS.free.deepAnalysis,
          chatWithReport: PLANS.free.chatWithReport,
          billingStatus: "active",
          nextBillingDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
        };
        return { success: true, data: defaultSub };
      }

      // Fetch subscription from DB
      const { data: subRow, error } = await supabase
        .from("subscriptions")
        .select("*")
        .eq("user_id", user.id)
        .single();

      if (error && error.code !== "PGRST116") {
        return {
          success: false,
          error: { code: "GET_SUBSCRIPTION_FAILED", message: error.message },
        };
      }

      if (!subRow) {
        // If not found, create and insert
        const defaultSub: Subscription = {
          planId: "free",
          reviewsLimit: PLANS.free.reviewsLimit,
          reviewsUsed: 0,
          deepAnalysis: PLANS.free.deepAnalysis,
          chatWithReport: PLANS.free.chatWithReport,
          billingStatus: "active",
          nextBillingDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
        };

        const { data: newRow, error: insertError } = await supabase
          .from("subscriptions")
          .insert({
            user_id: user.id,
            plan_id: "free",
            status: "active",
            reviews_used: 0,
            reviews_limit: PLANS.free.reviewsLimit,
            current_period_end: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
          })
          .select()
          .single();

        if (insertError) {
          console.error("Failed to create default subscription row:", insertError);
          return { success: true, data: defaultSub };
        }

        return { success: true, data: mapSubscriptionRow(newRow) };
      }

      return { success: true, data: mapSubscriptionRow(subRow) };
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : "Failed to retrieve subscription.";
      return {
        success: false,
        error: { code: "GET_SUBSCRIPTION_FAILED", message },
      };
    }
  },

  async getPlans(): Promise<ServiceResult<Plan[]>> {
    try {
      const plansList = Object.values(PLANS);
      return { success: true, data: plansList };
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : "Failed to retrieve plans.";
      return {
        success: false,
        error: { code: "GET_PLANS_FAILED", message },
      };
    }
  },

  async changePlan(planId: PlanId): Promise<ServiceResult<Subscription>> {
    try {
      const supabase = createClient();
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        return {
          success: false,
          error: { code: "UNAUTHORIZED", message: "User not logged in." },
        };
      }

      const targetPlan = PLANS[planId];
      const nextBillingDate = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000);

      const { data: subRow, error } = await supabase
        .from("subscriptions")
        .update({
          plan_id: planId,
          reviews_limit: targetPlan.reviewsLimit,
          reviews_used: 0,
          status: "active",
          current_period_start: new Date().toISOString(),
          current_period_end: nextBillingDate.toISOString(),
          cancel_at_period_end: false,
        })
        .eq("user_id", user.id)
        .select()
        .single();

      if (error) {
        return {
          success: false,
          error: { code: "CHANGE_PLAN_FAILED", message: error.message },
        };
      }

      return { success: true, data: mapSubscriptionRow(subRow) };
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : "Failed to change plan.";
      return {
        success: false,
        error: { code: "CHANGE_PLAN_FAILED", message },
      };
    }
  },

  async cancelSubscription(): Promise<ServiceResult<Subscription>> {
    try {
      const supabase = createClient();
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        return {
          success: false,
          error: { code: "UNAUTHORIZED", message: "User not logged in." },
        };
      }

      const { data: subRow, error } = await supabase
        .from("subscriptions")
        .update({
          status: "canceled",
          cancel_at_period_end: true,
        })
        .eq("user_id", user.id)
        .select()
        .single();

      if (error) {
        return {
          success: false,
          error: { code: "CANCEL_SUBSCRIPTION_FAILED", message: error.message },
        };
      }

      return { success: true, data: mapSubscriptionRow(subRow) };
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : "Failed to cancel subscription.";
      return {
        success: false,
        error: { code: "CANCEL_SUBSCRIPTION_FAILED", message },
      };
    }
  },

  async canRunReview(): Promise<ServiceResult<boolean>> {
    try {
      const subResult = await this.getCurrentSubscription();
      if (!subResult.success) {
        return { success: true, data: false };
      }

      const sub = subResult.data;
      const canRun = sub.reviewsUsed < sub.reviewsLimit;
      return { success: true, data: canRun };
    } catch {
      return { success: true, data: false };
    }
  },

  async incrementReviewUsage(): Promise<ServiceResult<void>> {
    try {
      const supabase = createClient();
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        return {
          success: false,
          error: { code: "UNAUTHORIZED", message: "User not logged in." },
        };
      }

      const subResult = await this.getCurrentSubscription();
      if (!subResult.success) {
        return {
          success: false,
          error: { code: "INCREMENT_FAILED", message: "Failed to retrieve subscription." },
        };
      }

      const newUsage = subResult.data.reviewsUsed + 1;

      const { error } = await supabase
        .from("subscriptions")
        .update({
          reviews_used: newUsage,
        })
        .eq("user_id", user.id);

      if (error) {
        return {
          success: false,
          error: { code: "INCREMENT_FAILED", message: error.message },
        };
      }

      return { success: true, data: undefined };
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : "Failed to update review usage.";
      return {
        success: false,
        error: { code: "INCREMENT_FAILED", message },
      };
    }
  },
};

/* eslint-disable-next-line @typescript-eslint/no-explicit-any */
function mapSubscriptionRow(row: any): Subscription {
  const plan = PLANS[row.plan_id as PlanId] || PLANS.free;
  return {
    planId: row.plan_id as PlanId,
    reviewsLimit: row.reviews_limit,
    reviewsUsed: row.reviews_used,
    deepAnalysis: plan.deepAnalysis,
    chatWithReport: plan.chatWithReport,
    portfolioMode: plan.portfolioMode,
    billingStatus: row.status === "canceled" ? "cancelled" : row.status,
    nextBillingDate: row.current_period_end
      ? new Date(row.current_period_end).toISOString().split("T")[0]
      : new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
    paymentMethod: "Visa **** 4242",
  };
}
