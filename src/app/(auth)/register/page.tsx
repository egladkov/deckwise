"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuthStore } from "../../../stores/auth.store";
import { User, Mail, Lock } from "lucide-react";
import { Logo } from "../../../components/shared/Logo";

export default function RegisterPage() {
  const router = useRouter();
  const { register, loading, error, clearError, isAuthenticated, restoreSession } = useAuthStore();
  const [formData, setFormData] = useState({ name: "", email: "", password: "", confirmPassword: "" });
  const [validationError, setValidationError] = useState<string | null>(null);

  useEffect(() => {
    restoreSession();
  }, [restoreSession]);

  useEffect(() => {
    if (isAuthenticated) {
      router.push("/dashboard");
    }
  }, [isAuthenticated, router]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    clearError();
    setValidationError(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setValidationError(null);
    clearError();

    if (!formData.name || !formData.email || !formData.password || !formData.confirmPassword) {
      setValidationError("Please fill in all fields.");
      return;
    }

    if (formData.password.length < 8) {
      setValidationError("Password must be at least 8 characters.");
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setValidationError("Passwords do not match.");
      return;
    }

    const success = await register(formData);
    if (success) {
      router.push("/dashboard");
    }
  };

  const activeError = validationError || error;

  return (
    <div className="min-h-screen bg-ruled bg-paper flex items-center justify-center p-4 font-sans">
      <div className="w-full max-w-md bg-paper border border-line rounded-2xl p-8 shadow-2xl relative overflow-hidden">
        {/* Decorative corner */}
        <div className="absolute top-0 right-0 w-16 h-16 bg-gold/10 rounded-bl-full border-b border-l border-gold/15" />

        {/* Logo */}
        <div className="flex flex-col items-center mb-6">
          <Logo href="/" />
          <p className="text-xs text-muted font-mono uppercase tracking-wider mt-2.5 text-center">
            Founder Registration
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-navy uppercase tracking-wider mb-1.5">
              Full Name
            </label>
            <div className="relative">
              <User className="absolute left-3.5 top-3.5 h-4.5 w-4.5 text-muted" />
              <input
                type="text"
                name="name"
                required
                placeholder="John Doe"
                value={formData.name}
                onChange={handleChange}
                className="w-full pl-10 pr-3.5 py-3 border border-line rounded-md bg-paper text-navy placeholder:text-muted/40 focus:border-gold focus:outline-none text-sm transition-colors"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-navy uppercase tracking-wider mb-1.5">
              Email Address
            </label>
            <div className="relative">
              <Mail className="absolute left-3.5 top-3.5 h-4.5 w-4.5 text-muted" />
              <input
                type="email"
                name="email"
                required
                placeholder="founder@startup.com"
                value={formData.email}
                onChange={handleChange}
                className="w-full pl-10 pr-3.5 py-3 border border-line rounded-md bg-paper text-navy placeholder:text-muted/40 focus:border-gold focus:outline-none text-sm transition-colors"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-navy uppercase tracking-wider mb-1.5">
              Password
            </label>
            <div className="relative">
              <Lock className="absolute left-3.5 top-3.5 h-4.5 w-4.5 text-muted" />
              <input
                type="password"
                name="password"
                required
                placeholder="Minimum 8 characters"
                value={formData.password}
                onChange={handleChange}
                className="w-full pl-10 pr-3.5 py-3 border border-line rounded-md bg-paper text-navy placeholder:text-muted/40 focus:border-gold focus:outline-none text-sm transition-colors"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-navy uppercase tracking-wider mb-1.5">
              Confirm Password
            </label>
            <div className="relative">
              <Lock className="absolute left-3.5 top-3.5 h-4.5 w-4.5 text-muted" />
              <input
                type="password"
                name="confirmPassword"
                required
                placeholder="••••••••"
                value={formData.confirmPassword}
                onChange={handleChange}
                className="w-full pl-10 pr-3.5 py-3 border border-line rounded-md bg-paper text-navy placeholder:text-muted/40 focus:border-gold focus:outline-none text-sm transition-colors"
              />
            </div>
          </div>

          {activeError && (
            <div className="p-3 bg-burgundy/5 border border-burgundy/15 rounded-md text-burgundy text-xs animate-fade-up font-medium">
              {activeError}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full px-5 py-3 bg-navy text-chalk hover:bg-navy-soft hover:-translate-y-0.5 shadow-md shadow-navy/15 hover:shadow-lg hover:shadow-navy/25 rounded-md text-sm font-semibold transition-all duration-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-gold/70 focus-visible:ring-offset-2 focus-visible:ring-offset-paper disabled:opacity-50 disabled:transform-none"
          >
            {loading ? "Registering..." : "Create Account"}
          </button>
        </form>

        <div className="mt-6 border-t border-line/60 pt-4 text-center">
          <p className="text-xs text-muted">
            Already have an account?{" "}
            <Link
              href="/login"
              className="text-gold hover:text-gold-soft font-semibold transition-colors"
            >
              Sign In
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
