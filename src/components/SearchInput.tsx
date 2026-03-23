'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';

interface Organization {
  id: string;
  name: string;
  industry: string;
  country: string;
  icpScore: number;
  source: string;
  _count?: { prospects: number };
}

interface SearchInputProps {
  organizations: Organization[];
}

function IcpBadge({ score }: { score: number }) {
  let color = 'bg-red-500/20 text-red-400';
  if (score >= 0.85) color = 'bg-green-500/20 text-green-400';
  else if (score >= 0.7) color = 'bg-yellow-500/20 text-yellow-400';
  return (
    <span className={`inline-block px-2 py-0.5 rounded text-xs font-medium ${color}`}>
      {(score * 100).toFixed(0)}%
    </span>
  );
}

export default function SearchInput({ organizations }: SearchInputProps) {
  const [query, setQuery] = useState('');

  const filtered = useMemo(() => {
    if (!query.trim()) return organizations;
    const q = query.toLowerCase();
    return organizations.filter((org) => org.name.toLowerCase().includes(q));
  }, [query, organizations]);

  return (
    <div>
      <div className="mb-4">
        <input
          type="text"
          placeholder="Zoek op naam..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="w-full max-w-sm bg-[#1a1a1a] border border-[#2a2a2a] text-white placeholder-gray-500 text-sm rounded px-3 py-2 focus:outline-none focus:border-blue-500"
        />
      </div>
      <div className="bg-[#1a1a1a] border border-[#2a2a2a] rounded-lg shadow overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-[#2a2a2a]">
                <th className="text-left px-4 py-3 text-gray-400 font-medium">Naam</th>
                <th className="text-left px-4 py-3 text-gray-400 font-medium">Industry</th>
                <th className="text-left px-4 py-3 text-gray-400 font-medium">Land</th>
                <th className="text-left px-4 py-3 text-gray-400 font-medium">ICP Score</th>
                <th className="text-left px-4 py-3 text-gray-400 font-medium">Prospects</th>
                <th className="text-left px-4 py-3 text-gray-400 font-medium">Bron</th>
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-4 py-8 text-center text-gray-400">Geen organisaties gevonden.</td>
                </tr>
              ) : (
                filtered.map((org) => (
                  <tr key={org.id} className="border-b border-[#2a2a2a] hover:bg-[#222] transition-colors">
                    <td className="px-4 py-3 text-white font-medium">
                      <Link href={`/organizations/${org.id}`} className="hover:text-blue-400 transition-colors">
                        {org.name}
                      </Link>
                    </td>
                    <td className="px-4 py-3 text-gray-400">{org.industry}</td>
                    <td className="px-4 py-3 text-gray-400">{org.country}</td>
                    <td className="px-4 py-3"><IcpBadge score={org.icpScore} /></td>
                    <td className="px-4 py-3 text-gray-400">{org._count?.prospects ?? 0}</td>
                    <td className="px-4 py-3 text-gray-400">{org.source}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
