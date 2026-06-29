import { useMemo, useState } from "react";
import {
  Search,
  ChevronUp,
  ChevronDown,
  ChevronsUpDown,
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  Inbox,
} from "lucide-react";
import { cn } from "@/lib/utils";

export type Column<T> = {
  /** Stable identifier for the column (used for sorting state). */
  key: string;
  header: React.ReactNode;
  /** Render the cell content for a row. */
  cell: (row: T) => React.ReactNode;
  /** Provide a comparable value to enable sorting on this column. */
  sortAccessor?: (row: T) => string | number;
  align?: "left" | "center" | "right";
  /** Extra classes applied to both header and body cells. */
  className?: string;
  /** Hide the column below the `lg` breakpoint to keep tables readable on mobile. */
  hideOnMobile?: boolean;
  headerClassName?: string;
};

type SortState = { key: string; dir: "asc" | "desc" } | null;

type DataTableProps<T> = {
  data: T[];
  columns: Column<T>[];
  getRowKey: (row: T) => string;
  /** Build a searchable string for a row. Enables the search box when provided. */
  searchAccessor?: (row: T) => string;
  searchPlaceholder?: string;
  /** Optional controls (filters, buttons) rendered in the toolbar. */
  toolbar?: React.ReactNode;
  pageSize?: number;
  pageSizeOptions?: number[];
  onRowClick?: (row: T) => void;
  /** Friendly noun shown in the footer count, e.g. "supervisors". */
  rowLabel?: string;
  emptyMessage?: string;
  className?: string;
};

const ALIGN: Record<NonNullable<Column<unknown>["align"]>, string> = {
  left: "text-left",
  center: "text-center",
  right: "text-right",
};

export function DataTable<T>({
  data,
  columns,
  getRowKey,
  searchAccessor,
  searchPlaceholder = "Search…",
  toolbar,
  pageSize: initialPageSize = 8,
  pageSizeOptions = [8, 16, 24],
  onRowClick,
  rowLabel = "records",
  emptyMessage = "No results found.",
  className,
}: DataTableProps<T>) {
  const [query, setQuery] = useState("");
  const [sort, setSort] = useState<SortState>(null);
  const [page, setPage] = useState(0);
  const [pageSize, setPageSize] = useState(initialPageSize);

  const filtered = useMemo(() => {
    if (!searchAccessor || !query.trim()) return data;
    const q = query.trim().toLowerCase();
    return data.filter((row) => searchAccessor(row).toLowerCase().includes(q));
  }, [data, query, searchAccessor]);

  const sorted = useMemo(() => {
    if (!sort) return filtered;
    const col = columns.find((c) => c.key === sort.key);
    if (!col?.sortAccessor) return filtered;
    const dir = sort.dir === "asc" ? 1 : -1;
    return [...filtered].sort((a, b) => {
      const av = col.sortAccessor!(a);
      const bv = col.sortAccessor!(b);
      if (typeof av === "number" && typeof bv === "number") return (av - bv) * dir;
      return String(av).localeCompare(String(bv)) * dir;
    });
  }, [filtered, sort, columns]);

  const pageCount = Math.max(1, Math.ceil(sorted.length / pageSize));
  const safePage = Math.min(page, pageCount - 1);
  const start = safePage * pageSize;
  const pageRows = sorted.slice(start, start + pageSize);

  function toggleSort(col: Column<T>) {
    if (!col.sortAccessor) return;
    setPage(0);
    setSort((prev) => {
      if (!prev || prev.key !== col.key) return { key: col.key, dir: "asc" };
      if (prev.dir === "asc") return { key: col.key, dir: "desc" };
      return null;
    });
  }

  const showingFrom = sorted.length === 0 ? 0 : start + 1;
  const showingTo = Math.min(start + pageSize, sorted.length);

  return (
    <section
      className={cn(
        "rounded-2xl border border-border bg-card shadow-soft",
        className,
      )}
    >
      {/* Toolbar */}
      {(searchAccessor || toolbar) && (
        <div className="flex flex-col gap-3 border-b border-border p-4 sm:flex-row sm:items-center sm:justify-between">
          {searchAccessor ? (
            <div className="relative w-full sm:max-w-xs">
              <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
              <input
                value={query}
                onChange={(e) => {
                  setQuery(e.target.value);
                  setPage(0);
                }}
                placeholder={searchPlaceholder}
                className="h-10 w-full rounded-lg border border-border bg-secondary/40 pl-9 pr-3 text-[13px] text-foreground placeholder:text-muted-foreground transition focus:border-ring focus:bg-card focus:outline-none focus:ring-4 focus:ring-ring/10"
              />
            </div>
          ) : (
            <span />
          )}
          {toolbar && <div className="flex flex-wrap items-center gap-2">{toolbar}</div>}
        </div>
      )}

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full border-collapse text-sm">
          <thead>
            <tr className="bg-secondary/40">
              {columns.map((col) => {
                const isSorted = sort?.key === col.key;
                return (
                  <th
                    key={col.key}
                    scope="col"
                    className={cn(
                      "whitespace-nowrap px-4 py-3 text-[11px] font-semibold uppercase tracking-[0.08em] text-muted-foreground first:pl-6 last:pr-6",
                      ALIGN[col.align ?? "left"],
                      col.hideOnMobile && "hidden lg:table-cell",
                      col.headerClassName,
                      col.className,
                    )}
                  >
                    {col.sortAccessor ? (
                      <button
                        type="button"
                        onClick={() => toggleSort(col)}
                        className={cn(
                          "group inline-flex items-center gap-1.5 transition-colors hover:text-foreground",
                          isSorted && "text-foreground",
                          col.align === "right" && "flex-row-reverse",
                        )}
                      >
                        {col.header}
                        <span className="text-muted-foreground/70 group-hover:text-foreground">
                          {!isSorted ? (
                            <ChevronsUpDown className="size-3.5" />
                          ) : sort?.dir === "asc" ? (
                            <ChevronUp className="size-3.5 text-primary" />
                          ) : (
                            <ChevronDown className="size-3.5 text-primary" />
                          )}
                        </span>
                      </button>
                    ) : (
                      col.header
                    )}
                  </th>
                );
              })}
            </tr>
          </thead>
          <tbody>
            {pageRows.length === 0 ? (
              <tr>
                <td colSpan={columns.length} className="px-6 py-16">
                  <div className="flex flex-col items-center justify-center gap-2 text-center">
                    <div className="grid size-11 place-items-center rounded-full bg-secondary text-muted-foreground">
                      <Inbox className="size-5" />
                    </div>
                    <p className="text-sm font-medium text-foreground">{emptyMessage}</p>
                    <p className="text-xs text-muted-foreground">
                      Try adjusting your search or filters.
                    </p>
                  </div>
                </td>
              </tr>
            ) : (
              pageRows.map((row) => (
                <tr
                  key={getRowKey(row)}
                  onClick={onRowClick ? () => onRowClick(row) : undefined}
                  className={cn(
                    "border-t border-border transition-colors",
                    onRowClick ? "cursor-pointer hover:bg-secondary/50" : "hover:bg-secondary/40",
                  )}
                >
                  {columns.map((col) => (
                    <td
                      key={col.key}
                      className={cn(
                        "px-4 py-3.5 align-middle text-foreground/90 first:pl-6 last:pr-6",
                        ALIGN[col.align ?? "left"],
                        col.hideOnMobile && "hidden lg:table-cell",
                        col.className,
                      )}
                    >
                      {col.cell(row)}
                    </td>
                  ))}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Footer / pagination */}
      <div className="flex flex-col gap-3 border-t border-border px-4 py-3 sm:flex-row sm:items-center sm:justify-between sm:px-6">
        <div className="flex items-center gap-4">
          <p className="text-xs text-muted-foreground">
            Showing{" "}
            <span className="font-semibold text-foreground">{showingFrom}</span>–
            <span className="font-semibold text-foreground">{showingTo}</span> of{" "}
            <span className="font-semibold text-foreground">{sorted.length}</span> {rowLabel}
          </p>
          <label className="hidden items-center gap-2 text-xs text-muted-foreground sm:flex">
            Rows
            <select
              value={pageSize}
              onChange={(e) => {
                setPageSize(Number(e.target.value));
                setPage(0);
              }}
              className="h-8 rounded-md border border-border bg-card px-2 text-xs font-medium text-foreground focus:border-ring focus:outline-none focus:ring-2 focus:ring-ring/10"
            >
              {pageSizeOptions.map((opt) => (
                <option key={opt} value={opt}>
                  {opt}
                </option>
              ))}
            </select>
          </label>
        </div>

        <div className="flex items-center gap-1">
          <span className="mr-2 text-xs font-medium text-muted-foreground">
            Page {safePage + 1} of {pageCount}
          </span>
          <PagerButton onClick={() => setPage(0)} disabled={safePage === 0} label="First page">
            <ChevronsLeft className="size-4" />
          </PagerButton>
          <PagerButton
            onClick={() => setPage((p) => Math.max(0, p - 1))}
            disabled={safePage === 0}
            label="Previous page"
          >
            <ChevronLeft className="size-4" />
          </PagerButton>
          <PagerButton
            onClick={() => setPage((p) => Math.min(pageCount - 1, p + 1))}
            disabled={safePage >= pageCount - 1}
            label="Next page"
          >
            <ChevronRight className="size-4" />
          </PagerButton>
          <PagerButton
            onClick={() => setPage(pageCount - 1)}
            disabled={safePage >= pageCount - 1}
            label="Last page"
          >
            <ChevronsRight className="size-4" />
          </PagerButton>
        </div>
      </div>
    </section>
  );
}

function PagerButton({
  onClick,
  disabled,
  label,
  children,
}: {
  onClick: () => void;
  disabled?: boolean;
  label: string;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      aria-label={label}
      className="grid size-8 place-items-center rounded-md border border-border bg-card text-muted-foreground transition hover:bg-secondary hover:text-foreground disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:bg-card disabled:hover:text-muted-foreground"
    >
      {children}
    </button>
  );
}
