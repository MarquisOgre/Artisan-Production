import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Tables, TablesInsert, TablesUpdate } from "@/integrations/supabase/types";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";

type CuttingPlanner = Tables<"cutting_planner">;
type CuttingPlannerInsert = TablesInsert<"cutting_planner">;
type CuttingPlannerUpdate = TablesUpdate<"cutting_planner">;

export function useCuttingPlanner() {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  const { data = [], isLoading: loading } = useQuery({
    queryKey: ["cutting_planner"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("cutting_planner")
        .select("*")
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data as CuttingPlanner[];
    },
    enabled: !!user,
  });

  const addMutation = useMutation({
    mutationFn: async (plan: Omit<CuttingPlannerInsert, "user_id">) => {
      if (!user) throw new Error("User not authenticated");
      const { error } = await supabase
        .from("cutting_planner")
        .insert({ ...plan, user_id: user.id });
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["cutting_planner"] });
      toast.success("Cutting plan added successfully");
    },
    onError: (error) => toast.error(error.message),
  });

  const updateMutation = useMutation({
    mutationFn: async ({ id, ...plan }: CuttingPlannerUpdate & { id: string }) => {
      const { error } = await supabase
        .from("cutting_planner")
        .update(plan)
        .eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["cutting_planner"] });
      toast.success("Cutting plan updated successfully");
    },
    onError: (error) => toast.error(error.message),
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("cutting_planner").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["cutting_planner"] });
      toast.success("Cutting plan deleted successfully");
    },
    onError: (error) => toast.error(error.message),
  });

  const addPlan = (plan: Omit<CuttingPlannerInsert, "user_id">) => addMutation.mutate(plan);
  const updatePlan = (id: string, plan: CuttingPlannerUpdate) => updateMutation.mutate({ id, ...plan });
  const deletePlan = (id: string) => deleteMutation.mutate(id);

  return { data, loading, addPlan, updatePlan, deletePlan };
}
