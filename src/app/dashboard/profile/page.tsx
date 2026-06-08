"use client";

import React from "react";
import { ProfileForm } from "../../../components/profile/ProfileForm";
import { AccountInfoCard } from "../../../components/profile/AccountInfoCard";
import { User } from "lucide-react";

export default function ProfilePage() {
  return (
    <div className="space-y-6 font-sans">
      {/* Title */}
      <div className="flex items-center gap-2 mb-6 animate-fade-up">
        <User className="w-6 h-6 text-gold" />
        <h1 className="text-2xl sm:text-3xl font-display font-bold text-navy leading-none">
          User Profile
        </h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
        {/* Profile edit form (takes 2 cols) */}
        <div className="lg:col-span-2">
          <ProfileForm />
        </div>

        {/* Account Info card (takes 1 col) */}
        <div>
          <AccountInfoCard />
        </div>
      </div>
    </div>
  );
}
