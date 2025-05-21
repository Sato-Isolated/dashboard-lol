import { useParams } from "next/navigation";
import { useUserStore } from "@/store/userStore";
import { useEffect } from "react";

export function useEffectiveUser(): {
  effectiveRegion: string;
  effectiveTagline: string;
  effectiveName: string;
} {
  const params = useParams();
  const { region, tagline, summonerName, setUser } = useUserStore();
  const effectiveRegion = (params?.region as string) || region;
  const effectiveTagline = (params?.tagline as string) || tagline;
  const effectiveName = (params?.name as string) || summonerName;

  // Sync store if params are present
  useEffect(() => {
    if (params?.region && params?.tagline && params?.name) {
      setUser({
        region: params.region as string,
        tagline: params.tagline as string,
        summonerName: params.name as string,
      });
    }
  }, [params, setUser]);

  return { effectiveRegion, effectiveTagline, effectiveName };
}
