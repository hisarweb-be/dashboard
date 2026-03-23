'use client';

import { useState } from 'react';
import { clientFetchAPI } from '@/lib/api-client';

interface ApprovalActionsProps {
  id: string;
  onDone?: () => void;
}

export default function ApprovalActions({ id, onDone }: ApprovalActionsProps) {
  const [loading, setLoading] = useState<'approve' | 'reject' | null>(null);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  async function handleAction(action: 'approve' | 'reject') {
    setLoading(action);
    setMessage(null);
    const result = await clientFetchAPI(`/api/v1/approval/${id}/${action}`, { method: 'POST' });
    setLoading(null);
    if (result !== null) {
      setMessage({ type: 'success', text: action === 'approve' ? 'Goedgekeurd.' : 'Afgewezen.' });
      onDone?.();
    } else {
      setMessage({ type: 'error', text: 'Actie mislukt. Probeer opnieuw.' });
    }
  }

  if (message) {
    return (
      <span className={message.type === 'success' ? 'text-green-400 text-sm' : 'text-red-400 text-sm'}>
        {message.text}
      </span>
    );
  }

  return (
    <div className="flex gap-2">
      <button
        onClick={() => handleAction('approve')}
        disabled={loading !== null}
        className="px-3 py-1.5 rounded bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium disabled:opacity-50 transition-colors"
      >
        {loading === 'approve' ? 'Bezig...' : 'Goedkeuren'}
      </button>
      <button
        onClick={() => handleAction('reject')}
        disabled={loading !== null}
        className="px-3 py-1.5 rounded bg-red-600 hover:bg-red-700 text-white text-sm font-medium disabled:opacity-50 transition-colors"
      >
        {loading === 'reject' ? 'Bezig...' : 'Afwijzen'}
      </button>
    </div>
  );
}
