import {
  TrendingUp,
  Users,
  Trophy,
  Gamepad2,
  BarChart3,
  Star,
} from 'lucide-react';
import { getDatabaseCounts } from '@/lib/utils/databaseStats';

export default async function Home() {
  // Fetch real counts from database
  const { playersCount, matchesCount } = await getDatabaseCounts();

  const stats = [
    {
      label: 'Players Tracked',
      value: playersCount.toLocaleString('en-US'),
      icon: Users,
      color: 'text-primary',
      isLive: true,
    },
    {
      label: 'ARAM Matches',
      value: matchesCount.toLocaleString('en-US'),
      icon: Gamepad2,
      color: 'text-secondary',
      isLive: true,
    },
    {
      label: 'Open Source',
      value: '100%',
      icon: Trophy,
      color: 'text-success',
      isLive: false,
    },
  ];
  const features = [
    {
      title: 'Match Tracking',
      description:
        'Track and analyze your ARAM match history with detailed statistics',
      icon: BarChart3,
      progress: 95,
    },
    {
      title: 'Champion Performance',
      description: 'Monitor your win rates and performance with each champion',
      icon: Trophy,
      progress: 88,
    },
    {
      title: 'ARAM Score Ranking',
      description:
        'Compete on leaderboards with our custom ARAM scoring system',
      icon: Users,
      progress: 75,
    },
  ];

  return (
    <div className='min-h-screen bg-gradient-to-br from-base-200 via-base-100 to-base-300'>
      {/* Hero Section */}
      <div className='hero min-h-[60vh] relative overflow-hidden'>
        {/* Background Effects */}
        <div className='absolute inset-0 bg-gradient-to-r from-primary/10 via-secondary/10 to-accent/10 animate-pulse'></div>
        <div className='absolute top-20 left-20 w-72 h-72 bg-primary/20 rounded-full blur-3xl animate-bounce-subtle'></div>
        <div className='absolute bottom-20 right-20 w-96 h-96 bg-secondary/20 rounded-full blur-3xl animate-bounce-subtle delay-1000'></div>

        <div className='hero-content text-center relative z-10'>
          <div className='max-w-4xl'>
            <h1 className='text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent mb-4 sm:mb-6'>
              League of Legends ARAM Dashboard
            </h1>
            <p className='text-lg sm:text-xl text-base-content/80 mb-6 sm:mb-8 leading-relaxed px-4 sm:px-0'>
              Track your ARAM performance, analyze champion statistics, and
              climb the community rankings with our open-source dashboard
            </p>
            <div className='flex flex-wrap gap-2 sm:gap-4 justify-center px-4 sm:px-0'>
              <div className='badge badge-primary badge-sm sm:badge-lg animate-glow'>
                <BarChart3 className='w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2' />
                <span className='text-xs sm:text-sm'>Performance Tracking</span>
              </div>
              <div className='badge badge-secondary badge-sm sm:badge-lg'>
                <Trophy className='w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2' />
                <span className='text-xs sm:text-sm'>ARAM Score System</span>
              </div>
              <div className='badge badge-accent badge-sm sm:badge-lg'>
                <Users className='w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2' />
                <span className='text-xs sm:text-sm'>Open Source</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Section */}
      <div className='container mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16'>
        <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 mb-12 sm:mb-16'>
          {stats.map(stat => (
            <div
              key={stat.label}
              className='card bg-base-100 shadow-xl transition-all duration-300 relative'
            >
              {stat.isLive && (
                <div className='absolute top-3 right-3'>
                  <div className='flex items-center gap-1'>
                    <div className='w-2 h-2 bg-success rounded-full animate-pulse'></div>
                    <span className='text-xs text-success font-bold'>LIVE</span>
                  </div>
                </div>
              )}
              <div className='card-body items-center text-center p-4 sm:p-6'>
                <stat.icon
                  className={`w-6 h-6 sm:w-8 sm:h-8 ${stat.color} mb-2`}
                />
                <h3 className='text-2xl sm:text-3xl font-bold text-primary'>
                  {stat.value}
                </h3>
                <p className='text-sm sm:text-base text-base-content/70 font-medium'>
                  {stat.label}
                </p>
              </div>
            </div>
          ))}
        </div>
        <div className='text-center mb-8 sm:mb-12'>
          <h2 className='text-2xl sm:text-3xl lg:text-4xl font-bold text-base-content mb-3 sm:mb-4'>
            Track Your ARAM Journey
          </h2>
          <p className='text-lg sm:text-xl text-base-content/70 px-4 sm:px-0'>
            Monitor your progress and compete with the community
          </p>
        </div>
        <div className='grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-8'>
          {features.map(feature => (
            <div
              key={feature.title}
              className='card bg-base-100 shadow-xl transition-all duration-300'
            >
              <div className='card-body p-4 sm:p-6'>
                <div className='flex items-center mb-4'>
                  <div className='p-2 sm:p-3 rounded-full bg-primary/20 transition-colors'>
                    <feature.icon className='w-5 h-5 sm:w-6 sm:h-6 text-primary' />
                  </div>
                  <h3 className='text-lg sm:text-xl font-bold ml-3 sm:ml-4'>
                    {feature.title}
                  </h3>
                </div>

                <p className='text-sm sm:text-base text-base-content/70 mb-4 sm:mb-6'>
                  {feature.description}
                </p>

                <div className='flex items-center justify-between'>
                  <span className='text-sm font-medium text-base-content/60'>
                    Development Progress
                  </span>
                  <span className='text-sm font-bold text-primary'>
                    {feature.progress}%
                  </span>
                </div>
                <progress
                  className='progress progress-primary w-full'
                  value={feature.progress}
                  max='100'
                ></progress>
              </div>
            </div>
          ))}
        </div>
        {/* Coming Soon Section */}
        <div className='mt-20 mb-16'>
          <div className='text-center mb-8 sm:mb-12'>
            <h2 className='text-2xl sm:text-3xl lg:text-4xl font-bold text-base-content mb-3 sm:mb-4'>
              Coming Soon
            </h2>
            <p className='text-lg sm:text-xl text-base-content/70 px-4 sm:px-0'>
              Exciting features in development
            </p>
          </div>

          <div className='grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8'>
            <div className='card bg-base-100 shadow-xl border border-primary/20'>
              <div className='card-body p-4 sm:p-6'>
                <div className='flex items-center mb-4'>
                  <div className='p-2 sm:p-3 rounded-full bg-warning/10'>
                    <Star className='w-5 h-5 sm:w-6 sm:h-6 text-warning' />
                  </div>
                  <h3 className='text-lg sm:text-xl font-bold ml-3 sm:ml-4'>
                    Achievement System
                  </h3>
                </div>
                <p className='text-sm sm:text-base text-base-content/70'>
                  Unlock achievements based on your ARAM performance. From first
                  pentakill to champion mastery milestones.
                </p>
                <div className='badge badge-warning badge-outline mt-3 sm:mt-4 text-xs sm:text-sm'>
                  In Development
                </div>
              </div>
            </div>

            <div className='card bg-base-100 shadow-xl border border-success/20'>
              <div className='card-body p-4 sm:p-6'>
                <div className='flex items-center mb-4'>
                  <div className='p-2 sm:p-3 rounded-full bg-success/10'>
                    <Users className='w-5 h-5 sm:w-6 sm:h-6 text-success' />
                  </div>
                  <h3 className='text-lg sm:text-xl font-bold ml-3 sm:ml-4'>
                    Open Source
                  </h3>
                </div>
                <p className='text-sm sm:text-base text-base-content/70'>
                  Built by the community, for the community. Contribute
                  features, report bugs, or suggest improvements on GitHub.
                </p>
                <div className='badge badge-success badge-outline mt-3 sm:mt-4 text-xs sm:text-sm'>
                  Available Now
                </div>
              </div>
            </div>
          </div>
        </div>
        {/* Call to Action Section */}
        <div className='text-center mt-20'>
          <div className='card bg-gradient-to-r from-primary/10 to-secondary/10 shadow-xl'>
            <div className='card-body p-6 sm:p-8'>
              <h2 className='text-2xl sm:text-3xl font-bold text-base-content mb-3 sm:mb-4 text-center'>
                Ready to Track Your Progress?
              </h2>
              <p className='text-base sm:text-lg text-base-content/70 mb-6 sm:mb-8 text-center px-2 sm:px-0'>
                Join the community and start tracking your ARAM performance
                today. Completely free and open source!
              </p>

              <div className='flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center'>
                <button className='btn btn-primary btn-md sm:btn-lg w-full sm:w-auto'>
                  <TrendingUp className='w-4 h-4 sm:w-5 sm:h-5 mr-2' />
                  <span className='text-sm sm:text-base'>Track Your Stats</span>
                </button>
                <a
                  href='https://github.com/Sato-Isolated/dashboard-lol'
                  target='_blank'
                  rel='noopener noreferrer'
                  className='btn btn-outline btn-md sm:btn-lg w-full sm:w-auto'
                >
                  <Trophy className='w-4 h-4 sm:w-5 sm:h-5 mr-2' />
                  <span className='text-sm sm:text-base'>View on GitHub</span>
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
