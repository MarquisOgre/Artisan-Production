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
  grn_no: z.string().min(1, "GRN No is required").max(50),
  supplier: z.string().min(1, "Supplier is required").max(100),
  total_qty: z.number().min(0),
  status: z.string(),
});

interface FormData {
  grn_no: string;
  grn_date: string;
  supplier: string;
  po_no: string;
  items: Json;
  total_qty: number;
  received_by: string;
  remarks: string;
  status: string;
}

interface InwardRegisterFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (data: FormData) => Promise<void>;
  initialData?: Partial<FormData>;
  mode: "add" | "edit";
}

export function InwardRegisterFormDialog({ open, onOpenChange, onSubmit, initialData, mode }: InwardRegisterFormDialogProps) {
  const [formData, setFormData] = useState<FormData>({
    grn_no: initialData?.grn_no || "",
    grn_date: initialData?.grn_date || format(new Date(), "yyyy-MM-dd"),
    supplier: initialData?.supplier || "",
    po_no: initialData?.po_no || "",
    items: initialData?.items || [],
    total_qty: initialData?.total_qty || 0,
    received_by: initialData?.received_by || "",
    remarks: initialData?.remarks || "",
    status: initialData?.status || "Received",
  });
  const [grnDate, setGrnDate] = useState<Date | undefined>(initialData?.grn_date ? new Date(initialData.grn_date) : new Date());
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});

    const dataToSubmit = { ...formData, grn_date: grnDate ? format(grnDate, "yyyy-MM-dd") : format(new Date(), "yyyy-MM-dd") };

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
          <DialogTitle>{mode === "add" ? "Add Inward Entry" : "Edit Inward Entry"}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="grn_no">GRN No *</Label>
              <Input id="grn_no" value={formData.grn_no} onChange={(e) => setFormData({ ...formData, grn_no: e.target.value })} placeholder="GRN/2024/001" />
              {errors.grn_no && <p className="text-xs text-destructive">{errors.grn_no}</p>}
            </div>
            <div className="space-y-2">
              <Label>GRN Date</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="outline" className={cn("w-full justify-start text-left font-normal", !grnDate && "text-muted-foreground")}>
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {grnDate ? format(grnDate, "PPP") : "Pick a date"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar mode="single" selected={grnDate} onSelect={setGrnDate} initialFocus className="pointer-events-auto" />
                </PopoverContent>
              </Popover>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="supplier">Supplier *</Label>
              <Input id="supplier" value={formData.supplier} onChange={(e) => setFormData({ ...formData, supplier: e.target.value })} placeholder="Textile Mills Ltd." />
              {errors.supplier && <p className="text-xs text-destructive">{errors.supplier}</p>}
            </div>
            <div className="space-y-2">
              <Label htmlFor="po_no">PO No</Label>
              <Input id="po_no" value={formData.po_no} onChange={(e) => setFormData({ ...formData, po_no: e.target.value })} placeholder="PO/2024/001" />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="total_qty">Total Quantity</Label>
              <Input id="total_qty" type="number" value={formData.total_qty} onChange={(e) => setFormData({ ...formData, total_qty: Number(e.target.value) })} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="received_by">Received By</Label>
              <Input id="received_by" value={formData.received_by} onChange={(e) => setFormData({ ...formData, received_by: e.target.value })} placeholder="John Doe" />
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
                  <SelectItem value="Received">Received</SelectItem>
                  <SelectItem value="Pending QC">Pending QC</SelectItem>
                  <SelectItem value="Accepted">Accepted</SelectItem>
                  <SelectItem value="Rejected">Rejected</SelectItem>
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
