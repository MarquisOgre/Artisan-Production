import { DataTable } from "@/components/ui/DataTable";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { Button } from "@/components/ui/button";
import { Eye, Pencil, Trash2 } from "lucide-react";

interface CostingItem {
  id: string;
  styleName: string;
  fabricCost: number;
  trimsCost: number;
  laborCost: number;
  overheadCost: number;
  totalCost: number;
  sellingPrice: number;
  status: "draft" | "completed" | "pending";
}

const sampleData: CostingItem[] = [
  { id: "CST-001", styleName: "Classic Oxford", fabricCost: 150, trimsCost: 25, laborCost: 80, overheadCost: 20, totalCost: 275, sellingPrice: 350, status: "completed" },
  { id: "CST-002", styleName: "Slim Fit Casual", fabricCost: 120, trimsCost: 20, laborCost: 75, overheadCost: 18, totalCost: 233, sellingPrice: 299, status: "completed" },
  { id: "CST-003", styleName: "Linen Summer", fabricCost: 200, trimsCost: 30, laborCost: 90, overheadCost: 25, totalCost: 345, sellingPrice: 450, status: "pending" },
  { id: "CST-004", styleName: "Denim Jacket", fabricCost: 180, trimsCost: 45, laborCost: 120, overheadCost: 30, totalCost: 375, sellingPrice: 499, status: "draft" },
  { id: "CST-005", styleName: "Polo Classic", fabricCost: 100, trimsCost: 15, laborCost: 60, overheadCost: 15, totalCost: 190, sellingPrice: 249, status: "completed" },
];

const formatCurrency = (value: number) => `₹${value.toLocaleString()}`;

const columns = [
  { key: "id", header: "Costing ID" },
  { key: "styleName", header: "Style Name" },
  { 
    key: "fabricCost", 
    header: "Fabric",
    render: (item: CostingItem) => formatCurrency(item.fabricCost)
  },
  { 
    key: "trimsCost", 
    header: "Trims",
    render: (item: CostingItem) => formatCurrency(item.trimsCost)
  },
  { 
    key: "laborCost", 
    header: "Labor",
    render: (item: CostingItem) => formatCurrency(item.laborCost)
  },
  { 
    key: "totalCost", 
    header: "Total Cost",
    render: (item: CostingItem) => (
      <span className="font-semibold">{formatCurrency(item.totalCost)}</span>
    )
  },
  { 
    key: "sellingPrice", 
    header: "Selling Price",
    render: (item: CostingItem) => (
      <span className="font-semibold text-success">{formatCurrency(item.sellingPrice)}</span>
    )
  },
  { 
    key: "margin", 
    header: "Margin",
    render: (item: CostingItem) => {
      const margin = ((item.sellingPrice - item.totalCost) / item.sellingPrice * 100).toFixed(1);
      return <span className="text-accent font-medium">{margin}%</span>;
    }
  },
  { 
    key: "status", 
    header: "Status",
    render: (item: CostingItem) => <StatusBadge status={item.status} />
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

export default function Costing() {
  return (
    <DataTable
      columns={columns}
      data={sampleData}
      searchPlaceholder="Search costings..."
      onAdd={() => console.log("Add new costing")}
      addButtonText="Add Costing"
    />
  );
}
