import { DataTable } from "@/components/ui/DataTable";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { Button } from "@/components/ui/button";
import { Eye, Pencil, Trash2 } from "lucide-react";

interface TrimItem {
  id: string;
  trimName: string;
  category: string;
  supplier: string;
  quantity: number;
  unit: string;
  status: "pending" | "completed" | "in-progress";
  lastUpdated: string;
}

const sampleData: TrimItem[] = [
  { id: "TRM-001", trimName: "White Pearl Buttons", category: "Buttons", supplier: "ABC Trims Co.", quantity: 5000, unit: "pcs", status: "completed", lastUpdated: "2024-01-15" },
  { id: "TRM-002", trimName: "Navy Thread - 40/2", category: "Thread", supplier: "Thread Masters", quantity: 200, unit: "cones", status: "in-progress", lastUpdated: "2024-01-14" },
  { id: "TRM-003", trimName: "Metal Collar Stays", category: "Accessories", supplier: "Metal Works Ltd.", quantity: 1500, unit: "pcs", status: "pending", lastUpdated: "2024-01-13" },
  { id: "TRM-004", trimName: "Woven Labels - Main", category: "Labels", supplier: "Label Pro", quantity: 10000, unit: "pcs", status: "completed", lastUpdated: "2024-01-12" },
  { id: "TRM-005", trimName: "Care Labels", category: "Labels", supplier: "Label Pro", quantity: 10000, unit: "pcs", status: "completed", lastUpdated: "2024-01-11" },
];

const columns = [
  { key: "id", header: "Trim ID" },
  { key: "trimName", header: "Trim Name" },
  { key: "category", header: "Category" },
  { key: "supplier", header: "Supplier" },
  { 
    key: "quantity", 
    header: "Quantity",
    render: (item: TrimItem) => `${item.quantity.toLocaleString()} ${item.unit}`
  },
  { 
    key: "status", 
    header: "Status",
    render: (item: TrimItem) => <StatusBadge status={item.status} />
  },
  { key: "lastUpdated", header: "Last Updated" },
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

export default function TrimsRegister() {
  return (
    <DataTable
      columns={columns}
      data={sampleData}
      searchPlaceholder="Search trims..."
      onAdd={() => console.log("Add new trim")}
      addButtonText="Add Trim"
    />
  );
}
