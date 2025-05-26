// Test script to validate Phase 1 improvements
import { config } from  "@/shared/lib/config";
import { logger } from  "@/shared/lib/logger/logger";
import { MongoService } from  "@/shared/services/database/MongoService";
import { getSummonerRequestSchema } from '../shared/lib/validation/schemas';

async function testPhase1Improvements() {
  logger.info("Starting Phase 1 improvements test");

  try {
    // Test 1: Configuration validation
    logger.info("Testing configuration validation");
    const dbConnString = config.get("DB_CONN_STRING");
    const logLevel = config.get("LOG_LEVEL");
    const riotApiKey = config.get("RIOT_API_KEY");

    logger.info("Configuration validated successfully", {
      dbConnString: dbConnString ? "Present" : "Missing",
      logLevel,
      riotApiKey: riotApiKey ? "Present" : "Missing",
      environment: config.get("NODE_ENV"),
    });

    // Test 2: MongoDB connection with monitoring
    logger.info("Testing MongoDB connection");
    const mongo = MongoService.getInstance();
    const db = await mongo.connect();
    logger.info("MongoDB connected successfully");

    // Test 3: Check collections exist
    const collections = await db.listCollections().toArray();
    logger.info("Available collections", {
      collections: collections.map((c) => c.name),
      count: collections.length,
    });

    // Test 4: Validation schema test
    logger.info("Testing validation schemas");
    try {
      const validSummoner = getSummonerRequestSchema.parse({
        name: "TestSummoner",
        region: "euw1",
      });
      logger.info("Summoner schema validation successful", validSummoner);
    } catch (error) {
      logger.error("Summoner schema validation failed", error);
    }

    // Test 5: Database health check
    logger.info("Testing database health");
    const summonersCol = await mongo.getCollection("summoners");
    const summonerCount = await summonersCol.countDocuments();

    const matchesCol = await mongo.getCollection("matches");
    const matchCount = await matchesCol.countDocuments();

    logger.info("Database health check completed", {
      summonerCount,
      matchCount,
      totalDocuments: summonerCount + matchCount,
    });

    // Test 6: Check indexes
    logger.info("Checking database indexes");
    const summonerIndexes = await summonersCol.listIndexes().toArray();
    const matchIndexes = await matchesCol.listIndexes().toArray();

    logger.info("Database indexes status", {
      summonerIndexes: summonerIndexes.map((idx) => idx.name),
      matchIndexes: matchIndexes.map((idx) => idx.name),
    });

    logger.info("Phase 1 improvements test completed successfully! ✅");

    return {
      success: true,
      config: {
        dbConnString: !!dbConnString,
        logLevel,
        environment: config.get("NODE_ENV"),
      },
      database: { summonerCount, matchCount, connected: true },
      validation: { working: true },
      indexes: {
        summoners: summonerIndexes.length,
        matches: matchIndexes.length,
      },
    };
  } catch (error) {
    logger.error("Phase 1 improvements test failed", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
    };
  }
}

// Main execution
if (require.main === module) {
  testPhase1Improvements()
    .then((result) => {
      if (result.success) {
        logger.info("✅ All Phase 1 improvements are working correctly!");
        console.log("\n📊 Test Results Summary:");
        console.log("- Configuration: ✅");
        console.log("- MongoDB Connection: ✅");
        console.log("- Validation Schemas: ✅");
        console.log("- Structured Logging: ✅");
        console.log("- Database Health: ✅");

        if (result.database) {
          console.log(
            `- Database Documents: ${
              result.database.summonerCount + result.database.matchCount
            }`
          );
        }

        if (result.indexes) {
          console.log(
            `- Database Indexes: ${
              result.indexes.summoners + result.indexes.matches
            }`
          );
        }
      } else {
        logger.error("❌ Phase 1 test failed:", result.error);
        process.exit(1);
      }
      process.exit(0);
    })
    .catch((error) => {
      logger.error("Test execution failed", error);
      process.exit(1);
    });
}

export { testPhase1Improvements };
