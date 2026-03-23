import { fetchAPI } from "@/lib/api";
import Link from "next/link";
import StatusUpdater from "@/components/StatusUpdater";

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

export default async function ProspectDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const res = await fetchAPI(`/api/v1/prospects/${id}`);
  const prospect = res?.data ?? res;

  if (!prospect || !prospect.id) {
    return (
      <div>
        <div className="flex items-center gap-2 text-sm text-gray-400 mb-6">
          <Link href="/prospects" className="hover:text-white transition-colors">Prospects</Link>
          <span>/</span>
          <span className="text-gray-500">Niet gevonden</span>
        </div>
        <div className="bg-[#1a1a1a] border border-[#2a2a2a] rounded-lg p-6">
          <p className="text-gray-400">Prospect niet gevonden.</p>
        </div>
      </div>
    );
  }

  const fullName =
    (prospect.fullName as string) ??
    `${prospect.firstName ?? ''} ${prospect.lastName ?? ''}`.trim();
  const status = (prospect.status as string) ?? "DISCOVERED";
  const badgeColor = statusColors[status] || "bg-gray-500/20 text-gray-400";
  const score = (prospect.leadScore as number) ?? 0;
  const org = prospect.organization as Record<string, unknown> | undefined;
  const hooks = prospect.personalizationHooks ?? prospect.hooks ?? null;

  return (
    <div>
      <div className="flex items-center gap-2 text-sm text-gray-400 mb-6">
        <Link href="/prospects" className="hover:text-white transition-colors">Prospects</Link>
        <span>/</span>
        <span className="text-white">{fullName}</span>
      </div>

      <div className="flex items-center gap-4 mb-6">
        <Link
          href="/prospects"
          className="px-3 py-1.5 rounded bg-[#2a2a2a] hover:bg-[#333] text-gray-400 hover:text-white text-sm transition-colors"
        >
          Terug
        </Link>
        <h1 className="text-2xl font-bold text-white">{fullName}</h1>
        <span className={`inline-block px-2 py-0.5 rounded text-xs font-medium ${badgeColor}`}>{status}</span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        <div className="bg-[#1a1a1a] border border-[#2a2a2a] rounded-lg p-6 shadow">
          <h2 className="text-lg font-semibold text-white mb-4">Prospect Details</h2>
          <dl className="space-y-3">
            {prospect.title && (
              <div className="flex justify-between">
                <dt className="text-gray-400 text-sm">Titel</dt>
                <dd className="text-white text-sm">{prospect.title as string}</dd>
              </div>
            )}
            {org?.name && (
              <div className="flex justify-between">
                <dt className="text-gray-400 text-sm">Bedrijf</dt>
                <dd className="text-sm">
                  <Link href={`/organizations/${org.id as string}`} className="text-blue-400 hover:text-blue-300 transition-colors">
                    {org.name as string}
                  </Link>
                </dd>
              </div>
            )}
            {prospect.email && (
              <div className="flex justify-between">
                <dt className="text-gray-400 text-sm">Email</dt>
                <dd className="text-white text-sm">{prospect.email as string}</dd>
              </div>
            )}
            {prospect.language && (
              <div className="flex justify-between">
                <dt className="text-gray-400 text-sm">Taal</dt>
                <dd className="text-white text-sm">{prospect.language as string}</dd>
              </div>
            )}
            {prospect.linkedinUrl && (
              <div className="flex justify-between">
                <dt className="text-gray-400 text-sm">LinkedIn</dt>
                <dd className="text-sm">
                  <a href={prospect.linkedinUrl as string} target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:text-blue-300 transition-colors">
                    Profiel bekijken
                  </a>
                </dd>
              </div>
            )}
            <div className="flex justify-between">
              <dt className="text-gray-400 text-sm">Lead Score</dt>
              <dd className="flex items-center gap-2">
                <div className="flex-1 bg-[#2a2a2a] rounded-full h-2 w-24 overflow-hidden">
                  <div className="bg-blue-500 h-full rounded-full" style={{ width: `${score * 100}%` }} />
                </div>
                <span className="text-white text-sm">{(score * 100).toFixed(0)}%</span>
              </dd>
            </div>
            {prospect.source && (
              <div className="flex justify-between">
                <dt className="text-gray-400 text-sm">Bron</dt>
                <dd className="text-white text-sm">{prospect.source as string}</dd>
              </div>
            )}
          </dl>
        </div>

        <div className="bg-[#1a1a1a] border border-[#2a2a2a] rounded-lg p-6 shadow">
          <h2 className="text-lg font-semibold text-white mb-4">Status bijwerken</h2>
          <p className="text-gray-400 text-sm mb-3">Huidige status: <span className={`inline-block px-2 py-0.5 rounded text-xs font-medium ml-1 ${badgeColor}`}>{status}</span></p>
          <StatusUpdater prospectId={prospect.id as string} currentStatus={status} />
        </div>
      </div>

      {hooks && (
        <div className="bg-[#1a1a1a] border border-[#2a2a2a] rounded-lg p-6 shadow">
          <h2 className="text-lg font-semibold text-white mb-4">Personalization Hooks</h2>
          <pre className="text-green-400 text-xs font-mono bg-[#0a0a0a] rounded p-4 overflow-x-auto whitespace-pre-wrap break-all">
            {JSON.stringify(hooks, null, 2)}
          </pre>
        </div>
      )}
    </div>
  );
}
