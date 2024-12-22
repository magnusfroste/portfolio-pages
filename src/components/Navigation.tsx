import { Button } from "@/components/ui/button";
import { useNavigate, useLocation } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useEffect, useState } from "react";
import { LogIn, LogOut, LayoutDashboard, Home } from "lucide-react";
import { useToast } from "./ui/use-toast";

export const Navigation = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [session, setSession] = useState<any>(null);
  const { toast } = useToast();

  useEffect(() => {
    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
    }).catch((error) => {
      console.error('Error getting session:', error);
    });

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      
      // If session expired or user logged out, redirect to home
      if (!session && location.pathname === '/dashboard') {
        navigate('/');
        toast({
          title: "Session expired",
          description: "Please log in again to continue.",
        });
      }
    });

    return () => subscription.unsubscribe();
  }, [navigate, location.pathname, toast]);

  const handleAuthClick = async () => {
    if (session) {
      try {
        await supabase.auth.signOut();
        navigate("/");
      } catch (error) {
        console.error('Error signing out:', error);
        toast({
          title: "Error",
          description: "Failed to sign out. Please try again.",
          variant: "destructive",
        });
      }
    } else {
      navigate("/login");
    }
  };

  return (
    <div className="fixed top-4 right-4 z-50 flex gap-4">
      {session && (
        <>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate("/")}
            className="flex items-center gap-2"
          >
            <Home className="h-4 w-4" />
            Home
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate("/dashboard")}
            className="flex items-center gap-2"
          >
            <LayoutDashboard className="h-4 w-4" />
            Dashboard
          </Button>
        </>
      )}
      <Button
        variant="ghost"
        size="sm"
        onClick={handleAuthClick}
        className="flex items-center gap-2"
      >
        {session ? (
          <>
            <LogOut className="h-4 w-4" />
            Logout
          </>
        ) : (
          <>
            <LogIn className="h-4 w-4" />
            Login
          </>
        )}
      </Button>
    </div>
  );
};