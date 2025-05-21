// src/db/init.ts
import { connectToDatabase } from "@/lib/mongo";

export async function initDb() {
  const db = await connectToDatabase();
  const matches = db.collection("matches");

  console.log("[Mongo] DB initialized with index.");
}
