import MainLayout from "@/components/MainLayout";
import { fetchSummonerFull } from "@/lib/summoner";

interface PageParams {
  region: string; // ex: "euw1"
  name: string; // ex: "RiotGames"
  tagline: string; // ex: "RiotGames"
}

export default async function Page({ params }: { params: PageParams }) {
  const data = await fetchSummonerFull(
    params.region,
    params.name,
    params.tagline
  );

  if (!data)
    return <div className="text-center text-error mt-8">Account not found</div>;

  const { account, summoner } = data;

  return (
    <MainLayout>
      <div className="flex flex-col gap-8 w-full">
        {/* Header section with avatar, name, tagline, region */}
        <div className="flex flex-col md:flex-row items-center gap-4 w-full bg-base-200 rounded-xl p-6 shadow">
          <div className="flex items-center gap-4 w-full md:w-auto">
            <img
              src={summoner.profileIconUrl}
              alt={summoner.name}
              className="w-20 h-20 rounded-full border-4 border-primary"
            />
            <div className="flex flex-col">
              <span className="text-2xl font-bold text-base-content">
                {account.gameName}
                <span className="text-base-content/60">#{account.tagLine}</span>
              </span>
              <span className="text-base-content/70 text-sm mt-1">
                {params.region.toUpperCase()}
              </span>
              <span className="text-base-content/50 text-xs">
                Level {summoner.summonerLevel}
              </span>
            </div>
          </div>
          {/* Placeholder for actions (update, link, etc.) */}
          <div className="flex-1 flex justify-end items-center gap-2 w-full md:w-auto">
            {/* Future: update button, link, etc. */}
          </div>
        </div>
        {/* Tabs (Summary, Champions, Mastery, etc.) */}
        <div className="flex gap-2 w-full border-b border-base-300 pb-2">
          <button className="tab tab-active">Summary</button>
          <button className="tab">Champions</button>
          <button className="tab">Mastery</button>
          <button className="tab">Live Game</button>
          <button className="tab">Highlights</button>
        </div>
        {/* Main content grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 w-full">
          {/* Left column: Profile, rank, recently played, mastery */}
          <div className="flex flex-col gap-4">
            <div className="bg-base-100 rounded-xl shadow p-4 w-full flex flex-col items-center">
              <span className="font-semibold text-base-content/80">
                Rank & Badges
              </span>
              <div className="mt-2 text-base-content/60">(à venir)</div>
            </div>
            <div className="bg-base-100 rounded-xl shadow p-4 w-full flex flex-col items-center">
              <span className="font-semibold text-base-content/80">
                Recently Played With
              </span>
              <div className="mt-2 text-base-content/60">(à venir)</div>
            </div>
            <div className="bg-base-100 rounded-xl shadow p-4 w-full flex flex-col items-center">
              <span className="font-semibold text-base-content/80">
                Mastery
              </span>
              <div className="mt-2 text-base-content/60">(à venir)</div>
            </div>
          </div>
          {/* Center column: Main stats, graphs, match history */}
          <div className="flex flex-col gap-4">
            <div className="bg-base-100 rounded-xl shadow p-4 min-h-[120px] flex flex-col items-center justify-center text-base-content/60 w-full">
              <span className="font-semibold text-base-content">
                Main Stats & Graphs
              </span>
              <div className="mt-2">
                (KDA, winrate, champion pool, etc. à venir)
              </div>
            </div>
            <div className="bg-base-100 rounded-xl shadow p-4 min-h-[200px] flex flex-col items-center justify-center text-base-content/60 w-full">
              <span className="font-semibold text-base-content">
                Match History
              </span>
              <div className="mt-2">(Historique des parties à venir)</div>
            </div>
          </div>
          {/* Right column: Widgets, tips, actions */}
          <div className="flex flex-col gap-4">
            <div className="bg-base-100 rounded-xl shadow p-4 min-h-[120px] flex flex-col items-center justify-center text-base-content/60 w-full">
              <span className="font-semibold text-base-content">
                Widgets & Actions
              </span>
              <div className="mt-2">(Tips, favoris, partage, etc. à venir)</div>
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}
