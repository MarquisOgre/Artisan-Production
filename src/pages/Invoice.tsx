import { DataTable } from "@/components/ui/DataTable";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { Button } from "@/components/ui/button";
import { Eye, Pencil, Trash2, Printer, Send } from "lucide-react";

interface InvoiceItem {
  id: string;
  invoiceNo: string;
  customerName: string;
  invoiceDate: string;
  dueDate: string;
  amount: number;
  paidAmount: number;
  status: "pending" | "completed" | "in-progress";
}

const sampleData: InvoiceItem[] = [
  { id: "INV-001", invoiceNo: "INV/2024/001", customerName: "Fashion Retail Co.", invoiceDate: "2024-01-15", dueDate: "2024-02-14", amount: 175000, paidAmount: 175000, status: "completed" },
  { id: "INV-002", invoiceNo: "INV/2024/002", customerName: "Style Hub Ltd.", invoiceDate: "2024-01-18", dueDate: "2024-02-17", amount: 358800, paidAmount: 100000, status: "in-progress" },
  { id: "INV-003", invoiceNo: "INV/2024/003", customerName: "Garment World", invoiceDate: "2024-01-20", dueDate: "2024-02-19", amount: 360000, paidAmount: 0, status: "pending" },
  { id: "INV-004", invoiceNo: "INV/2024/004", customerName: "Trendy Wear", invoiceDate: "2024-01-12", dueDate: "2024-02-11", amount: 174650, paidAmount: 174650, status: "completed" },
  { id: "INV-005", invoiceNo: "INV/2024/005", customerName: "Urban Outfitters", invoiceDate: "2024-01-22", dueDate: "2024-02-21", amount: 473550, paidAmount: 200000, status: "in-progress" },
];

const formatCurrency = (value: number) => `₹${value.toLocaleString()}`;

const columns = [
  { key: "invoiceNo", header: "Invoice No" },
  { key: "customerName", header: "Customer" },
  { key: "invoiceDate", header: "Invoice Date" },
  { key: "dueDate", header: "Due Date" },
  { 
    key: "amount", 
    header: "Amount",
    render: (item: InvoiceItem) => (
      <span className="font-semibold">{formatCurrency(item.amount)}</span>
    )
  },
  { 
    key: "paidAmount", 
    header: "Paid",
    render: (item: InvoiceItem) => (
      <span className="text-success font-medium">{formatCurrency(item.paidAmount)}</span>
    )
  },
  { 
    key: "balance", 
    header: "Balance",
    render: (item: InvoiceItem) => {
      const balance = item.amount - item.paidAmount;
      return (
        <span className={balance > 0 ? "text-warning font-medium" : "text-muted-foreground"}>
          {formatCurrency(balance)}
        </span>
      );
    }
  },
  { 
    key: "status", 
    header: "Status",
    render: (item: InvoiceItem) => <StatusBadge status={item.status} />
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
          <Send className="h-4 w-4" />
        </Button>
        <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive">
          <Trash2 className="h-4 w-4" />
        </Button>
      </div>
    ),
  },
];

export default function Invoice() {
  return (
    <DataTable
      columns={columns}
      data={sampleData}
      searchPlaceholder="Search invoices..."
      onAdd={() => console.log("Create new invoice")}
      addButtonText="Create Invoice"
    />
  );
}
