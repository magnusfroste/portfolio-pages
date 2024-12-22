import { useEffect } from 'react';
import { supabase } from "@/integrations/supabase/client";

export const useVisitCounter = () => {
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
          }
        }
      } catch (error) {
        console.error('Error tracking visit:', error);
      }
    };

    incrementVisitCount();
  }, []); // Run once when component mounts
};