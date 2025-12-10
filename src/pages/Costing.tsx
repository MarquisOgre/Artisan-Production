import { useState } from "react";
import { DataTable } from "@/components/ui/DataTable";
import { Button } from "@/components/ui/button";
import { Pencil, Trash2 } from "lucide-react";
import { useCosting } from "@/hooks/useCosting";
import { CostingFormDialog } from "@/components/forms/CostingFormDialog";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";

const formatCurrency = (value: number) => `₹${(value || 0).toLocaleString()}`;

export default function Costing() {
  const { data, loading, addItem, updateItem, deleteItem } = useCosting();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editItem, setEditItem] = useState<any>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const columns = [
    { key: "style_no", header: "Style No" },
    { key: "style_name", header: "Style Name" },
    { key: "fabric_cost", header: "Fabric", render: (item: any) => formatCurrency(item.fabric_cost) },
    { key: "trims_cost", header: "Trims", render: (item: any) => formatCurrency(item.trims_cost) },
    { key: "labor_cost", header: "Labor", render: (item: any) => formatCurrency(item.labor_cost) },
    { key: "total_cost", header: "Total Cost", render: (item: any) => <span className="font-semibold">{formatCurrency(item.total_cost)}</span> },
    { key: "selling_price", header: "Selling Price", render: (item: any) => <span className="font-semibold text-green-600">{formatCurrency(item.selling_price)}</span> },
    { key: "margin", header: "Margin", render: (item: any) => <span className="text-accent font-medium">{item.margin?.toFixed(1) || 0}%</span> },
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
      <DataTable columns={columns} data={data} searchPlaceholder="Search costings..." onAdd={() => { setEditItem(null); setDialogOpen(true); }} addButtonText="Add Costing" />
      <CostingFormDialog open={dialogOpen} onOpenChange={setDialogOpen} onSubmit={handleSubmit} initialData={editItem || undefined} mode={editItem ? "edit" : "add"} />
      <AlertDialog open={!!deleteId} onOpenChange={() => setDeleteId(null)}><AlertDialogContent><AlertDialogHeader><AlertDialogTitle>Delete Costing?</AlertDialogTitle><AlertDialogDescription>This action cannot be undone.</AlertDialogDescription></AlertDialogHeader><AlertDialogFooter><AlertDialogCancel>Cancel</AlertDialogCancel><AlertDialogAction onClick={() => { if (deleteId) deleteItem(deleteId); setDeleteId(null); }}>Delete</AlertDialogAction></AlertDialogFooter></AlertDialogContent></AlertDialog>
    </>
  );
}
