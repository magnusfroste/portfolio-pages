import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export type HeroContent = {
  title: string;
  subtitle: string;
  features: Array<{
    text: string;
    icon: string;
  }>;
};

export const useHeroContent = () => {
  return useQuery({
    queryKey: ["hero_content"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("portfolio_content")
        .select("content")
        .eq("content_type", "hero_content")
        .single();

      if (error) {
        throw error;
      }

      return data?.content as HeroContent;
    },
  });
};