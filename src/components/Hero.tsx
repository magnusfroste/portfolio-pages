import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useEffect, useState } from "react";
import { LogIn, LogOut, Brain, Rocket, LineChart } from "lucide-react";

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
    <section className="relative min-h-[80vh] flex flex-col items-center justify-center">
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
      
      <div className="container mx-auto text-center">
        <h1 className="text-6xl font-bold bg-gradient-to-r from-blue-600 to-rose-600 bg-clip-text text-transparent mb-6">
          Magnus Froste
        </h1>
        <p className="text-2xl text-gray-600 mb-12">
          Innovation Strategist • AI Integration Expert • Product Visionary
        </p>
        
        <div className="flex justify-center gap-12 text-gray-700">
          <div className="flex items-center gap-2">
            <Brain className="h-6 w-6 text-blue-600" />
            <span>AI Integration</span>
          </div>
          <div className="flex items-center gap-2">
            <Rocket className="h-6 w-6 text-orange-500" />
            <span>Innovation Strategy</span>
          </div>
          <div className="flex items-center gap-2">
            <LineChart className="h-6 w-6 text-blue-500" />
            <span>Product Growth</span>
          </div>
        </div>
      </div>
    </section>
  );
};