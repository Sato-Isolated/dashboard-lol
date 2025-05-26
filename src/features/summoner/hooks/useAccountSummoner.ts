import { useApiResource } from  "@/shared/hooks/useApiResource";
import { useEffectiveUser } from  "@/shared/hooks/useEffectiveUser";
import type { RiotAccountDto } from "@/shared/types/api/account.types";
import type { SummonerDto, LeagueEntry } from "@/shared/types/api/summoners.types";

interface AccountSummonerResult {
  account: RiotAccountDto | null;
  summoner: SummonerDto | null;
  leagues: LeagueEntry[];
  aramScore?: number;
  loading: boolean;
  error: string | null;
  refetch: () => void;
}

export function useAccountSummoner(
  region?: string,
  name?: string,
  tagline?: string
): AccountSummonerResult {
  // If not provided, fallback to effective user
  const effective = useEffectiveUser();
  const r = region || effective.effectiveRegion;
  const n = name || effective.effectiveName;
  const t = tagline || effective.effectiveTagline;

  // API endpoint expected to return { success, data: { account, summoner, leagues, aramScore } }
  const url =
    r && n && t
      ? `/api/summoner?region=${encodeURIComponent(
          r
        )}&name=${encodeURIComponent(n)}&tagline=${encodeURIComponent(t)}`
      : null;
  const { data, loading, error, refetch } = useApiResource<{
    success: boolean;
    data: {
      account: RiotAccountDto;
      summoner: SummonerDto;
      leagues: LeagueEntry[];
      aramScore?: number;
    };
  }>(url, `account-summoner-${r}-${n}-${t}`);

  return {
    account: data?.data?.account || null,
    summoner: data?.data?.summoner || null,
    leagues: data?.data?.leagues || [],
    aramScore: data?.data?.aramScore ?? 0,
    loading,
    error,
    refetch,
  };
}
