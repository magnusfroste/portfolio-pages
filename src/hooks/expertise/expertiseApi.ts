import { supabase } from "@/integrations/supabase/client";
import { ExpertiseArea } from "./types";
import { useToast } from "@/components/ui/use-toast";

export const fetchExpertiseAreas = async () => {
  console.log('Fetching expertise areas...');
  const { data, error } = await supabase
    .from('portfolio_content')
    .select('content')
    .eq('content_type', 'expertise_areas')
    .single();

  if (error) {
    console.error('Error fetching expertise areas:', error);
    throw error;
  }
  
  console.log('Fetched expertise areas:', data);
  return data?.content as ExpertiseArea[] || [];
};

export const updateExpertiseAreasInDb = async (
  updatedAreas: ExpertiseArea[],
  userId: string
) => {
  const { error } = await supabase
    .from('portfolio_content')
    .upsert({
      content_type: 'expertise_areas',
      content: updatedAreas,
      user_id: userId
    }, {
      onConflict: 'content_type,user_id'
    });

  if (error) {
    console.error('Error updating expertise areas:', error);
    throw error;
  }
};