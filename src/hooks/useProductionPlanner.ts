import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Tables, TablesInsert, TablesUpdate } from "@/integrations/supabase/types";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";

type ProductionPlanner = Tables<"production_planner">;
type ProductionPlannerInsert = TablesInsert<"production_planner">;
type ProductionPlannerUpdate = TablesUpdate<"production_planner">;

export function useProductionPlanner() {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  const { data = [], isLoading: loading } = useQuery({
    queryKey: ["production_planner"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("production_planner")
        .select("*")
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data as ProductionPlanner[];
    },
    enabled: !!user,
  });

  const addMutation = useMutation({
    mutationFn: async (plan: Omit<ProductionPlannerInsert, "user_id">) => {
      if (!user) throw new Error("User not authenticated");
      const { error } = await supabase
        .from("production_planner")
        .insert({ ...plan, user_id: user.id });
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["production_planner"] });
      toast.success("Production plan added successfully");
    },
    onError: (error) => toast.error(error.message),
  });

  const updateMutation = useMutation({
    mutationFn: async ({ id, ...plan }: ProductionPlannerUpdate & { id: string }) => {
      const { error } = await supabase
        .from("production_planner")
        .update(plan)
        .eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["production_planner"] });
      toast.success("Production plan updated successfully");
    },
    onError: (error) => toast.error(error.message),
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("production_planner").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["production_planner"] });
      toast.success("Production plan deleted successfully");
    },
    onError: (error) => toast.error(error.message),
  });

  const addPlan = (plan: Omit<ProductionPlannerInsert, "user_id">) => addMutation.mutate(plan);
  const updatePlan = (id: string, plan: ProductionPlannerUpdate) => updateMutation.mutate({ id, ...plan });
  const deletePlan = (id: string) => deleteMutation.mutate(id);

  return { data, loading, addPlan, updatePlan, deletePlan };
}
