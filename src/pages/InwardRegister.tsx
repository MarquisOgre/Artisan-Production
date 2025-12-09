import { DataTable } from "@/components/ui/DataTable";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { Button } from "@/components/ui/button";
import { Eye, Pencil, Trash2 } from "lucide-react";

interface InwardItem {
  id: string;
  grnNo: string;
  supplierName: string;
  invoiceNo: string;
  receivedDate: string;
  itemDescription: string;
  quantity: number;
  unit: string;
  status: "pending" | "completed" | "in-progress";
}

const sampleData: InwardItem[] = [
  { id: "INW-001", grnNo: "GRN/2024/001", supplierName: "Textile Mills Ltd.", invoiceNo: "TM-INV-456", receivedDate: "2024-01-15", itemDescription: "White Cotton Fabric", quantity: 2500, unit: "mtrs", status: "completed" },
  { id: "INW-002", grnNo: "GRN/2024/002", supplierName: "ABC Trims Co.", invoiceNo: "ABC-789", receivedDate: "2024-01-16", itemDescription: "Pearl Buttons Mix", quantity: 10000, unit: "pcs", status: "completed" },
  { id: "INW-003", grnNo: "GRN/2024/003", supplierName: "Thread Masters", invoiceNo: "TM-123", receivedDate: "2024-01-18", itemDescription: "Thread Cones Assorted", quantity: 500, unit: "cones", status: "in-progress" },
  { id: "INW-004", grnNo: "GRN/2024/004", supplierName: "Label Pro", invoiceNo: "LP-456", receivedDate: "2024-01-19", itemDescription: "Woven Labels", quantity: 15000, unit: "pcs", status: "pending" },
  { id: "INW-005", grnNo: "GRN/2024/005", supplierName: "Packing Solutions", invoiceNo: "PS-789", receivedDate: "2024-01-20", itemDescription: "Carton Boxes", quantity: 500, unit: "pcs", status: "completed" },
];

const columns = [
  { key: "grnNo", header: "GRN No" },
  { key: "supplierName", header: "Supplier" },
  { key: "invoiceNo", header: "Invoice No" },
  { key: "receivedDate", header: "Received Date" },
  { key: "itemDescription", header: "Item Description" },
  { 
    key: "quantity", 
    header: "Quantity",
    render: (item: InwardItem) => `${item.quantity.toLocaleString()} ${item.unit}`
  },
  { 
    key: "status", 
    header: "Status",
    render: (item: InwardItem) => <StatusBadge status={item.status} />
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

export default function InwardRegister() {
  return (
    <DataTable
      columns={columns}
      data={sampleData}
      searchPlaceholder="Search inward entries..."
      onAdd={() => console.log("Add new inward entry")}
      addButtonText="Add Entry"
    />
  );
}
