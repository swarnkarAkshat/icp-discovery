import React, { useState, useMemo } from "react";

type Row = Record<string, unknown>;

interface IcpTableProps {
  rows?: Row[];
}

const PAGE_SIZE = 6;

function rowToSearchText(row: Row): string {
  return Object.values(row)
    .map((v) => (Array.isArray(v) ? v.join(" ") : String(v ?? "")))
    .join(" ")
    .toLowerCase();
}

function exportCsv(rows: Row[]) {
  if (rows.length === 0) return;
  const cols = Object.keys(rows[0]);
  const header = cols.join(",");
  const body = rows.map((r) =>
    cols
      .map((c) => {
        const v = r[c];
        const s = Array.isArray(v) ? v.join("; ") : String(v ?? "");
        return `"${s.replace(/"/g, '""')}"`;
      })
      .join(",")
  );
  const blob = new Blob([[header, ...body].join("\n")], { type: "text/csv" });
  const a = document.createElement("a");
  a.href = URL.createObjectURL(blob);
  a.download = "icp_results.csv";
  a.click();
}

/* ── Single ICP Card ── */
function IcpCard({ row, index }: { row: Row; index: number }) {
  const id          = String(row.icp_id ?? `ICP-${String(index + 1).padStart(2, "0")}`);
  const sector      = String(row.industry ?? row.industry_sector ?? "—");
  const region      = String(row.region ?? row.region_industrial_area ?? "—");
  const revenueMin  = row.revenue_min !== undefined ? String(row.revenue_min) : null;
  const revenueMax  = row.revenue_max !== undefined ? String(row.revenue_max) : null;
  const revenue     = row.revenue     !== undefined ? String(row.revenue)     : null;
  const companySize = row.company_size !== undefined ? String(row.company_size) : null;
  const keywords: string[] = Array.isArray(row.product_keywords)
    ? (row.product_keywords as string[])
    : typeof row.product_keywords === "string"
    ? (row.product_keywords as string).split(",").map((s) => s.trim())
    : [];

  // Build revenue display
  const revenueDisplay =
    revenueMin && revenueMax
      ? `$${revenueMin} – $${revenueMax}`
      : revenueMin
      ? `From $${revenueMin}`
      : revenueMax
      ? `Up to $${revenueMax}`
      : revenue
      ? `$${revenue}`
      : null;

  return (
    <div className="bg-white border border-gray-200 rounded-xl p-5 hover:border-orange-300 hover:shadow-sm transition-all">
      {/* Card header */}
      <div className="flex items-start justify-between gap-3 mb-3">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap mb-1">
            <span className="inline-flex items-center px-2 py-0.5 rounded-md bg-gray-900 text-white text-xs font-bold tracking-wider">
              {id}
            </span>
            <span className="text-sm font-semibold text-gray-900 leading-tight">{sector}</span>
          </div>
          <div className="flex items-center gap-1.5 text-xs text-gray-500 mt-1">
            <svg className="w-3.5 h-3.5 text-gray-400 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" />
            </svg>
            <span className="leading-snug">{region}</span>
          </div>
        </div>

        {/* Revenue + Size pills */}
        <div className="flex flex-col items-end gap-1.5 flex-shrink-0">
          {revenueDisplay && (
            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs font-semibold font-mono whitespace-nowrap">
              <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v12m-3-2.818l.879.659c1.171.879 3.07.879 4.242 0 1.172-.879 1.172-2.303 0-3.182C13.536 12.219 12.768 12 12 12c-.725 0-1.45-.22-2.003-.659-1.106-.879-1.106-2.303 0-3.182s2.9-.879 4.006 0l.415.33M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              {revenueDisplay}
            </span>
          )}
          {companySize && (
            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-blue-50 border border-blue-200 text-blue-700 text-xs font-medium whitespace-nowrap">
              <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 018.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0111.964-3.07M12 6.375a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zm8.25 2.25a2.625 2.625 0 11-5.25 0 2.625 2.625 0 015.25 0z" />
              </svg>
              {companySize} emp.
            </span>
          )}
        </div>
      </div>

      {/* Divider */}
      {keywords.length > 0 && <div className="border-t border-gray-100 mb-3" />}

      {/* Product keywords */}
      {keywords.length > 0 && (
        <div>
          <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">Product Keywords</p>
          <div className="flex flex-wrap gap-1.5">
            {keywords.map((kw, i) => (
              <span
                key={i}
                className="inline-block px-2 py-0.5 rounded-md bg-orange-50 border border-orange-200 text-orange-700 text-xs font-medium"
              >
                {kw}
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

/* ── Main Table / Card List Component ── */
const IcpTable: React.FC<IcpTableProps> = ({ rows = [] }) => {
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);

  const filtered = useMemo(() => {
    const q = search.toLowerCase().trim();
    if (!q) return rows;
    return rows.filter((row) => rowToSearchText(row).includes(q));
  }, [search, rows]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const currentPage = Math.min(page, totalPages);
  const visible = filtered.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE);

  /* ── Empty state ── */
  if (rows.length === 0) {
    return (
      <div className="flex flex-col h-full items-center justify-center gap-4 text-center select-none">
        <div className="w-16 h-16 rounded-2xl bg-gray-100 border border-dashed border-gray-300 flex items-center justify-center">
          <svg className="w-8 h-8 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
          </svg>
        </div>
        <div>
          <p className="text-sm font-semibold text-gray-700">No ICP results yet</p>
          <p className="text-xs text-gray-400 mt-1.5 max-w-[260px] leading-relaxed">
            Select a sector and fill in your filters, then click{" "}
            <span className="font-semibold text-orange-500">Generate ICPs</span> to run the workflow.
          </p>
        </div>
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-gray-50 border border-gray-200">
          <span className="w-2 h-2 rounded-full bg-gray-300 flex-shrink-0"></span>
          <span className="text-xs text-gray-400 font-medium">Awaiting n8n response</span>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full gap-4">

      {/* ── Toolbar ── */}
      <div className="flex items-center gap-3 flex-shrink-0">
        {/* Search */}
        <div className="flex-1 flex items-center gap-2 px-3 py-2 rounded-lg bg-white border border-gray-300 focus-within:border-orange-400 focus-within:ring-2 focus-within:ring-orange-100 transition-all">
          <svg className="w-4 h-4 text-gray-400 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-4.35-4.35M17 11A6 6 0 1 1 5 11a6 6 0 0 1 12 0z" />
          </svg>
          <input
            type="text"
            value={search}
            onChange={(e) => { setSearch(e.target.value); setPage(1); }}
            placeholder="Search by sector, region, keywords…"
            className="flex-1 bg-transparent text-sm text-gray-700 placeholder-gray-400 outline-none"
          />
          {search && (
            <button onClick={() => { setSearch(""); setPage(1); }} className="text-gray-400 hover:text-gray-600 transition-colors">
              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          )}
        </div>

        {/* CSV */}
        <button
          onClick={() => exportCsv(filtered)}
          className="flex items-center gap-2 px-4 py-2 rounded-lg border border-gray-300 bg-white text-gray-600 text-sm font-medium hover:border-orange-400 hover:text-orange-600 transition-all whitespace-nowrap"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
          </svg>
          Export CSV
        </button>
      </div>

      {/* ── Count bar ── */}
      <div className="flex items-center justify-between flex-shrink-0">
        <p className="text-xs text-gray-500">
          Showing <span className="font-semibold text-gray-800">{filtered.length}</span> of{" "}
          <span className="font-semibold text-gray-800">{rows.length}</span> ICP profiles
        </p>
        {totalPages > 1 && (
          <p className="text-xs text-gray-400">Page {currentPage} of {totalPages}</p>
        )}
      </div>

      {/* ── Cards grid ── */}
      <div className="flex-1 overflow-y-auto space-y-3 pr-1">
        {visible.length === 0 ? (
          <div className="flex items-center justify-center py-20 text-sm text-gray-400">
            No results match your search.
          </div>
        ) : (
          visible.map((row, idx) => (
            <IcpCard
              key={String(row.icp_id ?? idx)}
              row={row}
              index={(currentPage - 1) * PAGE_SIZE + idx}
            />
          ))
        )}
      </div>

      {/* ── Pagination ── */}
      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-1 flex-shrink-0 pt-1 border-t border-gray-100">
          <button
            disabled={currentPage === 1}
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            className="px-3 py-1.5 text-xs rounded-md border border-gray-300 text-gray-500 hover:border-gray-400 hover:text-gray-700 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
          >← Prev</button>
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((n) => (
            <button
              key={n}
              onClick={() => setPage(n)}
              className={`w-7 h-7 text-xs rounded-md border transition-all ${
                n === currentPage
                  ? "bg-orange-500 border-orange-500 text-white font-semibold"
                  : "border-gray-300 text-gray-500 hover:border-gray-400 hover:text-gray-700"
              }`}
            >{n}</button>
          ))}
          <button
            disabled={currentPage === totalPages}
            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            className="px-3 py-1.5 text-xs rounded-md border border-gray-300 text-gray-500 hover:border-gray-400 hover:text-gray-700 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
          >Next →</button>
        </div>
      )}
    </div>
  );
};

export default IcpTable;
