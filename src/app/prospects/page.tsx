import { fetchAPI } from "@/lib/api";
import Link from "next/link";

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

export default async function ProspectsPage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string }>;
}) {
  const params = await searchParams;
  const currentPage = Number(params.page) || 1;

  const res = await fetchAPI(`/api/v1/prospects?page=${currentPage}&limit=20`);
  const prospects = res?.data ?? [];
  const pagination = res?.pagination ?? { total: 0, totalPages: 1 };

  return (
    <div>
      <h1 className="text-2xl font-bold text-white mb-8">Prospects</h1>

      {!res ? (
        <div className="bg-[#1a1a1a] border border-[#2a2a2a] rounded-lg p-6">
          <p className="text-gray-400">Kan geen verbinding maken met de API.</p>
        </div>
      ) : (
        <div className="bg-[#1a1a1a] border border-[#2a2a2a] rounded-lg shadow overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-[#2a2a2a]">
                  <th className="text-left px-4 py-3 text-gray-400 font-medium">Naam</th>
                  <th className="text-left px-4 py-3 text-gray-400 font-medium">Titel</th>
                  <th className="text-left px-4 py-3 text-gray-400 font-medium">Bedrijf</th>
                  <th className="text-left px-4 py-3 text-gray-400 font-medium">Lead Score</th>
                  <th className="text-left px-4 py-3 text-gray-400 font-medium">Status</th>
                  <th className="text-left px-4 py-3 text-gray-400 font-medium">Taal</th>
                </tr>
              </thead>
              <tbody>
                {prospects.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="px-4 py-8 text-center text-gray-400">Geen prospects gevonden.</td>
                  </tr>
                ) : (
                  prospects.map((p: Record<string, unknown>) => {
                    const org = p.organization as Record<string, unknown> | undefined;
                    const score = (p.leadScore as number) ?? 0;
                    const status = (p.status as string) ?? "DISCOVERED";
                    const badgeColor = statusColors[status] || "bg-gray-500/20 text-gray-400";

                    return (
                      <tr key={p.id as string} className="border-b border-[#2a2a2a] hover:bg-[#222] transition-colors">
                        <td className="px-4 py-3 text-white font-medium">
                          <Link href={`/prospects/${p.id as string}`} className="hover:text-blue-400 transition-colors">
                            {p.fullName as string}
                          </Link>
                        </td>
                        <td className="px-4 py-3 text-gray-400">{p.title as string}</td>
                        <td className="px-4 py-3 text-gray-400">{(org?.name as string) ?? "-"}</td>
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-2">
                            <div className="flex-1 bg-[#2a2a2a] rounded-full h-2 w-20 overflow-hidden">
                              <div className="bg-blue-500 h-full rounded-full" style={{ width: `${score * 100}%` }} />
                            </div>
                            <span className="text-gray-400 text-xs w-8">{(score * 100).toFixed(0)}%</span>
                          </div>
                        </td>
                        <td className="px-4 py-3">
                          <span className={`inline-block px-2 py-0.5 rounded text-xs font-medium ${badgeColor}`}>{status}</span>
                        </td>
                        <td className="px-4 py-3 text-gray-400">{(p.language as string) ?? "-"}</td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>

          {pagination.totalPages > 1 && (
            <div className="flex items-center justify-between px-4 py-3 border-t border-[#2a2a2a]">
              <p className="text-sm text-gray-400">Pagina {currentPage} van {pagination.totalPages} ({pagination.total} totaal)</p>
              <div className="flex gap-2">
                {currentPage > 1 && (
                  <Link href={`/prospects?page=${currentPage - 1}`} className="px-3 py-1.5 rounded bg-[#2a2a2a] hover:bg-[#333] text-gray-400 hover:text-white text-sm transition-colors">Vorige</Link>
                )}
                {currentPage < pagination.totalPages && (
                  <Link href={`/prospects?page=${currentPage + 1}`} className="px-3 py-1.5 rounded bg-[#2a2a2a] hover:bg-[#333] text-gray-400 hover:text-white text-sm transition-colors">Volgende</Link>
                )}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
