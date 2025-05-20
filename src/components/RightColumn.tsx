import React from "react";

const fakeWidgets = [
  { label: "Add to Favorites", icon: "⭐", action: "Favorited" },
  { label: "Share Profile", icon: "🔗", action: "Link copied!" },
  { label: "Report Player", icon: "🚩", action: "Reported" },
];

const RightColumn: React.FC = () => (
  <div className="flex flex-col gap-4">
    <div className="bg-base-100 rounded-xl shadow p-4 min-h-[120px] flex flex-col items-center justify-center text-base-content/60 w-full">
      <span className="font-semibold text-base-content mb-2">
        Widgets & Actions
      </span>
      <div className="flex flex-col gap-2 w-full items-center">
        {fakeWidgets.map((w, i) => (
          <button
            key={i}
            className="btn btn-sm btn-outline flex items-center gap-2 w-full justify-center"
          >
            <span>{w.icon}</span> {w.label}
          </button>
        ))}
      </div>
    </div>
  </div>
);

export default RightColumn;
