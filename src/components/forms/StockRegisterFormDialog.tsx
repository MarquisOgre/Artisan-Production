import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { z } from "zod";

const schema = z.object({
  item_code: z.string().min(1, "Item code is required").max(50),
  item_name: z.string().min(1, "Item name is required").max(100),
  category: z.string().max(50).optional(),
  current_stock: z.number().min(0),
  min_stock: z.number().min(0),
  max_stock: z.number().min(0),
  unit: z.string().max(20),
  location: z.string().max(100).optional(),
  status: z.string(),
});

interface FormData {
  item_code: string;
  item_name: string;
  category: string;
  current_stock: number;
  min_stock: number;
  max_stock: number;
  unit: string;
  location: string;
  status: string;
}

interface StockRegisterFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (data: FormData) => Promise<void>;
  initialData?: Partial<FormData>;
  mode: "add" | "edit";
}

export function StockRegisterFormDialog({ open, onOpenChange, onSubmit, initialData, mode }: StockRegisterFormDialogProps) {
  const [formData, setFormData] = useState<FormData>({
    item_code: initialData?.item_code || "",
    item_name: initialData?.item_name || "",
    category: initialData?.category || "",
    current_stock: initialData?.current_stock || 0,
    min_stock: initialData?.min_stock || 0,
    max_stock: initialData?.max_stock || 0,
    unit: initialData?.unit || "pcs",
    location: initialData?.location || "",
    status: initialData?.status || "In Stock",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);

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
          <DialogTitle>{mode === "add" ? "Add Stock Item" : "Edit Stock Item"}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="item_code">Item Code *</Label>
              <Input id="item_code" value={formData.item_code} onChange={(e) => setFormData({ ...formData, item_code: e.target.value })} placeholder="STK-001" />
              {errors.item_code && <p className="text-xs text-destructive">{errors.item_code}</p>}
            </div>
            <div className="space-y-2">
              <Label htmlFor="item_name">Item Name *</Label>
              <Input id="item_name" value={formData.item_name} onChange={(e) => setFormData({ ...formData, item_name: e.target.value })} placeholder="White Cotton Fabric" />
              {errors.item_name && <p className="text-xs text-destructive">{errors.item_name}</p>}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="category">Category</Label>
              <Input id="category" value={formData.category} onChange={(e) => setFormData({ ...formData, category: e.target.value })} placeholder="Fabric" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="location">Location</Label>
              <Input id="location" value={formData.location} onChange={(e) => setFormData({ ...formData, location: e.target.value })} placeholder="Warehouse A" />
            </div>
          </div>

          <div className="grid grid-cols-4 gap-4">
            <div className="space-y-2">
              <Label htmlFor="current_stock">Current Stock</Label>
              <Input id="current_stock" type="number" value={formData.current_stock} onChange={(e) => setFormData({ ...formData, current_stock: Number(e.target.value) })} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="min_stock">Min Stock</Label>
              <Input id="min_stock" type="number" value={formData.min_stock} onChange={(e) => setFormData({ ...formData, min_stock: Number(e.target.value) })} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="max_stock">Max Stock</Label>
              <Input id="max_stock" type="number" value={formData.max_stock} onChange={(e) => setFormData({ ...formData, max_stock: Number(e.target.value) })} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="unit">Unit</Label>
              <Select value={formData.unit} onValueChange={(v) => setFormData({ ...formData, unit: v })}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="pcs">Pieces</SelectItem>
                  <SelectItem value="mtrs">Meters</SelectItem>
                  <SelectItem value="yards">Yards</SelectItem>
                  <SelectItem value="cones">Cones</SelectItem>
                  <SelectItem value="rolls">Rolls</SelectItem>
                  <SelectItem value="kgs">Kilograms</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label>Status</Label>
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
            <Button type="submit" disabled={loading}>{loading ? "Saving..." : mode === "add" ? "Add Item" : "Save Changes"}</Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
