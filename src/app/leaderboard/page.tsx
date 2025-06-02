import { MongoService } from '@/lib/api/database/MongoService';
import type { Document } from 'mongodb';
import { LeaderboardClient } from '@/features/leaderboard';

const PLATFORMS = [
  { label: 'EUW', value: 'euw1', flag: '🇪🇺', fullName: 'Europe West' },
  {
    label: 'EUNE',
    value: 'eun1',
    flag: '🇪🇺',
    fullName: 'Europe Nordic & East',
  },
  { label: 'NA', value: 'na1', flag: '🇺🇸', fullName: 'North America' },
  { label: 'KR', value: 'kr', flag: '🇰🇷', fullName: 'Korea' },
  { label: 'BR', value: 'br1', flag: '🇧🇷', fullName: 'Brazil' },
  { label: 'LAN', value: 'la1', flag: '🌎', fullName: 'Latin America North' },
  { label: 'LAS', value: 'la2', flag: '🌎', fullName: 'Latin America South' },
  { label: 'OCE', value: 'oc1', flag: '🇦🇺', fullName: 'Oceania' },
  { label: 'RU', value: 'ru', flag: '🇷🇺', fullName: 'Russia' },
  { label: 'TR', value: 'tr1', flag: '🇹🇷', fullName: 'Turkey' },
  { label: 'JP', value: 'jp1', flag: '🇯🇵', fullName: 'Japan' },
];

export type LeaderboardEntry = {
  name: string;
  aramScore: number;
  profileIconId: number;
  tagline: string;
};

async function getLeaderboard(platform: string): Promise<LeaderboardEntry[]> {
  const mongo = MongoService.getInstance();
  const collection = await mongo.getCollection('summoners');
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
    name: entry.name ?? '',
    aramScore: entry.aramScore ?? 0,
    profileIconId: entry.profileIconId ?? 29, // fallback icon
    tagline: entry.tagline ?? '',
  }));
}

export default async function AramScoreRankPage(props: {
  searchParams?: Promise<{ platform?: string }>;
}) {
  const searchParams = await props.searchParams;
  const platform = searchParams?.platform || 'euw1';
  const leaderboard = await getLeaderboard(platform);

  return (
    <LeaderboardClient
      initialLeaderboard={leaderboard}
      initialPlatform={platform}
      platforms={PLATFORMS}
    />
  );
}
