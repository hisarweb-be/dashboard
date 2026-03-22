import { fetchAPI } from "@/lib/api";
import type { Prospect } from "@/lib/types";
import Link from "next/link";

const statusColors: Record<string, string> = {
  DISCOVERED: "bg-gray-500/20 text-gray-400",
  ENRICHED: "bg-blue-500/20 text-blue-400",
  CONTACTED: "bg-yellow-500/20 text-yellow-400",
  QUALIFIED: "bg-green-500/20 text-green-400",
  MEETING_BOOKED: "bg-purple-500/20 text-purple-400",
  WON: "bg-emerald-500/20 text-emerald-400",
};

function StatusBadge({ status }: { status: string }) {
  const color = statusColors[status] || "bg-gray-500/20 text-gray-400";
  return (
    <span className={`inline-block px-2 py-0.5 rounded text-xs font-medium ${color}`}>
      {status}
    </span>
  );
}

function LeadScoreBar({ score }: { score: number }) {
  return (
    <div className="flex items-center gap-2">
      <div className="flex-1 bg-[#2a2a2a] rounded-full h-2 w-20 overflow-hidden">
        <div
          className="bg-blue-500 h-full rounded-full"
          style={{ width: `${score * 100}%` }}
        />
      </div>
      <span className="text-gray-400 text-xs w-8">{(score * 100).toFixed(0)}%</span>
    </div>
  );
}

export default async function ProspectsPage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string }>;
}) {
  const params = await searchParams;
  const currentPage = Number(params.page) || 1;
  const perPage = 20;

  let prospects: Prospect[] = [];
  let total = 0;

  try {
    const data = await fetchAPI(`/api/v1/prospects?page=${currentPage}&limit=${perPage}`);
    if (Array.isArray(data)) {
      prospects = data;
      total = data.length;
    } else {
      prospects = data.data || [];
      total = data.total ?? prospects.length;
    }
  } catch {
    // fallback
  }

  const totalPages = Math.max(1, Math.ceil(total / perPage));

  return (
    <div>
      <h1 className="text-2xl font-bold text-white mb-8">Prospects</h1>

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
                  <td colSpan={6} className="px-4 py-8 text-center text-gray-400">
                    Geen prospects gevonden.
                  </td>
                </tr>
              ) : (
                prospects.map((prospect) => (
                  <tr key={prospect.id} className="border-b border-[#2a2a2a] hover:bg-[#222] transition-colors">
                    <td className="px-4 py-3 text-white font-medium">
                      {prospect.firstName} {prospect.lastName}
                    </td>
                    <td className="px-4 py-3 text-gray-400">{prospect.title}</td>
                    <td className="px-4 py-3 text-gray-400">{prospect.organizationName}</td>
                    <td className="px-4 py-3">
                      <LeadScoreBar score={prospect.leadScore} />
                    </td>
                    <td className="px-4 py-3">
                      <StatusBadge status={prospect.status} />
                    </td>
                    <td className="px-4 py-3 text-gray-400">{prospect.language}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between px-4 py-3 border-t border-[#2a2a2a]">
            <p className="text-sm text-gray-400">
              Pagina {currentPage} van {totalPages} ({total} totaal)
            </p>
            <div className="flex gap-2">
              {currentPage > 1 && (
                <Link
                  href={`/prospects?page=${currentPage - 1}`}
                  className="px-3 py-1.5 rounded bg-[#2a2a2a] text-gray-400 hover:text-white text-sm transition-colors"
                >
                  Vorige
                </Link>
              )}
              {currentPage < totalPages && (
                <Link
                  href={`/prospects?page=${currentPage + 1}`}
                  className="px-3 py-1.5 rounded bg-[#2a2a2a] text-gray-400 hover:text-white text-sm transition-colors"
                >
                  Volgende
                </Link>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
