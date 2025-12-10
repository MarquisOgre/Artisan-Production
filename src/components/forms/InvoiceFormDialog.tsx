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
  invoice_no: z.string().min(1, "Invoice No is required").max(50),
  customer: z.string().min(1, "Customer is required").max(100),
  total_amount: z.number().min(0),
  paid_amount: z.number().min(0),
  status: z.string(),
});

interface FormData {
  invoice_no: string;
  invoice_date: string;
  customer: string;
  customer_address: string;
  items: Json;
  subtotal: number;
  tax_amount: number;
  total_amount: number;
  paid_amount: number;
  balance: number;
  due_date: string;
  status: string;
}

interface InvoiceFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (data: FormData) => Promise<{ error: Error | null }>;
  initialData?: Partial<FormData>;
  mode: "add" | "edit";
}

export function InvoiceFormDialog({ open, onOpenChange, onSubmit, initialData, mode }: InvoiceFormDialogProps) {
  const [formData, setFormData] = useState<FormData>({
    invoice_no: initialData?.invoice_no || "",
    invoice_date: initialData?.invoice_date || format(new Date(), "yyyy-MM-dd"),
    customer: initialData?.customer || "",
    customer_address: initialData?.customer_address || "",
    items: initialData?.items || [],
    subtotal: initialData?.subtotal || 0,
    tax_amount: initialData?.tax_amount || 0,
    total_amount: initialData?.total_amount || 0,
    paid_amount: initialData?.paid_amount || 0,
    balance: initialData?.balance || 0,
    due_date: initialData?.due_date || "",
    status: initialData?.status || "Unpaid",
  });
  const [invoiceDate, setInvoiceDate] = useState<Date | undefined>(initialData?.invoice_date ? new Date(initialData.invoice_date) : new Date());
  const [dueDate, setDueDate] = useState<Date | undefined>(initialData?.due_date ? new Date(initialData.due_date) : undefined);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});

    const balance = formData.total_amount - formData.paid_amount;
    const dataToSubmit = {
      ...formData,
      invoice_date: invoiceDate ? format(invoiceDate, "yyyy-MM-dd") : format(new Date(), "yyyy-MM-dd"),
      due_date: dueDate ? format(dueDate, "yyyy-MM-dd") : "",
      balance,
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
    const { error } = await onSubmit(dataToSubmit);
    setLoading(false);

    if (!error) onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[550px]">
        <DialogHeader>
          <DialogTitle>{mode === "add" ? "Create Invoice" : "Edit Invoice"}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="invoice_no">Invoice No *</Label>
              <Input id="invoice_no" value={formData.invoice_no} onChange={(e) => setFormData({ ...formData, invoice_no: e.target.value })} placeholder="INV/2024/001" />
              {errors.invoice_no && <p className="text-xs text-destructive">{errors.invoice_no}</p>}
            </div>
            <div className="space-y-2">
              <Label>Invoice Date</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="outline" className={cn("w-full justify-start text-left font-normal", !invoiceDate && "text-muted-foreground")}>
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {invoiceDate ? format(invoiceDate, "PPP") : "Pick a date"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar mode="single" selected={invoiceDate} onSelect={setInvoiceDate} initialFocus className="pointer-events-auto" />
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
            <Label htmlFor="customer_address">Customer Address</Label>
            <Textarea id="customer_address" value={formData.customer_address} onChange={(e) => setFormData({ ...formData, customer_address: e.target.value })} placeholder="Full address..." rows={2} />
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="subtotal">Subtotal (₹)</Label>
              <Input id="subtotal" type="number" step="0.01" value={formData.subtotal} onChange={(e) => setFormData({ ...formData, subtotal: Number(e.target.value) })} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="tax_amount">Tax Amount (₹)</Label>
              <Input id="tax_amount" type="number" step="0.01" value={formData.tax_amount} onChange={(e) => setFormData({ ...formData, tax_amount: Number(e.target.value) })} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="total_amount">Total Amount (₹)</Label>
              <Input id="total_amount" type="number" step="0.01" value={formData.total_amount} onChange={(e) => setFormData({ ...formData, total_amount: Number(e.target.value) })} />
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="paid_amount">Paid Amount (₹)</Label>
              <Input id="paid_amount" type="number" step="0.01" value={formData.paid_amount} onChange={(e) => setFormData({ ...formData, paid_amount: Number(e.target.value) })} />
            </div>
            <div className="space-y-2">
              <Label>Due Date</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="outline" className={cn("w-full justify-start text-left font-normal", !dueDate && "text-muted-foreground")}>
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {dueDate ? format(dueDate, "PPP") : "Pick a date"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar mode="single" selected={dueDate} onSelect={setDueDate} initialFocus className="pointer-events-auto" />
                </PopoverContent>
              </Popover>
            </div>
            <div className="space-y-2">
              <Label>Status</Label>
              <Select value={formData.status} onValueChange={(v) => setFormData({ ...formData, status: v })}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="Unpaid">Unpaid</SelectItem>
                  <SelectItem value="Partial">Partial</SelectItem>
                  <SelectItem value="Paid">Paid</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-4">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
            <Button type="submit" disabled={loading}>{loading ? "Saving..." : mode === "add" ? "Create Invoice" : "Save Changes"}</Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
