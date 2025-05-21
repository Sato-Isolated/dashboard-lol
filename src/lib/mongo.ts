// src/lib/mongo.ts
import { MongoClient, Db } from "mongodb";

const uri = process.env.DB_CONN_STRING!;
if (!uri) {
  throw new Error("Please define the DB_CONN_STRING environment variable");
}
const dbName = process.env.DB_NAME!;
if (!dbName) {
  throw new Error("Please define the DB_NAME environment variable");
}

let cachedClient: MongoClient | null = null;
let cachedDb: Db | null = null;

export async function connectToDatabase(): Promise<Db> {
  if (cachedDb) return cachedDb;

  const client = cachedClient ?? new MongoClient(uri);
  await client.connect();
  cachedClient = client;

  const db = client.db(dbName);
  cachedDb = db;

  return db;
}
