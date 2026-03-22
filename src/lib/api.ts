const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://46.224.198.104:3001';
const API_KEY = process.env.NEXT_PUBLIC_API_KEY || 'hisarweb-lead-engine-x7k9m2p4q8r1w5v3';

export async function fetchAPI(endpoint: string) {
  try {
    const sep = endpoint.includes('?') ? '&' : '?';
    const res = await fetch(`${API_URL}${endpoint}${sep}apiKey=${API_KEY}`, {
      cache: 'no-store',
      // Reduce timeout because Vercel kills functions at 10s (Hobby tier).
      // We need to catch it earlier to render a fallback page instead of crashing with 500.
      signal: AbortSignal.timeout(4000),
    });
    if (!res.ok) return null;
    const json = await res.json();
    return json;
  } catch (error) {
    console.warn(`[API FETCH FAILED] ${endpoint}`, error);
    return null;
  }
}
