"use client";

import React, { useState } from "react";
import { ChangePasswordForm } from "../../../components/settings/ChangePasswordForm";
import { DeleteAccountDialog } from "../../../components/settings/DeleteAccountDialog";
import { FormSection } from "../../../components/shared/FormSection";
import { Settings, Bell, Database } from "lucide-react";

export default function SettingsPage() {
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  // Mock Notification settings
  const [notifications, setNotifications] = useState({
    emailReports: true,
    weeklyDigest: false,
    limitWarnings: true,
  });

  const handleNotificationChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = e.target;
    setNotifications((prev) => ({ ...prev, [name]: checked }));
    showToast("Notification settings updated (mock)");
  };

  const handleClearData = async () => {
    if (confirm("Are you sure you want to clear your local cache? This will reset local settings and offline cache, but will not delete your reviews stored in the cloud.")) {
      const { indexedDbService } = await import("../../../services/indexed-db.service");
      try {
        await indexedDbService.clearAllData();
        showToast("Local cache cleared successfully");
      } catch {
        showToast("Failed to clear local cache");
      }
    }
  };

  const showToast = (msg: string) => {
    setSuccessMsg(msg);
    setTimeout(() => setSuccessMsg(null), 3000);
  };

  return (
    <div className="space-y-6 font-sans">
      {/* Title */}
      <div className="flex items-center gap-2 mb-6 animate-fade-up">
        <Settings className="w-6 h-6 text-gold" />
        <h1 className="text-2xl sm:text-3xl font-display font-bold text-navy leading-none">
          Account Settings
        </h1>
      </div>

      {/* Dynamic Toast Status */}
      {successMsg && (
        <div className="fixed bottom-4 right-4 z-50 p-4 rounded-xl bg-navy text-gold border border-gold/40 shadow-2xl text-xs font-semibold uppercase tracking-wider animate-fade-up">
          {successMsg}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
        {/* Forms column (takes 2 cols) */}
        <div className="lg:col-span-2 space-y-6">
          {/* Change Password form */}
          <ChangePasswordForm />

          {/* Delete Account */}
          <DeleteAccountDialog />
        </div>

        {/* Mock settings panels (takes 1 col) */}
        <div className="space-y-6">
          {/* Notifications preferences mockup */}
          <FormSection title="Notifications">
            <div className="space-y-3.5 pt-2">
              <div className="flex items-start gap-3">
                <Bell className="w-4 h-4 text-gold shrink-0 mt-0.5" />
                <div className="space-y-1">
                  <label className="flex items-center gap-2 text-xs font-semibold text-navy uppercase tracking-wider cursor-pointer">
                    <input
                      type="checkbox"
                      name="emailReports"
                      checked={notifications.emailReports}
                      onChange={handleNotificationChange}
                      className="accent-navy"
                    />
                    Email Reports
                  </label>
                  <span className="text-[10px] text-muted leading-tight block">
                    Send a copy of the PDF report to your email upon analysis completion.
                  </span>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-4 shrink-0" />
                <div className="space-y-1">
                  <label className="flex items-center gap-2 text-xs font-semibold text-navy uppercase tracking-wider cursor-pointer">
                    <input
                      type="checkbox"
                      name="limitWarnings"
                      checked={notifications.limitWarnings}
                      onChange={handleNotificationChange}
                      className="accent-navy"
                    />
                    Limit Warnings
                  </label>
                  <span className="text-[10px] text-muted leading-tight block">
                    Notify me when there are less than 2 reviews remaining for the month.
                  </span>
                </div>
              </div>
            </div>
          </FormSection>



          {/* Clear local data */}
          <FormSection title="Database Management">
            <div className="space-y-3">
              <div className="flex items-start gap-3">
                <Database className="w-4 h-4 text-gold shrink-0 mt-0.5" />
                <p className="text-[11px] text-muted leading-relaxed">
                  Clearing will only delete the history of your reports and chats from IndexedDB on this device, keeping your account and subscription active.
                </p>
              </div>
              <button
                type="button"
                onClick={handleClearData}
                className="w-full py-2.5 border border-line bg-paper hover:bg-paper-warm text-navy text-xs font-semibold rounded-xl transition-all"
              >
                Clear Database
              </button>
            </div>
          </FormSection>
        </div>
      </div>
    </div>
  );
}
