// src/db/init.ts
import { connectToDatabase } from "@/lib/mongo";

export async function initDb() {
  await connectToDatabase();
  console.log("[Mongo] DB initialized with index.");
}
