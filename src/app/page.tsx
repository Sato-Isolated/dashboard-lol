'use client';
import { motion } from 'framer-motion';
import {
  TrendingUp,
  Users,
  Trophy,
  Gamepad2,
  BarChart3,
  Star,
} from 'lucide-react';
import { useState, useEffect } from 'react';

export default function Home() {
  const [playersCount, setPlayersCount] = useState(0);
  const [matchesCount, setMatchesCount] = useState(0);

  // Animation des compteurs en temps réel
  useEffect(() => {
    const playersTarget = 2547;
    const matchesTarget = 18342;

    const animateCounter = (
      target: number,
      setter: (value: number) => void,
      duration: number = 2000
    ) => {
      const increment = target / (duration / 50);
      let current = 0;

      const timer = setInterval(() => {
        current += increment;
        if (current >= target) {
          setter(target);
          clearInterval(timer);
        } else {
          setter(Math.floor(current));
        }
      }, 50);

      return timer;
    };

    // Délai pour démarrer les animations
    const timeoutPlayers = setTimeout(
      () => animateCounter(playersTarget, setPlayersCount),
      500
    );
    const timeoutMatches = setTimeout(
      () => animateCounter(matchesTarget, setMatchesCount),
      800
    );

    return () => {
      clearTimeout(timeoutPlayers);
      clearTimeout(timeoutMatches);
    };
  }, []);

  // Simulation d'incréments en temps réel
  useEffect(() => {
    const interval = setInterval(() => {
      // Ajouter un match toutes les 30 secondes
      if (Math.random() > 0.5) {
        setMatchesCount(prev => prev + 1);
      }

      // Ajouter un joueur toutes les 2 minutes environ
      if (Math.random() > 0.9) {
        setPlayersCount(prev => prev + 1);
      }
    }, 30000);

    return () => clearInterval(interval);
  }, []);

  const stats = [
    {
      label: 'Players Tracked',
      value: playersCount.toLocaleString(),
      icon: Users,
      color: 'text-primary',
      isLive: true,
    },
    {
      label: 'ARAM Matches',
      value: matchesCount.toLocaleString(),
      icon: Gamepad2,
      color: 'text-secondary',
      isLive: true,
    },
    {
      label: 'Features Available',
      value: '12',
      icon: Star,
      color: 'text-accent',
      isLive: false,
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
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className='hero min-h-[60vh] relative overflow-hidden'
      >
        {/* Background Effects */}
        <div className='absolute inset-0 bg-gradient-to-r from-primary/10 via-secondary/10 to-accent/10 animate-pulse'></div>
        <div className='absolute top-20 left-20 w-72 h-72 bg-primary/20 rounded-full blur-3xl animate-bounce-subtle'></div>
        <div className='absolute bottom-20 right-20 w-96 h-96 bg-secondary/20 rounded-full blur-3xl animate-bounce-subtle delay-1000'></div>

        <div className='hero-content text-center relative z-10'>
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1, delay: 0.2 }}
            className='max-w-4xl'
          >
            <motion.h1
              className='text-6xl font-bold bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent mb-6'
              animate={{
                backgroundPosition: ['0% 50%', '100% 50%', '0% 50%'],
              }}
              transition={{ duration: 3, repeat: Infinity }}
            >
              League of Legends ARAM Dashboard
            </motion.h1>
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.5 }}
              className='text-xl text-base-content/80 mb-8 leading-relaxed'
            >
              Track your ARAM performance, analyze champion statistics, and
              climb the community rankings with our open-source dashboard
            </motion.p>{' '}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.7 }}
              className='flex flex-wrap gap-4 justify-center'
            >
              <div className='badge badge-primary badge-lg animate-glow'>
                <BarChart3 className='w-4 h-4 mr-2' />
                Performance Tracking
              </div>
              <div className='badge badge-secondary badge-lg'>
                <Trophy className='w-4 h-4 mr-2' />
                ARAM Score System
              </div>
              <div className='badge badge-accent badge-lg'>
                <Users className='w-4 h-4 mr-2' />
                Open Source
              </div>
            </motion.div>
          </motion.div>
        </div>
      </motion.div>

      {/* Stats Section */}
      <div className='container mx-auto px-4 py-16'>
        {' '}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.8 }}
          className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16'
        >
          {stats.map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
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
              <div className='card-body items-center text-center'>
                <stat.icon className={`w-8 h-8 ${stat.color} mb-2`} />
                <h3 className='text-3xl font-bold text-primary'>
                  {stat.value}
                </h3>
                <p className='text-base-content/70 font-medium'>{stat.label}</p>
              </div>
            </motion.div>
          ))}
        </motion.div>
        {/* Features Section */}{' '}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.8 }}
          className='text-center mb-12'
        >
          <h2 className='text-4xl font-bold text-base-content mb-4'>
            Track Your ARAM Journey
          </h2>
          <p className='text-xl text-base-content/70'>
            Monitor your progress and compete with the community
          </p>
        </motion.div>
        <div className='grid grid-cols-1 lg:grid-cols-3 gap-8'>
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, x: index % 2 === 0 ? -30 : 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: index * 0.2 }}
              className='card bg-base-100 shadow-xl transition-all duration-300'
            >
              <div className='card-body'>
                <div className='flex items-center mb-4'>
                  <div className='p-3 rounded-full bg-primary/20 transition-colors'>
                    <feature.icon className='w-6 h-6 text-primary' />
                  </div>
                  <h3 className='text-xl font-bold ml-4'>{feature.title}</h3>
                </div>

                <p className='text-base-content/70 mb-6'>
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
            </motion.div>
          ))}{' '}
        </div>
        {/* Coming Soon Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className='mt-20 mb-16'
        >
          <div className='text-center mb-12'>
            <h2 className='text-4xl font-bold text-base-content mb-4'>
              Coming Soon
            </h2>
            <p className='text-xl text-base-content/70'>
              Exciting features in development
            </p>
          </div>

          <div className='grid grid-cols-1 md:grid-cols-2 gap-8'>
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              className='card bg-base-100 shadow-xl border border-primary/20'
            >
              <div className='card-body'>
                <div className='flex items-center mb-4'>
                  <div className='p-3 rounded-full bg-warning/10'>
                    <Star className='w-6 h-6 text-warning' />
                  </div>
                  <h3 className='text-xl font-bold ml-4'>Achievement System</h3>
                </div>
                <p className='text-base-content/70'>
                  Unlock achievements based on your ARAM performance. From first
                  pentakill to champion mastery milestones.
                </p>
                <div className='badge badge-warning badge-outline mt-4'>
                  In Development
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              className='card bg-base-100 shadow-xl border border-success/20'
            >
              <div className='card-body'>
                <div className='flex items-center mb-4'>
                  <div className='p-3 rounded-full bg-success/10'>
                    <Users className='w-6 h-6 text-success' />
                  </div>
                  <h3 className='text-xl font-bold ml-4'>Open Source</h3>
                </div>
                <p className='text-base-content/70'>
                  Built by the community, for the community. Contribute
                  features, report bugs, or suggest improvements on GitHub.
                </p>
                <div className='badge badge-success badge-outline mt-4'>
                  Available Now
                </div>
              </div>
            </motion.div>
          </div>
        </motion.div>
        {/* Call to Action Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className='text-center mt-20'
        >
          {' '}
          <div className='card bg-gradient-to-r from-primary/10 to-secondary/10 shadow-xl'>
            <div className='card-body'>
              <h2 className='text-3xl font-bold text-base-content mb-4'>
                Ready to Track Your Progress?
              </h2>
              <p className='text-lg text-base-content/70 mb-8'>
                Join the community and start tracking your ARAM performance
                today. Completely free and open source!
              </p>

              <div className='flex flex-col sm:flex-row gap-4 justify-center'>
                {' '}
                <motion.button
                  whileTap={{ scale: 0.95 }}
                  className='btn btn-primary btn-lg'
                >
                  <TrendingUp className='w-5 h-5 mr-2' />
                  Track Your Stats
                </motion.button>{' '}
                <motion.button
                  whileTap={{ scale: 0.95 }}
                  className='btn btn-outline btn-lg'
                  onClick={() =>
                    window.open('https://github.com/your-repo', '_blank')
                  }
                >
                  <Trophy className='w-5 h-5 mr-2' />
                  View on GitHub
                </motion.button>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
