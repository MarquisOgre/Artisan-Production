import { StatCard } from "@/components/ui/StatCard";
import { StatusBadge } from "@/components/ui/StatusBadge";
import {
  Package,
  Scissors,
  Factory,
  Truck,
  TrendingUp,
  Clock,
  CheckCircle2,
  AlertCircle,
  Loader2,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useDashboardStats } from "@/hooks/useDashboardStats";

export default function Dashboard() {
  const { stats, isLoading } = useDashboardStats();

  if (isLoading) {
    return (
      <div className="flex h-96 items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  const statCards = [
    {
      title: "Total Orders",
      value: stats?.totalOrders || 0,
      icon: Package,
    },
    {
      title: "In Production",
      value: stats?.inProduction || 0,
      icon: Factory,
    },
    {
      title: "Cutting Today",
      value: stats?.cuttingToday || 0,
      icon: Scissors,
    },
    {
      title: "Pending Delivery",
      value: stats?.pendingDelivery || 0,
      icon: Truck,
    },
  ];

  const quickStats = [
    { label: "Fabric in Stock", value: stats?.fabricInStock || "0 mtrs", icon: TrendingUp },
    { label: "Pending Trims", value: stats?.pendingTrims || "0 items", icon: Clock },
    { label: "Completed Qty", value: stats?.completedToday || "0 pcs", icon: CheckCircle2 },
    { label: "Low Stock Alerts", value: stats?.qualityAlerts || "0", icon: AlertCircle },
  ];

  const pipelineStages = [
    { stage: "Fabric Sourcing", count: stats?.pipeline?.fabricSourcing || 0, color: "bg-chart-1" },
    { stage: "Cutting", count: stats?.pipeline?.cutting || 0, color: "bg-chart-2" },
    { stage: "Stitching", count: stats?.pipeline?.stitching || 0, color: "bg-chart-3" },
    { stage: "Finishing", count: stats?.pipeline?.finishing || 0, color: "bg-chart-4" },
    { stage: "QC Check", count: stats?.pipeline?.qcCheck || 0, color: "bg-chart-5" },
    { stage: "Packing", count: stats?.pipeline?.packing || 0, color: "bg-accent" },
  ];

  return (
    <div className="space-y-6">
      {/* Stats Grid */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {statCards.map((stat) => (
          <StatCard key={stat.title} {...stat} />
        ))}
      </div>

      {/* Main Content Grid */}
      <div className="grid gap-6 lg:grid-cols-3">
        {/* Recent Orders */}
        <Card className="lg:col-span-2 animate-fade-in">
          <CardHeader>
            <CardTitle className="text-lg font-semibold">Recent Orders</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {stats?.recentOrders && stats.recentOrders.length > 0 ? (
                stats.recentOrders.map((order) => (
                  <div
                    key={order.id}
                    className="flex items-center justify-between rounded-lg border border-border bg-muted/30 p-3 transition-colors hover:bg-muted/50"
                  >
                    <div className="flex items-center gap-4">
                      <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                        <Package className="h-5 w-5 text-primary" />
                      </div>
                      <div>
                        <p className="font-medium text-foreground">{order.id}</p>
                        <p className="text-sm text-muted-foreground">{order.style}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <span className="text-sm font-medium text-foreground">
                        {order.qty} pcs
                      </span>
                      <StatusBadge status={order.status} />
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-center text-muted-foreground py-8">
                  No orders yet. Create your first production plan to get started.
                </p>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Quick Stats */}
        <Card className="animate-fade-in">
          <CardHeader>
            <CardTitle className="text-lg font-semibold">Quick Overview</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {quickStats.map((stat) => (
                <div
                  key={stat.label}
                  className="flex items-center justify-between rounded-lg border border-border p-3"
                >
                  <div className="flex items-center gap-3">
                    <stat.icon className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm text-muted-foreground">{stat.label}</span>
                  </div>
                  <span className="font-semibold text-foreground">{stat.value}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Production Timeline */}
      <Card className="animate-fade-in">
        <CardHeader>
          <CardTitle className="text-lg font-semibold">Production Pipeline</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-4">
            {pipelineStages.map((item) => (
              <div
                key={item.stage}
                className="flex items-center gap-3 rounded-lg border border-border bg-card p-4 flex-1 min-w-[150px]"
              >
                <div className={`h-3 w-3 rounded-full ${item.color}`} />
                <div>
                  <p className="text-sm font-medium text-foreground">{item.stage}</p>
                  <p className="text-xs text-muted-foreground">{item.count} orders</p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
