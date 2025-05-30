import { PlatformRegion } from './platformRegionTypes';

export const RegionalRegion = {
  EUROPE: 'europe',
  AMERICAS: 'americas',
  ASIA: 'asia',
  SEA: 'sea',
} as const;

export const RegionalRegionMap: Record<PlatformRegion, RegionalRegion> = {
  br1: RegionalRegion.AMERICAS,
  eun1: RegionalRegion.EUROPE,
  euw1: RegionalRegion.EUROPE,
  jp1: RegionalRegion.ASIA,
  kr: RegionalRegion.ASIA,
  la1: RegionalRegion.AMERICAS,
  la2: RegionalRegion.AMERICAS,
  me1: RegionalRegion.EUROPE,
  na1: RegionalRegion.AMERICAS,
  oc1: RegionalRegion.ASIA,
  ru: RegionalRegion.EUROPE,
  sg2: RegionalRegion.SEA,
  tr1: RegionalRegion.EUROPE,
  tw2: RegionalRegion.SEA,
  vn2: RegionalRegion.SEA,
};

export type RegionalRegion =
  (typeof RegionalRegion)[keyof typeof RegionalRegion];
