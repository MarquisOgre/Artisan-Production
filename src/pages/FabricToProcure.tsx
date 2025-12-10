import { useState } from "react";
import { DataTable } from "@/components/ui/DataTable";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { Button } from "@/components/ui/button";
import { Pencil, Trash2 } from "lucide-react";
import { useFabricToProcure } from "@/hooks/useFabricToProcure";
import { FabricToProcureFormDialog } from "@/components/forms/FabricToProcureFormDialog";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";

export default function FabricToProcure() {
  const { data, loading, addItem, updateItem, deleteItem } = useFabricToProcure();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editItem, setEditItem] = useState<any>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const getStatusType = (status: string) => { if (status === "Received") return "completed"; if (status === "Ordered") return "in-progress"; return "pending"; };

  const columns = [
    { key: "fabric_code", header: "Fabric Code" },
    { key: "fabric_name", header: "Fabric Name" },
    { key: "color", header: "Color" },
    { key: "required_qty", header: "Required", render: (item: any) => `${item.required_qty?.toLocaleString() || 0} ${item.unit}` },
    { key: "ordered_qty", header: "Ordered", render: (item: any) => <span className={item.ordered_qty < item.required_qty ? "text-yellow-600 font-medium" : "text-green-600 font-medium"}>{item.ordered_qty?.toLocaleString() || 0} {item.unit}</span> },
    { key: "supplier", header: "Supplier" },
    { key: "order_date", header: "Order Date" },
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
      <DataTable columns={columns} data={data} searchPlaceholder="Search fabrics..." onAdd={() => { setEditItem(null); setDialogOpen(true); }} addButtonText="Add Fabric" />
      <FabricToProcureFormDialog open={dialogOpen} onOpenChange={setDialogOpen} onSubmit={handleSubmit} initialData={editItem || undefined} mode={editItem ? "edit" : "add"} />
      <AlertDialog open={!!deleteId} onOpenChange={() => setDeleteId(null)}><AlertDialogContent><AlertDialogHeader><AlertDialogTitle>Delete Fabric?</AlertDialogTitle><AlertDialogDescription>This action cannot be undone.</AlertDialogDescription></AlertDialogHeader><AlertDialogFooter><AlertDialogCancel>Cancel</AlertDialogCancel><AlertDialogAction onClick={() => { if (deleteId) deleteItem(deleteId); setDeleteId(null); }}>Delete</AlertDialogAction></AlertDialogFooter></AlertDialogContent></AlertDialog>
    </>
  );
}
