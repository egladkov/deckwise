import React from "react";
import Link from "next/link";

interface LogoProps {
  showText?: boolean;
  href?: string;
  className?: string;
}

export const Logo: React.FC<LogoProps> = ({
  showText = true,
  href = "/",
  className = "",
}) => {
  return (
    <Link
      href={href}
      className={`group inline-flex items-center gap-2.5 ${className}`}
      aria-label="Deckwise AI home"
    >
      <span
        className="relative grid shrink-0 place-items-center overflow-hidden rounded-lg border border-line-dark bg-navy transition-transform duration-300 group-hover:scale-[1.03]"
        style={{ width: "38px", height: "38px" }}
      >
        <svg viewBox="0 0 40 40" width="30" height="30" aria-hidden="true">
          <defs>
            <linearGradient id="dw-gold" x1="0" y1="1" x2="1" y2="0">
              <stop offset="0" stopColor="#a88620" />
              <stop offset="1" stopColor="#e8d48b" />
            </linearGradient>
          </defs>
          <rect
            x="6"
            y="10"
            width="14"
            height="18"
            rx="1.5"
            fill="none"
            stroke="url(#dw-gold)"
            strokeWidth="1.8"
          />
          <path
            d="M9 15h8M9 18h6M9 21h5"
            stroke="#f7f3eb"
            strokeWidth="1.2"
            strokeLinecap="round"
            opacity="0.65"
          />
          <ellipse
            cx="27"
            cy="16"
            rx="5.5"
            ry="4"
            fill="none"
            stroke="#f7f3eb"
            strokeWidth="1.5"
          />
          <circle cx="27" cy="16" r="2" fill="#c9a227" />
          <path
            d="M22 28 L26 24 L29 26 L34 20"
            fill="none"
            stroke="url(#dw-gold)"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M32 20h2v2"
            stroke="url(#dw-gold)"
            strokeWidth="2"
            strokeLinecap="round"
          />
        </svg>
      </span>
      {showText && (
        <span className="font-sans text-[15px] font-semibold tracking-tight text-navy">
          Deckwise AI
        </span>
      )}
    </Link>
  );
};
