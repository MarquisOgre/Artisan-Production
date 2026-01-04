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
  order_no: z.string().min(1, "Order No is required").max(50),
  style: z.string().max(100).optional(),
  buyer: z.string().max(100).optional(),
  target_qty: z.number().min(0),
  completed_qty: z.number().min(0),
  status: z.string(),
});

interface FormData {
  order_no: string;
  style: string;
  buyer: string;
  target_qty: number;
  completed_qty: number;
  start_date: string;
  end_date: string;
  status: string;
}

interface ProductionPlannerFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (data: FormData) => Promise<void>;
  initialData?: Partial<FormData>;
  mode: "add" | "edit";
}

export function ProductionPlannerFormDialog({ open, onOpenChange, onSubmit, initialData, mode }: ProductionPlannerFormDialogProps) {
  const [formData, setFormData] = useState<FormData>({
    order_no: initialData?.order_no || "",
    style: initialData?.style || "",
    buyer: initialData?.buyer || "",
    target_qty: initialData?.target_qty || 0,
    completed_qty: initialData?.completed_qty || 0,
    start_date: initialData?.start_date || "",
    end_date: initialData?.end_date || "",
    status: initialData?.status || "Pending",
  });
  const [startDate, setStartDate] = useState<Date | undefined>(initialData?.start_date ? new Date(initialData.start_date) : undefined);
  const [endDate, setEndDate] = useState<Date | undefined>(initialData?.end_date ? new Date(initialData.end_date) : undefined);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});

    const dataToSubmit = {
      ...formData,
      start_date: startDate ? format(startDate, "yyyy-MM-dd") : "",
      end_date: endDate ? format(endDate, "yyyy-MM-dd") : "",
    };

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
    try {
      await onSubmit(dataToSubmit);
      onOpenChange(false);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>{mode === "add" ? "Add Production Plan" : "Edit Production Plan"}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="order_no">Order No *</Label>
              <Input id="order_no" value={formData.order_no} onChange={(e) => setFormData({ ...formData, order_no: e.target.value })} placeholder="ORD-001" />
              {errors.order_no && <p className="text-xs text-destructive">{errors.order_no}</p>}
            </div>
            <div className="space-y-2">
              <Label htmlFor="style">Style</Label>
              <Input id="style" value={formData.style} onChange={(e) => setFormData({ ...formData, style: e.target.value })} placeholder="Classic Oxford" />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="buyer">Buyer</Label>
            <Input id="buyer" value={formData.buyer} onChange={(e) => setFormData({ ...formData, buyer: e.target.value })} placeholder="Fashion Retail Co." />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="target_qty">Target Qty</Label>
              <Input id="target_qty" type="number" value={formData.target_qty} onChange={(e) => setFormData({ ...formData, target_qty: Number(e.target.value) })} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="completed_qty">Completed Qty</Label>
              <Input id="completed_qty" type="number" value={formData.completed_qty} onChange={(e) => setFormData({ ...formData, completed_qty: Number(e.target.value) })} />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Start Date</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="outline" className={cn("w-full justify-start text-left font-normal", !startDate && "text-muted-foreground")}>
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {startDate ? format(startDate, "PPP") : "Pick a date"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar mode="single" selected={startDate} onSelect={setStartDate} initialFocus className="pointer-events-auto" />
                </PopoverContent>
              </Popover>
            </div>
            <div className="space-y-2">
              <Label>End Date</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="outline" className={cn("w-full justify-start text-left font-normal", !endDate && "text-muted-foreground")}>
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {endDate ? format(endDate, "PPP") : "Pick a date"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar mode="single" selected={endDate} onSelect={setEndDate} initialFocus className="pointer-events-auto" />
                </PopoverContent>
              </Popover>
            </div>
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

          <div className="flex justify-end gap-2 pt-4">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
            <Button type="submit" disabled={loading}>{loading ? "Saving..." : mode === "add" ? "Add Plan" : "Save Changes"}</Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
