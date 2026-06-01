"use client";

import DataGrid from "@/shared/ui/system/components/DataGrid";
import type { DataGridColumn, DataGridAction } from "@/shared/ui/system/types";
import { Pencil, Trash2, Box } from "lucide-react";

interface Product {
  id: string;
  name: string;
  category: string;
  price: number;
  stock: number;
  status: "active" | "out_of_stock" | "discontinued";
}

const mockProducts: Product[] = [
  { id: "PRD-001", name: "Quantum Keyboard", category: "Peripherals", price: 149.99, stock: 45, status: "active" },
  { id: "PRD-002", name: "Void Mouse Pro", category: "Peripherals", price: 89.99, stock: 120, status: "active" },
  { id: "PRD-003", name: "Nebula Monitor 27\"", category: "Displays", price: 349.99, stock: 15, status: "active" },
  { id: "PRD-004", name: "Dark Matter GPU", category: "Components", price: 899.99, stock: 0, status: "out_of_stock" },
  { id: "PRD-005", name: "Starlight RAM 32GB", category: "Components", price: 129.99, stock: 85, status: "active" },
  { id: "PRD-006", name: "Nova SSD 2TB", category: "Storage", price: 159.99, stock: 200, status: "active" },
  { id: "PRD-007", name: "Eclipse Headset", category: "Audio", price: 119.99, stock: 60, status: "active" },
  { id: "PRD-008", name: "Pulsar Microphone", category: "Audio", price: 79.99, stock: 0, status: "out_of_stock" },
  { id: "PRD-009", name: "Gravity Desk Mat", category: "Accessories", price: 29.99, stock: 350, status: "active" },
  { id: "PRD-010", name: "Legacy Keyboard (Gen 1)", category: "Peripherals", price: 49.99, stock: 5, status: "discontinued" },
];

const columns: DataGridColumn<Product>[] = [];

const actions: DataGridAction<Product>[] = [
  {
    label: "Edit",
    icon: <Pencil className="size-3.5" />,
    onClick: (row) => alert(`Edit ${row.name}`),
  },
  {
    label: "Delete",
    variant: "destructive",
    icon: <Trash2 className="size-3.5" />,
    onClick: (row) => alert(`Delete ${row.name}`),
  },
];

export default function Products() {
  return (
    <div className="flex w-full flex-col gap-6 p-4 lg:p-8">
      <div>
        <h1 className="text-2xl font-semibold text-white tracking-tight">Products</h1>
        <p className="text-sm text-zinc-400 mt-1">Manage your product catalog and inventory.</p>
      </div>

      <DataGrid
        data={mockProducts}
        columns={columns}
        searchable
        searchPlaceholder="Search products by name, category, or ID..."
        pagination
        pageSize={5}
        actions={actions}
        rowKey="id"
      />
    </div>
  );
}
