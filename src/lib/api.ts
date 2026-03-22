import axios from "axios";

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://46.224.198.104:3001';
const API_KEY = process.env.NEXT_PUBLIC_API_KEY || 'hisarweb-lead-engine-x7k9m2p4q8r1w5v3';

export async function fetchAPI(endpoint: string) {
  try {
    const sep = endpoint.includes('?') ? '&' : '?';
    const url = `${API_URL}${endpoint}${sep}apiKey=${API_KEY}`;

    // Using axios bypasses Next.js `fetch` polyfills which swallow AbortSignal timeouts
    // This strictly throws if the IP is unreachable within 3s
    const { data } = await axios.get(url, {
      timeout: 3000,
    });

    return data;
  } catch (error: any) {
    if (error && typeof error === 'object' && ('digest' in error || error.message?.includes('Dynamic server usage'))) {
      throw error;
    }
    console.warn(`[API FETCH FAILED] ${endpoint}`, error?.message || error);
    return null;
  }
}
