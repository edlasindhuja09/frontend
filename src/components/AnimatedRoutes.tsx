import { Routes, Route, useLocation } from "react-router-dom";
import { AnimatePresence } from "framer-motion";
import PageWrapper from "./PageWrapper";

import HomePage from "../pages/HomePage";
import LoginPage from "../pages/LoginPage";
import RegisterPage from "../pages/RegisterPage";
import ExamsPage from "../pages/ExamsPage";
import ExamDetailPage from "../pages/ExamDetailPage";
import MockTestPage from "../pages/mock-test/MockTestPage";
import UserManagement from "../pages/admin/UserManagement";
import ExamResultPage from "../pages/ExamResultPage";
import DashboardPage from "../pages/DashboardPage";
import StudentDashboard from "../pages/student-dashboard";
import AdminDashboard from "../pages/AdminDashboard";
import ParentDashboard from "../pages/SalesDashboard";
import SchoolDashboard from "../pages/SchoolDashboard";
import ExamManagement from "../pages/admin/ExamManagement";
import ContactPage from "../pages/ContactPage";
import AboutPage from "../pages/AboutPage";
import BlogPage from "../pages/BlogPage";
import BlogDetailPage from "../pages/BlogDetailPage";
import NotFound from "../pages/NotFound";

const AnimatedRoutes = () => {
  const location = useLocation();

  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route path="/" element={<PageWrapper><HomePage /></PageWrapper>} />
        <Route path="/login" element={<PageWrapper><LoginPage /></PageWrapper>} />
        <Route path="/register" element={<PageWrapper><RegisterPage /></PageWrapper>} />
        <Route path="/exams" element={<PageWrapper><ExamsPage /></PageWrapper>} />
        <Route path="/exams/:id" element={<PageWrapper><ExamDetailPage /></PageWrapper>} />
        <Route path="/mock-tests/:id" element={<PageWrapper><MockTestPage /></PageWrapper>} />
        <Route path="/exam-results/:id" element={<PageWrapper><ExamResultPage /></PageWrapper>} />
        <Route path="/student-dashboard" element={<PageWrapper><StudentDashboard /></PageWrapper>} />
        <Route path="/admin-dashboard" element={<PageWrapper><AdminDashboard /></PageWrapper>} />
        <Route path="/parent-dashboard" element={<PageWrapper><ParentDashboard /></PageWrapper>} />
        <Route path="/school-dashboard" element={<PageWrapper><SchoolDashboard /></PageWrapper>} />
        <Route path="/admin/exams" element={<PageWrapper><ExamManagement /></PageWrapper>} />
        <Route path="/admin/users" element={<PageWrapper><UserManagement /></PageWrapper>} />
        <Route path="/dashboard" element={<PageWrapper><DashboardPage /></PageWrapper>} />
        <Route path="/contact" element={<PageWrapper><ContactPage /></PageWrapper>} />
        <Route path="/about" element={<PageWrapper><AboutPage /></PageWrapper>} />
        <Route path="/blog" element={<PageWrapper><BlogPage /></PageWrapper>} />
        <Route path="/blog/:id" element={<PageWrapper><BlogDetailPage /></PageWrapper>} />
        <Route path="*" element={<PageWrapper><NotFound /></PageWrapper>} />
      </Routes>
    </AnimatePresence>
  );
};

export default AnimatedRoutes;
