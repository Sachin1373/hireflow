import { useState } from "react";
import { NavLink, useLocation } from "react-router-dom";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";

type NavItem = {
  label: string;
  path?: string;
  children?: NavItem[];
};

export default function Sidebar({ items }: { items: NavItem[] }) {
  const [openMenu, setOpenMenu] = useState<string | null>(null);
  const location = useLocation();

  const toggle = (label: string) => {
    setOpenMenu((prev) => (prev === label ? null : label));
  };

  const isChildActive = (item: NavItem) =>
    item.children?.some((child) =>
      location.pathname.startsWith(child.path!)
    );

  return (
    <aside className="w-70 border-r border-gray-200 p-4 bg-[hsl(var(--glass-background-unique-marketing-menu))] backdrop-blur-md">
      <h1 className="font-bold text-lg mb-6">HireFlow</h1>

      <nav className="flex flex-col gap-2">
        {items.map((item) => {
          const isOpen =
            openMenu === item.label || isChildActive(item);

          if (!item.children) {
            return (
              <NavLink
                key={item.path}
                to={item.path!}
                end={item.path === "/dashboard"}
                className={({ isActive }) =>
                  `p-2 rounded-md block ${
                    isActive
                      ? "bg-gray-200 font-medium"
                      : "hover:bg-gray-100"
                  }`
                }
              >
                {item.label}
              </NavLink>
            );
          }

          return (
            <div key={item.label}>
              <div
                onClick={() => toggle(item.label)}
                className={`flex items-center justify-between p-2 rounded-md cursor-pointer hover:bg-gray-100 ${
                  isChildActive(item) ? "bg-gray-100 font-medium" : ""
                }`}
              >
                <span>{item.label}</span>
                {isOpen ? <ExpandMoreIcon /> : <ChevronRightIcon />}
              </div>

              {isOpen && (
                <div className="ml-4 flex flex-col gap-1">
                  {item.children.map((child) => (
                    <NavLink
                      key={child.path}
                      to={child.path!}
                      className={({ isActive }) =>
                        `p-3 rounded-md text-sm ${
                          isActive
                            ? "bg-gray-200 font-medium"
                            : "hover:bg-gray-100"
                        }`
                      }
                    >
                      {child.label}
                    </NavLink>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </nav>
    </aside>
  );
}