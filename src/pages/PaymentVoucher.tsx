import { DataTable } from "@/components/ui/DataTable";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { Button } from "@/components/ui/button";
import { Eye, Pencil, Trash2, Printer } from "lucide-react";

interface VoucherItem {
  id: string;
  voucherNo: string;
  payeeName: string;
  paymentDate: string;
  paymentMode: string;
  amount: number;
  referenceNo: string;
  status: "pending" | "completed" | "cancelled";
}

const sampleData: VoucherItem[] = [
  { id: "PV-001", voucherNo: "PV/2024/001", payeeName: "Textile Mills Ltd.", paymentDate: "2024-01-15", paymentMode: "NEFT", amount: 250000, referenceNo: "NEFT123456", status: "completed" },
  { id: "PV-002", voucherNo: "PV/2024/002", payeeName: "ABC Trims Co.", paymentDate: "2024-01-18", paymentMode: "RTGS", amount: 85000, referenceNo: "RTGS789012", status: "completed" },
  { id: "PV-003", voucherNo: "PV/2024/003", payeeName: "Linen World", paymentDate: "2024-01-20", paymentMode: "Cheque", amount: 150000, referenceNo: "CHQ-456", status: "pending" },
  { id: "PV-004", voucherNo: "PV/2024/004", payeeName: "Denim Factory", paymentDate: "2024-01-22", paymentMode: "NEFT", amount: 180000, referenceNo: "-", status: "pending" },
  { id: "PV-005", voucherNo: "PV/2024/005", payeeName: "Thread Masters", paymentDate: "2024-01-10", paymentMode: "Cash", amount: 15000, referenceNo: "CASH-001", status: "completed" },
];

const formatCurrency = (value: number) => `₹${value.toLocaleString()}`;

const columns = [
  { key: "voucherNo", header: "Voucher No" },
  { key: "payeeName", header: "Payee Name" },
  { key: "paymentDate", header: "Payment Date" },
  { key: "paymentMode", header: "Mode" },
  { 
    key: "amount", 
    header: "Amount",
    render: (item: VoucherItem) => (
      <span className="font-semibold">{formatCurrency(item.amount)}</span>
    )
  },
  { key: "referenceNo", header: "Reference No" },
  { 
    key: "status", 
    header: "Status",
    render: (item: VoucherItem) => <StatusBadge status={item.status} />
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

export default function PaymentVoucher() {
  return (
    <DataTable
      columns={columns}
      data={sampleData}
      searchPlaceholder="Search vouchers..."
      onAdd={() => console.log("Create new voucher")}
      addButtonText="Create Voucher"
    />
  );
}
