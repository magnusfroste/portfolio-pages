import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { AboutData, Feature } from "@/types/about";
import { useToast } from "@/components/ui/use-toast";

export const useAboutData = () => {
  const [session, setSession] = useState<any>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [aboutData, setAboutData] = useState<AboutData | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
    });

    fetchAboutData();
  }, []);

  const fetchAboutData = async () => {
    try {
      const { data, error } = await supabase
        .from('portfolio_about')
        .select('*')
        .single();

      if (error) throw error;

      // Parse the features JSON into Feature[] type
      const parsedData: AboutData = {
        ...data,
        features: Array.isArray(data.features) ? data.features : JSON.parse(data.features as string)
      };

      setAboutData(parsedData);
      return parsedData;
    } catch (error) {
      console.error('Error fetching about data:', error);
      return null;
    }
  };

  const handleSave = async (formData: AboutData) => {
    try {
      const { error } = await supabase
        .from('portfolio_about')
        .upsert({
          id: aboutData?.id || 1,
          title: formData.title,
          main_description: formData.main_description,
          features: formData.features,
          user_id: session?.user?.id
        });

      if (error) throw error;

      toast({
        title: "Success",
        description: "About section updated successfully",
      });

      setIsEditing(false);
      fetchAboutData();
    } catch (error) {
      console.error('Error saving about data:', error);
      toast({
        title: "Error",
        description: "Failed to update about section",
        variant: "destructive",
      });
    }
  };

  return {
    session,
    isEditing,
    setIsEditing,
    aboutData,
    handleSave,
  };
};