const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://46.224.198.104:3001';
const API_KEY = process.env.NEXT_PUBLIC_API_KEY || 'hisarweb-lead-engine-x7k9m2p4q8r1w5v3';

export async function fetchAPI(endpoint: string): Promise<any> {
  try {
    const sep = endpoint.includes('?') ? '&' : '?';
    const res = await fetch(`${API_URL}${endpoint}${sep}apiKey=${API_KEY}`, {
      cache: 'no-store',
      // Standaard snelle timeout nu we in hetzelfde netwerk zitten (Coolify)
      signal: AbortSignal.timeout(5000),
    });

    if (!res.ok) return null;
    return await res.json();
  } catch (error: any) {
    if (error && typeof error === 'object' && ('digest' in error || error.message?.includes('Dynamic server usage'))) {
      throw error;
    }
    console.warn(`[API FETCH FAILED] ${endpoint}`, error?.message || error);
    return null;
  }
}
