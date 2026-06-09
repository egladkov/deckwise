"use client";

import React, { useState, useEffect } from "react";
import { Lock, X, CreditCard, Loader2 } from "lucide-react";
import { Plan } from "../../types";
import { useUserStore } from "../../stores/user.store";

interface PaymentModalProps {
  isOpen: boolean;
  plan: Plan | null;
  onConfirm: () => Promise<void>;
  onCancel: () => void;
}

export const PaymentModal: React.FC<PaymentModalProps> = ({
  isOpen,
  plan,
  onConfirm,
  onCancel,
}) => {
  const { user, fetchUser } = useUserStore();
  const [cardholderName, setCardholderName] = useState("");
  const [cardNumber, setCardNumber] = useState("");
  const [expiryDate, setExpiryDate] = useState("");
  const [cvc, setCvc] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [prevIsOpen, setPrevIsOpen] = useState(false);

  const nameFromStore = user?.profile?.name || user?.name || "";

  // Adjust state during render when isOpen changes
  if (isOpen !== prevIsOpen) {
    setPrevIsOpen(isOpen);
    if (isOpen) {
      setCardNumber("");
      setExpiryDate("");
      setCvc("");
      setErrors({});
      setIsProcessing(false);
      setCardholderName(nameFromStore);
    }
  }

  // Sync cardholder name if it is currently empty and user profile has loaded
  if (isOpen && nameFromStore && !cardholderName) {
    setCardholderName(nameFromStore);
  }

  // Fetch user if not loaded and modal is open
  useEffect(() => {
    if (isOpen && !user) {
      fetchUser();
    }
  }, [isOpen, user, fetchUser]);

  if (!isOpen || !plan) return null;

  // Handle Card Number Input with auto-formatting (4242 4242 4242 4242)
  const handleCardNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, "");
    const formattedValue = value
      .replace(/(\d{4})/g, "$1 ")
      .trim()
      .substring(0, 19); // 16 digits + 3 spaces
    setCardNumber(formattedValue);
    if (errors.cardNumber) {
      setErrors((prev) => ({ ...prev, cardNumber: "" }));
    }
  };

  // Handle Expiry Date Input with auto-formatting (MM/YY)
  const handleExpiryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, "");
    let formattedValue = value;
    if (value.length > 2) {
      formattedValue = `${value.substring(0, 2)}/${value.substring(2, 4)}`;
    }
    formattedValue = formattedValue.substring(0, 5);
    setExpiryDate(formattedValue);
    if (errors.expiryDate) {
      setErrors((prev) => ({ ...prev, expiryDate: "" }));
    }
  };

  // Handle CVC Input (max 3 digits)
  const handleCvcChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, "").substring(0, 3);
    setCvc(value);
    if (errors.cvc) {
      setErrors((prev) => ({ ...prev, cvc: "" }));
    }
  };

  const validate = () => {
    const newErrors: Record<string, string> = {};

    if (!cardholderName.trim()) {
      newErrors.cardholderName = "Cardholder name is required";
    }

    const cleanCardNumber = cardNumber.replace(/\s/g, "");
    if (cleanCardNumber.length !== 16) {
      newErrors.cardNumber = "Card number must be 16 digits";
    }

    if (!expiryDate.includes("/")) {
      newErrors.expiryDate = "Invalid expiry date (MM/YY)";
    } else {
      const month = expiryDate.split("/")[0];
      const monthNum = parseInt(month, 10);
      if (monthNum < 1 || monthNum > 12) {
        newErrors.expiryDate = "Invalid month (01-12)";
      }
    }

    if (cvc.length !== 3) {
      newErrors.cvc = "CVC must be 3 digits";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setIsProcessing(true);

    // Simulate payment processing delay (1.5 seconds)
    setTimeout(async () => {
      try {
        await onConfirm();
      } catch (err) {
        console.error("Payment failed", err);
      } finally {
        setIsProcessing(false);
      }
    }, 1500);
  };

  // Format limits text
  let limitsText = "";
  if (plan.reviewsLimit === -1) {
    limitsText = "Unlimited Decks";
  } else {
    limitsText = `${plan.reviewsLimit} ${plan.reviewsLimit === 1 ? "Deck" : "Decks"}`;
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-navy/60 backdrop-blur-sm transition-opacity"
        onClick={isProcessing ? undefined : onCancel}
      />

      {/* Modal Content */}
      <div className="relative w-full max-w-md overflow-hidden rounded-2xl border border-line bg-paper p-6 shadow-2xl animate-fade-up font-sans text-navy">
        {/* Close Button */}
        <button
          type="button"
          onClick={onCancel}
          disabled={isProcessing}
          className="absolute right-4 top-4 text-muted hover:text-navy disabled:opacity-30 transition-colors p-1 rounded-lg hover:bg-paper-warm/50"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="flex items-center gap-2 mb-6">
          <Lock className="w-5 h-5 text-gold" />
          <h3 className="text-xl font-display font-bold text-navy leading-none">
            Secure Checkout
          </h3>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Plan Info Card */}
          <div className="bg-paper-warm/40 border border-line/60 rounded-xl p-4">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h4 className="font-display font-bold text-lg text-navy leading-tight">
                  {plan.name} Plan
                </h4>
                <p className="text-xs text-muted mt-0.5">Monthly Subscription</p>
              </div>
              <span className="bg-[#f0e6cb]/80 text-[#8b6508] border border-[#d4c59b]/60 px-2.5 py-0.5 rounded text-[10px] font-mono tracking-wider uppercase font-semibold">
                {limitsText}
              </span>
            </div>

            <div className="space-y-2 text-sm pt-3 border-t border-line/40">
              <div className="flex justify-between text-muted">
                <span>Subtotal</span>
                <span>${plan.priceMonth.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-muted">
                <span>Estimated Tax</span>
                <span>$0.00</span>
              </div>
              <div className="flex justify-between font-bold text-navy pt-1 border-t border-line/20">
                <span>Total Due</span>
                <span className="text-gold font-mono">${plan.priceMonth.toFixed(2)}</span>
              </div>
            </div>
          </div>

          {/* Credit Card Details Header */}
          <div className="flex items-center gap-2 text-xs font-semibold tracking-wider text-muted uppercase">
            <Lock className="w-3.5 h-3.5 text-gold/80" />
            <span>Credit Card Details</span>
          </div>

          {/* Fields */}
          <div className="space-y-4">
            {/* Cardholder Name */}
            <div>
              <label htmlFor="cardholderName" className="block text-xs font-semibold text-muted mb-1">
                CARDHOLDER NAME
              </label>
              <input
                id="cardholderName"
                type="text"
                required
                disabled={isProcessing}
                value={cardholderName}
                onChange={(e) => {
                  setCardholderName(e.target.value);
                  if (errors.cardholderName) setErrors((prev) => ({ ...prev, cardholderName: "" }));
                }}
                className={`w-full px-3 py-2 border rounded-md bg-paper text-sm text-navy placeholder:text-muted/50 focus:outline-none focus:ring-1 transition-all ${
                  errors.cardholderName
                    ? "border-burgundy focus:ring-burgundy/30"
                    : "border-line focus:border-gold focus:ring-gold/30"
                }`}
                placeholder="Jane Doe"
              />
              {errors.cardholderName && (
                <p className="text-burgundy text-[11px] mt-1">{errors.cardholderName}</p>
              )}
            </div>

            {/* Card Number */}
            <div>
              <label htmlFor="cardNumber" className="block text-xs font-semibold text-muted mb-1">
                CARD NUMBER
              </label>
              <div className="relative">
                <input
                  id="cardNumber"
                  type="text"
                  required
                  disabled={isProcessing}
                  value={cardNumber}
                  onChange={handleCardNumberChange}
                  className={`w-full pl-3 pr-10 py-2 border rounded-md bg-paper text-sm text-navy font-mono placeholder:text-muted/50 focus:outline-none focus:ring-1 transition-all ${
                    errors.cardNumber
                      ? "border-burgundy focus:ring-burgundy/30"
                      : "border-line focus:border-gold focus:ring-gold/30"
                  }`}
                  placeholder="4242 4242 4242 4242"
                />
                <CreditCard className="absolute right-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted" />
              </div>
              {errors.cardNumber && (
                <p className="text-burgundy text-[11px] mt-1">{errors.cardNumber}</p>
              )}
            </div>

            {/* Expiry Date & CVC */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label htmlFor="expiryDate" className="block text-xs font-semibold text-muted mb-1">
                  EXPIRY DATE
                </label>
                <input
                  id="expiryDate"
                  type="text"
                  required
                  disabled={isProcessing}
                  value={expiryDate}
                  onChange={handleExpiryChange}
                  className={`w-full px-3 py-2 border rounded-md bg-paper text-sm text-navy font-mono placeholder:text-muted/50 focus:outline-none focus:ring-1 transition-all ${
                    errors.expiryDate
                      ? "border-burgundy focus:ring-burgundy/30"
                      : "border-line focus:border-gold focus:ring-gold/30"
                  }`}
                  placeholder="MM/YY"
                />
                {errors.expiryDate && (
                  <p className="text-burgundy text-[11px] mt-1">{errors.expiryDate}</p>
                )}
              </div>

              <div>
                <label htmlFor="cvc" className="block text-xs font-semibold text-muted mb-1">
                  CVC
                </label>
                <input
                  id="cvc"
                  type="password"
                  required
                  disabled={isProcessing}
                  value={cvc}
                  onChange={handleCvcChange}
                  className={`w-full px-3 py-2 border rounded-md bg-paper text-sm text-navy font-mono placeholder:text-muted/50 focus:outline-none focus:ring-1 transition-all ${
                    errors.cvc
                      ? "border-burgundy focus:ring-burgundy/30"
                      : "border-line focus:border-gold focus:ring-gold/30"
                  }`}
                  placeholder="•••"
                />
                {errors.cvc && (
                  <p className="text-burgundy text-[11px] mt-1">{errors.cvc}</p>
                )}
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={onCancel}
              disabled={isProcessing}
              className="flex-1 py-3 px-4 border border-line bg-paper-warm text-navy hover:border-gold hover:bg-paper rounded-md text-sm font-semibold transition-all duration-300 disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isProcessing}
              className="flex-1 py-3 px-4 bg-navy text-chalk hover:bg-navy-soft rounded-md text-sm font-semibold transition-all duration-300 shadow-md shadow-navy/15 hover:shadow-lg hover:shadow-navy/25 flex items-center justify-center gap-2 disabled:opacity-75 disabled:transform-none"
            >
              {isProcessing ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin text-gold" />
                  <span>Processing...</span>
                </>
              ) : (
                `Pay $${plan.priceMonth.toFixed(2)}`
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
