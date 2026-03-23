import { fetchAPI } from "@/lib/api";
import ApprovalActions from "@/components/ApprovalActions";

export default async function ApprovalPage() {
  const res = await fetchAPI("/api/v1/approval/pending");
  const items = res?.data ?? [];

  return (
    <div>
      <h1 className="text-2xl font-bold text-white mb-8">Approval Queue</h1>

      {!res ? (
        <div className="bg-[#1a1a1a] border border-[#2a2a2a] rounded-lg p-6">
          <p className="text-gray-400">Kan geen verbinding maken met de API.</p>
        </div>
      ) : items.length === 0 ? (
        <div className="bg-[#1a1a1a] border border-[#2a2a2a] rounded-lg p-6 shadow">
          <p className="text-gray-400">Geen items in de wachtrij.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {items.map((item: Record<string, unknown>) => (
            <div key={item.id as string} className="bg-[#1a1a1a] border border-[#2a2a2a] rounded-lg p-6 shadow">
              <div className="flex items-start justify-between gap-4 flex-wrap">
                <div className="flex-1 min-w-0">
                  <h3 className="text-white font-medium">{(item.entityName ?? item.prospectId ?? "Item") as string}</h3>
                  <p className="text-gray-400 text-sm mt-1">{(item.action ?? item.type ?? "-") as string}</p>
                  {!!item.entityType && (
                    <p className="text-gray-500 text-xs mt-0.5">{item.entityType as string}</p>
                  )}
                </div>
                <div className="flex items-center gap-4 flex-shrink-0">
                  <span className="inline-block px-2 py-0.5 rounded text-xs font-medium bg-yellow-500/20 text-yellow-400">
                    {(item.status ?? "PENDING") as string}
                  </span>
                  <ApprovalActions id={item.id as string} />
                </div>
              </div>
              {!!(item.details && Object.keys(item.details as object).length > 0) && (
                <details className="mt-4">
                  <summary className="text-gray-400 text-xs cursor-pointer hover:text-white transition-colors">Details tonen</summary>
                  <pre className="text-gray-400 text-xs font-mono bg-[#0a0a0a] rounded p-3 mt-2 overflow-x-auto whitespace-pre-wrap break-all">
                    {JSON.stringify(item.details, null, 2)}
                  </pre>
                </details>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
