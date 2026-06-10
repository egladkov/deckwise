"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuthStore } from "../../../stores/auth.store";
import { FileText, Lock, Mail } from "lucide-react";
import { Logo } from "../../../components/shared/Logo";

export default function LoginPage() {
  const router = useRouter();
  const { login, loading, error, clearError, isAuthenticated, restoreSession } = useAuthStore();
  const [formData, setFormData] = useState({ email: "", password: "" });

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
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const success = await login(formData);
    if (success) {
      router.push("/dashboard");
    }
  };

  return (
    <div className="min-h-screen bg-ruled bg-paper flex items-center justify-center p-4 font-sans">
      <div className="w-full max-w-md bg-paper border border-line rounded-2xl p-8 shadow-2xl relative overflow-hidden">
        {/* Decorative corner */}
        <div className="absolute top-0 right-0 w-16 h-16 bg-gold/10 rounded-bl-full border-b border-l border-gold/15" />

        {/* Logo */}
        <div className="flex flex-col items-center mb-8">
          <Logo href="/" />
          <p className="text-xs text-muted font-mono uppercase tracking-wider mt-2.5 text-center">
            Founder Dashboard
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
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
            <div className="flex justify-between items-center mb-1.5">
              <label className="block text-xs font-semibold text-navy uppercase tracking-wider">
                Password
              </label>
              <Link
                href="/forgot-password"
                className="text-xs text-gold hover:text-gold-soft font-semibold transition-colors"
              >
                Forgot password?
              </Link>
            </div>
            <div className="relative">
              <Lock className="absolute left-3.5 top-3.5 h-4.5 w-4.5 text-muted" />
              <input
                type="password"
                name="password"
                required
                placeholder="••••••••"
                value={formData.password}
                onChange={handleChange}
                className="w-full pl-10 pr-3.5 py-3 border border-line rounded-md bg-paper text-navy placeholder:text-muted/40 focus:border-gold focus:outline-none text-sm transition-colors"
              />
            </div>
          </div>

          {error && (
            <div className="p-3 bg-burgundy/5 border border-burgundy/15 rounded-xl text-burgundy text-xs animate-fade-up font-medium">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full px-5 py-3 bg-navy text-chalk hover:bg-navy-soft hover:-translate-y-0.5 shadow-md shadow-navy/15 hover:shadow-lg hover:shadow-navy/25 rounded-md text-sm font-semibold transition-all duration-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-gold/70 focus-visible:ring-offset-2 focus-visible:ring-offset-paper disabled:opacity-50 disabled:transform-none"
          >
            {loading ? "Signing in..." : "Sign In"}
          </button>
        </form>

        {/* Demo hints */}
        <div className="mt-6 border-t border-line/60 pt-4 text-center">

          <p className="text-xs text-muted">
            Don't have an account?{" "}
            <Link
              href="/register"
              className="text-gold hover:text-gold-soft font-semibold transition-colors"
            >
              Sign up
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
