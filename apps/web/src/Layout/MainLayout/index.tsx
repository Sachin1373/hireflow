import { Outlet, NavLink } from "react-router-dom";
import NavBar from "../../Components/NavBar";

export default function MainLayout() {
  const navItems = [
    { label: "Dashboard", path: "/dashboard" },
    { label: "Jobs", path: "/dashboard/jobs" },
    { label: "Pipeline", path: "/dashboard/pipeline" },
    { label: "Reviewers", path: "/dashboard/reviewers" },
  ];

  return (
    <div className="flex min-h-screen">
      {/* Sidebar */}
      <aside className="w-70 border-r border-gray-200 p-4 bg-[hsl(var(--glass-background-unique-marketing-menu))] backdrop-blur-md">
        <h1 className="font-bold text-lg mb-6">HireFlow</h1>

        <nav className="flex flex-col gap-2">
          {navItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              end={item.path === "/dashboard"}
              className={({ isActive }) =>
                `p-2 rounded-md transition-all flex items-center
  ${
    isActive
      ? "bg-[hsl(0_0%_85%/0.6)] text-black border-l-4 border-black"
      : "hover:bg-[hsl(0_0%_90%/0.5)] border-l-4 border-transparent"
  }`
              }
            >
              {item.label}
            </NavLink>
          ))}
        </nav>
      </aside>

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
