import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Tables, TablesInsert, TablesUpdate } from "@/integrations/supabase/types";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";

type InwardRegister = Tables<"inward_register">;
type InwardRegisterInsert = TablesInsert<"inward_register">;
type InwardRegisterUpdate = TablesUpdate<"inward_register">;

export function useInwardRegister() {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  const { data = [], isLoading: loading } = useQuery({
    queryKey: ["inward_register"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("inward_register")
        .select("*")
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data as InwardRegister[];
    },
    enabled: !!user,
  });

  const addMutation = useMutation({
    mutationFn: async (entry: Omit<InwardRegisterInsert, "user_id">) => {
      if (!user) throw new Error("User not authenticated");
      const { error } = await supabase
        .from("inward_register")
        .insert({ ...entry, user_id: user.id });
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["inward_register"] });
      toast.success("Inward entry added successfully");
    },
    onError: (error) => toast.error(error.message),
  });

  const updateMutation = useMutation({
    mutationFn: async ({ id, ...entry }: InwardRegisterUpdate & { id: string }) => {
      const { error } = await supabase
        .from("inward_register")
        .update(entry)
        .eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["inward_register"] });
      toast.success("Inward entry updated successfully");
    },
    onError: (error) => toast.error(error.message),
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("inward_register").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["inward_register"] });
      toast.success("Inward entry deleted successfully");
    },
    onError: (error) => toast.error(error.message),
  });

  const addItem = (entry: Omit<InwardRegisterInsert, "user_id">) => addMutation.mutate(entry);
  const updateItem = (id: string, entry: InwardRegisterUpdate) => updateMutation.mutate({ id, ...entry });
  const deleteItem = (id: string) => deleteMutation.mutate(id);

  return { data, loading, addItem, updateItem, deleteItem };
}
