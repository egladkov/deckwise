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
        // Fallback to default bootstrapper plan if user is not authenticated
        const defaultSub: Subscription = {
          planId: "bootstrapper",
          reviewsLimit: PLANS.bootstrapper.reviewsLimit,
          reviewsUsed: 0,
          revisionsLimit: PLANS.bootstrapper.revisionsLimit,
          revisionsUsed: 0,
          deepAnalysis: PLANS.bootstrapper.deepAnalysis,
          chatWithReport: PLANS.bootstrapper.chatWithReport,
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
          planId: "bootstrapper",
          reviewsLimit: PLANS.bootstrapper.reviewsLimit,
          reviewsUsed: 0,
          revisionsLimit: PLANS.bootstrapper.revisionsLimit,
          revisionsUsed: 0,
          deepAnalysis: PLANS.bootstrapper.deepAnalysis,
          chatWithReport: PLANS.bootstrapper.chatWithReport,
          billingStatus: "active",
          nextBillingDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
        };

        const { data: newRow, error: insertError } = await supabase
          .from("subscriptions")
          .insert({
            user_id: user.id,
            plan_id: "bootstrapper",
            status: "active",
            reviews_used: 0,
            reviews_limit: PLANS.bootstrapper.reviewsLimit,
            revisions_used: 0,
            revisions_limit: PLANS.bootstrapper.revisionsLimit,
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
          revisions_limit: targetPlan.revisionsLimit,
          revisions_used: 0,
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

  async canRunReview(startupName?: string): Promise<ServiceResult<boolean>> {
    try {
      const subResult = await this.getCurrentSubscription();
      if (!subResult.success) {
        return { success: true, data: false };
      }

      const sub = subResult.data;

      // If unlimited reviews, always allowed
      if (sub.reviewsLimit === -1) {
        return { success: true, data: true };
      }

      // Check if it's a revision or a new deck
      let isRevision = false;
      if (startupName) {
        const supabase = createClient();
        const { count, error } = await supabase
          .from("deck_reviews")
          .select("*", { count: "exact", head: true })
          .eq("startup_name", startupName.trim());

        if (!error && count && count > 0) {
          isRevision = true;
        }
      }

      if (isRevision) {
        if (sub.revisionsLimit === -1) {
          return { success: true, data: true };
        }
        return { success: true, data: sub.revisionsUsed < sub.revisionsLimit };
      } else {
        return { success: true, data: sub.reviewsUsed < sub.reviewsLimit };
      }
    } catch {
      return { success: true, data: false };
    }
  },

  async incrementReviewUsage(startupName?: string): Promise<ServiceResult<void>> {
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

      const sub = subResult.data;

      // Check if it is a revision or a new deck
      let isRevision = false;
      if (startupName) {
        const { count, error } = await supabase
          .from("deck_reviews")
          .select("*", { count: "exact", head: true })
          .eq("user_id", user.id)
          .eq("startup_name", startupName.trim());

        // Note: inside runAnalysis, the draft review is ALREADY created in the DB,
        // so count > 1 means it's a revision.
        if (!error && count && count > 1) {
          isRevision = true;
        }
      }

      /* eslint-disable-next-line @typescript-eslint/no-explicit-any */
      const updateData: any = {};
      if (isRevision) {
        updateData.revisions_used = sub.revisionsUsed + 1;
      } else {
        updateData.reviews_used = sub.reviewsUsed + 1;
      }

      const { error } = await supabase
        .from("subscriptions")
        .update(updateData)
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
  const plan = PLANS[row.plan_id as PlanId] || PLANS.bootstrapper;
  return {
    planId: row.plan_id as PlanId,
    reviewsLimit: row.reviews_limit,
    reviewsUsed: row.reviews_used,
    revisionsLimit: row.revisions_limit ?? plan.revisionsLimit,
    revisionsUsed: row.revisions_used ?? 0,
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
