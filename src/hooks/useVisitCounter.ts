import { useEffect } from 'react';
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";

export const useVisitCounter = () => {
  const { toast } = useToast();

  useEffect(() => {
    const incrementVisitCount = async () => {
      const currentUrl = window.location.origin;
      
      try {
        // First try to get existing record
        const { data: existingData, error: selectError } = await supabase
          .from('app_visits')
          .select()
          .eq('app_url', currentUrl)
          .maybeSingle();

        if (selectError) {
          console.error('Error checking visit count:', selectError);
          toast({
            title: "Error",
            description: "Failed to check visit count",
            variant: "destructive",
          });
          return;
        }

        if (existingData) {
          // Update existing record
          const { error: updateError } = await supabase
            .from('app_visits')
            .update({ 
              visit_count: (existingData.visit_count || 0) + 1,
              updated_at: new Date().toISOString()
            })
            .eq('app_url', currentUrl);

          if (updateError) {
            console.error('Error updating visit count:', updateError);
            toast({
              title: "Error",
              description: "Failed to update visit count",
              variant: "destructive",
            });
          }
        } else {
          // Insert new record
          const { error: insertError } = await supabase
            .from('app_visits')
            .insert([
              { 
                app_url: currentUrl,
                visit_count: 1
              }
            ]);

          if (insertError) {
            console.error('Error inserting visit count:', insertError);
            toast({
              title: "Error",
              description: "Failed to create visit count",
              variant: "destructive",
            });
          }
        }
      } catch (error) {
        console.error('Error tracking visit:', error);
        toast({
          title: "Error",
          description: "Failed to track visit",
          variant: "destructive",
        });
      }
    };

    incrementVisitCount();
  }, []); // Run once when component mounts
};