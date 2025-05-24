import { MongoService } from "@/lib/MongoService";
import { getSummonerIcon } from "@/utils/helper";
import type { Document } from "mongodb";
import Image from "next/image";
import Link from "next/link";

const PLATFORMS = [
  { label: "EUW", value: "euw1" },
  { label: "EUNE", value: "eun1" },
  { label: "NA", value: "na1" },
  { label: "KR", value: "kr" },
  // Ajoute d'autres plateformes si besoin
];

type LeaderboardEntry = {
  name: string;
  aramScore: number;
  profileIconId: number;
  tagline: string;
};

async function getLeaderboard(platform: string): Promise<LeaderboardEntry[]> {
  const mongo = MongoService.getInstance();
  const collection = await mongo.getCollection("summoners");
  const leaderboard = (await collection
    .find({
      region: platform,
      aramScore: { $exists: true },
      profileIconId: { $exists: true },
      tagline: { $exists: true },
    })
    .sort({ aramScore: -1 })
    .limit(100)
    .project({ _id: 0, name: 1, aramScore: 1, profileIconId: 1, tagline: 1 })
    .toArray()) as Document[];
  // Cast/Map pour garantir le typage
  return leaderboard.map((entry: Document) => ({
    name: entry.name ?? "",
    aramScore: entry.aramScore ?? 0,
    profileIconId: entry.profileIconId ?? 29, // fallback icon
    tagline: entry.tagline ?? "",
  }));
}

export default async function AramScoreRankPage(props: {
  searchParams?: Promise<{ platform?: string }>;
}) {
  const searchParams = await props.searchParams;
  const platform = searchParams?.platform || "euw1";
  const leaderboard = await getLeaderboard(platform);

  return (
    <div className="p-4 max-w-3xl mx-auto min-h-[84vh]">
      <h1 className="text-2xl font-bold mb-4">AramScore Leaderboard</h1>
      <div className="mb-4">
        <form method="get">
          <label htmlFor="platform" className="mr-2 font-semibold">
            Platform:
          </label>
          <select
            id="platform"
            name="platform"
            defaultValue={platform}
            className="select select-bordered"
          >
            {PLATFORMS.map((p) => (
              <option key={p.value} value={p.value}>
                {p.label}
              </option>
            ))}
          </select>
          <button type="submit" className="btn btn-sm ml-2">
            View
          </button>
        </form>
      </div>
      <table className="table table-zebra table-lg w-full flex-grow">
        <thead>
          <tr>
            <th className="text-lg">#</th>
            <th className="text-lg">Summoner</th>
            <th className="text-lg">ARAM Score</th>
          </tr>
        </thead>
        <tbody>
          {leaderboard.map((entry, i) => (
            <tr key={entry.name} className="h-20">
              <td className="text-xl font-bold">{i + 1}</td>
              <td className="flex items-center gap-4">
                <div className="relative w-16 h-16">
                  <Image
                    src={getSummonerIcon(entry.profileIconId)}
                    alt="icon"
                    fill
                    className="rounded-full border border-base-300 object-cover"
                    sizes="64px"
                    priority={i < 10}
                  />
                </div>
                <Link
                  href={`/${platform}/summoner/${encodeURIComponent(
                    entry.name
                  )}/${encodeURIComponent(entry.tagline)}`}
                  className="text-lg font-semibold hover:underline"
                >
                  {entry.name.replace(/ /g, "\u00A0")}
                </Link>
              </td>
              <td className="text-lg">{entry.aramScore}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
