import { MongoClient, Db } from 'mongodb';

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
  users: async (): Promise<any[]> => {
    const db = await getDb();
    return db.collection('users').find({}).toArray() as Promise<any[]>;
  },
  orders: async (): Promise<any[]> => {
    const db = await getDb();
    return db.collection('orders').find({}).toArray() as Promise<any[]>;
  },
  leads: async (): Promise<any[]> => {
    const db = await getDb();
    return db.collection('leads').find({}).toArray() as Promise<any[]>;
  },
  reviews: async (): Promise<any[]> => {
    const db = await getDb();
    return db.collection('reviews').find({}).toArray() as Promise<any[]>;
  },

  saveUsers: async (data: any[]) => {
    const db = await getDb();
    const col = db.collection('users');
    await col.deleteMany({});
    if (data.length > 0) await col.insertMany(data);
  },
  saveOrders: async (data: any[]) => {
    const db = await getDb();
    const col = db.collection('orders');
    await col.deleteMany({});
    if (data.length > 0) await col.insertMany(data);
  },
  saveLeads: async (data: any[]) => {
    const db = await getDb();
    const col = db.collection('leads');
    await col.deleteMany({});
    if (data.length > 0) await col.insertMany(data);
  },
  saveReviews: async (data: any[]) => {
    const db = await getDb();
    const col = db.collection('reviews');
    await col.deleteMany({});
    if (data.length > 0) await col.insertMany(data);
  },
};
