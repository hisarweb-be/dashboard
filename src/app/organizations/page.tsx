import { fetchAPI } from "@/lib/api";
import Link from "next/link";
import SearchInput from "@/components/SearchInput";

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
        <>
          <SearchInput organizations={organizations} />

          {pagination.totalPages > 1 && (
            <div className="flex items-center justify-between px-4 py-3 mt-2 border border-[#2a2a2a] rounded-lg bg-[#1a1a1a]">
              <p className="text-sm text-gray-400">Pagina {currentPage} van {pagination.totalPages} ({pagination.total} totaal)</p>
              <div className="flex gap-2">
                {currentPage > 1 && (
                  <Link href={`/organizations?page=${currentPage - 1}`} className="px-3 py-1.5 rounded bg-[#2a2a2a] hover:bg-[#333] text-gray-400 hover:text-white text-sm transition-colors">Vorige</Link>
                )}
                {currentPage < pagination.totalPages && (
                  <Link href={`/organizations?page=${currentPage + 1}`} className="px-3 py-1.5 rounded bg-[#2a2a2a] hover:bg-[#333] text-gray-400 hover:text-white text-sm transition-colors">Volgende</Link>
                )}
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}
