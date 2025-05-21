import { useApiResource } from "./useApiResource";
import { useEffectiveUser } from "./useEffectiveUser";
import type { RiotAccountDto } from "@/types/api/account";
import type { SummonerDto, LeagueEntry } from "@/types/api/summoners";

interface AccountSummonerResult {
  account: RiotAccountDto | null;
  summoner: SummonerDto | null;
  leagues: LeagueEntry[];
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

  // API endpoint expected to return { account, summoner }
  const url =
    r && n && t
      ? `/api/summoner-full?region=${encodeURIComponent(
          r
        )}&name=${encodeURIComponent(n)}&tagline=${encodeURIComponent(t)}`
      : null;
  const { data, loading, error, refetch } = useApiResource<{
    account: RiotAccountDto;
    summoner: SummonerDto;
    leagues: LeagueEntry[];
  }>(url, `account-summoner-${r}-${n}-${t}`);

  return {
    account: data?.account || null,
    summoner: data?.summoner || null,
    leagues: data?.leagues || [],
    loading,
    error,
    refetch,
  };
}
