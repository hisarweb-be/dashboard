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

export default async function OrganizationsPage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string }>;
}) {
  const params = await searchParams;
  const currentPage = Number(params.page) || 1;

  const res = await fetchAPI(`/api/v1/organizations?page=${currentPage}&limit=20`);
  const organizations = res?.data ?? [];
  const pagination = res?.pagination ?? { total: 0, totalPages: 1 };

  return (
    <div>
      <h1 className="text-2xl font-bold text-white mb-8">Organizations</h1>

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
                  <th className="text-left px-4 py-3 text-gray-400 font-medium">Industry</th>
                  <th className="text-left px-4 py-3 text-gray-400 font-medium">Land</th>
                  <th className="text-left px-4 py-3 text-gray-400 font-medium">ICP Score</th>
                  <th className="text-left px-4 py-3 text-gray-400 font-medium">Prospects</th>
                  <th className="text-left px-4 py-3 text-gray-400 font-medium">Bron</th>
                </tr>
              </thead>
              <tbody>
                {organizations.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="px-4 py-8 text-center text-gray-400">Geen organisaties gevonden.</td>
                  </tr>
                ) : (
                  organizations.map((org: Record<string, unknown>) => (
                    <tr key={org.id as string} className="border-b border-[#2a2a2a] hover:bg-[#222] transition-colors">
                      <td className="px-4 py-3 text-white font-medium">{org.name as string}</td>
                      <td className="px-4 py-3 text-gray-400">{org.industry as string}</td>
                      <td className="px-4 py-3 text-gray-400">{org.country as string}</td>
                      <td className="px-4 py-3"><IcpBadge score={org.icpScore as number} /></td>
                      <td className="px-4 py-3 text-gray-400">{(org._count as Record<string, number>)?.prospects ?? 0}</td>
                      <td className="px-4 py-3 text-gray-400">{org.source as string}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {pagination.totalPages > 1 && (
            <div className="flex items-center justify-between px-4 py-3 border-t border-[#2a2a2a]">
              <p className="text-sm text-gray-400">Pagina {currentPage} van {pagination.totalPages} ({pagination.total} totaal)</p>
              <div className="flex gap-2">
                {currentPage > 1 && (
                  <Link href={`/organizations?page=${currentPage - 1}`} className="px-3 py-1.5 rounded bg-[#2a2a2a] text-gray-400 hover:text-white text-sm">Vorige</Link>
                )}
                {currentPage < pagination.totalPages && (
                  <Link href={`/organizations?page=${currentPage + 1}`} className="px-3 py-1.5 rounded bg-[#2a2a2a] text-gray-400 hover:text-white text-sm">Volgende</Link>
                )}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
