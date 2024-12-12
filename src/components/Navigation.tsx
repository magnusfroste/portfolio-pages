import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useEffect, useState } from "react";
import { LogIn, LogOut, LayoutDashboard } from "lucide-react";

export const Navigation = () => {
  const navigate = useNavigate();
  const [session, setSession] = useState<any>(null);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    return () => subscription.unsubscribe();
  }, []);

  const handleAuthClick = () => {
    if (session) {
      supabase.auth.signOut();
    } else {
      navigate("/login");
    }
  };

  return (
    <div className="absolute top-4 right-4 flex gap-4">
      {session && (
        <Button
          variant="ghost"
          size="sm"
          onClick={() => navigate("/dashboard")}
          className="flex items-center gap-2"
        >
          <LayoutDashboard className="h-4 w-4" />
          Dashboard
        </Button>
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