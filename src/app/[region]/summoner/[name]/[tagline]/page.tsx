import { RegionalRegionMap } from "@/types/regions";
import {
  createAccountService,
  createChampionMasteryService,
  createChampionService,
  createMatchService,
  createSummonerService,
} from "@/services/riotServiceFactory";

interface PageParams {
  region: string; // ex: "euw1"
  name: string; // ex: "RiotGames"
  tagline: string; // ex: "RiotGames"
}

export default async function Page({ params }: { params: PageParams }) {
  const platformRegion = params.region; // ex: "euw1"

  const accountApi = createAccountService(platformRegion);
  const account = await accountApi.getAccountByRiotId(
    params.name,
    params.tagline
  );

  if (!account) return <div>Account not found</div>;

  const summonerApi = createSummonerService(platformRegion);
  const summoner = await summonerApi.getSummonerByPuuid(account.puuid);

  return (
    <div className="p-8">
      <h1 className="text-2xl mb-4">Summoner Profile</h1>
      <pre>{JSON.stringify(account, null, 2)}</pre>
      <pre>{JSON.stringify(summoner, null, 2)}</pre>
    </div>
  );
}
