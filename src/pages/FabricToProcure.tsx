import { DataTable } from "@/components/ui/DataTable";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { Button } from "@/components/ui/button";
import { Eye, Pencil, Trash2 } from "lucide-react";

interface FabricItem {
  id: string;
  fabricName: string;
  composition: string;
  requiredQty: number;
  orderedQty: number;
  supplier: string;
  expectedDate: string;
  status: "pending" | "completed" | "in-progress";
}

const sampleData: FabricItem[] = [
  { id: "FAB-001", fabricName: "White Cotton Twill", composition: "100% Cotton", requiredQty: 5000, orderedQty: 5000, supplier: "Textile Mills Ltd.", expectedDate: "2024-01-25", status: "in-progress" },
  { id: "FAB-002", fabricName: "Navy Blue Poplin", composition: "60/40 Cotton Poly", requiredQty: 3000, orderedQty: 0, supplier: "Pending Selection", expectedDate: "-", status: "pending" },
  { id: "FAB-003", fabricName: "Linen Natural", composition: "100% Linen", requiredQty: 2000, orderedQty: 2000, supplier: "Linen World", expectedDate: "2024-01-20", status: "completed" },
  { id: "FAB-004", fabricName: "Denim 12oz", composition: "100% Cotton", requiredQty: 1500, orderedQty: 1500, supplier: "Denim Factory", expectedDate: "2024-01-22", status: "in-progress" },
  { id: "FAB-005", fabricName: "Pique Cotton", composition: "100% Cotton", requiredQty: 4000, orderedQty: 2000, supplier: "Knit Masters", expectedDate: "2024-01-28", status: "in-progress" },
];

const columns = [
  { key: "id", header: "Fabric ID" },
  { key: "fabricName", header: "Fabric Name" },
  { key: "composition", header: "Composition" },
  { 
    key: "requiredQty", 
    header: "Required",
    render: (item: FabricItem) => `${item.requiredQty.toLocaleString()} mtrs`
  },
  { 
    key: "orderedQty", 
    header: "Ordered",
    render: (item: FabricItem) => (
      <span className={item.orderedQty < item.requiredQty ? "text-warning font-medium" : "text-success font-medium"}>
        {item.orderedQty.toLocaleString()} mtrs
      </span>
    )
  },
  { key: "supplier", header: "Supplier" },
  { key: "expectedDate", header: "Expected Date" },
  { 
    key: "status", 
    header: "Status",
    render: (item: FabricItem) => <StatusBadge status={item.status} />
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

export default function FabricToProcure() {
  return (
    <DataTable
      columns={columns}
      data={sampleData}
      searchPlaceholder="Search fabrics..."
      onAdd={() => console.log("Add new fabric")}
      addButtonText="Add Fabric"
    />
  );
}
