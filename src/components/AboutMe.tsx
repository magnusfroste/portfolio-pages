import { motion } from "framer-motion";
import { Brain, Rocket, Command, Edit, X, Save } from "lucide-react";
import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { Input } from "./ui/input";
import { Textarea } from "./ui/textarea";
import { Button } from "./ui/button";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "./ui/use-toast";

type Feature = {
  title: string;
  description: string;
  icon: string;
};

type AboutData = {
  id: number;
  title: string;
  main_description: string[];
  features: Feature[];
};

const iconMap: { [key: string]: any } = {
  Brain,
  Rocket,
  Command,
};

export const AboutMe = () => {
  const [session, setSession] = useState<any>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [aboutData, setAboutData] = useState<AboutData | null>(null);
  const { toast } = useToast();
  
  const form = useForm<AboutData>();

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
      setAboutData(data);
      form.reset(data);
    } catch (error) {
      console.error('Error fetching about data:', error);
    }
  };

  const handleSave = async (formData: any) => {
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

  if (!aboutData) return null;

  return (
    <section className="py-20 px-4 bg-secondary/30">
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="max-w-6xl mx-auto"
      >
        <div className="flex justify-between items-center mb-12">
          {isEditing ? (
            <Input
              {...form.register('title')}
              defaultValue={aboutData.title}
              className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-accent"
            />
          ) : (
            <h2 className="text-3xl font-bold text-center bg-clip-text text-transparent bg-gradient-to-r from-primary to-accent">
              {aboutData.title}
            </h2>
          )}
          
          {session && (
            <div className="flex gap-2">
              {isEditing ? (
                <>
                  <Button
                    variant="default"
                    onClick={() => handleSave(form.getValues())}
                  >
                    <Save className="h-4 w-4 mr-2" />
                    Save
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => {
                      setIsEditing(false);
                      form.reset(aboutData);
                    }}
                  >
                    <X className="h-4 w-4 mr-2" />
                    Cancel
                  </Button>
                </>
              ) : (
                <Button
                  variant="outline"
                  onClick={() => setIsEditing(true)}
                >
                  <Edit className="h-4 w-4 mr-2" />
                  Edit
                </Button>
              )}
            </div>
          )}
        </div>
        
        <div className="grid md:grid-cols-2 gap-12">
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="space-y-6"
          >
            {isEditing ? (
              aboutData.main_description.map((paragraph, index) => (
                <Textarea
                  key={index}
                  {...form.register(`main_description.${index}`)}
                  defaultValue={paragraph}
                  className="text-lg leading-relaxed"
                />
              ))
            ) : (
              aboutData.main_description.map((paragraph, index) => (
                <p key={index} className="text-lg leading-relaxed">
                  {paragraph}
                </p>
              ))
            )}
          </motion.div>
          
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4 }}
            className="space-y-8"
          >
            {aboutData.features.map((feature, index) => {
              const IconComponent = iconMap[feature.icon];
              return (
                <div key={index} className="flex items-start gap-4">
                  <div className="p-3 bg-primary/10 rounded-lg">
                    <IconComponent className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    {isEditing ? (
                      <>
                        <Input
                          {...form.register(`features.${index}.title`)}
                          defaultValue={feature.title}
                          className="text-xl font-semibold mb-2"
                        />
                        <Textarea
                          {...form.register(`features.${index}.description`)}
                          defaultValue={feature.description}
                          className="text-muted-foreground"
                        />
                      </>
                    ) : (
                      <>
                        <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                        <p className="text-muted-foreground">
                          {feature.description}
                        </p>
                      </>
                    )}
                  </div>
                </div>
              );
            })}
          </motion.div>
        </div>
      </motion.div>
    </section>
  );
};