const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://46.224.198.104:3001';
const API_KEY = process.env.NEXT_PUBLIC_API_KEY || 'hisarweb-lead-engine-x7k9m2p4q8r1w5v3';

export async function fetchAPI(endpoint: string) {
  const sep = endpoint.includes('?') ? '&' : '?';
  const res = await fetch(`${API_URL}${endpoint}${sep}apiKey=${API_KEY}`, { cache: 'no-store' });
  if (!res.ok) throw new Error(`API error: ${res.status}`);
  return res.json();
}
