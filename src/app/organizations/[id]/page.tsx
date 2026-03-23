import { fetchAPI } from "@/lib/api";
import Link from "next/link";

function IcpBadge({ score }: { score: number }) {
  let color = "bg-red-500/20 text-red-400";
  if (score >= 0.85) color = "bg-green-500/20 text-green-400";
  else if (score >= 0.7) color = "bg-yellow-500/20 text-yellow-400";
  return (
    <span className={`inline-block px-2 py-0.5 rounded text-xs font-medium ${color}`}>
      {(score * 100).toFixed(0)}%
    </span>
  );
}

const statusColors: Record<string, string> = {
  DISCOVERED: "bg-gray-500/20 text-gray-400",
  ENRICHED: "bg-blue-500/20 text-blue-400",
  PROSPECT_IDENTIFIED: "bg-cyan-500/20 text-cyan-400",
  CONTACTED: "bg-yellow-500/20 text-yellow-400",
  CONNECTED: "bg-orange-500/20 text-orange-400",
  REPLIED: "bg-amber-500/20 text-amber-400",
  QUALIFIED: "bg-green-500/20 text-green-400",
  MEETING_INVITED: "bg-indigo-500/20 text-indigo-400",
  MEETING_BOOKED: "bg-purple-500/20 text-purple-400",
  PROPOSAL: "bg-pink-500/20 text-pink-400",
  WON: "bg-emerald-500/20 text-emerald-400",
  LOST: "bg-red-500/20 text-red-400",
};

export default async function OrganizationDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const res = await fetchAPI(`/api/v1/organizations/${id}`);
  const org = res?.data ?? res;

  if (!org || !org.id) {
    return (
      <div>
        <div className="flex items-center gap-2 text-sm text-gray-400 mb-6">
          <Link href="/organizations" className="hover:text-white transition-colors">Organizations</Link>
          <span>/</span>
          <span className="text-gray-500">Niet gevonden</span>
        </div>
        <div className="bg-[#1a1a1a] border border-[#2a2a2a] rounded-lg p-6">
          <p className="text-gray-400">Organisatie niet gevonden.</p>
        </div>
      </div>
    );
  }

  const prospects: Array<Record<string, unknown>> = org.prospects ?? [];

  return (
    <div>
      <div className="flex items-center gap-2 text-sm text-gray-400 mb-6">
        <Link href="/organizations" className="hover:text-white transition-colors">Organizations</Link>
        <span>/</span>
        <span className="text-white">{org.name}</span>
      </div>

      <div className="flex items-center gap-4 mb-6">
        <Link
          href="/organizations"
          className="px-3 py-1.5 rounded bg-[#2a2a2a] hover:bg-[#333] text-gray-400 hover:text-white text-sm transition-colors"
        >
          Terug
        </Link>
        <h1 className="text-2xl font-bold text-white">{org.name}</h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        <div className="bg-[#1a1a1a] border border-[#2a2a2a] rounded-lg p-6 shadow">
          <h2 className="text-lg font-semibold text-white mb-4">Organisatie Details</h2>
          <dl className="space-y-3">
            {org.domain && (
              <div className="flex justify-between">
                <dt className="text-gray-400 text-sm">Website</dt>
                <dd className="text-white text-sm">
                  <a href={`https://${org.domain}`} target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:text-blue-300 transition-colors">
                    {org.domain}
                  </a>
                </dd>
              </div>
            )}
            {org.linkedinUrl && (
              <div className="flex justify-between">
                <dt className="text-gray-400 text-sm">LinkedIn</dt>
                <dd className="text-sm">
                  <a href={org.linkedinUrl as string} target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:text-blue-300 transition-colors">
                    Profiel bekijken
                  </a>
                </dd>
              </div>
            )}
            {org.industry && (
              <div className="flex justify-between">
                <dt className="text-gray-400 text-sm">Industry</dt>
                <dd className="text-white text-sm">{org.industry as string}</dd>
              </div>
            )}
            {org.country && (
              <div className="flex justify-between">
                <dt className="text-gray-400 text-sm">Land</dt>
                <dd className="text-white text-sm">{org.country as string}</dd>
              </div>
            )}
            {org.city && (
              <div className="flex justify-between">
                <dt className="text-gray-400 text-sm">Stad</dt>
                <dd className="text-white text-sm">{org.city as string}</dd>
              </div>
            )}
            {org.employeeCount != null && (
              <div className="flex justify-between">
                <dt className="text-gray-400 text-sm">Medewerkers</dt>
                <dd className="text-white text-sm">{org.employeeCount as number}</dd>
              </div>
            )}
            {org.icpScore != null && (
              <div className="flex justify-between">
                <dt className="text-gray-400 text-sm">ICP Score</dt>
                <dd><IcpBadge score={org.icpScore as number} /></dd>
              </div>
            )}
            {org.source && (
              <div className="flex justify-between">
                <dt className="text-gray-400 text-sm">Bron</dt>
                <dd className="text-white text-sm">{org.source as string}</dd>
              </div>
            )}
          </dl>
        </div>

        <div className="bg-[#1a1a1a] border border-[#2a2a2a] rounded-lg p-6 shadow flex flex-col justify-center items-center">
          <p className="text-gray-400 text-sm mb-1">ICP Score</p>
          <p className="text-5xl font-bold text-white">{org.icpScore != null ? ((org.icpScore as number) * 100).toFixed(0) + "%" : "N/A"}</p>
        </div>
      </div>

      <div className="bg-[#1a1a1a] border border-[#2a2a2a] rounded-lg shadow overflow-hidden">
        <div className="px-6 py-4 border-b border-[#2a2a2a]">
          <h2 className="text-lg font-semibold text-white">Prospects ({prospects.length})</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-[#2a2a2a]">
                <th className="text-left px-4 py-3 text-gray-400 font-medium">Naam</th>
                <th className="text-left px-4 py-3 text-gray-400 font-medium">Titel</th>
                <th className="text-left px-4 py-3 text-gray-400 font-medium">Status</th>
                <th className="text-left px-4 py-3 text-gray-400 font-medium">Lead Score</th>
              </tr>
            </thead>
            <tbody>
              {prospects.length === 0 ? (
                <tr>
                  <td colSpan={4} className="px-4 py-8 text-center text-gray-400">Geen prospects gekoppeld.</td>
                </tr>
              ) : (
                prospects.map((p) => {
                  const status = (p.status as string) ?? "DISCOVERED";
                  const badgeColor = statusColors[status] || "bg-gray-500/20 text-gray-400";
                  const score = (p.leadScore as number) ?? 0;
                  const fullName = (p.fullName as string) ?? `${p.firstName ?? ''} ${p.lastName ?? ''}`.trim();
                  return (
                    <tr key={p.id as string} className="border-b border-[#2a2a2a] hover:bg-[#222] transition-colors">
                      <td className="px-4 py-3 text-white font-medium">
                        <Link href={`/prospects/${p.id as string}`} className="hover:text-blue-400 transition-colors">
                          {fullName || "-"}
                        </Link>
                      </td>
                      <td className="px-4 py-3 text-gray-400">{(p.title as string) ?? "-"}</td>
                      <td className="px-4 py-3">
                        <span className={`inline-block px-2 py-0.5 rounded text-xs font-medium ${badgeColor}`}>{status}</span>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2">
                          <div className="flex-1 bg-[#2a2a2a] rounded-full h-2 w-20 overflow-hidden">
                            <div className="bg-blue-500 h-full rounded-full" style={{ width: `${score * 100}%` }} />
                          </div>
                          <span className="text-gray-400 text-xs w-8">{(score * 100).toFixed(0)}%</span>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
