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
  challan_no: z.string().min(1, "Challan No is required").max(50),
  customer: z.string().min(1, "Customer is required").max(100),
  destination: z.string().max(200).optional(),
  total_qty: z.number().min(0),
  vehicle_no: z.string().max(50).optional(),
  driver_name: z.string().max(100).optional(),
  remarks: z.string().max(500).optional(),
  status: z.string(),
});

interface FormData {
  challan_no: string;
  challan_date: string;
  customer: string;
  destination: string;
  items: Json;
  total_qty: number;
  vehicle_no: string;
  driver_name: string;
  remarks: string;
  status: string;
}

interface DeliveryChallanFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (data: FormData) => Promise<{ error: Error | null }>;
  initialData?: Partial<FormData>;
  mode: "add" | "edit";
}

export function DeliveryChallanFormDialog({ open, onOpenChange, onSubmit, initialData, mode }: DeliveryChallanFormDialogProps) {
  const [formData, setFormData] = useState<FormData>({
    challan_no: initialData?.challan_no || "",
    challan_date: initialData?.challan_date || format(new Date(), "yyyy-MM-dd"),
    customer: initialData?.customer || "",
    destination: initialData?.destination || "",
    items: initialData?.items || [],
    total_qty: initialData?.total_qty || 0,
    vehicle_no: initialData?.vehicle_no || "",
    driver_name: initialData?.driver_name || "",
    remarks: initialData?.remarks || "",
    status: initialData?.status || "Pending",
  });
  const [challanDate, setChallanDate] = useState<Date | undefined>(initialData?.challan_date ? new Date(initialData.challan_date) : new Date());
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});

    const dataToSubmit = { ...formData, challan_date: challanDate ? format(challanDate, "yyyy-MM-dd") : format(new Date(), "yyyy-MM-dd") };

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
      <DialogContent className="sm:max-w-[550px]">
        <DialogHeader>
          <DialogTitle>{mode === "add" ? "Create Delivery Challan" : "Edit Delivery Challan"}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="challan_no">Challan No *</Label>
              <Input id="challan_no" value={formData.challan_no} onChange={(e) => setFormData({ ...formData, challan_no: e.target.value })} placeholder="DC/2024/001" />
              {errors.challan_no && <p className="text-xs text-destructive">{errors.challan_no}</p>}
            </div>
            <div className="space-y-2">
              <Label>Challan Date</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="outline" className={cn("w-full justify-start text-left font-normal", !challanDate && "text-muted-foreground")}>
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {challanDate ? format(challanDate, "PPP") : "Pick a date"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar mode="single" selected={challanDate} onSelect={setChallanDate} initialFocus className="pointer-events-auto" />
                </PopoverContent>
              </Popover>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="customer">Customer *</Label>
            <Input id="customer" value={formData.customer} onChange={(e) => setFormData({ ...formData, customer: e.target.value })} placeholder="Fashion Retail Co." />
            {errors.customer && <p className="text-xs text-destructive">{errors.customer}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="destination">Destination</Label>
            <Input id="destination" value={formData.destination} onChange={(e) => setFormData({ ...formData, destination: e.target.value })} placeholder="Mumbai" />
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="total_qty">Total Quantity</Label>
              <Input id="total_qty" type="number" value={formData.total_qty} onChange={(e) => setFormData({ ...formData, total_qty: Number(e.target.value) })} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="vehicle_no">Vehicle No</Label>
              <Input id="vehicle_no" value={formData.vehicle_no} onChange={(e) => setFormData({ ...formData, vehicle_no: e.target.value })} placeholder="MH-12-AB-1234" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="driver_name">Driver Name</Label>
              <Input id="driver_name" value={formData.driver_name} onChange={(e) => setFormData({ ...formData, driver_name: e.target.value })} placeholder="John Doe" />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="remarks">Remarks</Label>
              <Textarea id="remarks" value={formData.remarks} onChange={(e) => setFormData({ ...formData, remarks: e.target.value })} placeholder="Any special instructions..." rows={2} />
            </div>
            <div className="space-y-2">
              <Label>Status</Label>
              <Select value={formData.status} onValueChange={(v) => setFormData({ ...formData, status: v })}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="Pending">Pending</SelectItem>
                  <SelectItem value="Dispatched">Dispatched</SelectItem>
                  <SelectItem value="Delivered">Delivered</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-4">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
            <Button type="submit" disabled={loading}>{loading ? "Saving..." : mode === "add" ? "Create Challan" : "Save Changes"}</Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
