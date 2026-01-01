import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Tables, TablesInsert, TablesUpdate } from "@/integrations/supabase/types";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";

type Invoice = Tables<"invoices">;
type InvoiceInsert = TablesInsert<"invoices">;
type InvoiceUpdate = TablesUpdate<"invoices">;

export function useInvoice() {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  const { data = [], isLoading: loading } = useQuery({
    queryKey: ["invoices"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("invoices")
        .select("*")
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data as Invoice[];
    },
    enabled: !!user,
  });

  const addMutation = useMutation({
    mutationFn: async (invoice: Omit<InvoiceInsert, "user_id">) => {
      if (!user) throw new Error("User not authenticated");
      const { error } = await supabase
        .from("invoices")
        .insert({ ...invoice, user_id: user.id });
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["invoices"] });
      toast.success("Invoice added successfully");
    },
    onError: (error) => toast.error(error.message),
  });

  const updateMutation = useMutation({
    mutationFn: async ({ id, ...invoice }: InvoiceUpdate & { id: string }) => {
      const { error } = await supabase
        .from("invoices")
        .update(invoice)
        .eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["invoices"] });
      toast.success("Invoice updated successfully");
    },
    onError: (error) => toast.error(error.message),
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("invoices").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["invoices"] });
      toast.success("Invoice deleted successfully");
    },
    onError: (error) => toast.error(error.message),
  });

  const addItem = (invoice: Omit<InvoiceInsert, "user_id">) => addMutation.mutate(invoice);
  const updateItem = (id: string, invoice: InvoiceUpdate) => updateMutation.mutate({ id, ...invoice });
  const deleteItem = (id: string) => deleteMutation.mutate(id);

  return { data, loading, addItem, updateItem, deleteItem };
}
