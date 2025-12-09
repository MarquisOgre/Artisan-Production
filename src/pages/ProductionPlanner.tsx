import { DataTable } from "@/components/ui/DataTable";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { Button } from "@/components/ui/button";
import { Eye, Pencil, Trash2 } from "lucide-react";
import { Progress } from "@/components/ui/progress";

interface ProductionPlan {
  id: string;
  orderNo: string;
  styleName: string;
  targetQty: number;
  completedQty: number;
  startDate: string;
  endDate: string;
  status: "pending" | "completed" | "in-progress";
}

const sampleData: ProductionPlan[] = [
  { id: "PRD-001", orderNo: "ORD-2024-001", styleName: "Classic Oxford", targetQty: 2500, completedQty: 1800, startDate: "2024-01-15", endDate: "2024-01-25", status: "in-progress" },
  { id: "PRD-002", orderNo: "ORD-2024-002", styleName: "Slim Fit Casual", targetQty: 2000, completedQty: 0, startDate: "2024-01-22", endDate: "2024-02-01", status: "pending" },
  { id: "PRD-003", orderNo: "ORD-2024-003", styleName: "Linen Summer", targetQty: 1500, completedQty: 1500, startDate: "2024-01-10", endDate: "2024-01-18", status: "completed" },
  { id: "PRD-004", orderNo: "ORD-2024-004", styleName: "Denim Jacket", targetQty: 1000, completedQty: 750, startDate: "2024-01-12", endDate: "2024-01-20", status: "in-progress" },
  { id: "PRD-005", orderNo: "ORD-2024-005", styleName: "Polo Classic", targetQty: 2250, completedQty: 500, startDate: "2024-01-18", endDate: "2024-01-28", status: "in-progress" },
];

const columns = [
  { key: "id", header: "Plan ID" },
  { key: "orderNo", header: "Order No" },
  { key: "styleName", header: "Style Name" },
  { 
    key: "targetQty", 
    header: "Target Qty",
    render: (item: ProductionPlan) => item.targetQty.toLocaleString()
  },
  { 
    key: "progress", 
    header: "Progress",
    render: (item: ProductionPlan) => {
      const percentage = Math.round((item.completedQty / item.targetQty) * 100);
      return (
        <div className="flex items-center gap-2 min-w-[120px]">
          <Progress value={percentage} className="h-2" />
          <span className="text-xs text-muted-foreground w-10">{percentage}%</span>
        </div>
      );
    }
  },
  { key: "startDate", header: "Start Date" },
  { key: "endDate", header: "End Date" },
  { 
    key: "status", 
    header: "Status",
    render: (item: ProductionPlan) => <StatusBadge status={item.status} />
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

export default function ProductionPlanner() {
  return (
    <DataTable
      columns={columns}
      data={sampleData}
      searchPlaceholder="Search production plans..."
      onAdd={() => console.log("Add new production plan")}
      addButtonText="Add Plan"
    />
  );
}
