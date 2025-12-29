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
  return_no: z.string().min(1, "Return No is required").max(50),
  party_name: z.string().min(1, "Party name is required").max(100),
  total_qty: z.number().min(0),
  status: z.string(),
});

interface FormData {
  return_no: string;
  return_date: string;
  return_type: string;
  party_name: string;
  original_doc_no: string;
  items: Json;
  total_qty: number;
  reason: string;
  action_taken: string;
  status: string;
}

interface ReturnRegisterFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (data: FormData) => Promise<{ error: Error | null }>;
  initialData?: Partial<FormData>;
  mode: "add" | "edit";
}

export function ReturnRegisterFormDialog({ open, onOpenChange, onSubmit, initialData, mode }: ReturnRegisterFormDialogProps) {
  const [formData, setFormData] = useState<FormData>({
    return_no: initialData?.return_no || "",
    return_date: initialData?.return_date || format(new Date(), "yyyy-MM-dd"),
    return_type: initialData?.return_type || "Customer Return",
    party_name: initialData?.party_name || "",
    original_doc_no: initialData?.original_doc_no || "",
    items: initialData?.items || [],
    total_qty: initialData?.total_qty || 0,
    reason: initialData?.reason || "",
    action_taken: initialData?.action_taken || "",
    status: initialData?.status || "Pending",
  });
  const [returnDate, setReturnDate] = useState<Date | undefined>(initialData?.return_date ? new Date(initialData.return_date) : new Date());
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});

    const dataToSubmit = { ...formData, return_date: returnDate ? format(returnDate, "yyyy-MM-dd") : format(new Date(), "yyyy-MM-dd") };

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
          <DialogTitle>{mode === "add" ? "Add Return Entry" : "Edit Return Entry"}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="return_no">Return No *</Label>
              <Input id="return_no" value={formData.return_no} onChange={(e) => setFormData({ ...formData, return_no: e.target.value })} placeholder="RET/2024/001" />
              {errors.return_no && <p className="text-xs text-destructive">{errors.return_no}</p>}
            </div>
            <div className="space-y-2">
              <Label>Return Date</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="outline" className={cn("w-full justify-start text-left font-normal", !returnDate && "text-muted-foreground")}>
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {returnDate ? format(returnDate, "PPP") : "Pick a date"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar mode="single" selected={returnDate} onSelect={setReturnDate} initialFocus className="pointer-events-auto" />
                </PopoverContent>
              </Popover>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Return Type</Label>
              <Select value={formData.return_type} onValueChange={(v) => setFormData({ ...formData, return_type: v })}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="Customer Return">Customer Return</SelectItem>
                  <SelectItem value="Supplier Return">Supplier Return</SelectItem>
                  <SelectItem value="Internal Return">Internal Return</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="party_name">Party Name *</Label>
              <Input id="party_name" value={formData.party_name} onChange={(e) => setFormData({ ...formData, party_name: e.target.value })} placeholder="Fashion Retail Co." />
              {errors.party_name && <p className="text-xs text-destructive">{errors.party_name}</p>}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="original_doc_no">Original Doc No</Label>
              <Input id="original_doc_no" value={formData.original_doc_no} onChange={(e) => setFormData({ ...formData, original_doc_no: e.target.value })} placeholder="DC/2024/001" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="total_qty">Total Quantity</Label>
              <Input id="total_qty" type="number" value={formData.total_qty} onChange={(e) => setFormData({ ...formData, total_qty: Number(e.target.value) })} />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="reason">Reason</Label>
            <Textarea id="reason" value={formData.reason} onChange={(e) => setFormData({ ...formData, reason: e.target.value })} placeholder="Reason for return..." rows={2} />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="action_taken">Action Taken</Label>
              <Input id="action_taken" value={formData.action_taken} onChange={(e) => setFormData({ ...formData, action_taken: e.target.value })} placeholder="Replacement issued" />
            </div>
            <div className="space-y-2">
              <Label>Status</Label>
              <Select value={formData.status} onValueChange={(v) => setFormData({ ...formData, status: v })}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="Pending">Pending</SelectItem>
                  <SelectItem value="Processing">Processing</SelectItem>
                  <SelectItem value="Resolved">Resolved</SelectItem>
                  <SelectItem value="Rejected">Rejected</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-4">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
            <Button type="submit" disabled={loading}>{loading ? "Saving..." : mode === "add" ? "Add Return" : "Save Changes"}</Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
