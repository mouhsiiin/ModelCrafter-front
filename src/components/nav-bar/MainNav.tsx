import { Link, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import { UserNav } from "./user-nav";
import { useState } from "react";
import { Menu, X } from "lucide-react";
import { useAuth } from "@/context/auth";

const NAV_ITEMS = [
  { label: "Home", path: "/" },
  { label: "Features", path: "/features" },
  { label: "About", path: "/about" },
  { label: "Signup", path: "/signup", isPrivate: false },
  { label: "Login", path: "/login", isPrivate: false },
];

export function MainNav() {
  const location = useLocation();
  const pathname = location.pathname;
  const [isMobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Check if the user is authenticated
  const { isAuthenticated } = useAuth();

  return (
    <header className="fixed top-0 left-0 w-full bg-gradient-to-r from-black/50 to-black/20 backdrop-blur-md z-50">
      <div className="container mx-auto px-6 py-4 flex items-center justify-between">
        {/* Logo Section */}
        <Link to="/" className="flex items-center space-x-2">
          <div className="h-8 w-8 bg-gradient-to-r from-primary to-secondary rounded-full"></div>
          <span className="text-white text-xl font-bold">ML Trainer</span>
        </Link>

        {/* Navigation Links */}
        <nav className="hidden md:flex space-x-8 text-sm font-medium">
          {!isAuthenticated ? (
            NAV_ITEMS.map((item) => (
              <Link
                key={item.label}
                to={item.path}
                className={cn(
                  "text-white group",
                  "hover:text-secondary",
                  pathname === item.path && "text-secondary"
                )}
              >
                {item.label == "Signup" || item.label == "Login" ? (
                  <span className="text-black bg-blue-400 px-3 py-1 rounded-md hover:bg-blue-500 transition-colors duration-200">
                    {item.label}
                  </span>
                ) : (
                  <span>{item.label}</span>
                )}
              </Link>
            ))
            
          ) : (
            <>
              <Link to="/dashboard" className="text-white relative group">
                Dashboard
                <span
                  className={cn(
                    "absolute bottom-0 left-0 w-0 h-0.5 bg-white transition-all group-hover:w-full",
                    pathname === "/dashboard" && "w-full"
                  )}
                ></span>
              </Link>
            </>
          )}
        </nav>

        {/* User Navigation */}
        <div className="hidden md:flex items-center">
          <UserNav />
        </div>

        {/* Mobile Menu Toggle */}
        <button
          className="md:hidden text-white"
          onClick={() => setMobileMenuOpen(!isMobileMenuOpen)}
        >
          {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </div>
    </header>
  );
}
