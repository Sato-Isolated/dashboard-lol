// Centralisation des types LoL
export * from '@/types/api/accountTypes';
export * from '@/types/api/championTypes';
export * from '@/types/api/championMasteryTypes';
export * from '@/types/api/matchTypes';
export * from '@/types/api/summonerTypes';

// Platform and Region types - explicit exports to avoid conflicts
export { PlatformRegion } from '@/types/api/platformRegionTypes';
export type { PlatformRegion as PlatformRegionType } from '@/types/api/platformRegionTypes';

export { RegionalRegion, RegionalRegionMap } from '@/types/api/regionTypes';
export type { RegionalRegion as RegionalRegionType } from '@/types/api/regionTypes';
