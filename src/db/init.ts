// src/db/init.ts
import { connectToDatabase } from "@/lib/mongo";

export async function initDb() {
  await connectToDatabase();
}
