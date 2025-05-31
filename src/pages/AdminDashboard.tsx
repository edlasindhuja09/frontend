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
      <header className="lg:hidden bg-white shadow-sm p-4 flex items-center justify-between sticky top-0 z-40">
        <h2 className="text-xl font-bold text-education-blue">Admin Panel</h2>
        <button 
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="p-2 rounded-md text-gray-700 hover:bg-gray-100 focus:outline-none"
        >
          {sidebarOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
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

      {/* Main Content */}
      <main className={`p-4 sm:p-6 lg:p-8 ${sidebarOpen ? 'ml-64' : ''} lg:ml-64`}>
        <h1 className="text-2xl sm:text-3xl font-bold text-education-dark mb-4 sm:mb-6">
          Welcome to the Admin Dashboard
        </h1>
        <p className="text-gray-600 mb-6 text-sm sm:text-base">
          Use the sidebar to manage users, exams, mock tests, and site content.
        </p>

        {/* Quick Actions / Overview Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
          <Link
            to="/admin/users"
            className="bg-white p-4 sm:p-6 rounded-lg shadow hover:shadow-lg transition block"
          >
            <div className="flex items-center text-education-blue mb-3">
              <Users className="w-5 h-5 sm:w-6 sm:h-6 mr-2" />
              <h3 className="font-semibold text-base sm:text-lg">User Management</h3>
            </div>
            <p className="text-gray-600 text-xs sm:text-sm">
              Manage student, parent, and school profiles.
            </p>
          </Link>

          <Link
            to="/admin/exams"
            className="bg-white p-4 sm:p-6 rounded-lg shadow hover:shadow-lg transition block"
          >
            <div className="flex items-center text-education-blue mb-3">
              <BookOpen className="w-5 h-5 sm:w-6 sm:h-6 mr-2" />
              <h3 className="font-semibold text-base sm:text-lg">Exam Management</h3>
            </div>
            <p className="text-gray-600 text-xs sm:text-sm">
              Create and update exams. Enable or disable them as needed.
            </p>
          </Link>

          <Link
            to="/admin/content"
            className="bg-white p-4 sm:p-6 rounded-lg shadow hover:shadow-lg transition block"
          >
            <div className="flex items-center text-education-blue mb-3">
              <LayoutDashboard className="w-5 h-5 sm:w-6 sm:h-6 mr-2" />
              <h3 className="font-semibold text-base sm:text-lg">Content Management</h3>
            </div>
            <p className="text-gray-600 text-xs sm:text-sm">
              Manage homepage banners, blog posts, FAQs, and more.
            </p>
          </Link>

          <Link
            to="/admin/tasks"
            className="bg-white p-4 sm:p-6 rounded-lg shadow hover:shadow-lg transition block"
          >
            <div className="flex items-center text-education-blue mb-3">
              <ClipboardList className="w-5 h-5 sm:w-6 sm:h-6 mr-2" />
              <h3 className="font-semibold text-base sm:text-lg">Task Management</h3>
            </div>
            <p className="text-gray-600 text-xs sm:text-sm">
              Create, assign and track tasks for your team members.
            </p>
          </Link>

          <Link
            to="/admin/downloads"
            className="bg-white p-4 sm:p-6 rounded-lg shadow hover:shadow-lg transition block"
          >
            <div className="flex items-center text-education-blue mb-3">
              <Download className="w-5 h-5 sm:w-6 sm:h-6 mr-2" />
              <h3 className="font-semibold text-base sm:text-lg">Downloads</h3>
            </div>
            <p className="text-gray-600 text-xs sm:text-sm">
              Download student data CSV files here.
            </p>
          </Link>
        </div>
      </main>
    </div>
  );
};

export default AdminDashboard;
