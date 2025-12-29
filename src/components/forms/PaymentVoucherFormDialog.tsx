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

const schema = z.object({
  voucher_no: z.string().min(1, "Voucher No is required").max(50),
  payee: z.string().min(1, "Payee is required").max(100),
  amount: z.number().min(0),
  payment_mode: z.string(),
  status: z.string(),
});

interface FormData {
  voucher_no: string;
  voucher_date: string;
  payee: string;
  amount: number;
  payment_mode: string;
  reference_no: string;
  purpose: string;
  approved_by: string;
  status: string;
}

interface PaymentVoucherFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (data: FormData) => Promise<{ error: Error | null }>;
  initialData?: Partial<FormData>;
  mode: "add" | "edit";
}

export function PaymentVoucherFormDialog({ open, onOpenChange, onSubmit, initialData, mode }: PaymentVoucherFormDialogProps) {
  const [formData, setFormData] = useState<FormData>({
    voucher_no: initialData?.voucher_no || "",
    voucher_date: initialData?.voucher_date || format(new Date(), "yyyy-MM-dd"),
    payee: initialData?.payee || "",
    amount: initialData?.amount || 0,
    payment_mode: initialData?.payment_mode || "Cash",
    reference_no: initialData?.reference_no || "",
    purpose: initialData?.purpose || "",
    approved_by: initialData?.approved_by || "",
    status: initialData?.status || "Pending",
  });
  const [voucherDate, setVoucherDate] = useState<Date | undefined>(initialData?.voucher_date ? new Date(initialData.voucher_date) : new Date());
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});

    const dataToSubmit = { ...formData, voucher_date: voucherDate ? format(voucherDate, "yyyy-MM-dd") : format(new Date(), "yyyy-MM-dd") };

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
          <DialogTitle>{mode === "add" ? "Create Payment Voucher" : "Edit Payment Voucher"}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="voucher_no">Voucher No *</Label>
              <Input id="voucher_no" value={formData.voucher_no} onChange={(e) => setFormData({ ...formData, voucher_no: e.target.value })} placeholder="PV/2024/001" />
              {errors.voucher_no && <p className="text-xs text-destructive">{errors.voucher_no}</p>}
            </div>
            <div className="space-y-2">
              <Label>Voucher Date</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="outline" className={cn("w-full justify-start text-left font-normal", !voucherDate && "text-muted-foreground")}>
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {voucherDate ? format(voucherDate, "PPP") : "Pick a date"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar mode="single" selected={voucherDate} onSelect={setVoucherDate} initialFocus className="pointer-events-auto" />
                </PopoverContent>
              </Popover>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="payee">Payee *</Label>
            <Input id="payee" value={formData.payee} onChange={(e) => setFormData({ ...formData, payee: e.target.value })} placeholder="Textile Mills Ltd." />
            {errors.payee && <p className="text-xs text-destructive">{errors.payee}</p>}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="amount">Amount (₹)</Label>
              <Input id="amount" type="number" step="0.01" value={formData.amount} onChange={(e) => setFormData({ ...formData, amount: Number(e.target.value) })} />
            </div>
            <div className="space-y-2">
              <Label>Payment Mode</Label>
              <Select value={formData.payment_mode} onValueChange={(v) => setFormData({ ...formData, payment_mode: v })}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="Cash">Cash</SelectItem>
                  <SelectItem value="NEFT">NEFT</SelectItem>
                  <SelectItem value="RTGS">RTGS</SelectItem>
                  <SelectItem value="Cheque">Cheque</SelectItem>
                  <SelectItem value="UPI">UPI</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="reference_no">Reference No</Label>
              <Input id="reference_no" value={formData.reference_no} onChange={(e) => setFormData({ ...formData, reference_no: e.target.value })} placeholder="NEFT123456" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="approved_by">Approved By</Label>
              <Input id="approved_by" value={formData.approved_by} onChange={(e) => setFormData({ ...formData, approved_by: e.target.value })} placeholder="Manager Name" />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="purpose">Purpose</Label>
              <Textarea id="purpose" value={formData.purpose} onChange={(e) => setFormData({ ...formData, purpose: e.target.value })} placeholder="Payment for..." rows={2} />
            </div>
            <div className="space-y-2">
              <Label>Status</Label>
              <Select value={formData.status} onValueChange={(v) => setFormData({ ...formData, status: v })}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="Pending">Pending</SelectItem>
                  <SelectItem value="Approved">Approved</SelectItem>
                  <SelectItem value="Completed">Completed</SelectItem>
                  <SelectItem value="Cancelled">Cancelled</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-4">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
            <Button type="submit" disabled={loading}>{loading ? "Saving..." : mode === "add" ? "Create Voucher" : "Save Changes"}</Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
