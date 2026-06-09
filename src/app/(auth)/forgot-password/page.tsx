"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Mail, CheckCircle2 } from "lucide-react";
import { Logo } from "../../../components/shared/Logo";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    // Simulate API request
    await new Promise((resolve) => setTimeout(resolve, 800));
    setLoading(false);
    setSubmitted(true);
  };

  return (
    <div className="min-h-screen bg-ruled bg-paper flex items-center justify-center p-4 font-sans">
      <div className="w-full max-w-md bg-paper border border-line rounded-2xl p-8 shadow-2xl relative overflow-hidden">
        {/* Decorative corner */}
        <div className="absolute top-0 right-0 w-16 h-16 bg-gold/10 rounded-bl-full border-b border-l border-gold/15" />

        {/* Logo */}
        <div className="flex flex-col items-center mb-6">
          <Logo href="/" />
          <p className="text-xs text-muted font-mono uppercase tracking-wider mt-2.5 text-center">
            Recover Access
          </p>
        </div>

        {!submitted ? (
          <form onSubmit={handleSubmit} className="space-y-4">
            <p className="text-xs text-muted leading-relaxed mb-2 font-sans">
              Enter your email address and we will send you a temporary token to log in and reset your password (in mock mode).
            </p>

            <div>
              <label className="block text-xs font-semibold text-navy uppercase tracking-wider mb-1.5">
                Email Address
              </label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-3.5 h-4.5 w-4.5 text-muted" />
                <input
                  type="email"
                  required
                  placeholder="founder@startup.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-10 pr-3.5 py-3 border border-line rounded-md bg-paper text-navy placeholder:text-muted/40 focus:border-gold focus:outline-none text-sm transition-colors"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full px-5 py-3 bg-navy text-chalk hover:bg-navy-soft hover:-translate-y-0.5 shadow-md shadow-navy/15 hover:shadow-lg hover:shadow-navy/25 rounded-md text-sm font-semibold transition-all duration-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-gold/70 focus-visible:ring-offset-2 focus-visible:ring-offset-paper disabled:opacity-50 disabled:transform-none"
            >
              {loading ? "Sending..." : "Send Reset Link"}
            </button>
          </form>
        ) : (
          <div className="text-center space-y-4 py-4 animate-fade-up">
            <div className="flex justify-center text-sage">
              <CheckCircle2 className="w-12 h-12" />
            </div>
            <h3 className="text-lg font-display font-bold text-navy">Reset Link Sent!</h3>
            <p className="text-xs text-muted leading-relaxed max-w-sm mx-auto">
              We have sent password reset instructions to <span className="font-semibold text-navy">{email}</span>. In a production environment, this would integrate with an email delivery service.
            </p>
            <button
              onClick={() => setSubmitted(false)}
              className="px-4 py-2 border border-line bg-paper-warm text-navy hover:border-gold hover:bg-paper rounded-md text-xs font-semibold transition-all duration-300"
            >
              Enter different email
            </button>
          </div>
        )}

        <div className="mt-6 border-t border-line/60 pt-4 text-center">
          <p className="text-xs text-muted">
            Remembered your password?{" "}
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
