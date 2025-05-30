import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import { AuthProvider } from '../src/contexts/AuthContext';
import { AnimatePresence } from "framer-motion";

import ScrollToTop from "./components/ScrollToTop";
import Navbar from "./components/layout/Navbar";
import Footer from "./components/layout/Footer";

import HomePage from "./pages/HomePage";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import ExamsPage from "./pages/ExamsPage";
import ExamDetailPage from "./pages/ExamDetailPage";
import MockTestPage from "./pages/mock-test/MockTestPage";
import UserManagement from "./pages/admin/UserManagement";
import ExamResultPage from "./pages/ExamResultPage";
import DashboardPage from "./pages/DashboardPage";
import StudentDashboard from './pages/student-dashboard';
import AdminDashboard from "./pages/AdminDashboard";
import SalesDashboard from "./pages/SalesDashboard";
import SchoolDashboard from "./pages/SchoolDashboard";
import ExamManagement from "./pages/admin/ExamManagement";
import TaskManagement from "./pages/admin/TaskManagement";
import ContactPage from "./pages/ContactPage";
import AboutPage from "./pages/AboutPage";
import BlogPage from "./pages/BlogPage";
import BlogDetailPage from "./pages/BlogDetailPage";
import NotFound from "./pages/NotFound";
import MockTestManagement from "./pages/admin/MockTestManagement";
import Downloads from "./pages/admin/Downloads";
import PageWrapper from "./components/PageWrapper";
import { UserProvider } from "./contexts/UserContext";

const queryClient = new QueryClient();

const AppRoutes = () => {
  const location = useLocation();

  return (
    <AnimatePresence mode="wait" initial={false}>
      <Routes location={location} key={location.pathname}>
        <Route path="/" element={<PageWrapper><HomePage /></PageWrapper>} />
        <Route path="/login" element={<PageWrapper><LoginPage /></PageWrapper>} />
        <Route path="/register" element={<PageWrapper><RegisterPage /></PageWrapper>} />
        <Route path="/exams" element={<PageWrapper><ExamsPage /></PageWrapper>} />
        <Route path="/exams/:id" element={<PageWrapper><ExamDetailPage /></PageWrapper>} />
        <Route path="/mock-tests/:id" element={<PageWrapper><MockTestPage /></PageWrapper>} />
        <Route path="/exam-results/:id" element={<PageWrapper><ExamResultPage /></PageWrapper>} />
        <Route path="/student-dashboard" element={<PageWrapper><StudentDashboard /></PageWrapper>} />
        <Route path="/admin/mock-test" element={<PageWrapper><MockTestManagement /></PageWrapper>} />
        <Route path="/admin/exams" element={<PageWrapper><ExamManagement /></PageWrapper>} />
        <Route path="/admin/mock-tests" element={<PageWrapper><MockTestManagement /></PageWrapper>} />
        <Route path="/admin/downloads" element={<PageWrapper><Downloads /></PageWrapper>} />
        <Route path="/admin/tasks" element={<PageWrapper><TaskManagement userType="admin" /></PageWrapper>} />
        <Route path="/dashboard" element={<PageWrapper><DashboardPage /></PageWrapper>} />
        <Route path="/admin-dashboard" element={<PageWrapper><AdminDashboard /></PageWrapper>} />
        <Route path="/sales-dashboard" element={<PageWrapper><SalesDashboard /></PageWrapper>} />
        <Route path="/school-dashboard" element={<PageWrapper><SchoolDashboard /></PageWrapper>} />
        <Route path="/admin/users" element={<PageWrapper><UserManagement /></PageWrapper>} />
        <Route path="/contact" element={<PageWrapper><ContactPage /></PageWrapper>} />
        <Route path="/about" element={<PageWrapper><AboutPage /></PageWrapper>} />
        <Route path="/blog" element={<PageWrapper><BlogPage /></PageWrapper>} />
        <Route path="/blog/:id" element={<PageWrapper><BlogDetailPage /></PageWrapper>} />
        <Route path="*" element={<PageWrapper><NotFound /></PageWrapper>} />
      </Routes>
    </AnimatePresence>
  );
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <BrowserRouter>
      <AuthProvider>
        <UserProvider>
          <TooltipProvider>
            <Toaster />
            <Sonner />
            <div className="flex flex-col min-h-screen">
              <Navbar />
              <main className="flex-grow">
                <ScrollToTop />
                <AppRoutes />
              </main>
              <Footer />
            </div>
          </TooltipProvider>
        </UserProvider>
      </AuthProvider>
    </BrowserRouter>
  </QueryClientProvider>
);

export default App;