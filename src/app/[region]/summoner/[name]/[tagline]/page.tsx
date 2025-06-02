import { fetchSummonerFull } from '@/features/summoner/services/summonerDataService';
import PageWithTabs from '@/components/common/ui/PageWithTabs';
import HeaderSection from '@/features/summoner/components/SummonerHeader';
import LeftColumn from '@/features/summoner/components/SummonerProfile';
import CenterColumn from '@/features/matches/components/MatchHistory';
import dynamic from 'next/dynamic';
import { notFound } from 'next/navigation';

// Lazy load heavy components with loading fallbacks
const ChampionsTab = dynamic(
  () => import('@/features/champions/components/ChampionsTab'),
  {
    loading: () => (
      <div className='flex items-center justify-center h-64'>
        <div className='loading loading-spinner loading-lg' />
      </div>
    ),
  },
);

const MasteryTab = dynamic(
  () => import('@/features/champions/components/MasteryTab'),
  {
    loading: () => (
      <div className='flex items-center justify-center h-64'>
        <div className='loading loading-spinner loading-lg' />
      </div>
    ),
  },
);

interface PageParams {
  region: string;
  name: string;
  tagline: string;
}

export default async function Page(props: { params: Promise<PageParams> }) {
  const params = await props.params;
  const { region, name, tagline } = params;

  // Enhanced validation to catch static file requests and invalid formats

  // Check if this looks like a static file request (contains file extensions)
  if (name.includes('.') || tagline.includes('.')) {
    notFound();
  }

  // Check for common static file patterns that might slip through
  const staticFilePattern =
    /\.(js|css|map|json|ico|png|jpg|jpeg|gif|svg|woff|woff2|ttf|eot)$/i;
  if (staticFilePattern.test(name) || staticFilePattern.test(tagline)) {
    notFound();
  }

  // Check for source map or development file patterns
  if (
    name.toLowerCase().includes('installhook') ||
    name.toLowerCase().includes('webpack') ||
    name.toLowerCase().includes('chunk') ||
    tagline.toLowerCase().includes('installhook') ||
    tagline.toLowerCase().includes('webpack') ||
    tagline.toLowerCase().includes('chunk')
  ) {
    notFound();
  }

  // Decode the name to support spaces and special characters
  const decodedName = decodeURIComponent(name);
  const decodedTagline = decodeURIComponent(tagline);

  // Additional validation for tagline format (Riot taglines are alphanumeric)
  if (!/^[a-zA-Z0-9]+$/.test(decodedTagline)) {
    notFound();
  }

  // Validate summoner name format (basic validation)
  if (decodedName.length < 1 || decodedName.length > 16) {
    notFound();
  }

  const data = await fetchSummonerFull(region, decodedName, decodedTagline);

  if (!data) {
    return <div className='text-center text-error mt-8'>Account not found</div>;
  }

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
