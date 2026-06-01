"use client";

import {
  useState,
  useMemo,
  useCallback,
  useRef,
  useEffect,
  type ReactNode,
} from "react";
import {
  Search,
  ChevronUp,
  ChevronDown,
  ChevronsUpDown,
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  AlertCircle,
  Inbox,
  Loader2,
  MoreVertical,
} from "lucide-react";

import type {
  DataGridColumn,
  DataGridAction,
  DataGridProps,
  SortState,
  ActionVariant,
} from "../types";

/* ──────────────────────────────────────────────
 *  Utilidades internas
 * ────────────────────────────────────────────── */

/** Obtiene el valor de un accessorKey, soportando dot‑notation básica */
function getNestedValue<T>(obj: T, key: string): unknown {
  return (obj as Record<string, unknown>)[key];
}

/** Mapeo de variantes de acción a clases Tailwind */
const variantClasses: Record<ActionVariant, string> = {
  default:
    "text-zinc-400 hover:text-white hover:bg-white/10 focus:ring-indigo-500/40",
  destructive:
    "text-red-400 hover:text-red-300 hover:bg-red-500/10 focus:ring-red-500/40",
  success:
    "text-emerald-400 hover:text-emerald-300 hover:bg-emerald-500/10 focus:ring-emerald-500/40",
  warning:
    "text-amber-400 hover:text-amber-300 hover:bg-amber-500/10 focus:ring-amber-500/40",
};

/** Clases de alineación */
const alignClasses = {
  left: "text-left",
  center: "text-center",
  right: "text-right",
} as const;

/* ──────────────────────────────────────────────
 *  Subcomponentes internos
 * ────────────────────────────────────────────── */

/* ---------- Buscador ---------- */
function DataGridSearch({
  value,
  onChange,
  placeholder,
}: {
  value: string;
  onChange: (val: string) => void;
  placeholder: string;
}) {
  const [localValue, setLocalValue] = useState(value);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const handleChange = useCallback(
    (val: string) => {
      setLocalValue(val);
      if (timerRef.current) clearTimeout(timerRef.current);
      timerRef.current = setTimeout(() => onChange(val), 300);
    },
    [onChange]
  );

  useEffect(() => {
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, []);

  return (
    <div className="relative w-full sm:max-w-xs">
      <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-zinc-500 pointer-events-none" />
      <input
        id="datagrid-search"
        type="text"
        value={localValue}
        onChange={(e) => handleChange(e.target.value)}
        placeholder={placeholder}
        className="w-full rounded-lg bg-white/5 border border-white/10 py-2 pl-9 pr-3 text-sm text-zinc-200 placeholder:text-zinc-500 outline-none transition-all duration-200 focus:border-indigo-500/50 focus:ring-2 focus:ring-indigo-500/20"
        aria-label="Search in table"
      />
    </div>
  );
}

/* ---------- Indicador de sort ---------- */
function SortIndicator({
  active,
  direction,
}: {
  active: boolean;
  direction: "asc" | "desc" | null;
}) {
  if (!active || !direction) {
    return <ChevronsUpDown className="size-3.5 text-zinc-600" />;
  }
  return direction === "asc" ? (
    <ChevronUp className="size-3.5 text-indigo-400" />
  ) : (
    <ChevronDown className="size-3.5 text-indigo-400" />
  );
}

/* ---------- Menú de acciones (mobile / overflow) ---------- */
function ActionsMenu<T>({
  row,
  actions,
}: {
  row: T;
  actions: DataGridAction<T>[];
}) {
  const [open, setOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  const visibleActions = actions.filter((a) => !a.hidden?.(row));
  if (visibleActions.length === 0) return null;

  /* Cerrar al hacer clic fuera */
  useEffect(() => {
    if (!open) return;
    const handler = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [open]);

  return (
    <div ref={menuRef} className="relative inline-flex">
      <button
        type="button"
        onClick={() => setOpen((p) => !p)}
        className="rounded-lg p-1.5 text-zinc-500 hover:text-white hover:bg-white/10 transition-colors duration-150 focus:outline-none focus:ring-2 focus:ring-indigo-500/40"
        aria-label="Actions"
        aria-haspopup="true"
        aria-expanded={open}
      >
        <MoreVertical className="size-4" />
      </button>

      {open && (
        <div
          className="absolute right-0 top-full z-50 mt-1 min-w-36 origin-top-right animate-in fade-in rounded-xl border border-white/10 bg-zinc-900 p-1 shadow-xl shadow-black/40"
          role="menu"
        >
          {visibleActions.map((action, i) => (
            <button
              key={i}
              type="button"
              role="menuitem"
              onClick={() => {
                action.onClick(row);
                setOpen(false);
              }}
              className={`flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm transition-colors duration-150 ${variantClasses[action.variant ?? "default"]}`}
              title={action.tooltip}
            >
              {action.icon && <span className="size-4 shrink-0">{action.icon}</span>}
              {action.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

/* ---------- Botones de acción en línea (desktop) ---------- */
function InlineActions<T>({
  row,
  actions,
}: {
  row: T;
  actions: DataGridAction<T>[];
}) {
  const visibleActions = actions.filter((a) => !a.hidden?.(row));
  if (visibleActions.length === 0) return null;

  return (
    <div className="flex items-center justify-end gap-1">
      {visibleActions.map((action, i) => (
        <button
          key={i}
          type="button"
          onClick={() => action.onClick(row)}
          className={`inline-flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-xs font-medium transition-all duration-150 focus:outline-none focus:ring-2 cursor-pointer ${variantClasses[action.variant ?? "default"]}`}
          title={action.tooltip}
        >
          {action.icon && <span className="size-3.5 shrink-0">{action.icon}</span>}
          <span className="hidden sm:inline">{action.label}</span>
        </button>
      ))}
    </div>
  );
}

/* ---------- Paginación ---------- */
function DataGridPagination({
  currentPage,
  totalPages,
  pageSize,
  totalItems,
  onPageChange,
  onPageSizeChange,
}: {
  currentPage: number;
  totalPages: number;
  pageSize: number;
  totalItems: number;
  onPageChange: (page: number) => void;
  onPageSizeChange: (size: number) => void;
}) {
  const from = totalItems === 0 ? 0 : (currentPage - 1) * pageSize + 1;
  const to = Math.min(currentPage * pageSize, totalItems);

  const pageSizeOptions = [5, 10, 20, 50];

  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between border-t border-white/5 px-4 py-3">
      {/* Info + select de tamaño */}
      <div className="flex items-center gap-3 text-xs text-zinc-500">
        <span>
          {from}–{to} of {totalItems}
        </span>

        <div className="flex items-center gap-1.5">
          <label htmlFor="datagrid-pagesize" className="sr-only">
            Rows per page
          </label>
          <select
            id="datagrid-pagesize"
            value={pageSize}
            onChange={(e) => onPageSizeChange(Number(e.target.value))}
            className="rounded-md bg-white/5 border border-white/10 px-2 py-1 text-xs text-zinc-300 outline-none transition-colors focus:border-indigo-500/50"
          >
            {pageSizeOptions.map((s) => (
              <option key={s} value={s} className="bg-zinc-900">
                {s} / page
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Botones de navegación */}
      <nav className="flex items-center gap-1" aria-label="Table pagination">
        <PaginationButton
          onClick={() => onPageChange(1)}
          disabled={currentPage <= 1}
          aria-label="First page"
        >
          <ChevronsLeft className="size-4" />
        </PaginationButton>

        <PaginationButton
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage <= 1}
          aria-label="Previous page"
        >
          <ChevronLeft className="size-4" />
        </PaginationButton>

        {/* Números de página */}
        {generatePageNumbers(currentPage, totalPages).map((p, i) =>
          p === "..." ? (
            <span key={`dots-${i}`} className="px-1 text-zinc-600 text-xs">
              …
            </span>
          ) : (
            <PaginationButton
              key={p}
              onClick={() => onPageChange(p as number)}
              active={p === currentPage}
              aria-label={`Page ${p}`}
            >
              {p}
            </PaginationButton>
          )
        )}

        <PaginationButton
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage >= totalPages}
          aria-label="Next page"
        >
          <ChevronRight className="size-4" />
        </PaginationButton>

        <PaginationButton
          onClick={() => onPageChange(totalPages)}
          disabled={currentPage >= totalPages}
          aria-label="Last page"
        >
          <ChevronsRight className="size-4" />
        </PaginationButton>
      </nav>
    </div>
  );
}

function PaginationButton({
  children,
  onClick,
  disabled,
  active,
  ...rest
}: {
  children: ReactNode;
  onClick?: () => void;
  disabled?: boolean;
  active?: boolean;
} & React.ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className={`inline-flex items-center justify-center rounded-lg size-8 text-xs font-medium transition-all duration-150 focus:outline-none focus:ring-2 focus:ring-indigo-500/40 disabled:opacity-30 disabled:cursor-not-allowed ${active ? "bg-indigo-500/15 text-indigo-400 border border-indigo-500/30" : "text-zinc-400 hover:text-white hover:bg-white/10"}`}
      {...rest}
    >
      {children}
    </button>
  );
}

/** Genera los números de página a mostrar con elipsis */
function generatePageNumbers(
  current: number,
  total: number
): (number | "...")[] {
  if (total <= 7) return Array.from({ length: total }, (_, i) => i + 1);

  const pages: (number | "...")[] = [1];

  if (current > 3) pages.push("...");

  const start = Math.max(2, current - 1);
  const end = Math.min(total - 1, current + 1);

  for (let i = start; i <= end; i++) pages.push(i);

  if (current < total - 2) pages.push("...");

  pages.push(total);
  return pages;
}

/* ---------- Estados visuales ---------- */

function LoadingState({ colSpan }: { colSpan: number }) {
  return (
    <tr>
      <td colSpan={colSpan} className="px-4 py-16">
        <div className="flex flex-col items-center justify-center gap-3">
          <Loader2 className="size-8 text-indigo-400 animate-spin" />
          <span className="text-sm text-zinc-500">Loading data…</span>
        </div>
      </td>
    </tr>
  );
}

function ErrorState({ colSpan, message }: { colSpan: number; message: string }) {
  return (
    <tr>
      <td colSpan={colSpan} className="px-4 py-16">
        <div className="flex flex-col items-center justify-center gap-3">
          <div className="rounded-full bg-red-500/10 p-3">
            <AlertCircle className="size-6 text-red-400" />
          </div>
          <span className="text-sm text-red-400">{message}</span>
        </div>
      </td>
    </tr>
  );
}

function EmptyState({
  colSpan,
  message,
  icon,
}: {
  colSpan: number;
  message: string;
  icon?: ReactNode;
}) {
  return (
    <tr>
      <td colSpan={colSpan} className="px-4 py-16">
        <div className="flex flex-col items-center justify-center gap-3">
          {icon ?? (
            <div className="rounded-full bg-zinc-800 p-3">
              <Inbox className="size-6 text-zinc-500" />
            </div>
          )}
          <span className="text-sm text-zinc-500">{message}</span>
        </div>
      </td>
    </tr>
  );
}

/* ---------- Skeleton shimmer para loading ---------- */
function SkeletonRows({
  colSpan,
  rows = 5,
}: {
  colSpan: number;
  rows?: number;
}) {
  return (
    <>
      {Array.from({ length: rows }).map((_, i) => (
        <tr key={i} className="border-b border-white/5">
          {Array.from({ length: colSpan }).map((_, j) => (
            <td key={j} className="px-4 py-3">
              <div className="h-4 rounded bg-white/5 animate-pulse" />
            </td>
          ))}
        </tr>
      ))}
    </>
  );
}

/* ══════════════════════════════════════════════
 *  COMPONENTE PRINCIPAL: DataGrid
 * ══════════════════════════════════════════════ */

export default function DataGrid<T extends Record<string, unknown>>({
  data,
  columns,
  searchable = false,
  searchPlaceholder = "Search…",
  pagination = false,
  pageSize: initialPageSize = 10,
  actions,
  loading = false,
  error = null,
  emptyMessage = "No results found",
  emptyIcon,
  rowKey = "id" as keyof T & string,
}: DataGridProps<T>) {
  /* ── Estado ── */
  const [searchQuery, setSearchQuery] = useState("");
  const [sort, setSort] = useState<SortState<T>>({ column: null, direction: null });
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(initialPageSize);

  /* ── Filtering ── */
  const filteredData = useMemo(() => {
    if (!searchQuery.trim()) return data;

    const query = searchQuery.toLowerCase();
    return data.filter((row) =>
      columns.some((col) => {
        const val = getNestedValue(row, col.accessorKey);
        return val != null && String(val).toLowerCase().includes(query);
      })
    );
  }, [data, searchQuery, columns]);

  /* ── Sorting ── */
  const sortedData = useMemo(() => {
    if (!sort.column || !sort.direction) return filteredData;

    const col = sort.column;
    const dir = sort.direction === "asc" ? 1 : -1;

    return [...filteredData].sort((a, b) => {
      const aVal = getNestedValue(a, col);
      const bVal = getNestedValue(b, col);

      if (aVal == null && bVal == null) return 0;
      if (aVal == null) return 1;
      if (bVal == null) return -1;

      if (typeof aVal === "number" && typeof bVal === "number") {
        return (aVal - bVal) * dir;
      }
      return String(aVal).localeCompare(String(bVal)) * dir;
    });
  }, [filteredData, sort]);

  /* ── Paginación ── */
  const totalPages = Math.max(1, Math.ceil(sortedData.length / pageSize));

  const paginatedData = useMemo(() => {
    if (!pagination) return sortedData;
    const start = (currentPage - 1) * pageSize;
    return sortedData.slice(start, start + pageSize);
  }, [sortedData, pagination, currentPage, pageSize]);

  /* Reset de página al cambiar filtros/sort */
  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, sort, pageSize]);

  /* ── Handlers ── */
  const handleSort = useCallback(
    (columnKey: keyof T & string) => {
      setSort((prev) => {
        if (prev.column !== columnKey) return { column: columnKey, direction: "asc" };
        if (prev.direction === "asc") return { column: columnKey, direction: "desc" };
        return { column: null, direction: null };
      });
    },
    []
  );

  const handlePageSizeChange = useCallback((size: number) => {
    setPageSize(size);
    setCurrentPage(1);
  }, []);

  /* ── Cálculo de colSpan ── */
  const totalColumns = columns.length + (actions && actions.length > 0 ? 1 : 0);

  /* ── Visibilidad responsive de columnas (clases Tailwind) ── */
  const getVisibilityClasses = (col: DataGridColumn<T>) => {
    const classes: string[] = [];
    if (col.hideOnMobile) classes.push("hidden", "sm:table-cell");
    if (col.hideOnTablet && !col.hideOnMobile) classes.push("hidden", "lg:table-cell");
    if (col.hideOnTablet && col.hideOnMobile) classes.push("hidden", "lg:table-cell");
    return classes.join(" ");
  };

  /* ═══════════════════════════════════════════
   *  RENDER
   * ═══════════════════════════════════════════ */
  return (
    <section className="w-full rounded-xl border border-white/5 bg-zinc-900/60 overflow-hidden">
      {/* ── Toolbar ── */}
      {searchable && (
        <header className="flex items-center gap-3 border-b border-white/5 px-4 py-3">
          <DataGridSearch
            value={searchQuery}
            onChange={setSearchQuery}
            placeholder={searchPlaceholder}
          />
        </header>
      )}

      {/* ── Tabla con scroll horizontal ── */}
      <div className="overflow-x-auto scrollbar-thin scrollbar-thumb-zinc-700 scrollbar-track-transparent">
        <table className="w-full text-sm" role="grid">
          {/* ── Head ── */}
          <thead>
            <tr className="border-b border-white/5 bg-white/2">
              {/* Columna de acciones */}
              {actions && actions.length > 0 && (
                <th
                  scope="col"
                  className="px-4 py-3 text-xs font-semibold uppercase tracking-wider text-zinc-500 text-right w-0"
                >
                  <span className="sr-only">Actions</span>
                </th>
              )}
              {columns.map((col) => {
                const isActive = sort.column === col.accessorKey;
                const visibility = getVisibilityClasses(col);

                return (
                  <th
                    key={col.accessorKey}
                    scope="col"
                    className={`px-4 py-3 text-xs font-semibold uppercase tracking-wider text-zinc-500 ${alignClasses[col.align ?? "left"]} ${col.minWidth ?? ""} ${visibility} ${col.sortable ? "cursor-pointer select-none hover:text-zinc-300 transition-colors duration-150" : ""}`}
                    onClick={col.sortable ? () => handleSort(col.accessorKey) : undefined}
                    aria-sort={
                      isActive && sort.direction
                        ? sort.direction === "asc"
                          ? "ascending"
                          : "descending"
                        : undefined
                    }
                  >
                    <span className="inline-flex items-center gap-1.5">
                      {col.header}
                      {col.sortable && (
                        <SortIndicator
                          active={isActive}
                          direction={isActive ? sort.direction : null}
                        />
                      )}
                    </span>
                  </th>
                );
              })}
            </tr>
          </thead>

          {/* ── Body ── */}
          <tbody>
            {loading && <SkeletonRows colSpan={totalColumns} />}

            {!loading && error && (
              <ErrorState colSpan={totalColumns} message={error} />
            )}

            {!loading && !error && paginatedData.length === 0 && (
              <EmptyState
                colSpan={totalColumns}
                message={emptyMessage}
                icon={emptyIcon}
              />
            )}

            {!loading &&
              !error &&
              paginatedData.map((row, rowIndex) => {
                const key = rowKey in row ? String(row[rowKey]) : String(rowIndex);

                return (
                  <tr
                    key={key}
                    className="group border-b border-white/5 transition-colors duration-150 hover:bg-white/3 last:border-b-0"
                  >
                    {/* Acciones */}
                    {actions && actions.length > 0 && (
                      <td className="px-4 py-3 bg-white/2">
                        {/* Desktop: inline | Mobile: menú */}
                        <div className="hidden md:block">
                          <InlineActions row={row} actions={actions} />
                        </div>
                        <div className="md:hidden">
                          <ActionsMenu row={row} actions={actions} />
                        </div>
                      </td>
                    )}
                    {columns.map((col) => {
                      const rawValue = getNestedValue(row, col.accessorKey);
                      const visibility = getVisibilityClasses(col);

                      return (
                        <td
                          key={col.accessorKey}
                          className={`px-4 py-3 text-zinc-300 whitespace-nowrap ${alignClasses[col.align ?? "left"]} ${col.minWidth ?? ""} ${visibility}`}
                        >
                          {col.cell
                            ? col.cell(rawValue as T[keyof T], row)
                            : rawValue != null
                              ? String(rawValue)
                              : "—"}
                        </td>
                      );
                    })}


                  </tr>
                );
              })}
          </tbody>
        </table>
      </div>

      {/* ── Paginación ── */}
      {pagination && !loading && !error && (
        <DataGridPagination
          currentPage={currentPage}
          totalPages={totalPages}
          pageSize={pageSize}
          totalItems={sortedData.length}
          onPageChange={setCurrentPage}
          onPageSizeChange={handlePageSizeChange}
        />
      )}
    </section>
  );
}