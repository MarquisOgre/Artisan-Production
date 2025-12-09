import { DataTable } from "@/components/ui/DataTable";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { Button } from "@/components/ui/button";
import { Eye, Pencil, Trash2, Printer } from "lucide-react";

interface ChallanItem {
  id: string;
  challanNo: string;
  orderNo: string;
  customerName: string;
  deliveryDate: string;
  quantity: number;
  vehicleNo: string;
  status: "pending" | "completed" | "in-progress";
}

const sampleData: ChallanItem[] = [
  { id: "DC-001", challanNo: "DC/2024/001", orderNo: "ORD-2024-001", customerName: "Fashion Retail Co.", deliveryDate: "2024-01-20", quantity: 500, vehicleNo: "MH-12-AB-1234", status: "completed" },
  { id: "DC-002", challanNo: "DC/2024/002", orderNo: "ORD-2024-002", customerName: "Style Hub Ltd.", deliveryDate: "2024-01-21", quantity: 1200, vehicleNo: "MH-14-CD-5678", status: "in-progress" },
  { id: "DC-003", challanNo: "DC/2024/003", orderNo: "ORD-2024-003", customerName: "Garment World", deliveryDate: "2024-01-22", quantity: 800, vehicleNo: "-", status: "pending" },
  { id: "DC-004", challanNo: "DC/2024/004", orderNo: "ORD-2024-004", customerName: "Trendy Wear", deliveryDate: "2024-01-19", quantity: 350, vehicleNo: "MH-12-EF-9012", status: "completed" },
  { id: "DC-005", challanNo: "DC/2024/005", orderNo: "ORD-2024-005", customerName: "Urban Outfitters", deliveryDate: "2024-01-23", quantity: 950, vehicleNo: "-", status: "pending" },
];

const columns = [
  { key: "challanNo", header: "Challan No" },
  { key: "orderNo", header: "Order No" },
  { key: "customerName", header: "Customer" },
  { key: "deliveryDate", header: "Delivery Date" },
  { 
    key: "quantity", 
    header: "Quantity",
    render: (item: ChallanItem) => `${item.quantity.toLocaleString()} pcs`
  },
  { key: "vehicleNo", header: "Vehicle No" },
  { 
    key: "status", 
    header: "Status",
    render: (item: ChallanItem) => <StatusBadge status={item.status} />
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
          <Printer className="h-4 w-4" />
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

export default function DeliveryChallan() {
  return (
    <DataTable
      columns={columns}
      data={sampleData}
      searchPlaceholder="Search challans..."
      onAdd={() => console.log("Add new challan")}
      addButtonText="Create Challan"
    />
  );
}
