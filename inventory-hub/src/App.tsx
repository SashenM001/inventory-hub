import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useEffect } from "react";
import { useInventoryStore } from "@/stores/inventoryStore";
import Index from "./pages/Index";
import InventoryPage from "./pages/Inventory";
import SuppliersPage from "./pages/Suppliers";
import SummaryPage from "./pages/Summary";
import NotFound from "./pages/NotFound";
import LoginPage from "./pages/Login";
import AdminEmployeesPage from "./pages/AdminEmployees";

const queryClient = new QueryClient();

// Protected Route component
const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { isAuthenticated } = useInventoryStore();
  return isAuthenticated ? <>{children}</> : <Navigate to="/login" replace />;
};

// Admin Protected Route component
const AdminRoute = ({ children }: { children: React.ReactNode }) => {
  const { isAuthenticated, currentUser } = useInventoryStore();
  return isAuthenticated && currentUser?.role === "admin" ? (
    <>{children}</>
  ) : (
    <Navigate to="/" replace />
  );
};

const App = () => {
  const {
    isAuthenticated,
    fetchSuppliers,
    fetchItems,
    fetchAdditions,
    fetchIssues,
  } = useInventoryStore();

  // Load data from backend on app initialization
  useEffect(() => {
    const loadData = async () => {
      try {
        await Promise.all([
          fetchSuppliers(),
          fetchItems(),
          fetchAdditions(),
          fetchIssues(),
        ]);
      } catch (error) {
        console.error("Failed to load initial data:", error);
      }
    };

    if (isAuthenticated) {
      loadData();
    }
  }, [
    isAuthenticated,
    fetchSuppliers,
    fetchItems,
    fetchAdditions,
    fetchIssues,
  ]);

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/login" element={<LoginPage />} />
            <Route
              path="/"
              element={
                <ProtectedRoute>
                  <Index />
                </ProtectedRoute>
              }
            />
            <Route
              path="/inventory"
              element={
                <ProtectedRoute>
                  <InventoryPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/suppliers"
              element={
                <ProtectedRoute>
                  <SuppliersPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/suppliers/summary"
              element={
                <ProtectedRoute>
                  <SummaryPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/employees"
              element={
                <AdminRoute>
                  <AdminEmployeesPage />
                </AdminRoute>
              }
            />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
