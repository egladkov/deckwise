import React from "react";

export const Footer: React.FC = () => {
  return (
    <footer className="w-full bg-ink bg-dot-matrix border-t border-line-dark/20 text-muted/65 text-xs font-sans relative py-8">
      <div className="max-w-7xl mx-auto px-6 sm:px-12 flex flex-col sm:flex-row justify-between items-center gap-4">
        <p className="font-medium tracking-tight">
          © {new Date().getFullYear()} Deckwise Ventures LLC. All rights reserved.
        </p>
        <p className="text-[11px] text-muted/50 font-normal tracking-tight text-center sm:text-right max-w-md sm:max-w-none">
          Deckwise AI is analytical software — not investment advice or a broker-dealer.
        </p>
      </div>
    </footer>
  );
};
