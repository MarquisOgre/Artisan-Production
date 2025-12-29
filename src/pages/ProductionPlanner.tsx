import { useState } from "react";
import { DataTable } from "@/components/ui/DataTable";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { Button } from "@/components/ui/button";
import { Pencil, Trash2 } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { useProductionPlanner } from "@/hooks/useProductionPlanner";
import { ProductionPlannerFormDialog } from "@/components/forms/ProductionPlannerFormDialog";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";

export default function ProductionPlanner() {
  const { data, loading, addPlan, updatePlan, deletePlan } = useProductionPlanner();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editItem, setEditItem] = useState<any>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const getStatusType = (status: string) => {
    if (status === "Completed") return "completed";
    if (status === "In Progress") return "in-progress";
    return "pending";
  };

  const columns = [
    { key: "order_no", header: "Order No" },
    { key: "style", header: "Style" },
    { key: "buyer", header: "Buyer" },
    { key: "target_qty", header: "Target", render: (item: any) => item.target_qty?.toLocaleString() || 0 },
    { key: "progress", header: "Progress", render: (item: any) => {
      const pct = item.target_qty > 0 ? Math.round((item.completed_qty / item.target_qty) * 100) : 0;
      return <div className="flex items-center gap-2 min-w-[120px]"><Progress value={pct} className="h-2" /><span className="text-xs text-muted-foreground w-10">{pct}%</span></div>;
    }},
    { key: "start_date", header: "Start" },
    { key: "end_date", header: "End" },
    { key: "status", header: "Status", render: (item: any) => <StatusBadge status={getStatusType(item.status)} /> },
    { key: "actions", header: "Actions", render: (item: any) => (
      <div className="flex items-center gap-1">
        <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => { setEditItem(item); setDialogOpen(true); }}><Pencil className="h-4 w-4" /></Button>
        <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive" onClick={() => setDeleteId(item.id)}><Trash2 className="h-4 w-4" /></Button>
      </div>
    )},
  ];

  const handleSubmit = async (formData: any) => editItem ? updatePlan(editItem.id, formData) : addPlan(formData);

  return (
    <>
      <DataTable columns={columns} data={data} searchPlaceholder="Search production plans..." onAdd={() => { setEditItem(null); setDialogOpen(true); }} addButtonText="Add Plan" />
      <ProductionPlannerFormDialog open={dialogOpen} onOpenChange={setDialogOpen} onSubmit={handleSubmit} initialData={editItem || undefined} mode={editItem ? "edit" : "add"} />
      <AlertDialog open={!!deleteId} onOpenChange={() => setDeleteId(null)}><AlertDialogContent><AlertDialogHeader><AlertDialogTitle>Delete Plan?</AlertDialogTitle><AlertDialogDescription>This action cannot be undone.</AlertDialogDescription></AlertDialogHeader><AlertDialogFooter><AlertDialogCancel>Cancel</AlertDialogCancel><AlertDialogAction onClick={() => { if (deleteId) deletePlan(deleteId); setDeleteId(null); }}>Delete</AlertDialogAction></AlertDialogFooter></AlertDialogContent></AlertDialog>
    </>
  );
}
