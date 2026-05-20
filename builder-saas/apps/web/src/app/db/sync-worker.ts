import { offlineDb, OfflineSyncItem } from "./db";
import { apiRequest } from "../store/store";

let isSyncing = false;

/**
 * Enqueues a write operation to the local IndexedDB outbox when offline or for reliability
 */
export async function queueOfflineRequest(url: string, method: "POST" | "PUT" | "DELETE", body: any): Promise<void> {
  const syncItem: OfflineSyncItem = {
    url,
    method,
    body: JSON.stringify(body),
    timestamp: Date.now(),
    status: "pending"
  };
  
  await offlineDb.syncOutbox.add(syncItem);
  console.log(`[Offline Outbox] Queued request to sync queue: ${method} ${url}`);
  
  // If we are online, trigger synchronization immediately
  if (navigator.onLine) {
    triggerSync().catch(err => console.error("Immediate sync trigger failed:", err));
  }
}

/**
 * Iterates through the offline outbox and sends requests to the server
 */
export async function triggerSync(): Promise<boolean> {
  if (isSyncing) return false;
  if (!navigator.onLine) {
    console.log("[Sync Worker] Client is offline. Postponing synchronization.");
    return false;
  }

  const outboxItems = await offlineDb.syncOutbox.orderBy("timestamp").toArray();
  if (outboxItems.length === 0) {
    return false;
  }

  isSyncing = true;
  console.log(`[Sync Worker] Starting outbox synchronization. processing ${outboxItems.length} items...`);

  for (const item of outboxItems) {
    try {
      console.log(`[Sync Worker] Replaying: ${item.method} ${item.url}`);
      await apiRequest(item.url, {
        method: item.method,
        body: JSON.parse(item.body)
      });
      
      // Successfully replayed. Delete from local queue
      if (item.id !== undefined) {
        await offlineDb.syncOutbox.delete(item.id);
      }
    } catch (error: any) {
      console.error(`[Sync Worker] Replay failed for job ${item.id} (${item.url}):`, error.message);
      
      // Update status to failed so it doesn't cause an infinite sync loop
      if (item.id !== undefined) {
        await offlineDb.syncOutbox.update(item.id, { status: "failed" });
      }
      // Stop the queue synchronization loop to preserve order of operations
      isSyncing = false;
      return false;
    }
  }

  console.log("[Sync Worker] Outbox synchronized successfully.");
  isSyncing = false;
  return true;
}

// Register browser connectivity event listeners
if (typeof window !== "undefined") {
  window.addEventListener("online", () => {
    console.log("[Sync Worker] Network reconnected. Triggering sync...");
    triggerSync().catch(err => console.error("Network-event sync failed:", err));
  });
}
