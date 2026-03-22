import { fetchAPI } from "@/lib/api";
import type { AnalyticsOverview } from "@/lib/types";

export default async function AnalyticsPage() {
  let analytics: AnalyticsOverview | null = null;

  try {
    analytics = await fetchAPI("/api/v1/analytics/overview");
  } catch {
    // fallback
  }

  const pipeline = analytics?.pipeline ?? {};
  const pipelineEntries = Object.entries(pipeline);
  const maxCount = Math.max(...pipelineEntries.map(([, v]) => v), 1);

  const stats = [
    { label: "Totaal Organisaties", value: analytics?.totalOrganizations ?? 0 },
    { label: "Totaal Prospects", value: analytics?.totalProspects ?? 0 },
    { label: "Gem. ICP Score", value: ((analytics?.averageIcpScore ?? 0) * 100).toFixed(0) + "%" },
  ];

  return (
    <div>
      <h1 className="text-2xl font-bold text-white mb-8">Analytics</h1>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
        {stats.map((stat) => (
          <div
            key={stat.label}
            className="bg-[#1a1a1a] border border-[#2a2a2a] rounded-lg p-6 shadow"
          >
            <p className="text-gray-400 text-sm mb-1">{stat.label}</p>
            <p className="text-3xl font-bold text-white">{stat.value}</p>
          </div>
        ))}
      </div>

      {/* Pipeline Funnel */}
      <div className="bg-[#1a1a1a] border border-[#2a2a2a] rounded-lg p-6 shadow">
        <h2 className="text-lg font-semibold text-white mb-4">Pipeline Funnel</h2>
        {pipelineEntries.length === 0 ? (
          <p className="text-gray-400">Geen pipeline data beschikbaar.</p>
        ) : (
          <div className="space-y-3">
            {pipelineEntries.map(([status, count]) => (
              <div key={status} className="flex items-center gap-4">
                <span className="text-gray-400 text-sm w-40 shrink-0">{status}</span>
                <div className="flex-1 bg-[#2a2a2a] rounded-full h-6 overflow-hidden">
                  <div
                    className="bg-blue-500 h-full rounded-full transition-all"
                    style={{ width: `${(count / maxCount) * 100}%` }}
                  />
                </div>
                <span className="text-white text-sm font-medium w-10 text-right">{count}</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
