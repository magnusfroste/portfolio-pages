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
      
      console.log('Received data:', data);
      
      if (data && data.content) {
        console.log('Setting expertise areas:', data.content);
        setExpertiseAreas(data.content);
      } else {
        console.log('No expertise areas found');
        setExpertiseAreas([]);
      }
    } catch (error) {
      console.error('Error in fetchExpertiseAreas:', error);
      toast({
        title: "Error",
        description: "Failed to fetch expertise areas",
        variant: "destructive",
      });
      setExpertiseAreas([]);
    } finally {
      setIsLoading(false);
    }
  };

  const updateExpertiseAreas = async (updatedAreas: ExpertiseArea[]) => {
    if (!session?.user?.id) {
      toast({
        title: "Error",
        description: "You must be logged in to update expertise areas",
        variant: "destructive",
      });
      return false;
    }

    try {
      console.log('Updating expertise areas:', updatedAreas);
      
      const { data, error } = await supabase
        .from('portfolio_content')
        .update({
          content: updatedAreas,
          updated_at: new Date().toISOString()
        })
        .eq('content_type', 'expertise_areas')
        .select()
        .single();

      if (error) throw error;

      console.log('Update successful:', data);
      setExpertiseAreas(updatedAreas);
      return true;
    } catch (error) {
      console.error('Error updating expertise areas:', error);
      toast({
        title: "Error",
        description: "Failed to update expertise areas",
        variant: "destructive",
      });
      return false;
    }
  };

  const addExpertiseArea = async (newArea: ExpertiseArea) => {
    const success = await updateExpertiseAreas([...expertiseAreas, newArea]);
    if (success) {
      toast({
        title: "Success",
        description: "Expertise area added successfully",
      });
    }
  };

  const removeExpertiseArea = async (index: number) => {
    const updatedAreas = expertiseAreas.filter((_, i) => i !== index);
    const success = await updateExpertiseAreas(updatedAreas);
    if (success) {
      toast({
        title: "Success",
        description: "Expertise area removed successfully",
      });
    }
  };

  const reorderExpertiseAreas = async (oldIndex: number, newIndex: number) => {
    const updatedAreas = [...expertiseAreas];
    const [movedArea] = updatedAreas.splice(oldIndex, 1);
    updatedAreas.splice(newIndex, 0, movedArea);
    
    const success = await updateExpertiseAreas(updatedAreas);
    if (success) {
      toast({
        title: "Success",
        description: "Expertise areas reordered successfully",
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