import { fetchAPI } from "@/lib/api";

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
              <div className="flex items-start justify-between gap-4">
                <div>
                  <h3 className="text-white font-medium">{(item.entityName ?? item.prospectId ?? "Item") as string}</h3>
                  <p className="text-gray-400 text-sm mt-1">{(item.action ?? item.type ?? "-") as string}</p>
                </div>
                <span className="inline-block px-2 py-0.5 rounded text-xs font-medium bg-yellow-500/20 text-yellow-400">
                  {(item.status ?? "PENDING") as string}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
