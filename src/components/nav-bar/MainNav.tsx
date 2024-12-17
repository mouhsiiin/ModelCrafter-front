import { Link, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import { UserNav } from "./user-nav";

// Define navigation items as a constant for easier maintenance
const NAV_ITEMS = [
  { label: 'Dashboard', path: '/dashboard' },
  { label: 'Projects', path: '/projects' },
  { label: 'Datasets', path: '/datasets' },
];

export function MainNav() {
  // Use useLocation hook instead of window.location for better React practice
  const location = useLocation();
  const pathname = location.pathname;

  return (
    <div className="bg-black w-full flex py-4">
      <div className="container mx-auto flex justify-around items-center">
        <Link 
          to="/" 
          className="flex items-center space-x-2 group"
        >
          <span className="hidden font-bold sm:inline-block text-white group-hover:text-gray-300 transition-colors">
            ML Trainer
          </span>
        </Link>
        
        <nav className="flex items-center space-x-6 text-sm font-medium">
          {NAV_ITEMS.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={cn(
                "text-white transition-all duration-200 ease-in-out",
                "hover:text-gray-300",
                pathname === item.path || 
                (item.path !== '/' && pathname.startsWith(item.path))
                  ? "font-semibold"
                  : "text-white/60"
              )}
            >
              {item.label}
            </Link>
          ))}
        </nav>
      </div>
      <div className="justify-end mr-4">
        <UserNav />
      </div>
    </div>
  );
}