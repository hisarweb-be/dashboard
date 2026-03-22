const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://46.224.198.104:3001';
const API_KEY = process.env.NEXT_PUBLIC_API_KEY || 'hisarweb-lead-engine-x7k9m2p4q8r1w5v3';

export async function fetchAPI(endpoint: string) {
  try {
    const sep = endpoint.includes('?') ? '&' : '?';
    const url = `${API_URL}${endpoint}${sep}apiKey=${API_KEY}`;

    // Fallback Promise.race due to Next.js ignoring AbortSignal on hanging TCP sockets
    const controller = new AbortController();
    const timeoutPromise = new Promise<null>((_, reject) =>
      setTimeout(() => {
        controller.abort();
        reject(new Error('FETCH_TIMEOUT'));
      }, 4000)
    );

    const fetchPromise = fetch(url, {
      cache: 'no-store',
      signal: controller.signal,
    });

    // Prevent unhandled promise rejection crashing Node.js
    fetchPromise.catch(() => { });

    const res = await Promise.race([fetchPromise, timeoutPromise]) as Response;
    if (!res || !res.ok) return null;
    return await res.json();
  } catch (error: any) {
    // Rethrow Next.js internal control flow errors (redirect, static bailout)
    if (error && typeof error === 'object' && ('digest' in error || error.message?.includes('Dynamic server usage'))) {
      throw error;
    }
    console.warn(`[API FETCH FAILED] ${endpoint}`, error?.message || error);
    return null;
  }
}
