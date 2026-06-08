import React from "react";

interface FormSectionProps {
  title: string;
  description?: string;
  children: React.ReactNode;
}

export const FormSection: React.FC<FormSectionProps> = ({ title, description, children }) => {
  return (
    <div className="border border-line rounded-2xl bg-paper-warm/50 p-6 sm:p-8 animate-fade-up">
      <div className="mb-6">
        <h3 className="text-2xl font-display text-navy mb-1">{title}</h3>
        {description && <p className="text-sm text-muted font-sans">{description}</p>}
      </div>
      <div className="space-y-4 font-sans">{children}</div>
    </div>
  );
};
