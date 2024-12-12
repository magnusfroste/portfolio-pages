import { motion } from "framer-motion";
import { Edit, X, Save } from "lucide-react";
import { useForm } from "react-hook-form";
import { Input } from "./ui/input";
import { Textarea } from "./ui/textarea";
import { Button } from "./ui/button";
import { AboutFeatures } from "./about/AboutFeatures";
import { useAboutData } from "@/hooks/useAboutData";
import { AboutData } from "@/types/about";

export const AboutMe = () => {
  const { session, isEditing, setIsEditing, aboutData, handleSave } = useAboutData();
  const form = useForm<AboutData>();

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
          >
            <AboutFeatures 
              features={aboutData.features}
              isEditing={isEditing}
              register={form.register}
            />
          </motion.div>
        </div>
      </motion.div>
    </section>
  );
};