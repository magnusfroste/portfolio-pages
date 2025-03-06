
import { useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";

export const useVisitCounter = () => {
  useEffect(() => {
    const incrementVisitCount = async () => {
      try {
        // Get current URL without trailing slashes or port
        const currentUrl = window.location.origin.replace(/\/$/, "");
        
        // First check if entry exists
        const { data: existingVisit, error: fetchError } = await supabase
          .from("portfolio_visits")
          .select("*")
          .eq("app_url", currentUrl)
          .single();

        if (fetchError && fetchError.code !== "PGRST116") {
          console.error("Error fetching visit count:", fetchError);
          return;
        }

        if (existingVisit) {
          // Update existing entry
          const { error: updateError } = await supabase
            .from("portfolio_visits")
            .update({
              visit_count: (existingVisit.visit_count || 0) + 1,
              updated_at: new Date().toISOString(),
            })
            .eq("app_url", currentUrl);

          if (updateError) {
            console.error("Error updating visit count:", updateError);
            toast({
              title: "Error",
              description: "Failed to update visit count",
              variant: "destructive",
            });
          }
        } else {
          // Create new entry
          const { error: insertError } = await supabase.from("portfolio_visits").insert([
            {
              app_url: currentUrl,
              visit_count: 1,
            },
          ]);

          if (insertError) {
            console.error("Error inserting visit count:", insertError);
            toast({
              title: "Error",
              description: "Failed to record visit",
              variant: "destructive",
            });
          }
        }
      } catch (error) {
        console.error("Error in visit counter:", error);
        toast({
          title: "Error",
          description: "Failed to process visit count",
          variant: "destructive",
        });
      }
    };

    incrementVisitCount();
  }, []);
};
