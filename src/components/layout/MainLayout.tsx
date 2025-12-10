import { useState } from "react";
import { Outlet, useLocation } from "react-router-dom";
import { Sidebar } from "./Sidebar";
import { Header } from "./Header";

const pageTitles: Record<string, string> = {
  "/": "Dashboard",
  "/trims-register": "Trims Register",
  "/cutting-planner": "Cutting Planner",
  "/production-planner": "Production Planner",
  "/stock-register": "Stock Register",
  "/costing": "Costing",
  "/fabric-to-procure": "Fabric To Procure",
  "/delivery-challan": "Delivery Challan",
  "/invoice": "Invoice",
  "/payment-voucher": "Payment Voucher",
  "/inward-register": "Inward Register",
  "/outward-register": "Outward Register",
  "/return-register": "Return Register",
};

export function MainLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();
  const title = pageTitles[location.pathname] || "Artisan Apparels";

  return (
    <div className="min-h-screen bg-background">
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      <div className="lg:pl-64">
        <Header onMenuClick={() => setSidebarOpen(true)} title={title} />
        <main className="p-4 lg:p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
