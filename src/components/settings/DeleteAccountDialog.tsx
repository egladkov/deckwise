"use client";

import React, { useState } from "react";
import { useAuthStore } from "../../stores/auth.store";
import { useRouter } from "next/navigation";
import { FormSection } from "../shared/FormSection";
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
      router.push("/login");
    }
  };

  return (
    <div className="w-full max-w-2xl font-sans">
      <FormSection
        title="Danger Zone"
        description="Actions in this section cannot be undone. Please proceed with caution."
      >
        <div className="p-4 bg-burgundy/5 border border-burgundy/15 rounded-2xl flex gap-3 text-xs leading-relaxed text-burgundy mb-4">
          <AlertCircle className="w-5 h-5 shrink-0" />
          <div>
            <h4 className="font-semibold mb-0.5">Delete Account</h4>
            <p>
              This action will permanently delete your user profile, history of all pitch deck reviews, saved chat messages, and subscription. All local files and reports in IndexedDB will be completely erased and cannot be recovered.
            </p>
          </div>
        </div>

        <div className="flex justify-end pt-2">
          <button
            type="button"
            onClick={handleDeleteClick}
            disabled={loading}
            className="px-5 py-2.5 bg-burgundy hover:bg-burgundy/90 text-chalk text-xs font-semibold rounded-xl border border-burgundy/40 shadow-sm transition-all hover:-translate-y-0.5 disabled:opacity-50"
          >
            {loading ? "Deleting..." : "Delete Account"}
          </button>
        </div>
      </FormSection>

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
