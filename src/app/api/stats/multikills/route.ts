import { NextResponse } from 'next/server';
import { getMultiKillMatches } from '@/features/matches/services/matchRepository';
import { z } from 'zod';
import { withValidation } from '@/lib/validation/middleware';

// Empty schema since no parameters are needed
const multikillsSchema = z.object({});

export const GET = withValidation(
  multikillsSchema,
  async (_req, _validatedData, _context) => {
    const matches = await getMultiKillMatches();

    // For each match, extract badges from each participant
    const matchesWithBadges = matches
      .map(match => {
        const participantsWithBadges = match.info.participants.map(p => {
          const badges: string[] = [];
          if (p.doubleKills && p.doubleKills > 0) {
            badges.push('doublekill');
          }
          if (p.tripleKills && p.tripleKills > 0) {
            badges.push('triplekill');
          }
          if (p.quadraKills && p.quadraKills > 0) {
            badges.push('quadrakill');
          }
          if (p.pentaKills && p.pentaKills > 0) {
            badges.push('pentakill');
          }
          return {
            summonerName: p.summonerName,
            riotIdGameName: p.riotIdGameName,
            riotIdTagline: p.riotIdTagline,
            puuid: p.puuid,
            championName: p.championName,
            badges,
            kills: p.kills,
            deaths: p.deaths,
            assists: p.assists,
          };
        });
        return {
          matchId: match.metadata.matchId,
          gameEndTimestamp: match.info.gameEndTimestamp,
          gameDuration: match.info.gameDuration,
          queueId: match.info.queueId,
          participants: participantsWithBadges.filter(p => p.badges.length > 0), // Only include participants with multikills
        };
      })
      .filter(match => match.participants.length > 0); // Only include matches with multikills

    return NextResponse.json({
      success: true,
      data: matchesWithBadges,
      totalMatches: matchesWithBadges.length,
    });
  },
);
