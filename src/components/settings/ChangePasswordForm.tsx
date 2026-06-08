"use client";

import React, { useState } from "react";
import { useAuthStore } from "../../stores/auth.store";
import { FormSection } from "../shared/FormSection";

export const ChangePasswordForm: React.FC = () => {
  const { changePassword, loading, error, clearError } = useAuthStore();
  const [success, setSuccess] = useState(false);
  const [formData, setFormData] = useState({
    current: "",
    new: "",
    confirm: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setSuccess(false);
    clearError();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSuccess(false);

    if (formData.new !== formData.confirm) {
      alert("Passwords do not match!"); // Simple validation for MVP
      return;
    }

    const ok = await changePassword({
      current: formData.current,
      new: formData.new,
    });

    if (ok) {
      setSuccess(true);
      setFormData({ current: "", new: "", confirm: "" });
      setTimeout(() => setSuccess(false), 3000);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="w-full max-w-2xl font-sans">
      <FormSection
        title="Change Password"
        description="Change the password used to access your Deckwise AI dashboard."
      >
        <div className="space-y-4 max-w-md">
          {/* Current Password */}
          <div>
            <label className="block text-xs font-semibold text-navy uppercase tracking-wider mb-1.5">
              Current Password
            </label>
            <input
              type="password"
              name="current"
              value={formData.current}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 border border-line rounded-xl bg-paper text-navy placeholder:text-muted/50 focus:border-gold focus:outline-none text-sm transition-colors"
            />
          </div>

          {/* New Password */}
          <div>
            <label className="block text-xs font-semibold text-navy uppercase tracking-wider mb-1.5">
              New Password
            </label>
            <input
              type="password"
              name="new"
              value={formData.new}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 border border-line rounded-xl bg-paper text-navy placeholder:text-muted/50 focus:border-gold focus:outline-none text-sm transition-colors"
            />
          </div>

          {/* Confirm Password */}
          <div>
            <label className="block text-xs font-semibold text-navy uppercase tracking-wider mb-1.5">
              Confirm New Password
            </label>
            <input
              type="password"
              name="confirm"
              value={formData.confirm}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 border border-line rounded-xl bg-paper text-navy placeholder:text-muted/50 focus:border-gold focus:outline-none text-sm transition-colors"
            />
          </div>
        </div>

        {error && (
          <p className="text-xs font-medium text-burgundy bg-burgundy/5 px-3 py-1.5 rounded-lg border border-burgundy/20 mt-2">
            {error}
          </p>
        )}

        {success && (
          <p className="text-xs font-medium text-sage bg-sage/5 px-3 py-1.5 rounded-lg border border-sage/20 mt-2 animate-fade-up">
            Password updated successfully!
          </p>
        )}

        <div className="flex justify-end mt-4 border-t border-line/50 pt-4">
          <button
            type="submit"
            disabled={loading}
            className="px-5 py-2.5 bg-navy hover:bg-navy-soft text-chalk text-xs font-semibold rounded-xl border border-line-dark shadow-md transition-all hover:-translate-y-0.5 disabled:opacity-50"
          >
            {loading ? "Updating..." : "Update Password"}
          </button>
        </div>
      </FormSection>
    </form>
  );
};
