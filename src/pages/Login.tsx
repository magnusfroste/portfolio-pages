import { Auth } from "@supabase/auth-ui-react";
import { ThemeSupa } from "@supabase/auth-ui-shared";
import { supabase } from "@/integrations/supabase/client";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // Check if user is already logged in
    supabase.auth.onAuthStateChange((event, session) => {
      if (session) {
        navigate("/dashboard");
      }
    });
  }, [navigate]);

  return (
    <div className="container mx-auto max-w-md p-6">
      <h1 className="text-2xl font-bold mb-6 text-center">Dashboard Login</h1>
      <div className="bg-card p-6 rounded-lg shadow-lg border">
        <Auth
          supabaseClient={supabase}
          appearance={{
            theme: ThemeSupa,
            variables: {
              default: {
                colors: {
                  brand: "rgb(var(--primary))",
                  brandAccent: "rgb(var(--primary))",
                },
              },
            },
          }}
          providers={[]}
        />
      </div>
    </div>
  );
};

export default Login;