import { useState } from "react";
import { DataTable } from "@/components/ui/DataTable";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { Button } from "@/components/ui/button";
import { Eye, Pencil, Trash2 } from "lucide-react";
import { useTrimsRegister } from "@/hooks/useTrimsRegister";
import { TrimFormDialog } from "@/components/forms/TrimFormDialog";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";

export default function TrimsRegister() {
  const { data, loading, addTrim, updateTrim, deleteTrim } = useTrimsRegister();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editItem, setEditItem] = useState<any>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const getStatusType = (status: string) => {
    if (status === "In Stock") return "completed";
    if (status === "Low Stock") return "in-progress";
    return "pending";
  };

  const columns = [
    { key: "trim_id", header: "Trim ID" },
    { key: "trim_name", header: "Trim Name" },
    { key: "category", header: "Category" },
    { key: "supplier", header: "Supplier" },
    { key: "quantity", header: "Quantity", render: (item: any) => `${item.quantity?.toLocaleString() || 0} ${item.unit}` },
    { key: "rate", header: "Rate", render: (item: any) => `₹${item.rate?.toLocaleString() || 0}` },
    { key: "status", header: "Status", render: (item: any) => <StatusBadge status={getStatusType(item.status)} /> },
    {
      key: "actions", header: "Actions", render: (item: any) => (
        <div className="flex items-center gap-1">
          <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => { setEditItem(item); setDialogOpen(true); }}><Pencil className="h-4 w-4" /></Button>
          <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive" onClick={() => setDeleteId(item.id)}><Trash2 className="h-4 w-4" /></Button>
        </div>
      ),
    },
  ];

  const handleSubmit = async (formData: any) => {
    if (editItem) {
      return updateTrim(editItem.id, formData);
    }
    return addTrim(formData);
  };

  return (
    <>
      <DataTable columns={columns} data={data} searchPlaceholder="Search trims..." onAdd={() => { setEditItem(null); setDialogOpen(true); }} addButtonText="Add Trim" />
      <TrimFormDialog open={dialogOpen} onOpenChange={setDialogOpen} onSubmit={handleSubmit} initialData={editItem || undefined} mode={editItem ? "edit" : "add"} />
      <AlertDialog open={!!deleteId} onOpenChange={() => setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader><AlertDialogTitle>Delete Trim?</AlertDialogTitle><AlertDialogDescription>This action cannot be undone.</AlertDialogDescription></AlertDialogHeader>
          <AlertDialogFooter><AlertDialogCancel>Cancel</AlertDialogCancel><AlertDialogAction onClick={() => { if (deleteId) deleteTrim(deleteId); setDeleteId(null); }}>Delete</AlertDialogAction></AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
