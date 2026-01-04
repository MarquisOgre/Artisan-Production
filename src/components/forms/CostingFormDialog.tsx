import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { z } from "zod";

const schema = z.object({
  style_no: z.string().min(1, "Style No is required").max(50),
  style_name: z.string().max(100).optional(),
  fabric_cost: z.number().min(0),
  trims_cost: z.number().min(0),
  labor_cost: z.number().min(0),
  overhead_cost: z.number().min(0),
  selling_price: z.number().min(0),
});

interface FormData {
  style_no: string;
  style_name: string;
  fabric_cost: number;
  trims_cost: number;
  labor_cost: number;
  overhead_cost: number;
  total_cost: number;
  selling_price: number;
  margin: number;
}

interface CostingFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (data: FormData) => Promise<void>;
  initialData?: Partial<FormData>;
  mode: "add" | "edit";
}

export function CostingFormDialog({ open, onOpenChange, onSubmit, initialData, mode }: CostingFormDialogProps) {
  const [formData, setFormData] = useState<FormData>({
    style_no: initialData?.style_no || "",
    style_name: initialData?.style_name || "",
    fabric_cost: initialData?.fabric_cost || 0,
    trims_cost: initialData?.trims_cost || 0,
    labor_cost: initialData?.labor_cost || 0,
    overhead_cost: initialData?.overhead_cost || 0,
    total_cost: initialData?.total_cost || 0,
    selling_price: initialData?.selling_price || 0,
    margin: initialData?.margin || 0,
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const total = formData.fabric_cost + formData.trims_cost + formData.labor_cost + formData.overhead_cost;
    const marginValue = formData.selling_price > 0 ? ((formData.selling_price - total) / formData.selling_price * 100) : 0;
    setFormData(prev => ({ ...prev, total_cost: total, margin: Number(marginValue.toFixed(2)) }));
  }, [formData.fabric_cost, formData.trims_cost, formData.labor_cost, formData.overhead_cost, formData.selling_price]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});

    try {
      schema.parse(formData);
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
    try {
      await onSubmit(formData);
      onOpenChange(false);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>{mode === "add" ? "Add Costing" : "Edit Costing"}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="style_no">Style No *</Label>
              <Input id="style_no" value={formData.style_no} onChange={(e) => setFormData({ ...formData, style_no: e.target.value })} placeholder="STY-001" />
              {errors.style_no && <p className="text-xs text-destructive">{errors.style_no}</p>}
            </div>
            <div className="space-y-2">
              <Label htmlFor="style_name">Style Name</Label>
              <Input id="style_name" value={formData.style_name} onChange={(e) => setFormData({ ...formData, style_name: e.target.value })} placeholder="Classic Oxford" />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="fabric_cost">Fabric Cost (₹)</Label>
              <Input id="fabric_cost" type="number" step="0.01" value={formData.fabric_cost} onChange={(e) => setFormData({ ...formData, fabric_cost: Number(e.target.value) })} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="trims_cost">Trims Cost (₹)</Label>
              <Input id="trims_cost" type="number" step="0.01" value={formData.trims_cost} onChange={(e) => setFormData({ ...formData, trims_cost: Number(e.target.value) })} />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="labor_cost">Labor Cost (₹)</Label>
              <Input id="labor_cost" type="number" step="0.01" value={formData.labor_cost} onChange={(e) => setFormData({ ...formData, labor_cost: Number(e.target.value) })} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="overhead_cost">Overhead Cost (₹)</Label>
              <Input id="overhead_cost" type="number" step="0.01" value={formData.overhead_cost} onChange={(e) => setFormData({ ...formData, overhead_cost: Number(e.target.value) })} />
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label>Total Cost (₹)</Label>
              <Input value={`₹${formData.total_cost.toLocaleString()}`} disabled className="bg-muted font-semibold" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="selling_price">Selling Price (₹)</Label>
              <Input id="selling_price" type="number" step="0.01" value={formData.selling_price} onChange={(e) => setFormData({ ...formData, selling_price: Number(e.target.value) })} />
            </div>
            <div className="space-y-2">
              <Label>Margin</Label>
              <Input value={`${formData.margin}%`} disabled className={`bg-muted font-semibold ${formData.margin > 0 ? "text-green-600" : "text-red-600"}`} />
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-4">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
            <Button type="submit" disabled={loading}>{loading ? "Saving..." : mode === "add" ? "Add Costing" : "Save Changes"}</Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
