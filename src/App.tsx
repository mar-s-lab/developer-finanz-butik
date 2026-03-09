import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import ProtectedRoute from "@/components/ProtectedRoute";
import Index from "./pages/Index";
import ProjectSheet from "./pages/ProjectSheet";
import Portfolio from "./pages/Portfolio";
import Learn from "./pages/Learn";
import Login from "./pages/Login";
import DeveloperLayout from "./pages/developer/DeveloperLayout";
import MyProjects from "./pages/developer/MyProjects";
import UploadWizard from "./pages/developer/UploadWizard";
import Analytics from "./pages/developer/Analytics";
import Profile from "./pages/developer/Profile";
import Clients from "./pages/manager/Clients";
import BrandSettings from "./pages/manager/BrandSettings";
import Reports from "./pages/manager/Reports";
import VendorLayout from "./pages/vendor/VendorLayout";
import VendorDashboard from "./pages/vendor/VendorDashboard";
import CreateService from "./pages/vendor/CreateService";
import VendorAnalytics from "./pages/vendor/VendorAnalytics";
import VendorProfileSetup from "./pages/vendor/VendorProfileSetup";
import VendorRegisterPage from "./pages/vendor/VendorRegisterPage";
import VendorStatusPage from "./pages/vendor/VendorStatusPage";
import MyServicesPage from "./pages/vendor/MyServicesPage";
import VendorInboxPage from "./pages/vendor/VendorInboxPage";
import VendorServicesPage from "./pages/marketplace/VendorServicesPage";
import ServiceDetailPage from "./pages/marketplace/ServiceDetailPage";
import ClientInboxPage from "./pages/client/ClientInboxPage";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/project/:slug" element={<ProjectSheet />} />
            <Route path="/portfolio" element={<Portfolio />} />
            <Route path="/learn" element={<Learn />} />
            <Route path="/login" element={<Login />} />

            {/* Developer Dashboard (includes Client Manager) */}
            <Route path="/developer" element={<ProtectedRoute allowedRoles={["developer"]}><DeveloperLayout /></ProtectedRoute>}>
              <Route index element={<MyProjects />} />
              <Route path="upload" element={<UploadWizard />} />
              <Route path="analytics" element={<Analytics />} />
              <Route path="profile" element={<Profile />} />
              <Route path="clients" element={<Clients />} />
              <Route path="brand" element={<BrandSettings />} />
              <Route path="reports" element={<Reports />} />
            </Route>

            {/* Vendor Portal */}
            <Route path="/vendor" element={<ProtectedRoute allowedRoles={["vendor"]}><VendorLayout /></ProtectedRoute>}>
              <Route index element={<VendorDashboard />} />
              <Route path="new-service" element={<CreateService />} />
              <Route path="analytics" element={<VendorAnalytics />} />
              <Route path="profile" element={<VendorProfileSetup />} />
              <Route path="services" element={<MyServicesPage />} />
              <Route path="messages" element={<VendorInboxPage />} />
            </Route>

            {/* Vendor Registration (public) */}
            <Route path="/vendor/register" element={<VendorRegisterPage />} />
            <Route path="/vendor/status" element={<VendorStatusPage />} />

            {/* Marketplace (public) */}
            <Route path="/marketplace/services" element={<VendorServicesPage />} />
            <Route path="/marketplace/services/:serviceId" element={<ServiceDetailPage />} />

            {/* Client Messages */}
            <Route path="/client/messages" element={<ClientInboxPage />} />

            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
