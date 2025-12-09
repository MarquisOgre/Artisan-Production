import { DataTable } from "@/components/ui/DataTable";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { Button } from "@/components/ui/button";
import { Eye, Pencil, Trash2 } from "lucide-react";

interface StockItem {
  id: string;
  itemName: string;
  category: string;
  currentStock: number;
  minStock: number;
  unit: string;
  warehouse: string;
  status: "pending" | "completed" | "in-progress";
}

const sampleData: StockItem[] = [
  { id: "STK-001", itemName: "White Cotton Fabric", category: "Fabric", currentStock: 5000, minStock: 1000, unit: "mtrs", warehouse: "Warehouse A", status: "completed" },
  { id: "STK-002", itemName: "Pearl Buttons - 18L", category: "Trims", currentStock: 15000, minStock: 5000, unit: "pcs", warehouse: "Warehouse B", status: "completed" },
  { id: "STK-003", itemName: "Navy Thread", category: "Thread", currentStock: 200, minStock: 500, unit: "cones", warehouse: "Warehouse A", status: "pending" },
  { id: "STK-004", itemName: "Collar Interlining", category: "Interlining", currentStock: 3000, minStock: 1000, unit: "mtrs", warehouse: "Warehouse A", status: "completed" },
  { id: "STK-005", itemName: "Polybags - Large", category: "Packing", currentStock: 8000, minStock: 2000, unit: "pcs", warehouse: "Warehouse C", status: "completed" },
];

const columns = [
  { key: "id", header: "Stock ID" },
  { key: "itemName", header: "Item Name" },
  { key: "category", header: "Category" },
  { 
    key: "currentStock", 
    header: "Current Stock",
    render: (item: StockItem) => (
      <span className={item.currentStock < item.minStock ? "text-destructive font-medium" : ""}>
        {item.currentStock.toLocaleString()} {item.unit}
      </span>
    )
  },
  { 
    key: "minStock", 
    header: "Min Stock",
    render: (item: StockItem) => `${item.minStock.toLocaleString()} ${item.unit}`
  },
  { key: "warehouse", header: "Warehouse" },
  { 
    key: "status", 
    header: "Status",
    render: (item: StockItem) => (
      <StatusBadge status={item.currentStock < item.minStock ? "pending" : "completed"} />
    )
  },
  {
    key: "actions",
    header: "Actions",
    render: () => (
      <div className="flex items-center gap-1">
        <Button variant="ghost" size="icon" className="h-8 w-8">
          <Eye className="h-4 w-4" />
        </Button>
        <Button variant="ghost" size="icon" className="h-8 w-8">
          <Pencil className="h-4 w-4" />
        </Button>
        <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive">
          <Trash2 className="h-4 w-4" />
        </Button>
      </div>
    ),
  },
];

export default function StockRegister() {
  return (
    <DataTable
      columns={columns}
      data={sampleData}
      searchPlaceholder="Search stock items..."
      onAdd={() => console.log("Add new stock item")}
      addButtonText="Add Stock"
    />
  );
}
