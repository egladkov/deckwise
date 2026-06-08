"use client";

import React, { useState, useEffect } from "react";
import { useUserStore } from "../../stores/user.store";
import { FormSection } from "../shared/FormSection";

export const ProfileForm: React.FC = () => {
  const { user, updateProfile, loading, error, fetchUser } = useUserStore();
  const [success, setSuccess] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    companyName: "",
    industry: "",
    startupStage: "Idea",
    website: "",
    preferredLanguage: "en",
  });

  useEffect(() => {
    fetchUser();
  }, [fetchUser]);

  useEffect(() => {
    if (user?.profile) {
      setFormData({
        name: user.profile.name || user.name || "",
        email: user.profile.email || user.email || "",
        companyName: user.profile.companyName || "",
        industry: user.profile.industry || "",
        startupStage: user.profile.startupStage || "Idea",
        website: user.profile.website || "",
        preferredLanguage: user.profile.preferredLanguage || "en",
      });
    }
  }, [user]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setSuccess(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSuccess(false);
    const ok = await updateProfile(formData);
    if (ok) {
      setSuccess(true);
      // Reset success status after 3 seconds
      setTimeout(() => setSuccess(false), 3000);
    }
  };

  const stages = [
    "Idea",
    "Pre-seed",
    "Seed",
    "Series A",
    "Series B+",
    "Bootstrap / Profitable",
  ];

  return (
    <form onSubmit={handleSubmit} className="w-full max-w-2xl font-sans">
      <FormSection
        title="Profile Information"
        description="Edit your personal details and startup information to calibrate the AI context."
      >
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* Name */}
          <div>
            <label className="block text-xs font-semibold text-navy uppercase tracking-wider mb-1.5">
              Your Name
            </label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 border border-line rounded-xl bg-paper text-navy placeholder:text-muted/50 focus:border-gold focus:outline-none text-sm transition-colors"
            />
          </div>

          {/* Email */}
          <div>
            <label className="block text-xs font-semibold text-navy uppercase tracking-wider mb-1.5">
              Email Address
            </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 border border-line rounded-xl bg-paper text-navy placeholder:text-muted/50 focus:border-gold focus:outline-none text-sm transition-colors"
            />
          </div>

          {/* Company Name */}
          <div>
            <label className="block text-xs font-semibold text-navy uppercase tracking-wider mb-1.5">
              Project / Company Name
            </label>
            <input
              type="text"
              name="companyName"
              value={formData.companyName}
              onChange={handleChange}
              placeholder="e.g. Deckwise AI"
              className="w-full px-3 py-2 border border-line rounded-xl bg-paper text-navy placeholder:text-muted/50 focus:border-gold focus:outline-none text-sm transition-colors"
            />
          </div>

          {/* Industry */}
          <div>
            <label className="block text-xs font-semibold text-navy uppercase tracking-wider mb-1.5">
              Industry
            </label>
            <input
              type="text"
              name="industry"
              value={formData.industry}
              onChange={handleChange}
              placeholder="e.g. AI SaaS, FinTech"
              className="w-full px-3 py-2 border border-line rounded-xl bg-paper text-navy placeholder:text-muted/50 focus:border-gold focus:outline-none text-sm transition-colors"
            />
          </div>

          {/* Startup Stage */}
          <div>
            <label className="block text-xs font-semibold text-navy uppercase tracking-wider mb-1.5">
              Startup Stage
            </label>
            <select
              name="startupStage"
              value={formData.startupStage}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-line rounded-xl bg-paper text-navy focus:border-gold focus:outline-none text-sm transition-colors"
            >
              {stages.map((st) => (
                <option key={st} value={st}>
                  {st}
                </option>
              ))}
            </select>
          </div>

          {/* Website */}
          <div>
            <label className="block text-xs font-semibold text-navy uppercase tracking-wider mb-1.5">
              Project Website
            </label>
            <input
              type="url"
              name="website"
              value={formData.website}
              onChange={handleChange}
              placeholder="https://example.com"
              className="w-full px-3 py-2 border border-line rounded-xl bg-paper text-navy placeholder:text-muted/50 focus:border-gold focus:outline-none text-sm transition-colors"
            />
          </div>

          {/* Preferred Language */}
          <div>
            <label className="block text-xs font-semibold text-navy uppercase tracking-wider mb-1.5">
              AI Report Language
            </label>
            <select
              name="preferredLanguage"
              value={formData.preferredLanguage}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-line rounded-xl bg-paper text-navy focus:border-gold focus:outline-none text-sm transition-colors"
            >
              <option value="en">English</option>
              <option value="ru">Russian</option>
            </select>
          </div>
        </div>

        {/* Execution Status */}
        {error && (
          <p className="text-xs font-medium text-burgundy bg-burgundy/5 px-3 py-1.5 rounded-lg border border-burgundy/20 mt-2">
            {error}
          </p>
        )}

        {success && (
          <p className="text-xs font-medium text-sage bg-sage/5 px-3 py-1.5 rounded-lg border border-sage/20 mt-2 animate-fade-up">
            Profile updated successfully!
          </p>
        )}

        <div className="flex justify-end mt-4 border-t border-line/50 pt-4">
          <button
            type="submit"
            disabled={loading}
            className="px-5 py-2.5 bg-navy hover:bg-navy-soft text-chalk text-xs font-semibold rounded-xl border border-line-dark shadow-md transition-all hover:-translate-y-0.5 disabled:opacity-50"
          >
            {loading ? "Saving..." : "Save Profile"}
          </button>
        </div>
      </FormSection>
    </form>
  );
};
