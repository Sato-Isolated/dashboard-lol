import { MongoService } from "@/lib/MongoService";
import { SummonerCollection } from "@/types/schema/SummonerCollection";

export async function getOrCreateSummoner(
  region: string,
  name: string,
  tagline: string,
  puuid: string
) {
  const mongo = MongoService.getInstance();
  const collection = await mongo.getCollection<SummonerCollection>("summoners");
  let summoner = await collection.findOne({ region, name, tagline });
  if (!summoner) {
    const doc: SummonerCollection = {
      _id: new (await import("mongodb")).ObjectId(),
      puuid,
      region,
      name,
      tagline,
      fetchOldGames: false,
      lastFetchedGameEndTimestamp: undefined,
    };
    await collection.insertOne(doc);
    summoner = doc;
  }
  return summoner;
}

export async function insertOrUpdateChampionMastery(
  region: string,
  name: string,
  tagline: string,
  championId: number,
  championLevel: number,
  championPoints: number
) {
  const mongo = MongoService.getInstance();
  const collection = await mongo.getCollection<SummonerCollection>("summoners");
  await collection.updateOne(
    { region, name, tagline },
    {
      $set: {
        [`championMastery.${championId}`]: {
          championLevel,
          championPoints,
        },
      },
    }
  );
}

export async function setFetchOldGames(
  region: string,
  name: string,
  tagline: string,
  value: boolean
) {
  const mongo = MongoService.getInstance();
  const collection = await mongo.getCollection<SummonerCollection>("summoners");
  await collection.updateOne(
    { region, name, tagline },
    { $set: { fetchOldGames: value } }
  );
}

export async function setLastFetchedGameEndTimestamp(
  region: string,
  name: string,
  tagline: string,
  timestamp: number
) {
  const mongo = MongoService.getInstance();
  const collection = await mongo.getCollection<SummonerCollection>("summoners");
  await collection.updateOne(
    { region, name, tagline },
    { $set: { lastFetchedGameEndTimestamp: timestamp } }
  );
}

export async function getSummoner(
  region: string,
  name: string,
  tagline: string
) {
  const mongo = MongoService.getInstance();
  const collection = await mongo.getCollection<SummonerCollection>("summoners");
  return collection.findOne({ region, name, tagline });
}

export async function setAramScore(
  region: string,
  name: string,
  tagline: string,
  aramScore: number
) {
  const mongo = MongoService.getInstance();
  const collection = await mongo.getCollection<SummonerCollection>("summoners");
  await collection.updateOne(
    { region, name, tagline },
    { $set: { aramScore } }
  );
}
