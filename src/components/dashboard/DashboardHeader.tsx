"use client";

import React, { useEffect } from "react";
import Link from "next/link";
import { Menu, User as UserIcon, LogOut, Settings } from "lucide-react";
import { useAuthStore } from "../../stores/auth.store";
import { useSubscriptionStore } from "../../stores/subscription.store";
import { useUIStore } from "../../stores/ui.store";
import { PlanBadge } from "./PlanBadge";
import { UsageCard } from "./UsageCard";

export const DashboardHeader: React.FC = () => {
  const { session, logout } = useAuthStore();
  const { subscription, fetchSubscription } = useSubscriptionStore();
  const { toggleSidebar } = useUIStore();

  useEffect(() => {
    fetchSubscription();
  }, [fetchSubscription]);

  const userInitials = session?.user?.name
    ? session.user.name
        .split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase()
    : "U";

  return (
    <header className="h-16 border-b border-line bg-paper/95 backdrop-blur-md sticky top-0 z-30 flex items-center justify-between px-4 sm:px-6 font-sans">
      {/* Mobile Menu Toggle & Title */}
      <div className="flex items-center gap-3">
        <button
          onClick={toggleSidebar}
          className="p-2 -ml-2 rounded-lg border border-line bg-paper hover:bg-paper-warm text-navy md:hidden"
        >
          <Menu className="w-5 h-5" />
        </button>
        <div className="hidden sm:block">
          <span className="text-xs text-muted font-mono uppercase tracking-wider block">Workspace</span>
          <h2 className="text-sm font-semibold text-navy -mt-0.5">Dashboard</h2>
        </div>
      </div>

      {/* Right-side Controls */}
      <div className="flex items-center gap-4 sm:gap-6">
        {/* Usage counter */}
        {subscription && (
          <div className="hidden md:block">
            <UsageCard compact />
          </div>
        )}

        {/* Plan Badge */}
        {subscription && (
          <PlanBadge planId={subscription.planId} />
        )}

        {/* User profile actions */}
        <div className="flex items-center gap-3">
          <Link
            href="/dashboard/profile"
            className="flex items-center gap-2 group p-1 pr-3 rounded-full border border-line hover:border-gold bg-paper-warm/30 hover:bg-paper-warm/60 transition-all"
          >
            <div className="w-8 h-8 rounded-full bg-navy flex items-center justify-center text-gold font-mono text-xs border border-gold/20 shrink-0 group-hover:scale-105 transition-transform">
              {userInitials}
            </div>
            <span className="text-xs font-medium text-navy hidden md:inline truncate max-w-[120px]">
              {session?.user?.name || "User"}
            </span>
          </Link>
        </div>
      </div>
    </header>
  );
};
