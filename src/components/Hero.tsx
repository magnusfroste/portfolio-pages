import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useEffect, useState } from "react";
import { LogIn, LogOut } from "lucide-react";

export const Hero = () => {
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
    <section className="relative">
      <div className="absolute top-4 right-4">
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
      <div className="container mx-auto text-center py-20">
        <h1 className="text-5xl font-bold">Welcome to Innovative Mindraise</h1>
        <p className="mt-4 text-lg">Your portfolio of AI initiatives and proof of concepts.</p>
      </div>
    </section>
  );
};
