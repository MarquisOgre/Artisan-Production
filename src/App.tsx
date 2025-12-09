import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { MainLayout } from "@/components/layout/MainLayout";
import Dashboard from "./pages/Dashboard";
import TrimsRegister from "./pages/TrimsRegister";
import CuttingPlanner from "./pages/CuttingPlanner";
import ProductionPlanner from "./pages/ProductionPlanner";
import StockRegister from "./pages/StockRegister";
import Costing from "./pages/Costing";
import FabricToProcure from "./pages/FabricToProcure";
import DeliveryChallan from "./pages/DeliveryChallan";
import Invoice from "./pages/Invoice";
import PaymentVoucher from "./pages/PaymentVoucher";
import InwardRegister from "./pages/InwardRegister";
import OutwardRegister from "./pages/OutwardRegister";
import ReturnRegister from "./pages/ReturnRegister";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route element={<MainLayout />}>
            <Route path="/" element={<Dashboard />} />
            <Route path="/trims-register" element={<TrimsRegister />} />
            <Route path="/cutting-planner" element={<CuttingPlanner />} />
            <Route path="/production-planner" element={<ProductionPlanner />} />
            <Route path="/stock-register" element={<StockRegister />} />
            <Route path="/costing" element={<Costing />} />
            <Route path="/fabric-to-procure" element={<FabricToProcure />} />
            <Route path="/delivery-challan" element={<DeliveryChallan />} />
            <Route path="/invoice" element={<Invoice />} />
            <Route path="/payment-voucher" element={<PaymentVoucher />} />
            <Route path="/inward-register" element={<InwardRegister />} />
            <Route path="/outward-register" element={<OutwardRegister />} />
            <Route path="/return-register" element={<ReturnRegister />} />
          </Route>
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
