import { useState } from "react";
import { DataTable } from "@/components/ui/DataTable";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { Button } from "@/components/ui/button";
import { Pencil, Trash2 } from "lucide-react";
import { useDeliveryChallan } from "@/hooks/useDeliveryChallan";
import { DeliveryChallanFormDialog } from "@/components/forms/DeliveryChallanFormDialog";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";

export default function DeliveryChallan() {
  const { data, loading, addItem, updateItem, deleteItem } = useDeliveryChallan();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editItem, setEditItem] = useState<any>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const getStatusType = (status: string) => { if (status === "Delivered") return "completed"; if (status === "Dispatched") return "in-progress"; return "pending"; };

  const columns = [
    { key: "challan_no", header: "Challan No" },
    { key: "challan_date", header: "Date" },
    { key: "customer", header: "Customer" },
    { key: "destination", header: "Destination" },
    { key: "total_qty", header: "Quantity", render: (item: any) => `${item.total_qty?.toLocaleString() || 0} pcs` },
    { key: "vehicle_no", header: "Vehicle No" },
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
      <DataTable columns={columns} data={data} searchPlaceholder="Search challans..." onAdd={() => { setEditItem(null); setDialogOpen(true); }} addButtonText="Create Challan" />
      <DeliveryChallanFormDialog open={dialogOpen} onOpenChange={setDialogOpen} onSubmit={handleSubmit} initialData={editItem || undefined} mode={editItem ? "edit" : "add"} />
      <AlertDialog open={!!deleteId} onOpenChange={() => setDeleteId(null)}><AlertDialogContent><AlertDialogHeader><AlertDialogTitle>Delete Challan?</AlertDialogTitle><AlertDialogDescription>This action cannot be undone.</AlertDialogDescription></AlertDialogHeader><AlertDialogFooter><AlertDialogCancel>Cancel</AlertDialogCancel><AlertDialogAction onClick={() => { if (deleteId) deleteItem(deleteId); setDeleteId(null); }}>Delete</AlertDialogAction></AlertDialogFooter></AlertDialogContent></AlertDialog>
    </>
  );
}
