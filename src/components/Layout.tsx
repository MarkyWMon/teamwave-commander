import { cn } from "@/lib/utils";
import { Link, useLocation } from "react-router-dom";

interface NavItemProps {
  to: string;
  children: React.ReactNode;
}

const NavItem = ({ to, children }: NavItemProps) => {
  const location = useLocation();
  const isActive = location.pathname === to;

  return (
    <Link
      to={to}
      className={cn(
        "px-4 py-2 rounded-md transition-all duration-200",
        "hover:bg-secondary/50",
        isActive ? "bg-secondary text-foreground font-medium" : "text-foreground/60"
      )}
    >
      {children}
    </Link>
  );
};

const Layout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="min-h-screen bg-background">
      <nav className="fixed top-0 left-0 right-0 h-16 bg-card/80 backdrop-blur-lg border-b z-50">
        <div className="container h-full flex items-center justify-between">
          <Link to="/" className="text-xl font-semibold">
            Team Manager
          </Link>
          <div className="flex items-center gap-2">
            <NavItem to="/">Dashboard</NavItem>
            <NavItem to="/fixtures">Fixtures</NavItem>
            <NavItem to="/teams">Teams</NavItem>
            <NavItem to="/communications">Communications</NavItem>
          </div>
        </div>
      </nav>
      <main className="container pt-24 pb-8 animate-fade-in">
        {children}
      </main>
    </div>
  );
};

export default Layout;