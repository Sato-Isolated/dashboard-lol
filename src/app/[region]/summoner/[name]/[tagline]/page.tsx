import { fetchSummonerFull } from "@/lib/summoner";
import PageWithTabs from "@/components/tabs/PageWithTabs";
import HeaderSection from "@/components/layout/HeaderSection";
import LeftColumn from "@/components/layout/LeftColumn";
import CenterColumn from "@/components/layout/CenterColumn";
import ChampionsTab from "@/components/tabs/ChampionsTab";
import MasteryTab from "@/components/tabs/MasteryTab";

interface PageParams {
  region: string;
  name: string;
  tagline: string;
}

export default async function Page(props: { params: Promise<PageParams> }) {
  const params = await props.params;
  const { region, name, tagline } = params;
  // Décoder le nom pour supporter les espaces et caractères spéciaux
  const decodedName = decodeURIComponent(name);
  const decodedTagline = decodeURIComponent(tagline);
  const data = await fetchSummonerFull(region, decodedName, decodedTagline);

  if (!data)
    return <div className="text-center text-error mt-8">Account not found</div>;

  return (
    <PageWithTabs
      header={<HeaderSection />}
      left={<LeftColumn />}
      center={<CenterColumn />}
      champions={<ChampionsTab />}
      mastery={<MasteryTab />}
    />
  );
}
