'use client';

import { useState } from 'react';
import { clientFetchAPI } from '@/lib/api-client';

const STATUSES = [
  'DISCOVERED',
  'ENRICHED',
  'PROSPECT_IDENTIFIED',
  'CONTACTED',
  'CONNECTED',
  'REPLIED',
  'QUALIFIED',
  'MEETING_INVITED',
  'MEETING_BOOKED',
  'PROPOSAL',
  'WON',
  'LOST',
];

interface StatusUpdaterProps {
  prospectId: string;
  currentStatus: string;
}

export default function StatusUpdater({ prospectId, currentStatus }: StatusUpdaterProps) {
  const [status, setStatus] = useState(currentStatus);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  async function handleChange(newStatus: string) {
    setLoading(true);
    setMessage(null);
    const result = await clientFetchAPI(`/api/v1/prospects/${prospectId}`, {
      method: 'PATCH',
      body: JSON.stringify({ status: newStatus }),
    });
    setLoading(false);
    if (result !== null) {
      setStatus(newStatus);
      setMessage({ type: 'success', text: 'Status bijgewerkt.' });
      setTimeout(() => setMessage(null), 3000);
    } else {
      setMessage({ type: 'error', text: 'Update mislukt.' });
    }
  }

  return (
    <div className="flex items-center gap-3">
      <select
        value={status}
        onChange={(e) => handleChange(e.target.value)}
        disabled={loading}
        className="bg-[#2a2a2a] border border-[#3a3a3a] text-white text-sm rounded px-3 py-2 disabled:opacity-50 focus:outline-none focus:border-blue-500"
      >
        {STATUSES.map((s) => (
          <option key={s} value={s}>{s}</option>
        ))}
      </select>
      {loading && <span className="text-gray-400 text-sm">Opslaan...</span>}
      {message && (
        <span className={message.type === 'success' ? 'text-green-400 text-sm' : 'text-red-400 text-sm'}>
          {message.text}
        </span>
      )}
    </div>
  );
}
