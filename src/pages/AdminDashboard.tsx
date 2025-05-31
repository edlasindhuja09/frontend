import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import {
  Users,
  BookOpen,
  FileText,
  LayoutDashboard,
  Menu,
  X,
  ClipboardList,
  Download
} from "lucide-react";

const AdminDashboard = () => {
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const navItems = [
    { to: "/admin/users", icon: <Users className="w-5 h-5" />, label: "User Management" },
    { to: "/admin/exams", icon: <BookOpen className="w-5 h-5" />, label: "Exam Management" },
    { to: "/admin/content", icon: <LayoutDashboard className="w-5 h-5" />, label: "Content Management" },
    { to: "/admin/tasks", icon: <ClipboardList className="w-5 h-5" />, label: "Task Management" },
    { to: "/admin/downloads", icon: <Download className="w-5 h-5" />, label: "Downloads" },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Mobile header - only shown on mobile */}
      <header className="lg:hidden bg-white shadow-sm p-4 flex items-center justify-center sticky top-0 z-40">
        <h2 className="text-xl font-bold text-education-blue">Admin Panel</h2>
      </header>

      {/* Sidebar - hidden on mobile, shown on desktop */}
      <aside className="hidden lg:block fixed top-0 left-0 z-30 h-screen bg-white shadow-md border-r w-64">
        <div className="p-4 h-full">
          <h2 className="text-2xl font-bold text-education-blue mb-8 text-center">Admin Panel</h2>
          <nav className="space-y-2">
            {navItems.map((item) => (
              <Link
                key={item.to}
                to={item.to}
                className={`flex items-center px-4 py-3 rounded-md text-sm font-medium transition-all 
                ${
                  location.pathname === item.to
                    ? "bg-education-blue text-white"
                    : "text-gray-700 hover:bg-education-blue/10 hover:text-education-blue"
                }`}
              >
                <span className="mr-3">{item.icon}</span>
                {item.label}
              </Link>
            ))}
          </nav>
        </div>
      </aside>

      {/* Main Content - full width on mobile, shifted on desktop */}
      <main className="lg:ml-64 p-4 sm:p-6 lg:p-8">
        <h1 className="text-2xl sm:text-3xl font-bold text-education-dark mb-4 sm:mb-6">
          Welcome to the Admin Dashboard
        </h1>
        <p className="text-gray-600 mb-6 text-sm sm:text-base">
          Use the navigation menu to manage users, exams, mock tests, and site content.
        </p>

        {/* Quick Actions / Overview Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
          {navItems.map((item) => (
            <Link
              key={item.to}
              to={item.to}
              className="bg-white p-4 sm:p-6 rounded-lg shadow hover:shadow-lg transition block"
            >
              <div className="flex items-center text-education-blue mb-3">
                {item.icon}
                <h3 className="font-semibold text-base sm:text-lg ml-2">{item.label}</h3>
              </div>
              <p className="text-gray-600 text-xs sm:text-sm">
                {item.label === "User Management" && "Manage student, parent, and school profiles."}
                {item.label === "Exam Management" && "Create and update exams. Enable or disable them as needed."}
                {item.label === "Content Management" && "Manage homepage banners, blog posts, FAQs, and more."}
                {item.label === "Task Management" && "Create, assign and track tasks for your team members."}
                {item.label === "Downloads" && "Download student data CSV files here."}
              </p>
            </Link>
          ))}
        </div>
      </main>

      {/* Mobile sidebar overlay - only shown when sidebarOpen is true on mobile */}
      {sidebarOpen && (
        <div 
          className="lg:hidden fixed inset-0 z-20 bg-black bg-opacity-50 transition-opacity"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Mobile sidebar - slides in from left on mobile */}
      <aside
        className={`lg:hidden fixed top-0 left-0 z-30 h-screen bg-white shadow-md border-r w-64 transform transition-transform duration-300 ease-in-out
        ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}`}
      >
        <div className="p-4 h-full">
          <h2 className="text-2xl font-bold text-education-blue mb-8 text-center">Admin Panel</h2>
          <nav className="space-y-2">
            {navItems.map((item) => (
              <Link
                key={item.to}
                to={item.to}
                onClick={() => setSidebarOpen(false)}
                className={`flex items-center px-4 py-3 rounded-md text-sm font-medium transition-all 
                ${
                  location.pathname === item.to
                    ? "bg-education-blue text-white"
                    : "text-gray-700 hover:bg-education-blue/10 hover:text-education-blue"
                }`}
              >
                <span className="mr-3">{item.icon}</span>
                {item.label}
              </Link>
            ))}
          </nav>
        </div>
      </aside>
    </div>
  );
};

export default AdminDashboard;
