#!/usr/bin/env node

/**
 * Test script to verify the complete update flow:
 * 1. Fetch and store new matches
 * 2. Recalculate ARAM score with new matches
 *
 * Usage: node test-update-flow.js [region] [name] [tagline]
 * Example: node test-update-flow.js euw1 "testuser" "EUW"
 */

const region = process.argv[2] || "euw1";
const name = process.argv[3] || "test";
const tagline = process.argv[4] || "EUW";

console.log(`Testing update flow for: ${name}#${tagline} (${region})`);

async function testUpdateFlow() {
  try {
    console.log("\n=== Step 1: Fetch and store matches ===");

    // Simulate the fetch process
    const fetchResponse = await fetch(
      "http://localhost:3000/api/summoner/update",
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ region, name, tagline }),
      }
    );

    if (!fetchResponse.ok) {
      throw new Error(
        `Fetch failed: ${fetchResponse.status} ${fetchResponse.statusText}`
      );
    }

    const fetchResult = await fetchResponse.json();
    console.log("Fetch result:", fetchResult);

    console.log("\n=== Step 2: Recalculate ARAM score ===");

    // Get current ARAM score before update
    const preScoreResponse = await fetch(
      `http://localhost:3000/api/summoner/aram-score?region=${region}&name=${encodeURIComponent(
        name
      )}&tagline=${tagline}`
    );
    const preScoreData = await preScoreResponse.json();
    console.log("ARAM score before update:", preScoreData);

    // Trigger ARAM score recalculation
    const aramResponse = await fetch(
      "http://localhost:3000/api/summoner/aram-score",
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ region, name, tagline }),
      }
    );

    if (!aramResponse.ok) {
      throw new Error(
        `ARAM score update failed: ${aramResponse.status} ${aramResponse.statusText}`
      );
    }

    const aramResult = await aramResponse.json();
    console.log("ARAM score result:", aramResult);

    console.log("\n=== Step 3: Get final state ===");

    // Get final ARAM score
    const postScoreResponse = await fetch(
      `http://localhost:3000/api/summoner/aram-score?region=${region}&name=${encodeURIComponent(
        name
      )}&tagline=${tagline}`
    );
    const postScoreData = await postScoreResponse.json();
    console.log("ARAM score after update:", postScoreData);

    // Summary
    console.log("\n=== Summary ===");
    console.log(`Previous score: ${preScoreData.aramScore || 0}`);
    console.log(`New score: ${aramResult.aramScore || 0}`);
    console.log(
      `Score changed: ${
        aramResult.aramScore !== preScoreData.aramScore ? "YES" : "NO"
      }`
    );
    console.log(
      `Was first calculation: ${aramResult.wasFirstCalculation ? "YES" : "NO"}`
    );
    console.log(`Calculated: ${aramResult.calculated ? "YES" : "NO"}`);
  } catch (error) {
    console.error("Test failed:", error.message);
    process.exit(1);
  }
}

// Run the test if server is available
fetch("http://localhost:3000/api/health")
  .then(() => {
    console.log("Server is running, starting test...");
    testUpdateFlow();
  })
  .catch(() => {
    console.error("Server is not running on localhost:3000");
    console.log("Please start the development server with: npm run dev");
    process.exit(1);
  });
