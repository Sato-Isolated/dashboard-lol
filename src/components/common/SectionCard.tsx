import React from "react";

interface SectionCardProps {
  title: string;
  loading: boolean;
  error: string | null;
  children: React.ReactNode;
  role?: string;
}

const SectionCard: React.FC<SectionCardProps> = ({
  title,
  loading,
  error,
  children,
  role = "region",
}) => (
  <section
    className="bg-base-100 rounded-xl shadow p-4 min-h-[200px] flex flex-col items-center w-full"
    aria-busy={loading}
    aria-live="polite"
    role={role}
  >
    <span className="font-semibold text-base-content mb-2">{title}</span>
    {loading ? (
      <span className="text-base-content/50 text-xs">Loading...</span>
    ) : error ? (
      <span className="text-error text-xs text-center mb-2">{error}</span>
    ) : (
      children
    )}
  </section>
);
export default SectionCard; 