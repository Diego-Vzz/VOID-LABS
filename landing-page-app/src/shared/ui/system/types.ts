/* ──────────────────────────────────────────────
 *  DataGrid – Tipos e interfaces
 * ────────────────────────────────────────────── */

import type { ReactNode } from "react";

/** Dirección de ordenamiento */
export type SortDirection = "asc" | "desc" | null;

/** Definición de columna */
export interface DataGridColumn<T> {
  /** Clave de acceso al dato del objeto */
  accessorKey: keyof T & string;
  /** Título visible en el encabezado */
  header: string;
  /** Render personalizado de celda */
  cell?: (value: T[keyof T], row: T) => ReactNode;
  /** Alineación del contenido */
  align?: "left" | "center" | "right";
  /** Ancho mínimo (Tailwind class, ej. "min-w-40") */
  minWidth?: string;
  /** Permitir ordenar por esta columna */
  sortable?: boolean;
  /** Ocultar en mobile (<640px) */
  hideOnMobile?: boolean;
  /** Ocultar en tablet (<1024px) */
  hideOnTablet?: boolean;
}

/** Variante visual de una acción */
export type ActionVariant = "default" | "destructive" | "success" | "warning";

/** Acción por fila */
export interface DataGridAction<T> {
  /** Texto del botón */
  label: string;
  /** Ícono (componente de lucide-react u otro) */
  icon?: ReactNode;
  /** Variante visual */
  variant?: ActionVariant;
  /** Tooltip */
  tooltip?: string;
  /** Callback al hacer clic */
  onClick: (row: T) => void;
  /** Función para ocultar la acción condicionalmente */
  hidden?: (row: T) => boolean;
}

/** Props del componente DataGrid */
export interface DataGridProps<T> {
  /** Datos a mostrar */
  data: T[];
  /** Definición de columnas */
  columns: DataGridColumn<T>[];
  /** Habilitar buscador */
  searchable?: boolean;
  /** Placeholder del buscador */
  searchPlaceholder?: string;
  /** Habilitar paginación */
  pagination?: boolean;
  /** Filas por página (default 10) */
  pageSize?: number;
  /** Acciones por fila */
  actions?: DataGridAction<T>[];
  /** Estado de carga */
  loading?: boolean;
  /** Mensaje/estado de error */
  error?: string | null;
  /** Mensaje cuando no hay datos */
  emptyMessage?: string;
  /** Ícono o ilustración para estado vacío */
  emptyIcon?: ReactNode;
  /** Key única por fila (default "id") */
  rowKey?: keyof T & string;
}

/** Estado interno de sorting */
export interface SortState<T> {
  column: (keyof T & string) | null;
  direction: SortDirection;
}
