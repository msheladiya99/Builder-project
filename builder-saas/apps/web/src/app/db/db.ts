import Dexie, { type Table } from "dexie";

export interface OfflineFlat {
  id: string;
  number: string;
  floor: number;
  wing: string;
  type: string;
  status: string;
  price: number;
  area: number;
}

export interface OfflineWorker {
  id: string;
  name: string;
  trade: string;
  dailyWage: number;
  phone: string;
  status: string;
  tower?: string;
}

export interface OfflineSyncItem {
  id?: number;
  url: string;
  method: "POST" | "PUT" | "DELETE";
  body: string; // JSON string stringified
  timestamp: number;
  status: "pending" | "failed";
}

export class BuilderOfflineDatabase extends Dexie {
  flats!: Table<OfflineFlat, string>;
  workers!: Table<OfflineWorker, string>;
  syncOutbox!: Table<OfflineSyncItem, number>;

  constructor() {
    super("BuilderERP_OfflineDB");
    
    this.version(1).stores({
      flats: "id, number, wing, status",
      workers: "id, name, trade, status",
      syncOutbox: "++id, url, method, timestamp, status"
    });
  }
}

export const offlineDb = new BuilderOfflineDatabase();
