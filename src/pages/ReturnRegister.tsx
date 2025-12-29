import { useState } from "react";
import { DataTable } from "@/components/ui/DataTable";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { Button } from "@/components/ui/button";
import { Pencil, Trash2 } from "lucide-react";
import { useReturnRegister } from "@/hooks/useReturnRegister";
import { ReturnRegisterFormDialog } from "@/components/forms/ReturnRegisterFormDialog";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";

export default function ReturnRegister() {
  const { data, loading, addItem, updateItem, deleteItem } = useReturnRegister();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editItem, setEditItem] = useState<any>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const getStatusType = (status: string) => { if (status === "Resolved") return "completed"; if (status === "Processing") return "in-progress"; return "pending"; };

  const columns = [
    { key: "return_no", header: "Return No" },
    { key: "party_name", header: "Party" },
    { key: "return_date", header: "Date" },
    { key: "return_type", header: "Type" },
    { key: "original_doc_no", header: "Original Doc" },
    { key: "total_qty", header: "Qty", render: (item: any) => `${item.total_qty?.toLocaleString() || 0} pcs` },
    { key: "reason", header: "Reason", render: (item: any) => <span className="text-sm text-muted-foreground">{item.reason}</span> },
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
      <DataTable columns={columns} data={data} searchPlaceholder="Search returns..." onAdd={() => { setEditItem(null); setDialogOpen(true); }} addButtonText="Add Return" />
      <ReturnRegisterFormDialog open={dialogOpen} onOpenChange={setDialogOpen} onSubmit={handleSubmit} initialData={editItem || undefined} mode={editItem ? "edit" : "add"} />
      <AlertDialog open={!!deleteId} onOpenChange={() => setDeleteId(null)}><AlertDialogContent><AlertDialogHeader><AlertDialogTitle>Delete Return?</AlertDialogTitle><AlertDialogDescription>This action cannot be undone.</AlertDialogDescription></AlertDialogHeader><AlertDialogFooter><AlertDialogCancel>Cancel</AlertDialogCancel><AlertDialogAction onClick={() => { if (deleteId) deleteItem(deleteId); setDeleteId(null); }}>Delete</AlertDialogAction></AlertDialogFooter></AlertDialogContent></AlertDialog>
    </>
  );
}
