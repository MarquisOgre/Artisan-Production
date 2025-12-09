import { NavLink } from "react-router-dom";
import { cn } from "@/lib/utils";
import {
  LayoutDashboard,
  Scissors,
  ClipboardList,
  Factory,
  Package,
  Calculator,
  Truck,
  FileText,
  Receipt,
  CreditCard,
  ArrowDownToLine,
  ArrowUpFromLine,
  RotateCcw,
  Shirt,
  X,
} from "lucide-react";

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

const menuItems = [
  { path: "/", icon: LayoutDashboard, label: "Dashboard" },
  { path: "/trims-register", icon: Scissors, label: "Trims Register" },
  { path: "/cutting-planner", icon: ClipboardList, label: "Cutting Planner" },
  { path: "/production-planner", icon: Factory, label: "Production Planner" },
  { path: "/stock-register", icon: Package, label: "Stock Register" },
  { path: "/costing", icon: Calculator, label: "Costing" },
  { path: "/fabric-to-procure", icon: Truck, label: "Fabric To Procure" },
  { path: "/delivery-challan", icon: FileText, label: "Delivery Challan" },
  { path: "/invoice", icon: Receipt, label: "Invoice" },
  { path: "/payment-voucher", icon: CreditCard, label: "Payment Voucher" },
  { path: "/inward-register", icon: ArrowDownToLine, label: "Inward Register" },
  { path: "/outward-register", icon: ArrowUpFromLine, label: "Outward Register" },
  { path: "/return-register", icon: RotateCcw, label: "Return Register" },
];

export function Sidebar({ isOpen, onClose }: SidebarProps) {
  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-foreground/20 backdrop-blur-sm lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <aside
        className={cn(
          "fixed left-0 top-0 z-50 h-screen w-64 bg-sidebar transition-transform duration-300 lg:translate-x-0",
          isOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        <div className="flex h-full flex-col">
          {/* Logo */}
          <div className="flex h-16 items-center justify-between border-b border-sidebar-border px-4">
            <div className="flex items-center gap-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-sidebar-primary">
                <Shirt className="h-5 w-5 text-sidebar-primary-foreground" />
              </div>
              <span className="text-lg font-semibold text-sidebar-foreground">
                ShirtMFG
              </span>
            </div>
            <button
              onClick={onClose}
              className="rounded-lg p-1.5 text-sidebar-foreground/70 hover:bg-sidebar-accent hover:text-sidebar-foreground lg:hidden"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* Navigation */}
          <nav className="flex-1 overflow-y-auto p-3">
            <ul className="space-y-1">
              {menuItems.map((item) => (
                <li key={item.path}>
                  <NavLink
                    to={item.path}
                    onClick={onClose}
                    className={({ isActive }) =>
                      cn(
                        "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
                        isActive
                          ? "bg-sidebar-primary text-sidebar-primary-foreground"
                          : "text-sidebar-foreground/80 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
                      )
                    }
                  >
                    <item.icon className="h-4.5 w-4.5 shrink-0" />
                    <span>{item.label}</span>
                  </NavLink>
                </li>
              ))}
            </ul>
          </nav>

          {/* Footer */}
          <div className="border-t border-sidebar-border p-4">
            <p className="text-xs text-sidebar-foreground/50">
              © 2024 ShirtMFG Pro
            </p>
          </div>
        </div>
      </aside>
    </>
  );
}
