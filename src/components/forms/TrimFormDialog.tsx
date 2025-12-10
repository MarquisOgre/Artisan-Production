import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { z } from "zod";

const trimSchema = z.object({
  trim_id: z.string().min(1, "Trim ID is required").max(50),
  trim_name: z.string().min(1, "Trim name is required").max(100),
  category: z.string().max(50).optional(),
  supplier: z.string().max(100).optional(),
  quantity: z.number().min(0, "Quantity must be positive"),
  unit: z.string().max(20),
  rate: z.number().min(0, "Rate must be positive"),
  status: z.string(),
});

interface TrimFormData {
  trim_id: string;
  trim_name: string;
  category: string;
  supplier: string;
  quantity: number;
  unit: string;
  rate: number;
  status: string;
}

interface TrimFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (data: TrimFormData) => Promise<{ error: Error | null }>;
  initialData?: Partial<TrimFormData>;
  mode: "add" | "edit";
}

export function TrimFormDialog({ open, onOpenChange, onSubmit, initialData, mode }: TrimFormDialogProps) {
  const [formData, setFormData] = useState<TrimFormData>({
    trim_id: initialData?.trim_id || "",
    trim_name: initialData?.trim_name || "",
    category: initialData?.category || "",
    supplier: initialData?.supplier || "",
    quantity: initialData?.quantity || 0,
    unit: initialData?.unit || "pcs",
    rate: initialData?.rate || 0,
    status: initialData?.status || "In Stock",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});

    try {
      trimSchema.parse(formData);
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
    const { error } = await onSubmit(formData);
    setLoading(false);

    if (!error) {
      onOpenChange(false);
      setFormData({ trim_id: "", trim_name: "", category: "", supplier: "", quantity: 0, unit: "pcs", rate: 0, status: "In Stock" });
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>{mode === "add" ? "Add New Trim" : "Edit Trim"}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="trim_id">Trim ID *</Label>
              <Input
                id="trim_id"
                value={formData.trim_id}
                onChange={(e) => setFormData({ ...formData, trim_id: e.target.value })}
                placeholder="TRM-001"
              />
              {errors.trim_id && <p className="text-xs text-destructive">{errors.trim_id}</p>}
            </div>
            <div className="space-y-2">
              <Label htmlFor="trim_name">Trim Name *</Label>
              <Input
                id="trim_name"
                value={formData.trim_name}
                onChange={(e) => setFormData({ ...formData, trim_name: e.target.value })}
                placeholder="Pearl Buttons"
              />
              {errors.trim_name && <p className="text-xs text-destructive">{errors.trim_name}</p>}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="category">Category</Label>
              <Input
                id="category"
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                placeholder="Buttons"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="supplier">Supplier</Label>
              <Input
                id="supplier"
                value={formData.supplier}
                onChange={(e) => setFormData({ ...formData, supplier: e.target.value })}
                placeholder="ABC Trims Co."
              />
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="quantity">Quantity</Label>
              <Input
                id="quantity"
                type="number"
                value={formData.quantity}
                onChange={(e) => setFormData({ ...formData, quantity: Number(e.target.value) })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="unit">Unit</Label>
              <Select value={formData.unit} onValueChange={(v) => setFormData({ ...formData, unit: v })}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="pcs">Pieces</SelectItem>
                  <SelectItem value="meters">Meters</SelectItem>
                  <SelectItem value="yards">Yards</SelectItem>
                  <SelectItem value="cones">Cones</SelectItem>
                  <SelectItem value="rolls">Rolls</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="rate">Rate (₹)</Label>
              <Input
                id="rate"
                type="number"
                step="0.01"
                value={formData.rate}
                onChange={(e) => setFormData({ ...formData, rate: Number(e.target.value) })}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="status">Status</Label>
            <Select value={formData.status} onValueChange={(v) => setFormData({ ...formData, status: v })}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="In Stock">In Stock</SelectItem>
                <SelectItem value="Low Stock">Low Stock</SelectItem>
                <SelectItem value="Out of Stock">Out of Stock</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex justify-end gap-2 pt-4">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
            <Button type="submit" disabled={loading}>
              {loading ? "Saving..." : mode === "add" ? "Add Trim" : "Save Changes"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
