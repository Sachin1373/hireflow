import { Outlet, NavLink } from "react-router-dom";
import NavBar from "../../Components/NavBar";
import Sidebar from "@/Components/Sidebar";

export default function AdminLayout() {
  const adminNavItems = [
  // { label: "Dashboard", path: "/dashboard" },
  { label: "Jobs", path: "/dashboard/jobs" },
  { label: "Applications", path: "/dashboard/applications"},
  { label: "Reviewers", path: "/dashboard/reviewers" },
  { label: "Users", path: "/dashboard/users" },
];


  return (
    <div className="flex min-h-screen">
      {/* Sidebar */}
       <Sidebar items={adminNavItems} />

      {/* Content */}
      <div className="flex-1 flex flex-col">
        
        {/* Navbar */}
        <NavBar />

        {/* Content */}
        <main className="flex-1 p-6 bg-gray-50">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
