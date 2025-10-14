import type { Order } from "./domain.js";
import type { ProviderAdapter } from "./adapters/BaseAdapter.js";
import { setTimeout as wait } from "timers/promises";

type Job = { orderId: string };
const queue: Job[] = [];
let working = false;

export function enqueue(orderId: string) {
  queue.push({ orderId });
  tick();
}

export function emptyQueue() {
  return queue.length === 0;
}

let onWork: ((orderId: string) => Promise<void>) | null = null;

export function configureWorker(fn: (orderId: string) => Promise<void>) {
  onWork = fn;
}

async function tick() {
  if (working) return;
  working = true;

  while (queue.length) {
    const job = queue.shift()!;
    try {
      if (onWork) await onWork(job.orderId);
    } catch (e) {
      // swallow; servis loglayabilir
    }
    await wait(250);
  }

  working = false;
}
