import { Link } from "react-router-dom";
import { cn } from "@/lib/utils";

export function MainNav() {
  const pathname = window.location.pathname;

  return (
    <div className="mr-4 hidden md:flex">
      <Link to="/" className="mr-6 flex items-center space-x-2">
        <span className="hidden font-bold sm:inline-block">
          ML Trainer
        </span>
      </Link>
      <nav className="flex items-center space-x-6 text-sm font-medium">
        <Link
          to="/"
          className={cn(
            "transition-colors hover:text-foreground/80",
            pathname === "/" ? "text-foreground" : "text-foreground/60"
          )}
        >
          Dashboard
        </Link>
        <Link
          to="/projects"
          className={cn(
            "transition-colors hover:text-foreground/80",
            pathname.startsWith("/projects")
              ? "text-foreground"
              : "text-foreground/60"
          )}
        >
          Projects
        </Link>
        <Link
          to="/datasets"
          className={cn(
            "transition-colors hover:text-foreground/80",
            pathname.startsWith("/datasets")
              ? "text-foreground"
              : "text-foreground/60"
          )}
        >
          Datasets
        </Link>
        <Link
          to="/visualizations"
          className={cn(
            "transition-colors hover:text-foreground/80",
            pathname.startsWith("/visualizations")
              ? "text-foreground"
              : "text-foreground/60"
          )}
        >
          Visualizations
        </Link>
        <Link
          to="/settings"
          className={cn(
            "transition-colors hover:text-foreground/80",
            pathname.startsWith("/settings")
              ? "text-foreground"
              : "text-foreground/60"
          )}
        >
          Settings
        </Link>
      </nav>
    </div>
  );
}