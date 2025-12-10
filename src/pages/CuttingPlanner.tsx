import { useState } from "react";
import { DataTable } from "@/components/ui/DataTable";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { Button } from "@/components/ui/button";
import { Pencil, Trash2 } from "lucide-react";
import { useCuttingPlanner } from "@/hooks/useCuttingPlanner";
import { CuttingPlannerFormDialog } from "@/components/forms/CuttingPlannerFormDialog";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";

export default function CuttingPlanner() {
  const { data, loading, addPlan, updatePlan, deletePlan } = useCuttingPlanner();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editItem, setEditItem] = useState<any>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const getStatusType = (status: string) => {
    if (status === "Completed") return "completed";
    if (status === "In Progress") return "in-progress";
    return "pending";
  };

  const columns = [
    { key: "lot_no", header: "Lot No" },
    { key: "style", header: "Style" },
    { key: "fabric", header: "Fabric" },
    { key: "color", header: "Color" },
    { key: "planned_qty", header: "Planned", render: (item: any) => item.planned_qty?.toLocaleString() || 0 },
    { key: "cut_qty", header: "Cut", render: (item: any) => item.cut_qty?.toLocaleString() || 0 },
    { key: "balance", header: "Balance", render: (item: any) => item.balance?.toLocaleString() || 0 },
    { key: "cut_date", header: "Cut Date" },
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

  const handleSubmit = async (formData: any) => editItem ? updatePlan(editItem.id, formData) : addPlan(formData);

  return (
    <>
      <DataTable columns={columns} data={data} searchPlaceholder="Search cutting plans..." onAdd={() => { setEditItem(null); setDialogOpen(true); }} addButtonText="Add Plan" />
      <CuttingPlannerFormDialog open={dialogOpen} onOpenChange={setDialogOpen} onSubmit={handleSubmit} initialData={editItem || undefined} mode={editItem ? "edit" : "add"} />
      <AlertDialog open={!!deleteId} onOpenChange={() => setDeleteId(null)}>
        <AlertDialogContent><AlertDialogHeader><AlertDialogTitle>Delete Plan?</AlertDialogTitle><AlertDialogDescription>This action cannot be undone.</AlertDialogDescription></AlertDialogHeader><AlertDialogFooter><AlertDialogCancel>Cancel</AlertDialogCancel><AlertDialogAction onClick={() => { if (deleteId) deletePlan(deleteId); setDeleteId(null); }}>Delete</AlertDialogAction></AlertDialogFooter></AlertDialogContent>
      </AlertDialog>
    </>
  );
}
