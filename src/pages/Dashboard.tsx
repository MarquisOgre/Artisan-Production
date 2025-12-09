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
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const stats = [
  {
    title: "Total Orders",
    value: "1,284",
    icon: Package,
    trend: { value: 12, isPositive: true },
  },
  {
    title: "In Production",
    value: "342",
    icon: Factory,
    trend: { value: 8, isPositive: true },
  },
  {
    title: "Cutting Today",
    value: "156",
    icon: Scissors,
    trend: { value: 3, isPositive: false },
  },
  {
    title: "Pending Delivery",
    value: "89",
    icon: Truck,
    trend: { value: 5, isPositive: true },
  },
];

const recentOrders = [
  { id: "ORD-001", style: "Oxford Formal", qty: 500, status: "in-progress" as const },
  { id: "ORD-002", style: "Casual Slim Fit", qty: 1200, status: "pending" as const },
  { id: "ORD-003", style: "Linen Summer", qty: 800, status: "completed" as const },
  { id: "ORD-004", style: "Denim Casual", qty: 350, status: "in-progress" as const },
  { id: "ORD-005", style: "Polo Classic", qty: 950, status: "pending" as const },
];

const quickStats = [
  { label: "Fabric in Stock", value: "24,500 mtrs", icon: TrendingUp },
  { label: "Pending Trims", value: "18 items", icon: Clock },
  { label: "Completed Today", value: "245 pcs", icon: CheckCircle2 },
  { label: "Quality Alerts", value: "3", icon: AlertCircle },
];

export default function Dashboard() {
  return (
    <div className="space-y-6">
      {/* Stats Grid */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <StatCard
            key={stat.title}
            {...stat}
          />
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
              {recentOrders.map((order) => (
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
              ))}
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
            {[
              { stage: "Fabric Sourcing", count: 12, color: "bg-chart-1" },
              { stage: "Cutting", count: 8, color: "bg-chart-2" },
              { stage: "Stitching", count: 24, color: "bg-chart-3" },
              { stage: "Finishing", count: 15, color: "bg-chart-4" },
              { stage: "QC Check", count: 6, color: "bg-chart-5" },
              { stage: "Packing", count: 18, color: "bg-accent" },
            ].map((item) => (
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
