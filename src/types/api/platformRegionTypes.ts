export const PlatformRegion = {
  BR1: 'br1',
  EUN1: 'eun1',
  EUW1: 'euw1',
  JP1: 'jp1',
  KR: 'kr',
  LA1: 'la1',
  LA2: 'la2',
  ME1: 'me1',
  NA1: 'na1',
  OC1: 'oc1',
  RU: 'ru',
  SG2: 'sg2',
  TR1: 'tr1',
  TW2: 'tw2',
  VN2: 'vn2',
} as const;

export type PlatformRegion =
  (typeof PlatformRegion)[keyof typeof PlatformRegion];
