import { useState } from "react";
import { DataTable } from "@/components/ui/DataTable";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { Button } from "@/components/ui/button";
import { Pencil, Trash2 } from "lucide-react";
import { useStockRegister } from "@/hooks/useStockRegister";
import { StockRegisterFormDialog } from "@/components/forms/StockRegisterFormDialog";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";

export default function StockRegister() {
  const { data, loading, addItem, updateItem, deleteItem } = useStockRegister();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editItem, setEditItem] = useState<any>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const columns = [
    { key: "item_code", header: "Item Code" },
    { key: "item_name", header: "Item Name" },
    { key: "category", header: "Category" },
    { key: "current_stock", header: "Current Stock", render: (item: any) => <span className={item.current_stock < item.min_stock ? "text-destructive font-medium" : ""}>{item.current_stock?.toLocaleString() || 0} {item.unit}</span> },
    { key: "min_stock", header: "Min Stock", render: (item: any) => `${item.min_stock?.toLocaleString() || 0} ${item.unit}` },
    { key: "location", header: "Location" },
    { key: "status", header: "Status", render: (item: any) => <StatusBadge status={item.current_stock < item.min_stock ? "pending" : "completed"} /> },
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
      <DataTable columns={columns} data={data} searchPlaceholder="Search stock..." onAdd={() => { setEditItem(null); setDialogOpen(true); }} addButtonText="Add Stock" />
      <StockRegisterFormDialog open={dialogOpen} onOpenChange={setDialogOpen} onSubmit={handleSubmit} initialData={editItem || undefined} mode={editItem ? "edit" : "add"} />
      <AlertDialog open={!!deleteId} onOpenChange={() => setDeleteId(null)}><AlertDialogContent><AlertDialogHeader><AlertDialogTitle>Delete Item?</AlertDialogTitle><AlertDialogDescription>This action cannot be undone.</AlertDialogDescription></AlertDialogHeader><AlertDialogFooter><AlertDialogCancel>Cancel</AlertDialogCancel><AlertDialogAction onClick={() => { if (deleteId) deleteItem(deleteId); setDeleteId(null); }}>Delete</AlertDialogAction></AlertDialogFooter></AlertDialogContent></AlertDialog>
    </>
  );
}
