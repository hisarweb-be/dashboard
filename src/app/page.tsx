import { fetchAPI } from "@/lib/api";

export default async function DashboardPage() {
  const analyticsRes = await fetchAPI("/api/v1/analytics/overview");
  const orgsRes = await fetchAPI("/api/v1/organizations");
  const prospectsRes = await fetchAPI("/api/v1/prospects");

  const analytics = analyticsRes?.data ?? {};
  const totalOrgs = orgsRes?.pagination?.total ?? orgsRes?.data?.length ?? 0;
  const totalProspects = prospectsRes?.pagination?.total ?? prospectsRes?.data?.length ?? 0;
  const avgIcp = analytics?.averageIcpScore ?? 0;
  const pipeline = analytics?.pipeline ?? {};

  const pipelineEntries = Object.entries(pipeline) as [string, number][];
  const maxCount = pipelineEntries.length > 0 ? Math.max(...pipelineEntries.map(([, v]) => v), 1) : 1;

  const kpis = [
    { label: "Totaal Organisaties", value: totalOrgs },
    { label: "Totaal Prospects", value: totalProspects },
    { label: "Gem. ICP Score", value: avgIcp > 0 ? (avgIcp * 100).toFixed(0) + "%" : "N/A" },
    { label: "Pipeline Stadia", value: pipelineEntries.length },
  ];

  return (
    <div>
      <h1 className="text-2xl font-bold text-white mb-8">Dashboard</h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {kpis.map((kpi) => (
          <div key={kpi.label} className="bg-[#1a1a1a] border border-[#2a2a2a] rounded-lg p-6 shadow">
            <p className="text-gray-400 text-sm mb-1">{kpi.label}</p>
            <p className="text-3xl font-bold text-white">{kpi.value}</p>
          </div>
        ))}
      </div>

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
                  <div className="bg-blue-500 h-full rounded-full" style={{ width: `${(count / maxCount) * 100}%` }} />
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
