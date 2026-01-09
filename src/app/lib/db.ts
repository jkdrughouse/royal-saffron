import { writeFile, readFile, mkdir } from 'fs/promises';
import { existsSync } from 'fs';
import path from 'path';

const DATA_DIR = path.join(process.cwd(), 'data');

// Ensure data directory exists
export async function ensureDataDir() {
  if (!existsSync(DATA_DIR)) {
    await mkdir(DATA_DIR, { recursive: true });
  }
}

// Generic file operations
export async function readDataFile<T>(filename: string, defaultValue: T): Promise<T> {
  await ensureDataDir();
  const filePath = path.join(DATA_DIR, filename);
  
  if (!existsSync(filePath)) {
    await writeFile(filePath, JSON.stringify(defaultValue, null, 2));
    return defaultValue;
  }
  
  try {
    const data = await readFile(filePath, 'utf-8');
    return JSON.parse(data) as T;
  } catch (error) {
    console.error(`Error reading ${filename}:`, error);
    return defaultValue;
  }
}

export async function writeDataFile<T>(filename: string, data: T): Promise<void> {
  await ensureDataDir();
  const filePath = path.join(DATA_DIR, filename);
  await writeFile(filePath, JSON.stringify(data, null, 2));
}

// Database collections
export const DB = {
  users: async () => readDataFile<any[]>('users.json', []),
  orders: async () => readDataFile<any[]>('orders.json', []),
  leads: async () => readDataFile<any[]>('leads.json', []),
  saveUsers: (data: any[]) => writeDataFile('users.json', data),
  saveOrders: (data: any[]) => writeDataFile('orders.json', data),
  saveLeads: (data: any[]) => writeDataFile('leads.json', data),
};
