import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { CalendarIcon } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { z } from "zod";
import { Json } from "@/integrations/supabase/types";

const schema = z.object({
  dispatch_no: z.string().min(1, "Dispatch No is required").max(50),
  customer: z.string().min(1, "Customer is required").max(100),
  total_qty: z.number().min(0),
  status: z.string(),
});

interface FormData {
  dispatch_no: string;
  dispatch_date: string;
  customer: string;
  order_no: string;
  items: Json;
  total_qty: number;
  dispatched_by: string;
  vehicle_no: string;
  remarks: string;
  status: string;
}

interface OutwardRegisterFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (data: FormData) => Promise<{ error: Error | null }>;
  initialData?: Partial<FormData>;
  mode: "add" | "edit";
}

export function OutwardRegisterFormDialog({ open, onOpenChange, onSubmit, initialData, mode }: OutwardRegisterFormDialogProps) {
  const [formData, setFormData] = useState<FormData>({
    dispatch_no: initialData?.dispatch_no || "",
    dispatch_date: initialData?.dispatch_date || format(new Date(), "yyyy-MM-dd"),
    customer: initialData?.customer || "",
    order_no: initialData?.order_no || "",
    items: initialData?.items || [],
    total_qty: initialData?.total_qty || 0,
    dispatched_by: initialData?.dispatched_by || "",
    vehicle_no: initialData?.vehicle_no || "",
    remarks: initialData?.remarks || "",
    status: initialData?.status || "Dispatched",
  });
  const [dispatchDate, setDispatchDate] = useState<Date | undefined>(initialData?.dispatch_date ? new Date(initialData.dispatch_date) : new Date());
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});

    const dataToSubmit = { ...formData, dispatch_date: dispatchDate ? format(dispatchDate, "yyyy-MM-dd") : format(new Date(), "yyyy-MM-dd") };

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
          <DialogTitle>{mode === "add" ? "Add Outward Entry" : "Edit Outward Entry"}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="dispatch_no">Dispatch No *</Label>
              <Input id="dispatch_no" value={formData.dispatch_no} onChange={(e) => setFormData({ ...formData, dispatch_no: e.target.value })} placeholder="DC/2024/001" />
              {errors.dispatch_no && <p className="text-xs text-destructive">{errors.dispatch_no}</p>}
            </div>
            <div className="space-y-2">
              <Label>Dispatch Date</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="outline" className={cn("w-full justify-start text-left font-normal", !dispatchDate && "text-muted-foreground")}>
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {dispatchDate ? format(dispatchDate, "PPP") : "Pick a date"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar mode="single" selected={dispatchDate} onSelect={setDispatchDate} initialFocus className="pointer-events-auto" />
                </PopoverContent>
              </Popover>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="customer">Customer *</Label>
              <Input id="customer" value={formData.customer} onChange={(e) => setFormData({ ...formData, customer: e.target.value })} placeholder="Fashion Retail Co." />
              {errors.customer && <p className="text-xs text-destructive">{errors.customer}</p>}
            </div>
            <div className="space-y-2">
              <Label htmlFor="order_no">Order No</Label>
              <Input id="order_no" value={formData.order_no} onChange={(e) => setFormData({ ...formData, order_no: e.target.value })} placeholder="ORD-2024-001" />
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="total_qty">Total Quantity</Label>
              <Input id="total_qty" type="number" value={formData.total_qty} onChange={(e) => setFormData({ ...formData, total_qty: Number(e.target.value) })} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="dispatched_by">Dispatched By</Label>
              <Input id="dispatched_by" value={formData.dispatched_by} onChange={(e) => setFormData({ ...formData, dispatched_by: e.target.value })} placeholder="John Doe" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="vehicle_no">Vehicle No</Label>
              <Input id="vehicle_no" value={formData.vehicle_no} onChange={(e) => setFormData({ ...formData, vehicle_no: e.target.value })} placeholder="MH-12-AB-1234" />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="remarks">Remarks</Label>
              <Textarea id="remarks" value={formData.remarks} onChange={(e) => setFormData({ ...formData, remarks: e.target.value })} placeholder="Any notes..." rows={2} />
            </div>
            <div className="space-y-2">
              <Label>Status</Label>
              <Select value={formData.status} onValueChange={(v) => setFormData({ ...formData, status: v })}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="Dispatched">Dispatched</SelectItem>
                  <SelectItem value="In Transit">In Transit</SelectItem>
                  <SelectItem value="Delivered">Delivered</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-4">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
            <Button type="submit" disabled={loading}>{loading ? "Saving..." : mode === "add" ? "Add Entry" : "Save Changes"}</Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
