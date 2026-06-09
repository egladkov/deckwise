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
import { Logo } from "../shared/Logo";

export const DashboardSidebar: React.FC = () => {
  const pathname = usePathname();
  const router = useRouter();
  const { logout } = useAuthStore();
  const { sidebarOpen, toggleSidebar, setSidebarOpen } = useUIStore();

  const handleLogout = async () => {
    await logout();
    router.push("/");
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
        sidebarOpen 
          ? "w-64 translate-x-0" 
          : "w-64 -translate-x-full md:w-20 md:translate-x-0"
      }`}
    >
      <div>
        {/* Header/Logo */}
        <div className="h-16 flex items-center justify-between pl-[21px] pr-4 border-b border-line relative">
          <Logo href="/dashboard" showText={sidebarOpen} className="overflow-hidden" />
          <button
            onClick={toggleSidebar}
            className={`hidden md:flex p-1.5 rounded-lg border border-line bg-paper hover:bg-paper-deep text-navy transition-all ${
              sidebarOpen ? "relative" : "absolute -right-3 top-1/2 -translate-y-1/2 z-50"
            }`}
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
                onClick={() => {
                  if (window.innerWidth < 768) {
                    setSidebarOpen(false);
                  }
                }}
                className={`flex items-center rounded-xl text-sm font-sans font-medium transition-all group relative pl-[18px] pr-[18px] py-2.5 ${
                  isActive
                    ? "bg-navy text-chalk border border-line-dark shadow-sm"
                    : "text-muted hover:bg-paper hover:text-navy border border-transparent"
                }`}
              >
                <Icon className={`w-5 h-5 shrink-0 ${isActive ? "text-gold" : "text-muted group-hover:text-navy"}`} />
                <span
                  className={`font-sans transition-all duration-300 overflow-hidden whitespace-nowrap ${
                    sidebarOpen ? "w-auto opacity-100 ml-3" : "w-0 opacity-0 ml-0"
                  }`}
                >
                  {item.label}
                </span>
                <span className={`absolute left-16 bg-navy text-chalk text-xs rounded-md px-2.5 py-1.5 whitespace-nowrap z-50 pointer-events-none border border-line-dark shadow-md font-sans transition-all duration-200 ${
                  sidebarOpen 
                    ? "opacity-0 invisible scale-95" 
                    : "opacity-0 invisible scale-95 group-hover:opacity-100 group-hover:visible group-hover:scale-100"
                }`}>
                  {item.label}
                </span>
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
          onClick={async (e) => {
            if (window.innerWidth < 768) {
              setSidebarOpen(false);
            }
            await handleLogout();
          }}
          className="w-full flex items-center rounded-xl text-sm font-sans font-medium text-burgundy hover:bg-burgundy/10 transition-all group relative border border-transparent pl-[18px] pr-[18px] py-2.5"
        >
          <LogOut className="w-5 h-5 shrink-0" />
          <span
            className={`font-sans transition-all duration-300 overflow-hidden whitespace-nowrap ${
              sidebarOpen ? "w-auto opacity-100 ml-3" : "w-0 opacity-0 ml-0"
            }`}
          >
            Logout
          </span>
          <span className={`absolute left-16 bg-burgundy text-chalk text-xs rounded-md px-2.5 py-1.5 whitespace-nowrap z-50 pointer-events-none border border-burgundy/30 shadow-md transition-all duration-200 ${
            sidebarOpen 
              ? "opacity-0 invisible scale-95" 
              : "opacity-0 invisible scale-95 group-hover:opacity-100 group-hover:visible group-hover:scale-100"
          }`}>
            Logout
          </span>
        </button>
      </div>
    </aside>
  );
};
