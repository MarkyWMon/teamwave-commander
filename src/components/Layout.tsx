import { useEffect } from "react";
import { cn } from "@/lib/utils";
import { Link, useLocation, useNavigate, Outlet } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { LogOut } from "lucide-react";
import { Button } from "./ui/button";
import { toast } from "sonner";

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

const Layout = () => {
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const checkAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        navigate("/auth");
      }
    };

    checkAuth();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (!session && location.pathname !== "/auth") {
        navigate("/auth");
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [navigate, location]);

  const handleSignOut = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      navigate("/auth");
    } catch (error: any) {
      toast.error(error.message);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <nav className="fixed top-0 left-0 right-0 h-16 bg-card/80 backdrop-blur-lg border-b z-50">
        <div className="container h-full flex items-center justify-between">
          <Link to="/" className="text-xl font-semibold">
            Fixture Comms Manager
          </Link>
          <div className="flex items-center gap-2">
            <NavItem to="/">Dashboard</NavItem>
            <NavItem to="/fixtures">Fixtures</NavItem>
            <NavItem to="/teams">Teams</NavItem>
            <NavItem to="/communications">Communications</NavItem>
            <Button variant="ghost" size="icon" onClick={handleSignOut}>
              <LogOut className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </nav>
      <main className="container pt-24 pb-8 animate-fade-in">
        <Outlet />
      </main>
    </div>
  );
};

export default Layout;