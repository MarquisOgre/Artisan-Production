import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { CalendarIcon, Plus, Trash2 } from "lucide-react";
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

interface InvoiceItem {
  sl_no: number;
  particulars: string;
  hsn_code: string;
  qty: number;
  rate: number;
  amount: number;
}

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
  onSubmit: (data: FormData) => Promise<void>;
  initialData?: Partial<FormData>;
  mode: "add" | "edit";
}

const emptyItem = (): InvoiceItem => ({
  sl_no: 1,
  particulars: "",
  hsn_code: "",
  qty: 0,
  rate: 0,
  amount: 0,
});

export function InvoiceFormDialog({ open, onOpenChange, onSubmit, initialData, mode }: InvoiceFormDialogProps) {
  const parseItems = (items: Json | undefined): InvoiceItem[] => {
    if (!items || !Array.isArray(items) || items.length === 0) {
      return [emptyItem()];
    }
    return items.map((item: any, index: number) => ({
      sl_no: index + 1,
      particulars: item.particulars || "",
      hsn_code: item.hsn_code || "",
      qty: Number(item.qty) || 0,
      rate: Number(item.rate) || 0,
      amount: Number(item.amount) || 0,
    }));
  };

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

  const [items, setItems] = useState<InvoiceItem[]>(parseItems(initialData?.items));
  const [invoiceDate, setInvoiceDate] = useState<Date | undefined>(initialData?.invoice_date ? new Date(initialData.invoice_date) : new Date());
  const [dueDate, setDueDate] = useState<Date | undefined>(initialData?.due_date ? new Date(initialData.due_date) : undefined);
  const [taxPercent, setTaxPercent] = useState<number>(initialData?.subtotal && initialData.subtotal > 0 ? Math.round((initialData.tax_amount || 0) / initialData.subtotal * 100) : 18);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);

  // Reset form when dialog opens with new data
  useEffect(() => {
    if (open) {
      setFormData({
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
      setItems(parseItems(initialData?.items));
      setInvoiceDate(initialData?.invoice_date ? new Date(initialData.invoice_date) : new Date());
      setDueDate(initialData?.due_date ? new Date(initialData.due_date) : undefined);
      setTaxPercent(initialData?.subtotal && initialData.subtotal > 0 ? Math.round((initialData.tax_amount || 0) / initialData.subtotal * 100) : 18);
      setErrors({});
    }
  }, [open, initialData]);

  // Calculate totals when items or tax changes
  useEffect(() => {
    const subtotal = items.reduce((sum, item) => sum + item.amount, 0);
    const taxAmount = Math.round(subtotal * taxPercent / 100 * 100) / 100;
    const totalAmount = subtotal + taxAmount;
    const balance = totalAmount - formData.paid_amount;

    setFormData(prev => ({
      ...prev,
      subtotal,
      tax_amount: taxAmount,
      total_amount: totalAmount,
      balance,
    }));
  }, [items, taxPercent, formData.paid_amount]);

  const updateItem = (index: number, field: keyof InvoiceItem, value: string | number) => {
    setItems(prev => {
      const updated = [...prev];
      updated[index] = { ...updated[index], [field]: value };
      // Auto-calculate amount
      if (field === "qty" || field === "rate") {
        updated[index].amount = updated[index].qty * updated[index].rate;
      }
      return updated;
    });
  };

  const addItem = () => {
    setItems(prev => [...prev, { ...emptyItem(), sl_no: prev.length + 1 }]);
  };

  const removeItem = (index: number) => {
    if (items.length === 1) return;
    setItems(prev => prev.filter((_, i) => i !== index).map((item, i) => ({ ...item, sl_no: i + 1 })));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});

    const subtotal = items.reduce((sum, item) => sum + item.amount, 0);
    const taxAmount = Math.round(subtotal * taxPercent / 100 * 100) / 100;
    const totalAmount = subtotal + taxAmount;
    const balance = totalAmount - formData.paid_amount;

    const dataToSubmit: FormData = {
      ...formData,
      invoice_date: invoiceDate ? format(invoiceDate, "yyyy-MM-dd") : format(new Date(), "yyyy-MM-dd"),
      due_date: dueDate ? format(dueDate, "yyyy-MM-dd") : "",
      items: items as unknown as Json,
      subtotal,
      tax_amount: taxAmount,
      total_amount: totalAmount,
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

    // Validate at least one item with particulars
    if (!items.some(item => item.particulars.trim())) {
      setErrors({ items: "At least one item is required" });
      return;
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
      <DialogContent className="sm:max-w-[800px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{mode === "add" ? "Create Invoice" : "Edit Invoice"}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Header Section */}
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

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="customer">Customer *</Label>
              <Input id="customer" value={formData.customer} onChange={(e) => setFormData({ ...formData, customer: e.target.value })} placeholder="Fashion Retail Co." />
              {errors.customer && <p className="text-xs text-destructive">{errors.customer}</p>}
            </div>
            <div className="space-y-2">
              <Label htmlFor="customer_address">Customer Address</Label>
              <Input id="customer_address" value={formData.customer_address} onChange={(e) => setFormData({ ...formData, customer_address: e.target.value })} placeholder="Full address..." />
            </div>
          </div>

          {/* Items Section */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label className="text-base font-semibold">Invoice Items</Label>
              <Button type="button" variant="outline" size="sm" onClick={addItem}>
                <Plus className="h-4 w-4 mr-1" /> Add Item
              </Button>
            </div>
            {errors.items && <p className="text-xs text-destructive">{errors.items}</p>}
            
            <div className="border rounded-md overflow-hidden">
              <div className="bg-muted px-3 py-2 grid grid-cols-12 gap-2 text-xs font-medium">
                <div className="col-span-1">SL.No</div>
                <div className="col-span-4">Particulars</div>
                <div className="col-span-2">HSN Code</div>
                <div className="col-span-1">Qty</div>
                <div className="col-span-2">Rate (₹)</div>
                <div className="col-span-1">Amount</div>
                <div className="col-span-1"></div>
              </div>
              
              <div className="divide-y">
                {items.map((item, index) => (
                  <div key={index} className="px-3 py-2 grid grid-cols-12 gap-2 items-center">
                    <div className="col-span-1 text-sm text-muted-foreground">{item.sl_no}</div>
                    <div className="col-span-4">
                      <Input
                        value={item.particulars}
                        onChange={(e) => updateItem(index, "particulars", e.target.value)}
                        placeholder="Item description"
                        className="h-8 text-sm"
                      />
                    </div>
                    <div className="col-span-2">
                      <Input
                        value={item.hsn_code}
                        onChange={(e) => updateItem(index, "hsn_code", e.target.value)}
                        placeholder="HSN"
                        className="h-8 text-sm"
                      />
                    </div>
                    <div className="col-span-1">
                      <Input
                        type="number"
                        value={item.qty || ""}
                        onChange={(e) => updateItem(index, "qty", Number(e.target.value))}
                        className="h-8 text-sm"
                        min={0}
                      />
                    </div>
                    <div className="col-span-2">
                      <Input
                        type="number"
                        step="0.01"
                        value={item.rate || ""}
                        onChange={(e) => updateItem(index, "rate", Number(e.target.value))}
                        className="h-8 text-sm"
                        min={0}
                      />
                    </div>
                    <div className="col-span-1 text-sm font-medium">
                      ₹{item.amount.toLocaleString()}
                    </div>
                    <div className="col-span-1">
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-destructive"
                        onClick={() => removeItem(index)}
                        disabled={items.length === 1}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Totals Section */}
          <div className="flex justify-end">
            <div className="w-72 space-y-2">
              <div className="flex justify-between text-sm">
                <span>Subtotal:</span>
                <span className="font-medium">₹{formData.subtotal.toLocaleString()}</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-2">
                  <span>Tax</span>
                  <Input
                    type="number"
                    value={taxPercent}
                    onChange={(e) => setTaxPercent(Number(e.target.value))}
                    className="h-7 w-16 text-sm"
                    min={0}
                    max={100}
                  />
                  <span>%:</span>
                </div>
                <span className="font-medium">₹{formData.tax_amount.toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-sm font-semibold border-t pt-2">
                <span>Total Amount:</span>
                <span>₹{formData.total_amount.toLocaleString()}</span>
              </div>
            </div>
          </div>

          {/* Payment Section */}
          <div className="grid grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="paid_amount">Paid Amount (₹)</Label>
              <Input 
                id="paid_amount" 
                type="number" 
                step="0.01" 
                value={formData.paid_amount || ""} 
                onChange={(e) => setFormData({ ...formData, paid_amount: Number(e.target.value) })} 
              />
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

          <div className="bg-muted/50 p-3 rounded-md flex justify-between items-center">
            <span className="font-medium">Balance Due:</span>
            <span className={cn("text-lg font-bold", formData.balance > 0 ? "text-yellow-600" : "text-green-600")}>
              ₹{formData.balance.toLocaleString()}
            </span>
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
