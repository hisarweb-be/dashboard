export async function clientFetchAPI(endpoint: string, options?: RequestInit) {
  const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://46.224.198.104:3001';
  const API_KEY = process.env.NEXT_PUBLIC_API_KEY || 'hisarweb-lead-engine-x7k9m2p4q8r1w5v3';
  const sep = endpoint.includes('?') ? '&' : '?';
  try {
    const res = await fetch(`${API_URL}${endpoint}${sep}apiKey=${API_KEY}`, {
      ...options,
      headers: { 'Content-Type': 'application/json', ...options?.headers },
    });
    if (!res.ok) return null;
    return await res.json();
  } catch {
    return null;
  }
}
