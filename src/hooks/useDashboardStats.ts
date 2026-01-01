import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";

export function useDashboardStats() {
  const { user } = useAuth();

  const { data: stats, isLoading } = useQuery({
    queryKey: ["dashboard_stats"],
    queryFn: async () => {
      const [
        productionRes,
        cuttingRes,
        deliveryRes,
        stockRes,
        fabricRes,
        trimsRes,
        invoicesRes,
      ] = await Promise.all([
        supabase.from("production_planner").select("*"),
        supabase.from("cutting_planner").select("*"),
        supabase.from("delivery_challan").select("*"),
        supabase.from("stock_register").select("*"),
        supabase.from("fabric_to_procure").select("*"),
        supabase.from("trims_register").select("*"),
        supabase.from("invoices").select("*"),
      ]);

      const production = productionRes.data || [];
      const cutting = cuttingRes.data || [];
      const delivery = deliveryRes.data || [];
      const stock = stockRes.data || [];
      const fabric = fabricRes.data || [];
      const trims = trimsRes.data || [];
      const invoices = invoicesRes.data || [];

      // Calculate stats
      const totalOrders = production.length;
      const inProduction = production.filter(p => p.status === "In Progress").length;
      const cuttingToday = cutting.filter(c => {
        const today = new Date().toISOString().split('T')[0];
        return c.cut_date === today;
      }).length;
      const pendingDelivery = delivery.filter(d => d.status === "Pending").length;

      // Calculate fabric in stock
      const totalFabricReceived = fabric.reduce((sum, f) => sum + (f.received_qty || 0), 0);

      // Calculate pending trims
      const pendingTrims = trims.filter(t => t.status === "Low Stock" || t.quantity === 0).length;

      // Calculate completed production
      const completedQty = production.reduce((sum, p) => sum + (p.completed_qty || 0), 0);

      // Calculate low stock alerts
      const lowStockAlerts = stock.filter(s => 
        s.current_stock !== null && 
        s.min_stock !== null && 
        s.current_stock <= s.min_stock
      ).length;

      // Recent orders (last 5 production plans)
      const recentOrders = production.slice(0, 5).map(p => ({
        id: p.order_no,
        style: p.style || "N/A",
        qty: p.target_qty || 0,
        status: (p.status === "Completed" ? "completed" : 
                p.status === "In Progress" ? "in-progress" : "pending") as "completed" | "in-progress" | "pending",
      }));

      // Production pipeline stats
      const fabricSourcing = fabric.filter(f => f.status === "Pending" || f.status === "Ordered").length;
      const cuttingCount = cutting.filter(c => c.status === "Pending" || c.status === "In Progress").length;
      const stitching = production.filter(p => p.status === "In Progress").length;
      const finishing = production.filter(p => p.status === "Finishing").length;
      const qcCheck = production.filter(p => p.status === "QC").length;
      const packing = delivery.filter(d => d.status === "Pending").length;

      return {
        totalOrders,
        inProduction,
        cuttingToday,
        pendingDelivery,
        fabricInStock: `${totalFabricReceived.toLocaleString()} mtrs`,
        pendingTrims: `${pendingTrims} items`,
        completedToday: `${completedQty} pcs`,
        qualityAlerts: lowStockAlerts.toString(),
        recentOrders,
        pipeline: {
          fabricSourcing,
          cutting: cuttingCount,
          stitching,
          finishing,
          qcCheck,
          packing,
        },
      };
    },
    enabled: !!user,
  });

  return { stats, isLoading };
}
