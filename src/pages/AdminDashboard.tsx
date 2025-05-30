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
    { to: "/admin/users", icon: <Users className="w-5 h-5 mr-3" />, label: "User Management" },
    { to: "/admin/exams", icon: <BookOpen className="w-5 h-5 mr-3" />, label: "Exam Management" },
    
    { to: "/admin/content", icon: <LayoutDashboard className="w-5 h-5 mr-3" />, label: "Content Management" },
    { to: "/admin/tasks", icon: <ClipboardList className="w-5 h-5 mr-3" />, label: "Task Management" },
    { to: "/admin/downloads", icon: <Download className="w-5 h-5 mr-3" />, label: "Downloads" }, // new Downloads nav item
  ];

  return (
    <div className="min-h-screen bg-gray-50 flex px-6 ml-20 mr-20">
      {/* Mobile toggle button */}
      <div className="lg:hidden p-4 absolute top-0 left-0 z-50">
        {/* No button needed as sidebar is removed for screens less than 1024px */}
      </div>
      {/* Sidebar */}
      <aside
        className={`fixed lg:static top-0 left-0 z-40 h-screen bg-white shadow-md border-r w-64 transform transition-transform duration-300 ease-in-out
        ${sidebarOpen ? "translate-x-0" : "-translate-x-full"} lg:translate-x-0 lg:m-5 lg:p-2`}
      >
        <div>
          <h2 className="text-2xl font-bold text-education-blue mb-8 text-center">Admin Panel</h2>
          <nav className="space-y-2">
            {navItems.map((item) => (
              <Link
                key={item.to}
                to={item.to}
                onClick={() => setSidebarOpen(false)}
                className={`flex items-center px-4 py-2 rounded-md text-sm font-medium transition-all 
                ${
                  location.pathname === item.to
                    ? "bg-education-blue text-white"
                    : "text-gray-700 hover:bg-education-blue/10 hover:text-education-blue"
                }`}
              >
                <div className="flex items-center transition-transform duration-200 hover:scale-105">
                  {item.icon}
                  {item.label}
                </div>
              </Link>
            ))}
          </nav>
        </div>
      </aside>
      {/* Main Content */}
      <main className="flex-1 p-6 lg:p-10 ml-0 lg:ml-0">
        <h1 className="text-3xl font-bold text-education-dark mb-6">
          Welcome to the Admin Dashboard
        </h1>
        <p className="text-gray-600 mb-4">
          Use the sidebar to manage users, exams, mock tests, and site content.
        </p>

        {/* Quick Actions / Overview Cards */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mt-10">
          <Link
            to="/admin/users"
            className="bg-white p-6 rounded-lg shadow hover:shadow-lg transition block"
          >
            <div className="flex items-center text-education-blue mb-3">
              <Users className="w-6 h-6 mr-2" />
              <h3 className="font-semibold text-lg">User Management</h3>
            </div>
            <p className="text-gray-600 text-sm">
              Manage student, parent, and school profiles.
            </p>
          </Link>

          <Link
            to="/admin/exams"
            className="bg-white p-6 rounded-lg shadow hover:shadow-lg transition block"
          >
            <div className="flex items-center text-education-blue mb-3">
              <BookOpen className="w-6 h-6 mr-2" />
              <h3 className="font-semibold text-lg">Exam Management</h3>
            </div>
            <p className="text-gray-600 text-sm">
              Create and update exams. Enable or disable them as needed.
            </p>
          </Link>

          

          <Link
            to="/admin/content"
            className="bg-white p-6 rounded-lg shadow hover:shadow-lg transition block"
          >
            <div className="flex items-center text-education-blue mb-3">
              <LayoutDashboard className="w-6 h-6 mr-2" />
              <h3 className="font-semibold text-lg">Content Management</h3>
            </div>
            <p className="text-gray-600 text-sm">
              Manage homepage banners, blog posts, FAQs, and more.
            </p>
          </Link>

          {/* New Task Management Card */}
          <Link
            to="/admin/tasks"
            className="bg-white p-6 rounded-lg shadow hover:shadow-lg transition block"
          >
            <div className="flex items-center text-education-blue mb-3">
              <ClipboardList className="w-6 h-6 mr-2" />
              <h3 className="font-semibold text-lg">Task Management</h3>
            </div>
            <p className="text-gray-600 text-sm">
              Create, assign and track tasks for your team members.
            </p>
          </Link>
          {/* New Downloads Card */}
          <Link
            to="/admin/downloads"
            className="bg-white p-6 rounded-lg shadow hover:shadow-lg transition block"
          >
            <div className="flex items-center text-education-blue mb-3">
              <Download className="w-6 h-6 mr-2" />
              <h3 className="font-semibold text-lg">Downloads</h3>
            </div>
            <p className="text-gray-600 text-sm">
              Download student data CSV files here.
            </p>
          </Link>
        </div>
      </main>
    </div>
  );
};

export default AdminDashboard;