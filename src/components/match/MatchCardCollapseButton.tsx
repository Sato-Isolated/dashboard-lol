import React from "react";

interface MatchCardCollapseButtonProps {
  open: boolean;
  onClick: (e: React.MouseEvent<HTMLButtonElement>) => void;
}

const MatchCardCollapseButton: React.FC<MatchCardCollapseButtonProps> = ({
  open,
  onClick,
}) => (
  <button
    className="absolute right-4 bottom-4 bg-base-100/90 glass rounded-full shadow-lg p-2 border-2 border-primary/30 hover:bg-primary/10 hover:scale-110 transition z-20 focus:outline-none focus:ring-2 focus:ring-primary/40"
    onClick={onClick}
    aria-label={open ? "Masquer les détails" : "Afficher les détails"}
    tabIndex={0}
    type="button"
  >
    <span
      className="text-2xl text-primary transition-transform duration-200 font-bold"
      style={{ transform: open ? "rotate(180deg)" : "rotate(0deg)" }}
    >
      {open ? "▲" : "▼"}
    </span>
  </button>
);

export default MatchCardCollapseButton;
