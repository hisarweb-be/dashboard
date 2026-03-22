import axios from "axios";

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://46.224.198.104:3001';
const API_KEY = process.env.NEXT_PUBLIC_API_KEY || 'hisarweb-lead-engine-x7k9m2p4q8r1w5v3';

export async function fetchAPI(endpoint: string) {
  console.log(`[Diagnostic] Bypassing fetch for ${endpoint}`);
  return null;
}
