// src/db/init.ts
import { MongoService } from "@/lib/MongoService";

export async function initDb() {
  await MongoService.getInstance().connect();
}
