import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Tables, TablesInsert, TablesUpdate } from "@/integrations/supabase/types";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";

type Costing = Tables<"costing">;
type CostingInsert = TablesInsert<"costing">;
type CostingUpdate = TablesUpdate<"costing">;

export function useCosting() {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  const { data = [], isLoading: loading } = useQuery({
    queryKey: ["costing"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("costing")
        .select("*")
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data as Costing[];
    },
    enabled: !!user,
  });

  const addMutation = useMutation({
    mutationFn: async (costing: Omit<CostingInsert, "user_id">) => {
      if (!user) throw new Error("User not authenticated");
      const { error } = await supabase
        .from("costing")
        .insert({ ...costing, user_id: user.id });
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["costing"] });
      toast.success("Costing added successfully");
    },
    onError: (error) => toast.error(error.message),
  });

  const updateMutation = useMutation({
    mutationFn: async ({ id, ...costing }: CostingUpdate & { id: string }) => {
      const { error } = await supabase
        .from("costing")
        .update(costing)
        .eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["costing"] });
      toast.success("Costing updated successfully");
    },
    onError: (error) => toast.error(error.message),
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("costing").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["costing"] });
      toast.success("Costing deleted successfully");
    },
    onError: (error) => toast.error(error.message),
  });

  const addItem = (costing: Omit<CostingInsert, "user_id">) => addMutation.mutate(costing);
  const updateItem = (id: string, costing: CostingUpdate) => updateMutation.mutate({ id, ...costing });
  const deleteItem = (id: string) => deleteMutation.mutate(id);

  return { data, loading, addItem, updateItem, deleteItem };
}
