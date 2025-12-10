import { useState } from "react";
import { DataTable } from "@/components/ui/DataTable";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { Button } from "@/components/ui/button";
import { Pencil, Trash2 } from "lucide-react";
import { usePaymentVoucher } from "@/hooks/usePaymentVoucher";
import { PaymentVoucherFormDialog } from "@/components/forms/PaymentVoucherFormDialog";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";

const formatCurrency = (value: number) => `₹${(value || 0).toLocaleString()}`;

export default function PaymentVoucher() {
  const { data, loading, addItem, updateItem, deleteItem } = usePaymentVoucher();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editItem, setEditItem] = useState<any>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const getStatusType = (status: string) => { if (status === "Completed") return "completed"; if (status === "Approved") return "in-progress"; return "pending"; };

  const columns = [
    { key: "voucher_no", header: "Voucher No" },
    { key: "payee", header: "Payee" },
    { key: "voucher_date", header: "Date" },
    { key: "payment_mode", header: "Mode" },
    { key: "amount", header: "Amount", render: (item: any) => <span className="font-semibold">{formatCurrency(item.amount)}</span> },
    { key: "reference_no", header: "Reference" },
    { key: "status", header: "Status", render: (item: any) => <StatusBadge status={getStatusType(item.status)} /> },
    { key: "actions", header: "Actions", render: (item: any) => (
      <div className="flex items-center gap-1">
        <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => { setEditItem(item); setDialogOpen(true); }}><Pencil className="h-4 w-4" /></Button>
        <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive" onClick={() => setDeleteId(item.id)}><Trash2 className="h-4 w-4" /></Button>
      </div>
    )},
  ];

  const handleSubmit = async (formData: any) => editItem ? updateItem(editItem.id, formData) : addItem(formData);

  return (
    <>
      <DataTable columns={columns} data={data} searchPlaceholder="Search vouchers..." onAdd={() => { setEditItem(null); setDialogOpen(true); }} addButtonText="Create Voucher" />
      <PaymentVoucherFormDialog open={dialogOpen} onOpenChange={setDialogOpen} onSubmit={handleSubmit} initialData={editItem || undefined} mode={editItem ? "edit" : "add"} />
      <AlertDialog open={!!deleteId} onOpenChange={() => setDeleteId(null)}><AlertDialogContent><AlertDialogHeader><AlertDialogTitle>Delete Voucher?</AlertDialogTitle><AlertDialogDescription>This action cannot be undone.</AlertDialogDescription></AlertDialogHeader><AlertDialogFooter><AlertDialogCancel>Cancel</AlertDialogCancel><AlertDialogAction onClick={() => { if (deleteId) deleteItem(deleteId); setDeleteId(null); }}>Delete</AlertDialogAction></AlertDialogFooter></AlertDialogContent></AlertDialog>
    </>
  );
}
