import { MongoClient, Db } from 'mongodb';

type DocumentRecord = Record<string, unknown>;

const MONGODB_URI = process.env.MONGODB_URI!;
const DB_NAME = 'jkc_store';

if (!MONGODB_URI) {
  throw new Error('Please define the MONGODB_URI environment variable in .env.local');
}

// Cache the MongoClient across hot-reloads in dev and across serverless invocations
let cachedClient: MongoClient | null = null;
let cachedDb: Db | null = null;

async function getDb(): Promise<Db> {
  if (cachedDb) return cachedDb;

  if (!cachedClient) {
    cachedClient = new MongoClient(MONGODB_URI);
    await cachedClient.connect();
  }

  cachedDb = cachedClient.db(DB_NAME);
  return cachedDb;
}

// Database collections — same interface as before so all API routes work unchanged
export const DB = {
  users: async <T = DocumentRecord>(): Promise<T[]> => {
    const db = await getDb();
    return db.collection('users').find({}).toArray() as Promise<T[]>;
  },
  orders: async <T = DocumentRecord>(): Promise<T[]> => {
    const db = await getDb();
    return db.collection('orders').find({}).toArray() as Promise<T[]>;
  },
  leads: async <T = DocumentRecord>(): Promise<T[]> => {
    const db = await getDb();
    return db.collection('leads').find({}).toArray() as Promise<T[]>;
  },
  customers: async <T = DocumentRecord>(): Promise<T[]> => {
    const db = await getDb();
    return db.collection('customers').find({}).toArray() as Promise<T[]>;
  },
  reviews: async <T = DocumentRecord>(): Promise<T[]> => {
    const db = await getDb();
    return db.collection('reviews').find({}).toArray() as Promise<T[]>;
  },

  saveUsers: async <T extends object>(data: T[]) => {
    const db = await getDb();
    const col = db.collection('users');
    await col.deleteMany({});
    if (data.length > 0) await col.insertMany(data as DocumentRecord[]);
  },
  saveOrders: async <T extends object>(data: T[]) => {
    const db = await getDb();
    const col = db.collection('orders');
    await col.deleteMany({});
    if (data.length > 0) await col.insertMany(data as DocumentRecord[]);
  },
  saveLeads: async <T extends object>(data: T[]) => {
    const db = await getDb();
    const col = db.collection('leads');
    await col.deleteMany({});
    if (data.length > 0) await col.insertMany(data as DocumentRecord[]);
  },
  saveCustomers: async <T extends object>(data: T[]) => {
    const db = await getDb();
    const col = db.collection('customers');
    await col.deleteMany({});
    if (data.length > 0) await col.insertMany(data as DocumentRecord[]);
  },
  saveReviews: async <T extends object>(data: T[]) => {
    const db = await getDb();
    const col = db.collection('reviews');
    await col.deleteMany({});
    if (data.length > 0) await col.insertMany(data as DocumentRecord[]);
  },
  featuredReviews: async <T = DocumentRecord>(): Promise<T[]> => {
    const db = await getDb();
    // First try to get explicitly featured reviews
    const featured = await db.collection('reviews')
      .find({ featured: true, rating: { $gte: 4 } })
      .sort({ createdAt: -1 })
      .limit(10)
      .toArray() as unknown as T[];
    // Fall back to top-rated reviews if none are featured
    if (featured.length > 0) return featured;
    return db.collection('reviews')
      .find({ rating: { $gte: 4 } })
      .sort({ rating: -1, createdAt: -1 })
      .limit(10)
      .toArray() as Promise<T[]>;
  },
  upsertReview: async (review: DocumentRecord) => {
    const db = await getDb();
    await db.collection('reviews').replaceOne(
      { id: review.id },
      review,
      { upsert: true }
    );
  },
  patchReview: async (id: string, patch: Record<string, unknown>) => {
    const db = await getDb();
    await db.collection('reviews').updateOne(
      { id },
      { $set: patch }
    );
  },
};
