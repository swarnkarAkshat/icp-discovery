import { useState } from "react";
import { SECTORS } from "../data/dummyData";

const PAGE_SIZE = 7;

interface SectorListProps {
  selected: string;
  onChange: (selected: string) => void;
}

const SectorList: React.FC<SectorListProps> = ({ selected, onChange }) => {
  const [page, setPage] = useState(1);
  const totalPages = Math.ceil(SECTORS.length / PAGE_SIZE);
  const start = (page - 1) * PAGE_SIZE;
  const visible = SECTORS.slice(start, start + PAGE_SIZE);

  const pageNumbers = Array.from({ length: totalPages }, (_, i) => i + 1);

  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-center justify-between mb-1">
        <span className="text-xs text-gray-500">
          {selected ? "1 selected" : "None selected"}
        </span>
        {selected && (
          <button
            className="text-xs text-orange-500 hover:text-orange-600 transition-colors font-medium"
            onClick={() => onChange("")}
          >
            Clear
          </button>
        )}
      </div>

      {/* Radio list */}
      <div className="space-y-1 min-h-[260px]">
        {visible.map((sector) => {
          const checked = selected === sector;
          return (
            <label
              key={sector}
              className={`flex items-start gap-3 px-3 py-2.5 rounded-lg border cursor-pointer transition-all duration-150 ${
                checked
                  ? "border-orange-400/70 bg-orange-50"
                  : "border-gray-200 bg-white hover:border-gray-300 hover:bg-gray-50"
              }`}
            >
              <div className="relative flex-shrink-0 mt-0.5">
                <input
                  type="radio"
                  name="sector"
                  checked={checked}
                  onChange={() => onChange(sector)}
                  className="sr-only"
                />
                <div
                  className={`w-4 h-4 rounded-full border-2 flex items-center justify-center transition-all duration-150 ${
                    checked
                      ? "border-orange-500 bg-orange-500"
                      : "border-gray-300 bg-white"
                  }`}
                >
                  {checked && (
                    <div className="w-1.5 h-1.5 rounded-full bg-white" />
                  )}
                </div>
              </div>
              <span
                className={`text-sm leading-snug ${
                  checked ? "text-orange-700 font-medium" : "text-gray-700"
                }`}
              >
                {sector}
              </span>
            </label>
          );
        })}
      </div>

      {/* Pagination */}
      <div className="flex items-center justify-between pt-2 border-t border-gray-200">
        <button
          disabled={page === 1}
          onClick={() => setPage((p) => Math.max(1, p - 1))}
          className="px-3 py-1.5 text-xs rounded-md border border-gray-300 text-gray-500 hover:border-gray-400 hover:text-gray-700 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
        >
          ← Prev
        </button>
        <div className="flex items-center gap-1">
          {pageNumbers.map((n) => (
            <button
              key={n}
              onClick={() => setPage(n)}
              className={`w-7 h-7 text-xs rounded-md border transition-all ${
                n === page
                  ? "bg-orange-500 border-orange-500 text-white font-semibold"
                  : "border-gray-300 text-gray-500 hover:border-gray-400 hover:text-gray-700"
              }`}
            >
              {n}
            </button>
          ))}
        </div>
        <button
          disabled={page === totalPages}
          onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
          className="px-3 py-1.5 text-xs rounded-md border border-gray-300 text-gray-500 hover:border-gray-400 hover:text-gray-700 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
        >
          Next →
        </button>
      </div>
    </div>
  );
};

export default SectorList;
