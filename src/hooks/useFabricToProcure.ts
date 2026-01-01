import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Tables, TablesInsert, TablesUpdate } from "@/integrations/supabase/types";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";

type FabricToProcure = Tables<"fabric_to_procure">;
type FabricToProcureInsert = TablesInsert<"fabric_to_procure">;
type FabricToProcureUpdate = TablesUpdate<"fabric_to_procure">;

export function useFabricToProcure() {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  const { data = [], isLoading: loading } = useQuery({
    queryKey: ["fabric_to_procure"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("fabric_to_procure")
        .select("*")
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data as FabricToProcure[];
    },
    enabled: !!user,
  });

  const addMutation = useMutation({
    mutationFn: async (item: Omit<FabricToProcureInsert, "user_id">) => {
      if (!user) throw new Error("User not authenticated");
      const { error } = await supabase
        .from("fabric_to_procure")
        .insert({ ...item, user_id: user.id });
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["fabric_to_procure"] });
      toast.success("Fabric item added successfully");
    },
    onError: (error) => toast.error(error.message),
  });

  const updateMutation = useMutation({
    mutationFn: async ({ id, ...item }: FabricToProcureUpdate & { id: string }) => {
      const { error } = await supabase
        .from("fabric_to_procure")
        .update(item)
        .eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["fabric_to_procure"] });
      toast.success("Fabric item updated successfully");
    },
    onError: (error) => toast.error(error.message),
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("fabric_to_procure").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["fabric_to_procure"] });
      toast.success("Fabric item deleted successfully");
    },
    onError: (error) => toast.error(error.message),
  });

  const addItem = (item: Omit<FabricToProcureInsert, "user_id">) => addMutation.mutate(item);
  const updateItem = (id: string, item: FabricToProcureUpdate) => updateMutation.mutate({ id, ...item });
  const deleteItem = (id: string) => deleteMutation.mutate(id);

  return { data, loading, addItem, updateItem, deleteItem };
}
