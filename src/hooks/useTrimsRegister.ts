import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Tables, TablesInsert, TablesUpdate } from "@/integrations/supabase/types";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";

type TrimsRegister = Tables<"trims_register">;
type TrimsRegisterInsert = TablesInsert<"trims_register">;
type TrimsRegisterUpdate = TablesUpdate<"trims_register">;

export function useTrimsRegister() {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  const { data = [], isLoading: loading } = useQuery({
    queryKey: ["trims_register"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("trims_register")
        .select("*")
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data as TrimsRegister[];
    },
    enabled: !!user,
  });

  const addMutation = useMutation({
    mutationFn: async (trim: Omit<TrimsRegisterInsert, "user_id">) => {
      if (!user) throw new Error("User not authenticated");
      const { error } = await supabase
        .from("trims_register")
        .insert({ ...trim, user_id: user.id });
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["trims_register"] });
      toast.success("Trim added successfully");
    },
    onError: (error) => toast.error(error.message),
  });

  const updateMutation = useMutation({
    mutationFn: async ({ id, ...trim }: TrimsRegisterUpdate & { id: string }) => {
      const { error } = await supabase
        .from("trims_register")
        .update(trim)
        .eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["trims_register"] });
      toast.success("Trim updated successfully");
    },
    onError: (error) => toast.error(error.message),
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("trims_register").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["trims_register"] });
      toast.success("Trim deleted successfully");
    },
    onError: (error) => toast.error(error.message),
  });

  const addItem = (trim: Omit<TrimsRegisterInsert, "user_id">) => addMutation.mutate(trim);
  const updateItem = (id: string, trim: TrimsRegisterUpdate) => updateMutation.mutate({ id, ...trim });
  const deleteItem = (id: string) => deleteMutation.mutate(id);

  return { data, loading, addItem, updateItem, deleteItem };
}
