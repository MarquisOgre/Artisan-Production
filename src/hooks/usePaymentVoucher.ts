import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Tables, TablesInsert, TablesUpdate } from "@/integrations/supabase/types";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";

type PaymentVoucher = Tables<"payment_voucher">;
type PaymentVoucherInsert = TablesInsert<"payment_voucher">;
type PaymentVoucherUpdate = TablesUpdate<"payment_voucher">;

export function usePaymentVoucher() {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  const { data = [], isLoading: loading } = useQuery({
    queryKey: ["payment_voucher"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("payment_voucher")
        .select("*")
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data as PaymentVoucher[];
    },
    enabled: !!user,
  });

  const addMutation = useMutation({
    mutationFn: async (voucher: Omit<PaymentVoucherInsert, "user_id">) => {
      if (!user) throw new Error("User not authenticated");
      const { error } = await supabase
        .from("payment_voucher")
        .insert({ ...voucher, user_id: user.id });
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["payment_voucher"] });
      toast.success("Payment voucher added successfully");
    },
    onError: (error) => toast.error(error.message),
  });

  const updateMutation = useMutation({
    mutationFn: async ({ id, ...voucher }: PaymentVoucherUpdate & { id: string }) => {
      const { error } = await supabase
        .from("payment_voucher")
        .update(voucher)
        .eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["payment_voucher"] });
      toast.success("Payment voucher updated successfully");
    },
    onError: (error) => toast.error(error.message),
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("payment_voucher").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["payment_voucher"] });
      toast.success("Payment voucher deleted successfully");
    },
    onError: (error) => toast.error(error.message),
  });

  const addItem = (voucher: Omit<PaymentVoucherInsert, "user_id">) => addMutation.mutate(voucher);
  const updateItem = (id: string, voucher: PaymentVoucherUpdate) => updateMutation.mutate({ id, ...voucher });
  const deleteItem = (id: string) => deleteMutation.mutate(id);

  return { data, loading, addItem, updateItem, deleteItem };
}
