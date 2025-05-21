// pages/api/summoner-full.ts
import type { NextApiRequest, NextApiResponse } from "next";
import { fetchSummonerFull } from "@/lib/summoner";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { region, name, tagline } = req.query;
  if (!region || !name || !tagline) {
    return res.status(400).json({ error: "Missing parameters" });
  }
  try {
    const data = await fetchSummonerFull(
      region as string,
      name as string,
      tagline as string
    );
    if (!data) return res.status(404).json({ error: "Not found" });
    return res.status(200).json(data);
  } catch (e: unknown) {
    return res.status(500).json({ error: e instanceof Error ? e.message : "Unknown error" });
  }
}
