export function trackEvent(event: string, payload: Record<string, string | number>) {
  return { event, payload, trackedAt: new Date().toISOString() };
}
