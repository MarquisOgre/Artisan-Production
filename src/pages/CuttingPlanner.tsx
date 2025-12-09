import { DataTable } from "@/components/ui/DataTable";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { Button } from "@/components/ui/button";
import { Eye, Pencil, Trash2 } from "lucide-react";

interface CuttingPlan {
  id: string;
  orderNo: string;
  styleName: string;
  fabricType: string;
  layers: number;
  pieces: number;
  scheduledDate: string;
  status: "pending" | "completed" | "in-progress";
}

const sampleData: CuttingPlan[] = [
  { id: "CUT-001", orderNo: "ORD-2024-001", styleName: "Classic Oxford", fabricType: "Cotton 100%", layers: 50, pieces: 2500, scheduledDate: "2024-01-20", status: "in-progress" },
  { id: "CUT-002", orderNo: "ORD-2024-002", styleName: "Slim Fit Casual", fabricType: "Cotton Blend", layers: 40, pieces: 2000, scheduledDate: "2024-01-21", status: "pending" },
  { id: "CUT-003", orderNo: "ORD-2024-003", styleName: "Linen Summer", fabricType: "Linen 100%", layers: 30, pieces: 1500, scheduledDate: "2024-01-22", status: "pending" },
  { id: "CUT-004", orderNo: "ORD-2024-004", styleName: "Denim Jacket", fabricType: "Denim 12oz", layers: 25, pieces: 1000, scheduledDate: "2024-01-19", status: "completed" },
  { id: "CUT-005", orderNo: "ORD-2024-005", styleName: "Polo Classic", fabricType: "Pique Cotton", layers: 45, pieces: 2250, scheduledDate: "2024-01-23", status: "pending" },
];

const columns = [
  { key: "id", header: "Plan ID" },
  { key: "orderNo", header: "Order No" },
  { key: "styleName", header: "Style Name" },
  { key: "fabricType", header: "Fabric Type" },
  { key: "layers", header: "Layers" },
  { 
    key: "pieces", 
    header: "Total Pieces",
    render: (item: CuttingPlan) => item.pieces.toLocaleString()
  },
  { key: "scheduledDate", header: "Scheduled Date" },
  { 
    key: "status", 
    header: "Status",
    render: (item: CuttingPlan) => <StatusBadge status={item.status} />
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

export default function CuttingPlanner() {
  return (
    <DataTable
      columns={columns}
      data={sampleData}
      searchPlaceholder="Search cutting plans..."
      onAdd={() => console.log("Add new cutting plan")}
      addButtonText="Add Plan"
    />
  );
}
