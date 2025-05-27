import React, { useState } from 'react';
import ChampionCard, {
  type ChampionCardData,
  type ChampionStats,
  type ChampionMastery,
} from '../ChampionCard';
import type { ChampionData } from '@/shared/types/data/champion';

// Example Champion Data
const exampleChampionData: ChampionData = {
  version: '14.1.1',
  id: 'Ahri',
  key: '103',
  name: 'Ahri',
  title: 'the Nine-Tailed Fox',
  blurb:
    'Innately connected to the latent power of Runeterra, Ahri is a vastaya who can reshape magic into orbs of raw energy.',
  info: {
    attack: 3,
    defense: 4,
    magic: 8,
    difficulty: 5,
  },
  image: {
    full: 'Ahri.png',
    sprite: 'champion0.png',
    group: 'champion',
    x: 48,
    y: 0,
    w: 48,
    h: 48,
  },
  tags: ['Mage', 'Assassin'],
  partype: 'Mana',
  stats: {
    hp: 570,
    hpperlevel: 96,
    mp: 418,
    mpperlevel: 25,
    movespeed: 330,
    armor: 21,
    armorperlevel: 4.7,
    spellblock: 30,
    spellblockperlevel: 1.3,
    attackrange: 550,
    hpregen: 2.5,
    hpregenperlevel: 0.6,
    mpregen: 8,
    mpregenperlevel: 0.8,
    crit: 0,
    critperlevel: 0,
    attackdamage: 53,
    attackdamageperlevel: 3,
    attackspeedperlevel: 2,
    attackspeed: 0.668,
  },
};

const exampleStats: ChampionStats = {
  champion: 'Ahri',
  games: 45,
  wins: 31,
  kda: 2.4,
  kills: 108,
  deaths: 67,
  assists: 93,
};

const exampleMastery: ChampionMastery = {
  championId: 103,
  championPoints: 125674,
  championLevel: 7,
};

// High-level champion example
const highLevelChampionData: ChampionData = {
  ...exampleChampionData,
  id: 'Yasuo',
  name: 'Yasuo',
  title: 'the Unforgiven',
  blurb:
    'An Ionian of deep resolve, Yasuo is an agile swordsman who wields the air itself against his enemies.',
  info: {
    attack: 8,
    defense: 4,
    magic: 4,
    difficulty: 10,
  },
  tags: ['Fighter', 'Assassin'],
};

const highLevelStats: ChampionStats = {
  champion: 'Yasuo',
  games: 127,
  wins: 89,
  kda: 3.1,
  kills: 394,
  deaths: 203,
  assists: 236,
};

const highLevelMastery: ChampionMastery = {
  championId: 157,
  championPoints: 567890,
  championLevel: 7,
};

// Support champion example
const supportChampionData: ChampionData = {
  ...exampleChampionData,
  id: 'Thresh',
  name: 'Thresh',
  title: 'the Chain Warden',
  blurb:
    'Sadistic and cunning, Thresh is an ambitious and restless spirit of the Shadow Isles.',
  info: {
    attack: 5,
    defense: 6,
    magic: 6,
    difficulty: 7,
  },
  tags: ['Support', 'Tank'],
};

const supportStats: ChampionStats = {
  champion: 'Thresh',
  games: 23,
  wins: 19,
  kda: 4.2,
  kills: 23,
  deaths: 34,
  assists: 120,
};

const supportMastery: ChampionMastery = {
  championId: 412,
  championPoints: 45230,
  championLevel: 5,
};

const ChampionCardExamples: React.FC = () => {
  const [selectedVariant, setSelectedVariant] = useState<
    'compact' | 'default' | 'detailed'
  >('default');
  const [showLoading, setShowLoading] = useState(false);

  const champions: ChampionCardData[] = [
    {
      championData: exampleChampionData,
      stats: exampleStats,
      mastery: exampleMastery,
    },
    {
      championData: highLevelChampionData,
      stats: highLevelStats,
      mastery: highLevelMastery,
    },
    {
      championData: supportChampionData,
      stats: supportStats,
      mastery: supportMastery,
    },
  ];

  return (
    <div className='space-y-8 p-6'>
      <div className='text-center'>
        <h1 className='text-3xl font-bold text-base-content mb-2'>
          ChampionCard Component Examples
        </h1>
        <p className='text-base-content/70 mb-6'>
          Demonstrating all variants and usage patterns of the ChampionCard
          component
        </p>
      </div>

      {/* Controls */}
      <div className='card bg-base-200 p-4 rounded-xl'>
        <h2 className='text-xl font-semibold mb-4'>Controls</h2>
        <div className='flex flex-wrap gap-4 items-center'>
          <div className='form-control'>
            <label className='label'>
              <span className='label-text'>Variant:</span>
            </label>
            <select
              className='select select-bordered'
              value={selectedVariant}
              onChange={e =>
                setSelectedVariant(
                  e.target.value as 'compact' | 'default' | 'detailed'
                )
              }
            >
              <option value='compact'>Compact</option>
              <option value='default'>Default</option>
              <option value='detailed'>Detailed</option>
            </select>
          </div>
          <div className='form-control'>
            <label className='label cursor-pointer'>
              <span className='label-text mr-2'>Show Loading:</span>
              <input
                type='checkbox'
                className='toggle toggle-primary'
                checked={showLoading}
                onChange={e => setShowLoading(e.target.checked)}
              />
            </label>
          </div>
        </div>
      </div>

      {/* Examples Grid */}
      <div className='space-y-6'>
        <h2 className='text-2xl font-semibold text-base-content'>
          {selectedVariant.charAt(0).toUpperCase() + selectedVariant.slice(1)}
          Variant
        </h2>

        <div
          className={`grid gap-4 ${
            selectedVariant === 'compact'
              ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3'
              : selectedVariant === 'detailed'
                ? 'grid-cols-1 lg:grid-cols-2'
                : 'grid-cols-1 md:grid-cols-2'
          }`}
        >
          {champions.map((champion, index) => (
            <ChampionCard
              key={`${champion.championData.id}-${index}`}
              champion={champion}
              variant={selectedVariant}
              loading={showLoading}
              onClick={() =>
                console.log(`Clicked on ${champion.championData.name}`)
              }
              showStats={true}
              showMastery={true}
            />
          ))}
        </div>
      </div>

      {/* Usage Examples */}
      <div className='space-y-6'>
        <h2 className='text-2xl font-semibold text-base-content'>
          Usage Examples
        </h2>

        {/* Stats Only */}
        <div>
          <h3 className='text-lg font-semibold mb-3'>
            Statistics Only (No Mastery)
          </h3>
          <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
            <ChampionCard
              champion={{
                championData: exampleChampionData,
                stats: exampleStats,
              }}
              variant='default'
              showStats={true}
              showMastery={false}
            />
            <ChampionCard
              champion={{
                championData: highLevelChampionData,
                stats: highLevelStats,
              }}
              variant='default'
              showStats={true}
              showMastery={false}
            />
          </div>
        </div>

        {/* Mastery Only */}
        <div>
          <h3 className='text-lg font-semibold mb-3'>
            Mastery Only (No Stats)
          </h3>
          <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
            <ChampionCard
              champion={{
                championData: exampleChampionData,
                mastery: exampleMastery,
              }}
              variant='default'
              showStats={false}
              showMastery={true}
            />
            <ChampionCard
              champion={{
                championData: supportChampionData,
                mastery: supportMastery,
              }}
              variant='default'
              showStats={false}
              showMastery={true}
            />
          </div>
        </div>

        {/* Basic Champion Info Only */}
        <div>
          <h3 className='text-lg font-semibold mb-3'>Champion Info Only</h3>
          <div className='grid grid-cols-1 md:grid-cols-3 gap-4'>
            <ChampionCard
              champion={{
                championData: exampleChampionData,
              }}
              variant='compact'
              showStats={false}
              showMastery={false}
            />
            <ChampionCard
              champion={{
                championData: highLevelChampionData,
              }}
              variant='compact'
              showStats={false}
              showMastery={false}
            />
            <ChampionCard
              champion={{
                championData: supportChampionData,
              }}
              variant='compact'
              showStats={false}
              showMastery={false}
            />
          </div>
        </div>

        {/* Loading States */}
        <div>
          <h3 className='text-lg font-semibold mb-3'>Loading States</h3>
          <div className='grid grid-cols-1 md:grid-cols-3 gap-4'>
            <ChampionCard
              champion={{
                championData: exampleChampionData,
              }}
              variant='compact'
              loading={true}
            />
            <ChampionCard
              champion={{
                championData: exampleChampionData,
              }}
              variant='default'
              loading={true}
            />
            <ChampionCard
              champion={{
                championData: exampleChampionData,
              }}
              variant='detailed'
              loading={true}
            />
          </div>
        </div>
      </div>

      {/* Integration Examples */}
      <div className='card bg-base-100 p-6 rounded-xl'>
        <h2 className='text-xl font-semibold mb-4'>Integration Notes</h2>
        <div className='space-y-3 text-sm'>
          <div>
            <strong>ChampionsTab Integration:</strong> Use with ChampionStats
            interface for performance data
          </div>
          <div>
            <strong>MasteryTab Integration:</strong> Use with ChampionMastery
            interface for mastery progression
          </div>
          <div>
            <strong>Champion Browser:</strong> Use basic ChampionData for
            champion exploration
          </div>
          <div>
            <strong>Combined Views:</strong> Merge stats and mastery data for
            comprehensive champion profiles
          </div>
        </div>
      </div>

      {/* Code Examples */}
      <div className='card bg-base-100 p-6 rounded-xl'>
        <h2 className='text-xl font-semibold mb-4'>Code Examples</h2>
        <div className='space-y-4'>
          <div>
            <h3 className='font-semibold mb-2'>Basic Usage:</h3>
            <pre className='bg-base-200 p-3 rounded text-sm overflow-x-auto'>
              {`<ChampionCard
  champion={{
    championData: championData,
    stats: championStats,
    mastery: championMastery
  }}
  variant="default"
  onClick={() => navigate(\`/champion/\${championData.id}\`)}
/>`}
            </pre>
          </div>
          <div>
            <h3 className='font-semibold mb-2'>Compact Grid:</h3>
            <pre className='bg-base-200 p-3 rounded text-sm overflow-x-auto'>
              {`<div className="grid grid-cols-1 md:grid-cols-3 gap-4">
  {champions.map(champion => (
    <ChampionCard
      key={champion.championData.id}
      champion={champion}
      variant="compact"
      showMastery={false}
    />
  ))}
</div>`}
            </pre>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChampionCardExamples;
