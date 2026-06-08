import { create } from "zustand";
import { subscriptionService } from "../services/subscription.service";
import { Plan, PlanId, Subscription } from "../types";

interface SubscriptionState {
  subscription: Subscription | null;
  plans: Plan[];
  loading: boolean;
  error: string | null;
  fetchSubscription: () => Promise<void>;
  fetchPlans: () => Promise<void>;
  changePlan: (planId: PlanId) => Promise<boolean>;
  cancelSubscription: () => Promise<boolean>;
  checkCanRunReview: () => Promise<boolean>;
  clearSubscription: () => void;
}

export const useSubscriptionStore = create<SubscriptionState>((set, get) => ({
  subscription: null,
  plans: [],
  loading: false,
  error: null,

  fetchSubscription: async () => {
    set({ loading: true, error: null });
    const res = await subscriptionService.getCurrentSubscription();
    if (res.success) {
      set({ subscription: res.data, loading: false });
    } else {
      set({ error: res.error.message, loading: false });
    }
  },

  fetchPlans: async () => {
    const res = await subscriptionService.getPlans();
    if (res.success) {
      set({ plans: res.data });
    }
  },

  changePlan: async (planId) => {
    set({ loading: true, error: null });
    const res = await subscriptionService.changePlan(planId);
    if (res.success) {
      set({ subscription: res.data, loading: false });
      return true;
    } else {
      set({ error: res.error.message, loading: false });
      return false;
    }
  },

  cancelSubscription: async () => {
    set({ loading: true, error: null });
    const res = await subscriptionService.cancelSubscription();
    if (res.success) {
      set({ subscription: res.data, loading: false });
      return true;
    } else {
      set({ error: res.error.message, loading: false });
      return false;
    }
  },

  checkCanRunReview: async () => {
    const res = await subscriptionService.canRunReview();
    return res.success ? res.data : false;
  },

  clearSubscription: () => set({ subscription: null, error: null }),
}));
