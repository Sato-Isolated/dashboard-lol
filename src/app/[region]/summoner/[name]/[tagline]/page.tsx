import MainLayout from "@/components/layout/MainLayout";
import { fetchSummonerFull } from "@/lib/summoner";
import HeaderSection from "@/components/layout/HeaderSection";
import TabsSection from "@/components/match/TabsSection";
import LeftColumn from "@/components/layout/LeftColumn";
import CenterColumn from "@/components/layout/CenterColumn";
import RightColumn from "@/components/layout/RightColumn";

interface PageParams {
  region: string; // ex: "euw1"
  name: string; // ex: "RiotGames"
  tagline: string; // ex: "RiotGames"
}

export default async function Page({ params }: { params: PageParams }) {
  const { region, name, tagline } = await params;
  const data = await fetchSummonerFull(region, name, tagline); // ✅ CLASSIQUE

  if (!data)
    return <div className="text-center text-error mt-8">Account not found</div>;

  const { account, summoner } = data;

  return (
    <MainLayout>
      <div className="flex flex-col gap-8 w-full">
        <HeaderSection summoner={summoner} account={account} region={region} />
        <TabsSection />
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 w-full">
          <LeftColumn />
          <CenterColumn />
          <RightColumn />
        </div>
      </div>
    </MainLayout>
  );
}
