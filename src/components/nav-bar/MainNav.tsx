import { Link, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import { UserNav } from "./user-nav";
import { useState } from "react";
import { Menu, X } from "lucide-react";

const NAV_ITEMS = [
  { label: "Home", path: "/" },
  { label: "Features", path: "/features" },
  { label: "Pricing", path: "/pricing" },
  { label: "About", path: "/about" },
];

export function MainNav() {
  const location = useLocation();
  const pathname = location.pathname;
  const [isMobileMenuOpen, setMobileMenuOpen] = useState(false);

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
          {NAV_ITEMS.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={cn(
                "text-white relative group",
                pathname === item.path
                  ? "font-semibold"
                  : "text-white/70 hover:text-white"
              )}
            >
              {item.label}
              <span
                className={cn(
                  "absolute bottom-0 left-0 w-0 h-0.5 bg-white transition-all group-hover:w-full",
                  pathname === item.path && "w-full"
                )}
              ></span>
            </Link>
          ))}
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

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-black/80 text-white">
          <nav className="flex flex-col space-y-4 p-4">
            {NAV_ITEMS.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={cn(
                  "text-white/70 hover:text-white font-medium",
                  pathname === item.path && "font-semibold text-white"
                )}
              >
                {item.label}
              </Link>
            ))}
          </nav>
        </div>
      )}
    </header>
  );
}
