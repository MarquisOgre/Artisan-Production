import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { CalendarIcon } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { z } from "zod";

const schema = z.object({
  lot_no: z.string().min(1, "Lot No is required").max(50),
  style: z.string().max(100).optional(),
  fabric: z.string().max(100).optional(),
  color: z.string().max(50).optional(),
  planned_qty: z.number().min(0),
  cut_qty: z.number().min(0),
  balance: z.number(),
  cut_date: z.string().optional(),
  status: z.string(),
});

interface FormData {
  lot_no: string;
  style: string;
  fabric: string;
  color: string;
  planned_qty: number;
  cut_qty: number;
  balance: number;
  cut_date: string;
  status: string;
}

interface CuttingPlannerFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (data: FormData) => Promise<{ error: Error | null }>;
  initialData?: Partial<FormData>;
  mode: "add" | "edit";
}

export function CuttingPlannerFormDialog({ open, onOpenChange, onSubmit, initialData, mode }: CuttingPlannerFormDialogProps) {
  const [formData, setFormData] = useState<FormData>({
    lot_no: initialData?.lot_no || "",
    style: initialData?.style || "",
    fabric: initialData?.fabric || "",
    color: initialData?.color || "",
    planned_qty: initialData?.planned_qty || 0,
    cut_qty: initialData?.cut_qty || 0,
    balance: initialData?.balance || 0,
    cut_date: initialData?.cut_date || "",
    status: initialData?.status || "Pending",
  });
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(initialData?.cut_date ? new Date(initialData.cut_date) : undefined);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setFormData(prev => ({
      ...prev,
      balance: prev.planned_qty - prev.cut_qty
    }));
  }, [formData.planned_qty, formData.cut_qty]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});

    const dataToSubmit = { ...formData, cut_date: selectedDate ? format(selectedDate, "yyyy-MM-dd") : "" };

    try {
      schema.parse(dataToSubmit);
    } catch (error) {
      if (error instanceof z.ZodError) {
        const fieldErrors: Record<string, string> = {};
        error.errors.forEach((err) => {
          if (err.path[0]) fieldErrors[err.path[0].toString()] = err.message;
        });
        setErrors(fieldErrors);
        return;
      }
    }

    setLoading(true);
    const { error } = await onSubmit(dataToSubmit);
    setLoading(false);

    if (!error) {
      onOpenChange(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>{mode === "add" ? "Add Cutting Plan" : "Edit Cutting Plan"}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="lot_no">Lot No *</Label>
              <Input
                id="lot_no"
                value={formData.lot_no}
                onChange={(e) => setFormData({ ...formData, lot_no: e.target.value })}
                placeholder="LOT-001"
              />
              {errors.lot_no && <p className="text-xs text-destructive">{errors.lot_no}</p>}
            </div>
            <div className="space-y-2">
              <Label htmlFor="style">Style</Label>
              <Input
                id="style"
                value={formData.style}
                onChange={(e) => setFormData({ ...formData, style: e.target.value })}
                placeholder="Classic Oxford"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="fabric">Fabric</Label>
              <Input
                id="fabric"
                value={formData.fabric}
                onChange={(e) => setFormData({ ...formData, fabric: e.target.value })}
                placeholder="Cotton 100%"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="color">Color</Label>
              <Input
                id="color"
                value={formData.color}
                onChange={(e) => setFormData({ ...formData, color: e.target.value })}
                placeholder="White"
              />
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="planned_qty">Planned Qty</Label>
              <Input
                id="planned_qty"
                type="number"
                value={formData.planned_qty}
                onChange={(e) => setFormData({ ...formData, planned_qty: Number(e.target.value) })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="cut_qty">Cut Qty</Label>
              <Input
                id="cut_qty"
                type="number"
                value={formData.cut_qty}
                onChange={(e) => setFormData({ ...formData, cut_qty: Number(e.target.value) })}
              />
            </div>
            <div className="space-y-2">
              <Label>Balance</Label>
              <Input value={formData.planned_qty - formData.cut_qty} disabled className="bg-muted" />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Cut Date</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="outline" className={cn("w-full justify-start text-left font-normal", !selectedDate && "text-muted-foreground")}>
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {selectedDate ? format(selectedDate, "PPP") : "Pick a date"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar mode="single" selected={selectedDate} onSelect={setSelectedDate} initialFocus className="pointer-events-auto" />
                </PopoverContent>
              </Popover>
            </div>
            <div className="space-y-2">
              <Label>Status</Label>
              <Select value={formData.status} onValueChange={(v) => setFormData({ ...formData, status: v })}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="Pending">Pending</SelectItem>
                  <SelectItem value="In Progress">In Progress</SelectItem>
                  <SelectItem value="Completed">Completed</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-4">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
            <Button type="submit" disabled={loading}>
              {loading ? "Saving..." : mode === "add" ? "Add Plan" : "Save Changes"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
