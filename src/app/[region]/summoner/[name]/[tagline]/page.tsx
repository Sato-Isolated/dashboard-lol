
import { fetchSummonerFull } from "@/lib/summoner";
import PageWithTabs from "./PageWithTabs";

interface PageParams {
  region: string; // ex: "euw1"
  name: string; // ex: "RiotGames"
  tagline: string; // ex: "RiotGames"
}

export default async function Page({ params }: { params: PageParams }) {
  const { region, name, tagline } = await params;
  const data = await fetchSummonerFull(region, name, tagline);

  if (!data)
    return <div className="text-center text-error mt-8">Account not found</div>;

  return <PageWithTabs data={data} />;
}
