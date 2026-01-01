import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Tables, TablesInsert, TablesUpdate } from "@/integrations/supabase/types";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";

type DeliveryChallan = Tables<"delivery_challan">;
type DeliveryChallanInsert = TablesInsert<"delivery_challan">;
type DeliveryChallanUpdate = TablesUpdate<"delivery_challan">;

export function useDeliveryChallan() {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  const { data = [], isLoading: loading } = useQuery({
    queryKey: ["delivery_challan"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("delivery_challan")
        .select("*")
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data as DeliveryChallan[];
    },
    enabled: !!user,
  });

  const addMutation = useMutation({
    mutationFn: async (challan: Omit<DeliveryChallanInsert, "user_id">) => {
      if (!user) throw new Error("User not authenticated");
      const { error } = await supabase
        .from("delivery_challan")
        .insert({ ...challan, user_id: user.id });
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["delivery_challan"] });
      toast.success("Delivery challan added successfully");
    },
    onError: (error) => toast.error(error.message),
  });

  const updateMutation = useMutation({
    mutationFn: async ({ id, ...challan }: DeliveryChallanUpdate & { id: string }) => {
      const { error } = await supabase
        .from("delivery_challan")
        .update(challan)
        .eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["delivery_challan"] });
      toast.success("Delivery challan updated successfully");
    },
    onError: (error) => toast.error(error.message),
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("delivery_challan").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["delivery_challan"] });
      toast.success("Delivery challan deleted successfully");
    },
    onError: (error) => toast.error(error.message),
  });

  const addItem = (challan: Omit<DeliveryChallanInsert, "user_id">) => addMutation.mutate(challan);
  const updateItem = (id: string, challan: DeliveryChallanUpdate) => updateMutation.mutate({ id, ...challan });
  const deleteItem = (id: string) => deleteMutation.mutate(id);

  return { data, loading, addItem, updateItem, deleteItem };
}
