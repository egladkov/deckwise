"use client";

import React, { useState } from "react";
import { useAuthStore } from "../../stores/auth.store";
import { useRouter } from "next/navigation";
import { ConfirmDialog } from "../shared/ConfirmDialog";
import { AlertCircle } from "lucide-react";

export const DeleteAccountDialog: React.FC = () => {
  const { deleteAccount, loading } = useAuthStore();
  const [isOpen, setIsOpen] = useState(false);
  const router = useRouter();

  const handleDeleteClick = () => {
    setIsOpen(true);
  };

  const handleConfirm = async () => {
    setIsOpen(false);
    const success = await deleteAccount();
    if (success) {
      window.location.replace("/");
    }
  };

  return (
    <div className="w-full max-w-2xl font-sans border border-burgundy/20 rounded-2xl bg-burgundy/5 p-6 sm:p-8 animate-fade-up">
      <div className="mb-6 flex gap-3.5 items-start">
        <AlertCircle className="w-6 h-6 text-burgundy shrink-0 mt-1" />
        <div>
          <h3 className="text-xl sm:text-2xl font-display font-bold text-burgundy mb-2">
            Delete Account
          </h3>
          <p className="text-sm text-burgundy/80 leading-relaxed font-sans">
            This action will permanently delete your user profile, history of all pitch deck reviews, saved chat messages, and subscription. All local files and reports in IndexedDB will be completely erased and cannot be recovered.
          </p>
        </div>
      </div>

      <div className="flex justify-end pt-2">
        <button
          type="button"
          onClick={handleDeleteClick}
          disabled={loading}
          className="px-5 py-2.5 bg-burgundy hover:bg-burgundy/90 text-chalk rounded-md text-sm font-semibold transition-all duration-300 hover:-translate-y-0.5 disabled:opacity-50"
        >
          {loading ? "Deleting..." : "Delete Account"}
        </button>
      </div>

      <ConfirmDialog
        isOpen={isOpen}
        title="Delete account and data?"
        description="Are you absolutely sure? This action will erase your session, profile, Deckwise AI reports history, and assistant chat logs. It will be impossible to recover this data."
        confirmLabel="Yes, delete permanently"
        cancelLabel="Cancel"
        isDestructive
        onConfirm={handleConfirm}
        onCancel={() => setIsOpen(false)}
      />
    </div>
  );
};
