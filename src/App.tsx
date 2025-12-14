import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "@/contexts/AuthContext";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import AuthPage from "./pages/AuthPage";
import AboutPage from "./pages/AboutPage";
import AdminDashboard from "./pages/admin/AdminDashboard";
import TrainerDashboard from "./pages/trainer/TrainerDashboard";
import MemberDashboard from "./pages/member/MemberDashboard";
import ClassSchedulePage from "./pages/classes/ClassSchedulePage";
import DietPlansPage from "./pages/diet-plans/DietPlansPage";
import AttendancePage from "./pages/attendance/AttendancePage";
import GeneratedDietPage from "./pages/generated-plans/GeneratedDietPage";
import GeneratedWorkoutPage from "./pages/generated-plans/GeneratedWorkoutPage";
import SettingsPage from "./pages/settings/SettingsPage";

const queryClient = new QueryClient();

function ProtectedRoute({ children, allowedRoles }: { children: React.ReactNode; allowedRoles: string[] }) {
  const { user, role, loading } = useAuth();
  
  if (loading) return <div className="min-h-screen bg-background flex items-center justify-center"><div className="animate-pulse text-primary font-display text-2xl">LOADING...</div></div>;
  if (!user) return <Navigate to="/auth" replace />;
  if (allowedRoles.length && role && !allowedRoles.includes(role)) return <Navigate to={`/${role}`} replace />;
  
  return <>{children}</>;
}

function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Index />} />
      <Route path="/about" element={<AboutPage />} />
      <Route path="/auth" element={<AuthPage />} />
      
      {/* Admin Routes */}
      <Route path="/admin" element={<ProtectedRoute allowedRoles={['admin']}><AdminDashboard /></ProtectedRoute>} />
      
      {/* Trainer Routes */}
      <Route path="/trainer" element={<ProtectedRoute allowedRoles={['trainer']}><TrainerDashboard /></ProtectedRoute>} />
      
      {/* Member Routes */}
      <Route path="/member" element={<ProtectedRoute allowedRoles={['member']}><MemberDashboard /></ProtectedRoute>} />
      <Route path="/my-diet-plan" element={<ProtectedRoute allowedRoles={['member']}><GeneratedDietPage /></ProtectedRoute>} />
      <Route path="/my-workout-plan" element={<ProtectedRoute allowedRoles={['member']}><GeneratedWorkoutPage /></ProtectedRoute>} />
      
      {/* Shared Routes (accessible by all authenticated users) */}
      <Route path="/classes" element={<ProtectedRoute allowedRoles={['admin', 'trainer', 'member']}><ClassSchedulePage /></ProtectedRoute>} />
      <Route path="/diet-plans" element={<ProtectedRoute allowedRoles={['admin', 'trainer', 'member']}><DietPlansPage /></ProtectedRoute>} />
      <Route path="/attendance" element={<ProtectedRoute allowedRoles={['admin', 'trainer', 'member']}><AttendancePage /></ProtectedRoute>} />
      <Route path="/settings" element={<ProtectedRoute allowedRoles={['admin', 'trainer', 'member']}><SettingsPage /></ProtectedRoute>} />
      
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AuthProvider>
          <AppRoutes />
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
