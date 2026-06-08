"use client";

import React from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  LayoutDashboard,
  PlusCircle,
  History,
  User,
  CreditCard,
  Settings as SettingsIcon,
  LogOut,
  ChevronLeft,
  ChevronRight,
  Menu,
} from "lucide-react";
import { useAuthStore } from "../../stores/auth.store";
import { useUIStore } from "../../stores/ui.store";

export const DashboardSidebar: React.FC = () => {
  const pathname = usePathname();
  const router = useRouter();
  const { logout } = useAuthStore();
  const { sidebarOpen, toggleSidebar } = useUIStore();

  const handleLogout = async () => {
    await logout();
    router.push("/login");
  };

  const navItems = [
    { label: "Overview", href: "/dashboard", icon: LayoutDashboard },
    { label: "New Review", href: "/dashboard/new-review", icon: PlusCircle },
    { label: "Reviews", href: "/dashboard/reviews", icon: History },
    { label: "Profile", href: "/dashboard/profile", icon: User },
    { label: "Subscription", href: "/dashboard/subscription", icon: CreditCard },
    { label: "Settings", href: "/dashboard/settings", icon: SettingsIcon },
  ];

  return (
    <aside
      className={`fixed top-0 left-0 z-40 h-screen border-r border-line bg-paper-warm/80 backdrop-blur-md transition-all duration-300 flex flex-col justify-between ${
        sidebarOpen ? "w-64" : "w-20"
      }`}
    >
      <div>
        {/* Header/Logo */}
        <div className="h-16 flex items-center justify-between px-4 border-b border-line">
          <Link href="/dashboard" className="flex items-center gap-2 overflow-hidden">
            <div className="w-8 h-8 rounded-lg bg-navy flex items-center justify-center text-gold font-display font-bold text-lg shrink-0 border border-gold/30">
              D
            </div>
            {sidebarOpen && (
              <span className="font-display font-bold text-xl text-navy tracking-tight animate-fade-up">
                Deckwise <span className="text-gold">AI</span>
              </span>
            )}
          </Link>
          <button
            onClick={toggleSidebar}
            className="hidden md:flex p-1.5 rounded-lg border border-line bg-paper hover:bg-paper-deep text-navy transition-all"
          >
            {sidebarOpen ? <ChevronLeft className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
          </button>
        </div>

        {/* Navigation Items */}
        <nav className="p-3 space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive =
              pathname === item.href || (item.href !== "/dashboard" && pathname.startsWith(item.href));

            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-sans font-medium transition-all group relative ${
                  isActive
                    ? "bg-navy text-chalk border border-line-dark shadow-sm"
                    : "text-muted hover:bg-paper hover:text-navy border border-transparent"
                }`}
              >
                <Icon className={`w-5 h-5 shrink-0 ${isActive ? "text-gold" : "text-muted group-hover:text-navy"}`} />
                {sidebarOpen ? (
                  <span className="truncate">{item.label}</span>
                ) : (
                  <span className="absolute left-16 bg-navy text-chalk text-xs rounded-md px-2.5 py-1.5 opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-50 pointer-events-none border border-line-dark shadow-md font-sans">
                    {item.label}
                  </span>
                )}
                {isActive && sidebarOpen && (
                  <div className="absolute right-3 w-1.5 h-1.5 rounded-full bg-gold animate-pulse" />
                )}
              </Link>
            );
          })}
        </nav>
      </div>

      {/* Footer / Logout */}
      <div className="p-3 border-t border-line">
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-sans font-medium text-burgundy hover:bg-burgundy/10 transition-all group relative border border-transparent"
        >
          <LogOut className="w-5 h-5 shrink-0" />
          {sidebarOpen ? (
            <span>Logout</span>
          ) : (
            <span className="absolute left-16 bg-burgundy text-chalk text-xs rounded-md px-2.5 py-1.5 opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-50 pointer-events-none border border-burgundy/30 shadow-md">
              Logout
            </span>
          )}
        </button>
      </div>
    </aside>
  );
};
