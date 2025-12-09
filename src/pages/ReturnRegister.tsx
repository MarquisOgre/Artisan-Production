import { DataTable } from "@/components/ui/DataTable";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { Button } from "@/components/ui/button";
import { Eye, Pencil, Trash2 } from "lucide-react";

interface ReturnItem {
  id: string;
  returnNo: string;
  customerName: string;
  originalDcNo: string;
  returnDate: string;
  itemDescription: string;
  quantity: number;
  reason: string;
  status: "pending" | "completed" | "in-progress";
}

const sampleData: ReturnItem[] = [
  { id: "RET-001", returnNo: "RET/2024/001", customerName: "Fashion Retail Co.", originalDcNo: "DC/2023/145", returnDate: "2024-01-10", itemDescription: "Oxford Shirts - Size M", quantity: 25, reason: "Size Mismatch", status: "completed" },
  { id: "RET-002", returnNo: "RET/2024/002", customerName: "Style Hub Ltd.", originalDcNo: "DC/2023/156", returnDate: "2024-01-12", itemDescription: "Casual Slim Fit", quantity: 50, reason: "Color Variation", status: "in-progress" },
  { id: "RET-003", returnNo: "RET/2024/003", customerName: "Garment World", originalDcNo: "DC/2024/002", returnDate: "2024-01-15", itemDescription: "Linen Shirts", quantity: 15, reason: "Stitching Defect", status: "pending" },
  { id: "RET-004", returnNo: "RET/2024/004", customerName: "Trendy Wear", originalDcNo: "DC/2023/189", returnDate: "2024-01-08", itemDescription: "Denim Jackets", quantity: 10, reason: "Wrong Style", status: "completed" },
  { id: "RET-005", returnNo: "RET/2024/005", customerName: "Urban Outfitters", originalDcNo: "DC/2024/001", returnDate: "2024-01-18", itemDescription: "Polo Classic", quantity: 35, reason: "Quality Issue", status: "pending" },
];

const columns = [
  { key: "returnNo", header: "Return No" },
  { key: "customerName", header: "Customer" },
  { key: "originalDcNo", header: "Original DC" },
  { key: "returnDate", header: "Return Date" },
  { key: "itemDescription", header: "Item Description" },
  { 
    key: "quantity", 
    header: "Qty",
    render: (item: ReturnItem) => `${item.quantity} pcs`
  },
  { 
    key: "reason", 
    header: "Reason",
    render: (item: ReturnItem) => (
      <span className="text-sm text-muted-foreground">{item.reason}</span>
    )
  },
  { 
    key: "status", 
    header: "Status",
    render: (item: ReturnItem) => <StatusBadge status={item.status} />
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

export default function ReturnRegister() {
  return (
    <DataTable
      columns={columns}
      data={sampleData}
      searchPlaceholder="Search returns..."
      onAdd={() => console.log("Add new return")}
      addButtonText="Add Return"
    />
  );
}
