import { MongoService } from "@/lib/MongoService";
import { SummonerCollection } from "@/types/schema/SummonerCollection";
import { logger } from "@/lib/logger";
import { ErrorHandler, ValidationError } from "@/lib/errorHandler";
import {
  puuidSchema,
  validateSummonerName,
  validateRegion,
} from "@/lib/validation/schemas";

export async function getOrCreateSummoner(
  region: string,
  name: string,
  tagline: string,
  puuid: string
) {
  const timerId = logger.startTimer("summoner_get_or_create");

  try {
    // Validate inputs
    const regionValidation = validateRegion(region);
    if (!regionValidation.isValid) {
      throw new ValidationError(
        regionValidation.error || "Invalid region",
        "region"
      );
    }

    const nameValidation = validateSummonerName(name);
    if (!nameValidation.isValid) {
      throw new ValidationError(
        nameValidation.error || "Invalid summoner name",
        "name"
      );
    }

    // Validate PUUID format
    try {
      puuidSchema.parse(puuid);
    } catch {
      throw new ValidationError("Invalid PUUID format", "puuid");
    }

    logger.info("Getting or creating summoner", {
      region,
      name,
      tagline,
      puuid,
    });

    const mongo = MongoService.getInstance();
    const collection = await mongo.getCollection<SummonerCollection>(
      "summoners"
    );

    // Try to find existing summoner
    let summoner = await collection.findOne({ region, name, tagline });

    if (!summoner) {
      logger.info("Summoner not found, creating new record", {
        region,
        name,
        tagline,
      });

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

      logger.info("Summoner created successfully", {
        region,
        name,
        tagline,
        summonerId: summoner._id,
      });
    } else {
      logger.info("Summoner found in database", {
        region,
        name,
        tagline,
        summonerId: summoner._id,
      });
    }

    return summoner;
  } catch (error) {
    logger.error("Failed to get or create summoner", error, {
      region,
      name,
      tagline,
      puuid,
    });

    if (error instanceof ValidationError) {
      throw error;
    }

    throw ErrorHandler.handle(error as Error, {
      operation: "getOrCreateSummoner",
      collection: "summoners",
      region,
      name,
      tagline,
    });
  } finally {
    logger.endTimer(timerId);
  }
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

export async function setLastUpdateTimestamp(
  region: string,
  name: string,
  tagline: string,
  timestamp: number
) {
  const mongo = MongoService.getInstance();
  const collection = await mongo.getCollection<SummonerCollection>("summoners");
  await collection.updateOne(
    { region, name, tagline },
    { $set: { lastUpdateTimestamp: timestamp } }
  );
}
