import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";

export type ExpertiseArea = {
  title: string;
  description: string;
};

export const useExpertiseAreas = (session: any) => {
  const [expertiseAreas, setExpertiseAreas] = useState<ExpertiseArea[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    fetchExpertiseAreas();
  }, []);

  const fetchExpertiseAreas = async () => {
    try {
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
      // The content column contains the array of expertise areas
      setExpertiseAreas(data?.content || []);
    } catch (error) {
      console.error('Error:', error);
      toast({
        title: "Error",
        description: "Failed to fetch expertise areas",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const addExpertiseArea = async (newArea: ExpertiseArea) => {
    if (!session?.user?.id) {
      toast({
        title: "Error",
        description: "You must be logged in to add expertise areas",
        variant: "destructive",
      });
      return;
    }

    try {
      // First get the current areas
      const { data: currentData } = await supabase
        .from('portfolio_content')
        .select('content')
        .eq('content_type', 'expertise_areas')
        .single();

      const currentAreas = currentData?.content || [];
      const updatedAreas = [...currentAreas, newArea];

      // Update the content with the new area
      const { error } = await supabase
        .from('portfolio_content')
        .upsert({
          content_type: 'expertise_areas',
          content: updatedAreas,
          user_id: session.user.id
        });

      if (error) throw error;

      setExpertiseAreas(updatedAreas);
      toast({
        title: "Success",
        description: "Expertise area added successfully",
      });
    } catch (error) {
      console.error('Error:', error);
      toast({
        title: "Error",
        description: "Failed to add expertise area",
        variant: "destructive",
      });
    }
  };

  const removeExpertiseArea = async (index: number) => {
    if (!session?.user?.id) {
      toast({
        title: "Error",
        description: "You must be logged in to remove expertise areas",
        variant: "destructive",
      });
      return;
    }

    try {
      const updatedAreas = expertiseAreas.filter((_, i) => i !== index);

      const { error } = await supabase
        .from('portfolio_content')
        .upsert({
          content_type: 'expertise_areas',
          content: updatedAreas,
          user_id: session.user.id
        });

      if (error) throw error;

      setExpertiseAreas(updatedAreas);
      toast({
        title: "Success",
        description: "Expertise area removed successfully",
      });
    } catch (error) {
      console.error('Error:', error);
      toast({
        title: "Error",
        description: "Failed to remove expertise area",
        variant: "destructive",
      });
    }
  };

  const reorderExpertiseAreas = async (oldIndex: number, newIndex: number) => {
    if (!session?.user?.id) {
      toast({
        title: "Error",
        description: "You must be logged in to reorder expertise areas",
        variant: "destructive",
      });
      return;
    }

    try {
      const updatedAreas = [...expertiseAreas];
      const [movedArea] = updatedAreas.splice(oldIndex, 1);
      updatedAreas.splice(newIndex, 0, movedArea);

      const { error } = await supabase
        .from('portfolio_content')
        .upsert({
          content_type: 'expertise_areas',
          content: updatedAreas,
          user_id: session.user.id
        });

      if (error) throw error;

      setExpertiseAreas(updatedAreas);
      toast({
        title: "Success",
        description: "Expertise areas reordered successfully",
      });
    } catch (error) {
      console.error('Error:', error);
      toast({
        title: "Error",
        description: "Failed to reorder expertise areas",
        variant: "destructive",
      });
    }
  };

  return {
    expertiseAreas,
    isLoading,
    addExpertiseArea,
    removeExpertiseArea,
    reorderExpertiseAreas,
  };
};