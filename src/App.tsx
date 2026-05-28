import { useState } from "react";
import SectorList from "./components/SectorList";
import CountryDropdown from "./components/CountryDropdown";
import IcpTable from "./components/IcpTable";

function App() {
  const [selectedSector, setSelectedSector] = useState<string>("");
  const [country, setCountry] = useState("");
  const [minRevenue, setMinRevenue] = useState("");
  const [maxRevenue, setMaxRevenue] = useState("");
  const [employees, setEmployees] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [tableRows, setTableRows] = useState<Record<string, unknown>[]>([]);
  const [error, setError] = useState<string | null>(null);

  const N8N_WEBHOOK = "https://n8n.ianman.com/webhook/discovery";

  const handleGenerate = async () => {
    setIsGenerating(true);
    setError(null);

    const payload = {
      sector: selectedSector,
      country,
      revenueMin: minRevenue ? Number(minRevenue) : null,
      revenueMax: maxRevenue ? Number(maxRevenue) : null,
      employees: employees ? Number(employees) : null,
    };

    try {
      const res = await fetch(N8N_WEBHOOK, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        throw new Error(`Webhook returned ${res.status}: ${res.statusText}`);
      }

      const data = await res.json();

      // Recursive normalizer — handles any n8n wrapping depth/order
      function extractRows(d: unknown): Record<string, unknown>[] {
        if (!d) return [];

        // n8n item-wrapper array: [{json: {...}}, ...]
        if (
          Array.isArray(d) &&
          d.length > 0 &&
          d[0] &&
          typeof (d[0] as Record<string, unknown>).json === "object"
        ) {
          // Unwrap each json and recurse
          return extractRows(
            (d as Record<string, unknown>[]).map(
              (r) => r.json as Record<string, unknown>
            )
          );
        }

        // Plain array — check if first item has micro_icps inside
        if (Array.isArray(d)) {
          if (
            d.length > 0 &&
            Array.isArray((d[0] as Record<string, unknown>)?.micro_icps)
          ) {
            return extractRows(
              (d[0] as Record<string, unknown>).micro_icps
            );
          }
          return d as Record<string, unknown>[];
        }

        // Object — check known wrapper keys
        if (d && typeof d === "object") {
          const obj = d as Record<string, unknown>;
          if (Array.isArray(obj.micro_icps)) return extractRows(obj.micro_icps);
          if (Array.isArray(obj.results)) return extractRows(obj.results);
          if (Array.isArray(obj.data)) return extractRows(obj.data);
          return [obj];
        }

        return [];
      }

      const rows = extractRows(data);
      setTableRows(rows);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Unknown error";
      setError(`Failed to reach n8n workflow. ${msg}`);
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="flex flex-col min-h-full bg-white">
      {/* ── Header ── */}
      <header className="flex-shrink-0 border-b border-gray-200 bg-white px-6 py-3 flex items-center justify-between shadow-sm">
        {/* ESSNPS Logo — 174.97 × 44 px matching the site */}
        <img
          src="/essnps-logo.svg"
          alt="ESSNPS Logo"
          style={{ width: "175px", height: "44px" }}
          className="object-contain object-left"
        />
        <div className="flex items-center gap-2">
          <a
            href="mailto:RFQ@ESSNPS.COM"
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-orange-50 border border-orange-200 text-xs text-orange-600 font-semibold hover:bg-orange-100 transition-colors"
          >
            <svg className="w-3.5 h-3.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" />
            </svg>
            rfq@essnps.com
          </a>
        </div>
      </header>

      {/* ── Page title row ── */}
      <div className="flex-shrink-0 px-6 py-4 border-b border-gray-100 bg-gray-50/60">
        <h1 className="text-lg font-bold text-gray-900">ICP Discovery Dashboard</h1>
        <p className="text-xs text-gray-500 mt-0.5">Ideal Customer Profile Generator — powered by n8n automation</p>
      </div>

      {/* ── Main Split Layout ── */}
      <div className="flex flex-1 flex-col lg:flex-row overflow-hidden">

        {/* ── LEFT PANEL ── */}
        <aside className="w-full lg:w-[35%] flex-shrink-0 border-b lg:border-b-0 lg:border-r border-gray-200 bg-white flex flex-col overflow-hidden">
          <div className="flex-1 overflow-y-auto p-5 space-y-5">

            {/* Sectors */}
            <section>
              <div className="flex items-center gap-2 mb-3">
                <div className="w-1 h-4 rounded-full bg-orange-500 flex-shrink-0"></div>
                <h2 className="text-sm font-semibold text-gray-800">Sector</h2>
              </div>
              <SectorList selected={selectedSector} onChange={setSelectedSector} />
            </section>

            <hr className="border-gray-100" />

            {/* Country */}
            <section>
              <div className="flex items-center gap-2 mb-3">
                <div className="w-1 h-4 rounded-full bg-orange-500 flex-shrink-0"></div>
                <h2 className="text-sm font-semibold text-gray-800">Country</h2>
              </div>
              <CountryDropdown value={country} onChange={setCountry} />
            </section>

            <hr className="border-gray-100" />

            {/* Revenue Range */}
            <section>
              <div className="flex items-center gap-2 mb-3">
                <div className="w-1 h-4 rounded-full bg-orange-500 flex-shrink-0"></div>
                <h2 className="text-sm font-semibold text-gray-800">Revenue Range</h2>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs text-gray-500 mb-1.5">Min Revenue ($)</label>
                  <input
                    type="number"
                    value={minRevenue}
                    onChange={(e) => setMinRevenue(e.target.value)}
                    placeholder="1000000"
                    className="w-full px-3 py-2.5 rounded-lg border border-gray-300 bg-white text-sm text-gray-800 placeholder-gray-400 outline-none focus:border-orange-400 focus:ring-2 focus:ring-orange-100 transition-all"
                  />
                </div>
                <div>
                  <label className="block text-xs text-gray-500 mb-1.5">Max Revenue ($)</label>
                  <input
                    type="number"
                    value={maxRevenue}
                    onChange={(e) => setMaxRevenue(e.target.value)}
                    placeholder="50000000"
                    className="w-full px-3 py-2.5 rounded-lg border border-gray-300 bg-white text-sm text-gray-800 placeholder-gray-400 outline-none focus:border-orange-400 focus:ring-2 focus:ring-orange-100 transition-all"
                  />
                </div>
              </div>
            </section>

            <hr className="border-gray-100" />

            {/* Company Size */}
            <section>
              <div className="flex items-center gap-2 mb-3">
                <div className="w-1 h-4 rounded-full bg-orange-500 flex-shrink-0"></div>
                <h2 className="text-sm font-semibold text-gray-800">Company Size</h2>
              </div>
              <div>
                <label className="block text-xs text-gray-500 mb-1.5">Number of Employees</label>
                <input
                  type="number"
                  value={employees}
                  onChange={(e) => setEmployees(e.target.value)}
                  placeholder="500"
                  className="w-full px-3 py-2.5 rounded-lg border border-gray-300 bg-white text-sm text-gray-800 placeholder-gray-400 outline-none focus:border-orange-400 focus:ring-2 focus:ring-orange-100 transition-all"
                />
              </div>
            </section>
          </div>

          {/* Generate Button */}
          <div className="flex-shrink-0 p-5 border-t border-gray-200 bg-white">
            <button
              onClick={handleGenerate}
              disabled={isGenerating}
              className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-orange-500 hover:bg-orange-600 disabled:opacity-70 disabled:cursor-not-allowed text-white font-semibold text-sm transition-colors shadow-sm"
            >
              {isGenerating ? (
                <>
                  <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4l3-3-3-3v4a8 8 0 00-8 8h4z" />
                  </svg>
                  Discovering ICPs…
                </>
              ) : (
                <>
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09z" />
                  </svg>
                  Generate ICPs
                </>
              )}
            </button>
            <p className="text-xs text-gray-400 text-center mt-2">
              Powered by n8n automation workflow
            </p>
          </div>
        </aside>

        {/* ── RIGHT PANEL ── */}
        <main className="flex-1 flex flex-col overflow-hidden bg-gray-50/40">
          {/* Panel header */}
          <div className="flex-shrink-0 px-6 py-4 border-b border-gray-200 bg-white flex items-center justify-between">
            <div>
              <h2 className="text-sm font-semibold text-gray-800">ICP Results</h2>
              <p className="text-xs text-gray-400 mt-0.5">
                {error
                  ? "Workflow error — see message below"
                  : tableRows.length > 0
                    ? `${tableRows.length} profiles returned`
                    : "Results will appear here after the workflow responds"}
              </p>
            </div>
            {tableRows.length > 0 && !error && (
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-orange-50 border border-orange-200 text-xs text-orange-600 font-semibold">
                {tableRows.length} profiles
              </span>
            )}
          </div>

          {/* Error banner */}
          {error && (
            <div className="flex-shrink-0 mx-6 mt-4 flex items-start gap-3 px-4 py-3 rounded-lg bg-red-50 border border-red-200 text-sm text-red-700">
              <svg className="w-4 h-4 mt-0.5 flex-shrink-0 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
              </svg>
              <span>{error}</span>
              <button onClick={() => setError(null)} className="ml-auto text-red-400 hover:text-red-600 transition-colors">
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          )}

          {/* Table area */}
          <div className="flex-1 overflow-hidden p-6">
            <IcpTable rows={tableRows} />
          </div>
        </main>
      </div>
    </div>
  );
}

export default App;
