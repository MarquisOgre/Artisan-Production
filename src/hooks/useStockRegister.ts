import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Tables, TablesInsert, TablesUpdate } from "@/integrations/supabase/types";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";

type StockRegister = Tables<"stock_register">;
type StockRegisterInsert = TablesInsert<"stock_register">;
type StockRegisterUpdate = TablesUpdate<"stock_register">;

export function useStockRegister() {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  const { data = [], isLoading: loading } = useQuery({
    queryKey: ["stock_register"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("stock_register")
        .select("*")
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data as StockRegister[];
    },
    enabled: !!user,
  });

  const addMutation = useMutation({
    mutationFn: async (item: Omit<StockRegisterInsert, "user_id">) => {
      if (!user) throw new Error("User not authenticated");
      const { error } = await supabase
        .from("stock_register")
        .insert({ ...item, user_id: user.id });
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["stock_register"] });
      toast.success("Stock item added successfully");
    },
    onError: (error) => toast.error(error.message),
  });

  const updateMutation = useMutation({
    mutationFn: async ({ id, ...item }: StockRegisterUpdate & { id: string }) => {
      const { error } = await supabase
        .from("stock_register")
        .update(item)
        .eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["stock_register"] });
      toast.success("Stock item updated successfully");
    },
    onError: (error) => toast.error(error.message),
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("stock_register").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["stock_register"] });
      toast.success("Stock item deleted successfully");
    },
    onError: (error) => toast.error(error.message),
  });

  const addItem = (item: Omit<StockRegisterInsert, "user_id">) => addMutation.mutate(item);
  const updateItem = (id: string, item: StockRegisterUpdate) => updateMutation.mutate({ id, ...item });
  const deleteItem = (id: string) => deleteMutation.mutate(id);

  return { data, loading, addItem, updateItem, deleteItem };
}
