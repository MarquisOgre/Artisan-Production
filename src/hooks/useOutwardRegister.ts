import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Tables, TablesInsert, TablesUpdate } from "@/integrations/supabase/types";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";

type OutwardRegister = Tables<"outward_register">;
type OutwardRegisterInsert = TablesInsert<"outward_register">;
type OutwardRegisterUpdate = TablesUpdate<"outward_register">;

export function useOutwardRegister() {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  const { data = [], isLoading: loading } = useQuery({
    queryKey: ["outward_register"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("outward_register")
        .select("*")
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data as OutwardRegister[];
    },
    enabled: !!user,
  });

  const addMutation = useMutation({
    mutationFn: async (entry: Omit<OutwardRegisterInsert, "user_id">) => {
      if (!user) throw new Error("User not authenticated");
      const { error } = await supabase
        .from("outward_register")
        .insert({ ...entry, user_id: user.id });
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["outward_register"] });
      toast.success("Outward entry added successfully");
    },
    onError: (error) => toast.error(error.message),
  });

  const updateMutation = useMutation({
    mutationFn: async ({ id, ...entry }: OutwardRegisterUpdate & { id: string }) => {
      const { error } = await supabase
        .from("outward_register")
        .update(entry)
        .eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["outward_register"] });
      toast.success("Outward entry updated successfully");
    },
    onError: (error) => toast.error(error.message),
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("outward_register").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["outward_register"] });
      toast.success("Outward entry deleted successfully");
    },
    onError: (error) => toast.error(error.message),
  });

  const addItem = (entry: Omit<OutwardRegisterInsert, "user_id">) => addMutation.mutate(entry);
  const updateItem = (id: string, entry: OutwardRegisterUpdate) => updateMutation.mutate({ id, ...entry });
  const deleteItem = (id: string) => deleteMutation.mutate(id);

  return { data, loading, addItem, updateItem, deleteItem };
}
