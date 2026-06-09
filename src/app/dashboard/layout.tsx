"use client";

import React, { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "../../stores/auth.store";
import { useUIStore } from "../../stores/ui.store";
import { DashboardSidebar } from "../../components/dashboard/DashboardSidebar";
import { DashboardHeader } from "../../components/dashboard/DashboardHeader";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const { session, loading, restoreSession, isAuthenticated } = useAuthStore();
  const { sidebarOpen, setSidebarOpen } = useUIStore();

  useEffect(() => {
    restoreSession();
  }, [restoreSession]);

  // Close sidebar by default on small screens on initial render
  useEffect(() => {
    if (typeof window !== "undefined") {
      if (window.innerWidth < 768) {
        setSidebarOpen(false);
      }
    }
  }, [setSidebarOpen]);

  useEffect(() => {
    if (!loading && !session && !isAuthenticated) {
      router.push("/");
    }
  }, [session, loading, isAuthenticated, router]);

  if (loading) {
    return (
      <div className="min-h-screen bg-ruled bg-paper flex flex-col items-center justify-center font-sans">
        <div className="w-10 h-10 rounded-xl bg-navy border border-gold/30 flex items-center justify-center animate-spin text-gold font-bold text-lg">
          D
        </div>
        <span className="text-xs text-muted font-mono uppercase tracking-wider mt-3 animate-pulse">
          Loading dashboard...
        </span>
      </div>
    );
  }

  if (!session) return null;

  return (
    <div className="min-h-screen bg-paper text-ink font-sans relative">
      {/* Sidebar navigation */}
      <DashboardSidebar />

      {/* Main workspace area */}
      <div
        className={`transition-all duration-300 min-h-screen flex flex-col ${
          sidebarOpen ? "md:pl-64" : "md:pl-20"
        }`}
      >
        {/* Top bar header */}
        <DashboardHeader />

        {/* Backdrop for mobile sidebar */}
        {sidebarOpen && (
          <div
            onClick={() => setSidebarOpen(false)}
            className="fixed inset-0 z-30 bg-navy/40 backdrop-blur-sm md:hidden"
          />
        )}

        {/* Content routing view */}
        <main className="flex-1 p-4 sm:p-6 md:p-8 max-w-6xl w-full mx-auto animate-fade-up">
          {children}
        </main>
      </div>
    </div>
  );
}
