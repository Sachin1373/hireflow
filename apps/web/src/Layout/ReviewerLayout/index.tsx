import { Outlet, NavLink } from "react-router-dom";
import NavBar from "../../Components/NavBar";
import Sidebar from "@/Components/Sidebar";


export default function ReviewerLayout() {
  const reviewerNavItems = [
  { label: "Applications", path: "/reviewer-dashboard/application" },
  { label: "Setting", path: "/reviewer-dashboard/setting" },
];

  return (
    <div className="flex min-h-screen">
      {/* Sidebar */}
      <Sidebar items={reviewerNavItems} />

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
