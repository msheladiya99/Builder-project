import { Queue, Worker, Job } from "bullmq";
import Redis from "ioredis";

const REDIS_URL = process.env.REDIS_URL || "redis://127.0.0.1:6379";

let queue: Queue | null = null;
let connection: Redis | null = null;
let isRedisConnected = false;

try {
  connection = new Redis(REDIS_URL, {
    maxRetriesPerRequest: null,
    enableReadyCheck: false,
    connectTimeout: 2000
  });

  connection.on("connect", () => {
    isRedisConnected = true;
    console.log("BullMQ connected to Redis cache backend successfully.");
  });

  connection.on("error", (err) => {
    isRedisConnected = false;
    console.warn("Redis connection warning. Background tasks will run in-memory synchronously.", err.message);
  });

  queue = new Queue("builder_erp_tasks", { connection });
  
  // Initialize BullMQ Worker
  const worker = new Worker("builder_erp_tasks", async (job: Job) => {
    console.log(`[BullMQ Worker] Processing background task: ${job.name} (ID: ${job.id})`);
    await processJob(job.name, job.data);
  }, { connection });

  worker.on("failed", (job, err) => {
    console.error(`[BullMQ Worker] Task failed: ${job?.name}`, err);
  });
} catch (error: any) {
  console.warn("Failed to instantiate BullMQ Redis queue. Falling back to synchronous runner.", error.message);
}

/**
 * Dispatches a background job. If Redis is unavailable, runs it synchronously.
 */
export async function addJob(name: string, data: any): Promise<void> {
  if (isRedisConnected && queue) {
    await queue.add(name, data);
  } else {
    // Synchronous execution fallback for systems without running Redis
    console.log(`[Queue Sync Fallback] Executing background task in-memory: ${name}`);
    // Non-blocking trigger
    setTimeout(() => {
      processJob(name, data).catch(err => {
        console.error(`[Queue Sync Fallback Error] Task failed: ${name}`, err);
      });
    }, 0);
  }
}

/**
 * Task Execution Router
 */
async function processJob(name: string, data: any): Promise<void> {
  switch (name) {
    case "send_email_notification":
      console.log(`[Email Service] Sending notification to ${data.to}: "${data.subject}"`);
      break;
    case "send_sms_notification":
      console.log(`[SMS Service] Sending SMS to ${data.phone}: "${data.message}"`);
      break;
    case "generate_periodic_analytics":
      console.log(`[Analytics Scheduler] Recompiling balance sheets and target metrics.`);
      break;
    default:
      console.warn(`[BullMQ Worker] Unknown job register: ${name}`);
  }
}
