import { DataTable } from "@/components/ui/DataTable";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { Button } from "@/components/ui/button";
import { Eye, Pencil, Trash2 } from "lucide-react";

interface OutwardItem {
  id: string;
  dcNo: string;
  customerName: string;
  dispatchDate: string;
  itemDescription: string;
  quantity: number;
  unit: string;
  destination: string;
  status: "pending" | "completed" | "in-progress";
}

const sampleData: OutwardItem[] = [
  { id: "OUT-001", dcNo: "DC/2024/001", customerName: "Fashion Retail Co.", dispatchDate: "2024-01-20", itemDescription: "Classic Oxford Shirts", quantity: 500, unit: "pcs", destination: "Mumbai", status: "completed" },
  { id: "OUT-002", dcNo: "DC/2024/002", customerName: "Style Hub Ltd.", dispatchDate: "2024-01-21", itemDescription: "Slim Fit Casual", quantity: 1200, unit: "pcs", destination: "Delhi", status: "in-progress" },
  { id: "OUT-003", dcNo: "DC/2024/003", customerName: "Garment World", dispatchDate: "2024-01-22", itemDescription: "Linen Summer Collection", quantity: 800, unit: "pcs", destination: "Bangalore", status: "pending" },
  { id: "OUT-004", dcNo: "DC/2024/004", customerName: "Trendy Wear", dispatchDate: "2024-01-19", itemDescription: "Denim Jackets", quantity: 350, unit: "pcs", destination: "Chennai", status: "completed" },
  { id: "OUT-005", dcNo: "DC/2024/005", customerName: "Urban Outfitters", dispatchDate: "2024-01-23", itemDescription: "Polo Classic", quantity: 950, unit: "pcs", destination: "Pune", status: "pending" },
];

const columns = [
  { key: "dcNo", header: "DC No" },
  { key: "customerName", header: "Customer" },
  { key: "dispatchDate", header: "Dispatch Date" },
  { key: "itemDescription", header: "Item Description" },
  { 
    key: "quantity", 
    header: "Quantity",
    render: (item: OutwardItem) => `${item.quantity.toLocaleString()} ${item.unit}`
  },
  { key: "destination", header: "Destination" },
  { 
    key: "status", 
    header: "Status",
    render: (item: OutwardItem) => <StatusBadge status={item.status} />
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

export default function OutwardRegister() {
  return (
    <DataTable
      columns={columns}
      data={sampleData}
      searchPlaceholder="Search outward entries..."
      onAdd={() => console.log("Add new outward entry")}
      addButtonText="Add Entry"
    />
  );
}
