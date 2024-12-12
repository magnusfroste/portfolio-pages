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
      let { data, error } = await supabase
        .from('portfolio_about')
        .select('*')
        .single();

      if (error) {
        if (error.code === 'PGRST116') {
          // No data exists, let's create the default row
          const defaultData = {
            id: 1,
            title: 'About Me',
            main_description: [
              'As a seasoned technology leader and innovator, I\'ve dedicated my career to helping organizations navigate the rapidly evolving tech landscape.',
              'With extensive experience in rapid application prototyping and product development, I excel at turning complex ideas into tangible solutions.'
            ],
            features: [
              {
                title: 'AI Integration',
                description: 'Pioneering AI solutions that transform business operations and create competitive advantages.',
                icon: 'Brain'
              },
              {
                title: 'Product Strategy',
                description: '20+ years of experience in product management and successful market launches across different sectors.',
                icon: 'Rocket'
              },
              {
                title: 'Technology Leadership',
                description: 'Proven track record as CTO, leading teams and implementing cutting-edge technology solutions.',
                icon: 'Command'
              }
            ]
          };

          const { data: insertedData, error: insertError } = await supabase
            .from('portfolio_about')
            .insert(defaultData)
            .select()
            .single();

          if (insertError) throw insertError;
          data = insertedData;
        } else {
          throw error;
        }
      }

      // Parse the features JSON into Feature[] type
      const parsedData: AboutData = {
        ...data,
        features: Array.isArray(data.features) ? data.features : JSON.parse(data.features as string)
      };

      setAboutData(parsedData);
      return parsedData;
    } catch (error) {
      console.error('Error fetching about data:', error);
      toast({
        title: "Error",
        description: "Failed to load about section data",
        variant: "destructive",
      });
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