import React from "react";
import MatchTeamTable from "./MatchTeamTable";
import { UIMatch, UIPlayer } from "@/types/ui-match";

interface MatchCardTabsProps {
  tab: string;
  setTab: (tab: string) => void;
  match: UIMatch;
  redTeam: UIPlayer[];
  blueTeam: UIPlayer[];
}

const MatchCardTabs: React.FC<MatchCardTabsProps> = ({
  tab,
  setTab,
  match,
  redTeam,
  blueTeam,
}) => {
  // Use a unique group name for each match card (use gameId)
  const groupId = `match_tabs_${match.gameId || "default"}`;
  return (
    <div className="w-full">
      <div className="tabs tabs-lift w-full">
        {/* Overview Tab */}
        <input
          type="radio"
          name={groupId}
          className="tab"
          aria-label="Overview"
          checked={tab === "overview"}
          onChange={() => setTab("overview")}
        />
        <div className="tab-content bg-base-100 border-base-300 p-6">
          {tab === "overview" && (
            <div className="flex flex-col gap-4">
              <MatchTeamTable
                players={redTeam}
                team="Victory (Red)"
                teamColor="red"
                teamStats={{
                  kills: match.details.kills.red,
                  gold: match.details.gold.red,
                }}
              />
              <MatchTeamTable
                players={blueTeam}
                team="Defeat (Blue)"
                teamColor="blue"
                teamStats={{
                  kills: match.details.kills.blue,
                  gold: match.details.gold.blue,
                }}
              />
            </div>
          )}
        </div>
        {/* Team analysis Tab */}
        <input
          type="radio"
          name={groupId}
          className="tab"
          aria-label="Team analysis"
          checked={tab === "team"}
          onChange={() => setTab("team")}
        />
        <div className="tab-content bg-base-100 border-base-300 p-6">
          {tab === "team" && (
            <div className="flex flex-col gap-2 text-base-content/80 p-2">
              <div>
                <span className="font-semibold">Duration:</span>{" "}
                <span className="badge badge-outline ml-1 badge-lg">
                  {match.details.duration}
                </span>
              </div>
              <div>
                <span className="font-semibold">Gold:</span>{" "}
                <span className="badge badge-error ml-1 badge-lg">
                  Red {match.details.gold.red}
                </span>{" "}
                /{" "}
                <span className="badge badge-info ml-1 badge-lg">
                  Blue {match.details.gold.blue}
                </span>
              </div>
              <div>
                <span className="font-semibold">Kills:</span>{" "}
                <span className="badge badge-error ml-1 badge-lg">
                  Red {match.details.kills.red}
                </span>{" "}
                /{" "}
                <span className="badge badge-info ml-1 badge-lg">
                  Blue {match.details.kills.blue}
                </span>
              </div>
              <div>
                <span className="font-semibold">Towers:</span>{" "}
                <span className="badge badge-error ml-1 badge-lg">
                  Red {match.details.towers.red}
                </span>{" "}
                /{" "}
                <span className="badge badge-info ml-1 badge-lg">
                  Blue {match.details.towers.blue}
                </span>
              </div>
              <div>
                <span className="font-semibold">Dragons:</span>{" "}
                <span className="badge badge-error ml-1 badge-lg">
                  Red {match.details.dragons.red}
                </span>{" "}
                /{" "}
                <span className="badge badge-info ml-1 badge-lg">
                  Blue {match.details.dragons.blue}
                </span>
              </div>
            </div>
          )}
        </div>
        {/* Build Tab */}
        <input
          type="radio"
          name={groupId}
          className="tab"
          aria-label="Build"
          checked={tab === "build"}
          onChange={() => setTab("build")}
        />
        <div className="tab-content bg-base-100 border-base-300 p-6">
          {tab === "build" && (
            <div className="flex flex-col gap-2 text-base-content/80 p-2">
              <div className="alert alert-info shadow-lg">
                Build, runes, spells, etc. (à venir)
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MatchCardTabs;
