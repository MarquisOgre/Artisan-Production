import { useState } from "react";
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
  fabric_code: z.string().min(1, "Fabric code is required").max(50),
  fabric_name: z.string().min(1, "Fabric name is required").max(100),
  color: z.string().max(50).optional(),
  required_qty: z.number().min(0),
  ordered_qty: z.number().min(0),
  received_qty: z.number().min(0),
  unit: z.string().max(20),
  supplier: z.string().max(100).optional(),
  status: z.string(),
});

interface FormData {
  fabric_code: string;
  fabric_name: string;
  color: string;
  required_qty: number;
  ordered_qty: number;
  received_qty: number;
  unit: string;
  supplier: string;
  order_date: string;
  status: string;
}

interface FabricToProcureFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (data: FormData) => Promise<{ error: Error | null }>;
  initialData?: Partial<FormData>;
  mode: "add" | "edit";
}

export function FabricToProcureFormDialog({ open, onOpenChange, onSubmit, initialData, mode }: FabricToProcureFormDialogProps) {
  const [formData, setFormData] = useState<FormData>({
    fabric_code: initialData?.fabric_code || "",
    fabric_name: initialData?.fabric_name || "",
    color: initialData?.color || "",
    required_qty: initialData?.required_qty || 0,
    ordered_qty: initialData?.ordered_qty || 0,
    received_qty: initialData?.received_qty || 0,
    unit: initialData?.unit || "meters",
    supplier: initialData?.supplier || "",
    order_date: initialData?.order_date || "",
    status: initialData?.status || "Pending",
  });
  const [orderDate, setOrderDate] = useState<Date | undefined>(initialData?.order_date ? new Date(initialData.order_date) : undefined);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});

    const dataToSubmit = { ...formData, order_date: orderDate ? format(orderDate, "yyyy-MM-dd") : "" };

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

    if (!error) onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>{mode === "add" ? "Add Fabric" : "Edit Fabric"}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="fabric_code">Fabric Code *</Label>
              <Input id="fabric_code" value={formData.fabric_code} onChange={(e) => setFormData({ ...formData, fabric_code: e.target.value })} placeholder="FAB-001" />
              {errors.fabric_code && <p className="text-xs text-destructive">{errors.fabric_code}</p>}
            </div>
            <div className="space-y-2">
              <Label htmlFor="fabric_name">Fabric Name *</Label>
              <Input id="fabric_name" value={formData.fabric_name} onChange={(e) => setFormData({ ...formData, fabric_name: e.target.value })} placeholder="Cotton Twill" />
              {errors.fabric_name && <p className="text-xs text-destructive">{errors.fabric_name}</p>}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="color">Color</Label>
              <Input id="color" value={formData.color} onChange={(e) => setFormData({ ...formData, color: e.target.value })} placeholder="White" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="supplier">Supplier</Label>
              <Input id="supplier" value={formData.supplier} onChange={(e) => setFormData({ ...formData, supplier: e.target.value })} placeholder="Textile Mills Ltd." />
            </div>
          </div>

          <div className="grid grid-cols-4 gap-4">
            <div className="space-y-2">
              <Label htmlFor="required_qty">Required</Label>
              <Input id="required_qty" type="number" step="0.01" value={formData.required_qty} onChange={(e) => setFormData({ ...formData, required_qty: Number(e.target.value) })} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="ordered_qty">Ordered</Label>
              <Input id="ordered_qty" type="number" step="0.01" value={formData.ordered_qty} onChange={(e) => setFormData({ ...formData, ordered_qty: Number(e.target.value) })} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="received_qty">Received</Label>
              <Input id="received_qty" type="number" step="0.01" value={formData.received_qty} onChange={(e) => setFormData({ ...formData, received_qty: Number(e.target.value) })} />
            </div>
            <div className="space-y-2">
              <Label>Unit</Label>
              <Select value={formData.unit} onValueChange={(v) => setFormData({ ...formData, unit: v })}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="meters">Meters</SelectItem>
                  <SelectItem value="yards">Yards</SelectItem>
                  <SelectItem value="kgs">Kilograms</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Order Date</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="outline" className={cn("w-full justify-start text-left font-normal", !orderDate && "text-muted-foreground")}>
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {orderDate ? format(orderDate, "PPP") : "Pick a date"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar mode="single" selected={orderDate} onSelect={setOrderDate} initialFocus className="pointer-events-auto" />
                </PopoverContent>
              </Popover>
            </div>
            <div className="space-y-2">
              <Label>Status</Label>
              <Select value={formData.status} onValueChange={(v) => setFormData({ ...formData, status: v })}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="Pending">Pending</SelectItem>
                  <SelectItem value="Ordered">Ordered</SelectItem>
                  <SelectItem value="Received">Received</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-4">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
            <Button type="submit" disabled={loading}>{loading ? "Saving..." : mode === "add" ? "Add Fabric" : "Save Changes"}</Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
