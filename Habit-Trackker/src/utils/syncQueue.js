import { get, set } from 'idb-keyval';

const QUEUE_KEY = 'offline-sync-queue';

/**
 * Adds a request to the offline sync queue.
 * Stores method, url, data, and headers.
 */
export async function enqueueRequest(request) {
  const queue = (await get(QUEUE_KEY)) || [];
  queue.push({
    ...request,
    timestamp: Date.now(),
  });
  await set(QUEUE_KEY, queue);
}

/**
 * Retrieves the current queue of pending requests.
 */
export async function getQueue() {
  return (await get(QUEUE_KEY)) || [];
}

/**
 * Clears the queue.
 */
export async function clearQueue() {
  await set(QUEUE_KEY, []);
}

/**
 * Process the queue by replaying requests through a provided axios instance.
 */
export async function processQueue(apiInstance) {
  const queue = await getQueue();
  if (queue.length === 0) return;

  console.log(`[SyncEngine] Processing ${queue.length} pending requests...`);
  
  // Create a copy to iterate so we don't interfere with new enqueues
  const pending = [...queue];
  await clearQueue();

  for (const req of pending) {
    try {
      await apiInstance({
        method: req.method,
        url: req.url,
        data: req.data,
        headers: req.headers,
      });
      console.log(`[SyncEngine] Successfully synced: ${req.method} ${req.url}`);
    } catch (err) {
      console.error(`[SyncEngine] Sync failed for ${req.url}:`, err);
      // Re-enqueue if it's still a network error, otherwise drop (e.g. 400 Bad Request)
      if (!err.response) {
        await enqueueRequest(req);
      }
    }
  }
}
