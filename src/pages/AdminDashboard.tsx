import { Link, useLocation } from "react-router-dom";
import {
  Users,
  BookOpen,
  LayoutDashboard,
  ClipboardList,
  Download
} from "lucide-react";

const AdminDashboard = () => {
  const location = useLocation();

  const navItems = [
    { to: "/admin/users", icon: <Users className="w-5 h-5" />, label: "User Management", 
      description: "Manage student, parent, and school profiles." },
    { to: "/admin/exams", icon: <BookOpen className="w-5 h-5" />, label: "Exam Management", 
      description: "Create and update exams. Enable or disable them as needed." },
    { to: "/admin/content", icon: <LayoutDashboard className="w-5 h-5" />, label: "Content Management", 
      description: "Manage homepage banners, blog posts, FAQs, and more." },
    { to: "/admin/tasks", icon: <ClipboardList className="w-5 h-5" />, label: "Task Management", 
      description: "Create, assign and track tasks for your team members." },
    { to: "/admin/downloads", icon: <Download className="w-5 h-5" />, label: "Downloads", 
      description: "Download student data CSV files here." },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header - shown on all screens */}
      <header className="bg-white shadow-sm p-4 sticky top-0 z-40">
        <h2 className="text-xl sm:text-2xl font-bold text-education-blue">Admin Panel</h2>
      </header>

      {/* Main Content - full width on all screens */}
      <main className="p-4 sm:p-6 lg:p-8">
        <div className="mb-6 sm:mb-8">
          <h1 className="text-2xl sm:text-3xl font-bold text-education-dark mb-2 sm:mb-3">
            Welcome to the Admin Dashboard
          </h1>
          <p className="text-gray-600 text-sm sm:text-base">
            Manage your platform through the following sections:
          </p>
        </div>

        {/* Dashboard Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
          {navItems.map((item) => (
            <Link
              key={item.to}
              to={item.to}
              className={`bg-white p-4 sm:p-6 rounded-lg shadow hover:shadow-lg transition block border-l-4 ${
                location.pathname === item.to 
                  ? "border-education-blue" 
                  : "border-transparent hover:border-education-blue/30"
              }`}
            >
              <div className="flex items-center text-education-blue mb-3">
                <div className="p-2 bg-education-blue/10 rounded-lg mr-3">
                  {item.icon}
                </div>
                <h3 className="font-semibold text-base sm:text-lg">{item.label}</h3>
              </div>
              <p className="text-gray-600 text-xs sm:text-sm">
                {item.description}
              </p>
            </Link>
          ))}
        </div>
      </main>
    </div>
  );
};

export default AdminDashboard;
