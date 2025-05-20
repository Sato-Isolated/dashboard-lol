import React from "react";

const fakeRanks = [
  {
    queue: "Solo/Duo",
    tier: "Plastic",
    division: "III",
    lp: 75,
    wins: 120,
    losses: 98,
  },
  { queue: "Flex", tier: "Wood", division: "I", lp: 23, wins: 60, losses: 55 },
];
const fakeRecentlyPlayed = [
  { name: "Petite Antilope", champion: "Ezreal", result: "Win" },
  { name: "HDinisPT", champion: "Lux", result: "Loss" },
  { name: "Koenigsohn", champion: "Jinx", result: "Win" },
];
const fakeMastery = [
  { champion: "Ahri", points: 320000 },
  { champion: "Lee Sin", points: 210000 },
  { champion: "Jinx", points: 180000 },
];

const LeftColumn: React.FC = () => (
  <div className="flex flex-col gap-4">
    <div className="bg-base-100 rounded-xl shadow p-4 w-full flex flex-col items-center">
      <span className="font-semibold text-base-content/80 mb-2">
        Rank & Badges
      </span>
      <div className="flex flex-col gap-1 w-full">
        {fakeRanks.map((rank, i) => (
          <div
            key={i}
            className="flex justify-between w-full text-base-content/80"
          >
            <span>{rank.queue}</span>
            <span>
              {rank.tier} {rank.division}{" "}
              <span className="text-xs">({rank.lp} LP)</span>
            </span>
            <span className="text-xs text-base-content/60">
              {rank.wins}W/{rank.losses}L
            </span>
          </div>
        ))}
      </div>
    </div>
    <div className="bg-base-100 rounded-xl shadow p-4 w-full flex flex-col items-center">
      <span className="font-semibold text-base-content/80 mb-2">
        Recently Played With
      </span>
      <div className="flex flex-col gap-1 w-full">
        {fakeRecentlyPlayed.map((p, i) => (
          <div
            key={i}
            className="flex justify-between w-full text-base-content/80"
          >
            <span>{p.name}</span>
            <span>{p.champion}</span>
            <span
              className={p.result === "Win" ? "text-success" : "text-error"}
            >
              {p.result}
            </span>
          </div>
        ))}
      </div>
    </div>
    <div className="bg-base-100 rounded-xl shadow p-4 w-full flex flex-col items-center">
      <span className="font-semibold text-base-content/80 mb-2">Mastery</span>
      <div className="flex flex-col gap-1 w-full">
        {fakeMastery.map((m, i) => (
          <div
            key={i}
            className="flex justify-between w-full text-base-content/80"
          >
            <span>{m.champion}</span>
            <span>{m.points.toLocaleString()} pts</span>
          </div>
        ))}
      </div>
    </div>
  </div>
);

export default LeftColumn;
