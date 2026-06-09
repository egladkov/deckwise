"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuthStore } from "../stores/auth.store";
import { Mail, Lock, User, Sparkles, ArrowRight } from "lucide-react";
import { Logo } from "../components/shared/Logo";

export default function RootAuthPage() {
  const router = useRouter();
  const { 
    login, 
    register, 
    loading, 
    error, 
    clearError, 
    isAuthenticated, 
    restoreSession 
  } = useAuthStore();

  const [mode, setMode] = useState<"login" | "register">("login");
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [validationError, setValidationError] = useState<string | null>(null);

  // Restore session on mount to check if user is already logged in
  useEffect(() => {
    restoreSession();
  }, [restoreSession]);

  // Redirect to dashboard if authenticated
  useEffect(() => {
    if (isAuthenticated) {
      router.push("/dashboard");
    }
  }, [isAuthenticated, router]);

  const handleModeChange = (newMode: "login" | "register") => {
    setMode(newMode);
    setValidationError(null);
    clearError();
    // Keep email and password to avoid re-typing, but clear confirm password and name
    setFormData(prev => ({
      ...prev,
      name: "",
      confirmPassword: ""
    }));
  };

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

    if (mode === "login") {
      if (!formData.email || !formData.password) {
        setValidationError("Please fill in all fields.");
        return;
      }

      const success = await login({
        email: formData.email,
        password: formData.password,
      });
      if (success) {
        router.push("/dashboard");
      }
    } else {
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

      const success = await register({
        name: formData.name,
        email: formData.email,
        password: formData.password,
      });
      if (success) {
        router.push("/dashboard");
      }
    }
  };

  const activeError = validationError || error;

  return (
    <div className="min-h-screen bg-ruled bg-paper flex items-center justify-center p-4 font-sans relative overflow-hidden">
      <div className="w-full max-w-md bg-paper border border-line rounded-2xl p-8 shadow-2xl relative overflow-hidden transition-all duration-300">
        {/* Decorative corner */}
        <div className="absolute top-0 right-0 w-16 h-16 bg-gold/10 rounded-bl-full border-b border-l border-gold/15" />

        {/* Logo */}
        <div className="flex flex-col items-center mb-6">
          <Logo href="/" />
          <p className="text-xs text-muted font-mono uppercase tracking-wider mt-2.5 text-center">
            Pitch Deck Intelligence
          </p>
        </div>

        {/* Auth Mode Tabs */}
        <div className="flex border-b border-line mb-6 relative">
          <button
            type="button"
            onClick={() => handleModeChange("login")}
            className={`flex-1 pb-3 text-xs font-semibold uppercase tracking-wider transition-all duration-300 border-b-2 text-center focus:outline-none ${
              mode === "login"
                ? "border-gold text-navy font-bold"
                : "border-transparent text-muted hover:text-navy"
            }`}
          >
            Sign In
          </button>
          <button
            type="button"
            onClick={() => handleModeChange("register")}
            className={`flex-1 pb-3 text-xs font-semibold uppercase tracking-wider transition-all duration-300 border-b-2 text-center focus:outline-none ${
              mode === "register"
                ? "border-gold text-navy font-bold"
                : "border-transparent text-muted hover:text-navy"
            }`}
          >
            Sign Up
          </button>
        </div>

        {/* Auth Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Full Name field (Register only) */}
          <div 
            className={`transition-all duration-300 overflow-hidden ${
              mode === "register" 
                ? "max-h-24 opacity-100 mb-4" 
                : "max-h-0 opacity-0 pointer-events-none mb-0"
            }`}
          >
            {mode === "register" && (
              <>
                <label className="block text-xs font-semibold text-navy uppercase tracking-wider mb-1.5">
                  Full Name
                </label>
                <div className="relative">
                  <User className="absolute left-3.5 top-3.5 h-4.5 w-4.5 text-muted" />
                  <input
                    type="text"
                    name="name"
                    required={mode === "register"}
                    placeholder="John Doe"
                    value={formData.name}
                    onChange={handleChange}
                    className="w-full pl-10 pr-3.5 py-3 border border-line rounded-md bg-paper text-navy placeholder:text-muted/40 focus:border-gold focus:outline-none text-sm transition-colors"
                  />
                </div>
              </>
            )}
          </div>

          {/* Email Address */}
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

          {/* Password */}
          <div>
            <div className="flex justify-between items-center mb-1.5">
              <label className="block text-xs font-semibold text-navy uppercase tracking-wider">
                Password
              </label>
              {mode === "login" && (
                <Link
                  href="/forgot-password"
                  className="text-xs text-gold hover:text-gold-soft font-semibold transition-colors focus:outline-none"
                >
                  Forgot password?
                </Link>
              )}
            </div>
            <div className="relative">
              <Lock className="absolute left-3.5 top-3.5 h-4.5 w-4.5 text-muted" />
              <input
                type="password"
                name="password"
                required
                placeholder={mode === "register" ? "Minimum 8 characters" : "••••••••"}
                value={formData.password}
                onChange={handleChange}
                className="w-full pl-10 pr-3.5 py-3 border border-line rounded-md bg-paper text-navy placeholder:text-muted/40 focus:border-gold focus:outline-none text-sm transition-colors"
              />
            </div>
          </div>

          {/* Confirm Password (Register only) */}
          <div 
            className={`transition-all duration-300 overflow-hidden ${
              mode === "register" 
                ? "max-h-24 opacity-100 mb-4" 
                : "max-h-0 opacity-0 pointer-events-none mb-0"
            }`}
          >
            {mode === "register" && (
              <>
                <label className="block text-xs font-semibold text-navy uppercase tracking-wider mb-1.5">
                  Confirm Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-3.5 top-3.5 h-4.5 w-4.5 text-muted" />
                  <input
                    type="password"
                    name="confirmPassword"
                    required={mode === "register"}
                    placeholder="••••••••"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    className="w-full pl-10 pr-3.5 py-3 border border-line rounded-md bg-paper text-navy placeholder:text-muted/40 focus:border-gold focus:outline-none text-sm transition-colors"
                  />
                </div>
              </>
            )}
          </div>

          {/* Error Message */}
          {activeError && (
            <div className="p-3 bg-burgundy/5 border border-burgundy/15 rounded-xl text-burgundy text-xs animate-fade-up font-medium">
              {activeError}
            </div>
          )}

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full px-5 py-3 bg-navy text-chalk hover:bg-navy-soft hover:-translate-y-0.5 shadow-md shadow-navy/15 hover:shadow-lg hover:shadow-navy/25 rounded-md text-sm font-semibold transition-all duration-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-gold/70 focus-visible:ring-offset-2 focus-visible:ring-offset-paper disabled:opacity-50 disabled:transform-none flex items-center justify-center gap-2"
          >
            <span>
              {loading 
                ? (mode === "login" ? "Signing in..." : "Registering...") 
                : (mode === "login" ? "Sign In" : "Create Account")
              }
            </span>
            {!loading && <ArrowRight className="w-4 h-4" />}
          </button>
        </form>

        {/* Demo Details / Switch Mode Link */}
        <div className="mt-6 border-t border-line/60 pt-4 text-center">
          {mode === "login" ? (
            <>
              <p className="text-xs text-muted mb-3 font-sans">
                For a quick demo, use: <span className="font-semibold text-navy">demo@deckwise.ai</span> (any password)
              </p>
              <p className="text-xs text-muted">
                Don't have an account?{" "}
                <button
                  type="button"
                  onClick={() => handleModeChange("register")}
                  className="text-gold hover:text-gold-soft font-semibold transition-colors focus:outline-none cursor-pointer"
                >
                  Sign up
                </button>
              </p>
            </>
          ) : (
            <p className="text-xs text-muted">
              Already have an account?{" "}
              <button
                type="button"
                onClick={() => handleModeChange("login")}
                className="text-gold hover:text-gold-soft font-semibold transition-colors focus:outline-none cursor-pointer"
              >
                Sign In
              </button>
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
