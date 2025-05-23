import {
  MongoClient,
  Db,
  Collection,
  MongoClientOptions,
  Document,
} from "mongodb";

export class MongoService {
  private static instance: MongoService;
  private client: MongoClient | null = null;
  private db: Db | null = null;
  private uri: string;
  private dbName: string;

  private constructor(uri: string, dbName: string) {
    this.uri = uri;
    this.dbName = dbName;
  }

  public static getInstance(): MongoService {
    if (!MongoService.instance) {
      const uri = process.env.DB_CONN_STRING!;
      const dbName = process.env.DB_NAME!;
      if (!uri || !dbName) throw new Error("DB_CONN_STRING or DB_NAME missing");
      MongoService.instance = new MongoService(uri, dbName);
    }
    return MongoService.instance;
  }

  public async connect(options?: MongoClientOptions): Promise<Db> {
    if (this.db) return this.db;
    this.client = new MongoClient(this.uri, options);
    await this.client.connect();
    this.db = this.client.db(this.dbName);
    return this.db;
  }

  public async getCollection<T extends Document = Document>(
    name: string
  ): Promise<Collection<T>> {
    const db = await this.connect();
    return db.collection<T>(name);
  }

  public async withCollection<T extends Document, R>(
    name: string,
    fn: (col: Collection<T>) => Promise<R>
  ): Promise<R> {
    const col = await this.getCollection<T>(name);
    try {
      return await fn(col);
    } catch (e) {
      // Log or handle error here
      throw e;
    }
  }

  public async close(): Promise<void> {
    if (this.client) {
      await this.client.close();
      this.client = null;
      this.db = null;
    }
  }
}
