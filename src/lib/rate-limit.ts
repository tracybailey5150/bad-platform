const submissions = new Map<string, number[]>();

const CLEANUP_INTERVAL = 60 * 60 * 1000; // 1 hour
let lastCleanup = Date.now();

function cleanup() {
  const now = Date.now();
  if (now - lastCleanup < CLEANUP_INTERVAL) return;
  lastCleanup = now;
  const cutoff = now - 60 * 60 * 1000;
  for (const [key, timestamps] of submissions.entries()) {
    const valid = timestamps.filter((t) => t > cutoff);
    if (valid.length === 0) {
      submissions.delete(key);
    } else {
      submissions.set(key, valid);
    }
  }
}

export function checkRateLimit(ip: string, maxPerHour: number): boolean {
  cleanup();
  const now = Date.now();
  const cutoff = now - 60 * 60 * 1000;
  const timestamps = (submissions.get(ip) || []).filter((t) => t > cutoff);

  if (timestamps.length >= maxPerHour) {
    return false;
  }

  timestamps.push(now);
  submissions.set(ip, timestamps);
  return true;
}
