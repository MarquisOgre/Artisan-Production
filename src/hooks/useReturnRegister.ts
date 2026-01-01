import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Tables, TablesInsert, TablesUpdate } from "@/integrations/supabase/types";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";

type ReturnRegister = Tables<"return_register">;
type ReturnRegisterInsert = TablesInsert<"return_register">;
type ReturnRegisterUpdate = TablesUpdate<"return_register">;

export function useReturnRegister() {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  const { data = [], isLoading: loading } = useQuery({
    queryKey: ["return_register"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("return_register")
        .select("*")
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data as ReturnRegister[];
    },
    enabled: !!user,
  });

  const addMutation = useMutation({
    mutationFn: async (returnItem: Omit<ReturnRegisterInsert, "user_id">) => {
      if (!user) throw new Error("User not authenticated");
      const { error } = await supabase
        .from("return_register")
        .insert({ ...returnItem, user_id: user.id });
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["return_register"] });
      toast.success("Return entry added successfully");
    },
    onError: (error) => toast.error(error.message),
  });

  const updateMutation = useMutation({
    mutationFn: async ({ id, ...returnItem }: ReturnRegisterUpdate & { id: string }) => {
      const { error } = await supabase
        .from("return_register")
        .update(returnItem)
        .eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["return_register"] });
      toast.success("Return entry updated successfully");
    },
    onError: (error) => toast.error(error.message),
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("return_register").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["return_register"] });
      toast.success("Return entry deleted successfully");
    },
    onError: (error) => toast.error(error.message),
  });

  const addItem = (returnItem: Omit<ReturnRegisterInsert, "user_id">) => addMutation.mutate(returnItem);
  const updateItem = (id: string, returnItem: ReturnRegisterUpdate) => updateMutation.mutate({ id, ...returnItem });
  const deleteItem = (id: string) => deleteMutation.mutate(id);

  return { data, loading, addItem, updateItem, deleteItem };
}
