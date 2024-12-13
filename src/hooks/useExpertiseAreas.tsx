import { useState, useEffect } from "react";
import { useToast } from "@/components/ui/use-toast";
import { ExpertiseArea } from "./expertise/types";
import { fetchExpertiseAreas, updateExpertiseAreasInDb } from "./expertise/expertiseApi";

export type { ExpertiseArea };

export const useExpertiseAreas = (session: any) => {
  const [expertiseAreas, setExpertiseAreas] = useState<ExpertiseArea[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    const loadExpertiseAreas = async () => {
      try {
        const areas = await fetchExpertiseAreas();
        setExpertiseAreas(areas);
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

    loadExpertiseAreas();
  }, [toast]);

  const updateDatabase = async (updatedAreas: ExpertiseArea[]) => {
    if (!session?.user?.id) {
      toast({
        title: "Error",
        description: "You must be logged in to update expertise areas",
        variant: "destructive",
      });
      return false;
    }

    try {
      await updateExpertiseAreasInDb(updatedAreas, session.user.id);
      setExpertiseAreas(updatedAreas);
      toast({
        title: "Success",
        description: "Expertise areas updated successfully",
      });
      return true;
    } catch (error) {
      console.error('Error:', error);
      toast({
        title: "Error",
        description: "Failed to update expertise areas",
        variant: "destructive",
      });
      return false;
    }
  };

  const addExpertiseArea = async (newArea: ExpertiseArea) => {
    const updatedAreas = [...expertiseAreas, newArea];
    return updateDatabase(updatedAreas);
  };

  const removeExpertiseArea = async (index: number) => {
    const updatedAreas = expertiseAreas.filter((_, i) => i !== index);
    return updateDatabase(updatedAreas);
  };

  const updateExpertiseArea = async (index: number, updatedArea: ExpertiseArea) => {
    const updatedAreas = [...expertiseAreas];
    updatedAreas[index] = updatedArea;
    return updateDatabase(updatedAreas);
  };

  const reorderExpertiseAreas = async (oldIndex: number, newIndex: number) => {
    const updatedAreas = [...expertiseAreas];
    const [movedArea] = updatedAreas.splice(oldIndex, 1);
    updatedAreas.splice(newIndex, 0, movedArea);
    return updateDatabase(updatedAreas);
  };

  return {
    expertiseAreas,
    isLoading,
    addExpertiseArea,
    removeExpertiseArea,
    updateExpertiseArea,
    reorderExpertiseAreas,
  };
};