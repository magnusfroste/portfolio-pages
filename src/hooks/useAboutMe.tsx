import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";

export type AboutMeHighlight = {
  title: string;
  description: string;
  icon: string;
};

export type AboutMeContent = {
  mainText: string[];
  highlights: AboutMeHighlight[];
};

export const useAboutMe = (session: any) => {
  const [aboutMe, setAboutMe] = useState<AboutMeContent | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    fetchAboutMe();
  }, []);

  const fetchAboutMe = async () => {
    try {
      console.log('Fetching about me content...');
      const { data, error } = await supabase
        .from('portfolio_content')
        .select('content')
        .eq('content_type', 'about_me')
        .single();

      if (error) {
        console.error('Error fetching about me:', error);
        throw error;
      }
      
      console.log('Received about me data:', data);
      
      if (data?.content) {
        // Type assertion to ensure the content matches our expected type
        setAboutMe(data.content as AboutMeContent);
      }
    } catch (error) {
      console.error('Error in fetchAboutMe:', error);
      toast({
        title: "Error",
        description: "Failed to fetch about me content",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const updateAboutMe = async (updatedContent: AboutMeContent) => {
    if (!session?.user?.id) {
      toast({
        title: "Error",
        description: "You must be logged in to update content",
        variant: "destructive",
      });
      return false;
    }

    try {
      console.log('Updating about me content:', updatedContent);
      
      const { data, error } = await supabase
        .from('portfolio_content')
        .update({
          content: updatedContent,
          updated_at: new Date().toISOString()
        })
        .eq('content_type', 'about_me')
        .select()
        .single();

      if (error) throw error;

      console.log('Update successful:', data);
      setAboutMe(updatedContent);
      toast({
        title: "Success",
        description: "About me content updated successfully",
      });
      return true;
    } catch (error) {
      console.error('Error updating about me:', error);
      toast({
        title: "Error",
        description: "Failed to update about me content",
        variant: "destructive",
      });
      return false;
    }
  };

  return {
    aboutMe,
    isLoading,
    updateAboutMe,
  };
};