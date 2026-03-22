import { fetchAPI } from "@/lib/api";
import type { ApprovalItem } from "@/lib/types";

export default async function ApprovalPage() {
  let items: ApprovalItem[] = [];

  try {
    const data = await fetchAPI("/api/v1/approval/pending");
    items = Array.isArray(data) ? data : data.data || [];
  } catch {
    // fallback
  }

  return (
    <div>
      <h1 className="text-2xl font-bold text-white mb-8">Approval</h1>

      {items.length === 0 ? (
        <div className="bg-[#1a1a1a] border border-[#2a2a2a] rounded-lg p-6 shadow">
          <p className="text-gray-400">Geen items in de wachtrij.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {items.map((item) => (
            <div
              key={item.id}
              className="bg-[#1a1a1a] border border-[#2a2a2a] rounded-lg p-6 shadow"
            >
              <div className="flex items-start justify-between gap-4">
                <div>
                  <h3 className="text-white font-medium">{item.entityName}</h3>
                  <p className="text-gray-400 text-sm mt-1">
                    {item.action} - {item.entityType}
                  </p>
                  <p className="text-gray-400 text-xs mt-2">
                    {new Date(item.createdAt).toLocaleDateString("nl-NL", {
                      day: "numeric",
                      month: "long",
                      year: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </p>
                </div>
                <span className="inline-block px-2 py-0.5 rounded text-xs font-medium bg-yellow-500/20 text-yellow-400">
                  {item.status}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
