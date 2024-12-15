import { Brain, Rocket, LineChart, LucideIcon, Pencil, Check, X } from "lucide-react";
import { Navigation } from "./Navigation";
import { useHeroContent } from "@/hooks/useHeroContent";
import { useState } from "react";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { useToast } from "./ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useSession } from "@/hooks/useSession";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";

const iconMap: Record<string, LucideIcon> = {
  Brain,
  Rocket,
  LineChart,
};

const availableIcons = Object.keys(iconMap);

export const Hero = () => {
  const { data: content, isLoading, refetch } = useHeroContent();
  const [isEditing, setIsEditing] = useState(false);
  const [editedContent, setEditedContent] = useState(content);
  const { toast } = useToast();
  const session = useSession();

  const handleEdit = () => {
    setEditedContent(content);
    setIsEditing(true);
  };

  const handleSave = async () => {
    try {
      const { error } = await supabase
        .from('portfolio_content')
        .update({ content: editedContent })
        .eq('content_type', 'hero_content');

      if (error) throw error;

      await refetch();
      setIsEditing(false);
      toast({
        title: "Success",
        description: "Hero content updated successfully",
      });
    } catch (error) {
      console.error('Error updating hero content:', error);
      toast({
        title: "Error",
        description: "Failed to update hero content",
        variant: "destructive",
      });
    }
  };

  const handleCancel = () => {
    setIsEditing(false);
    setEditedContent(content);
  };

  if (isLoading) {
    return (
      <section className="relative min-h-[80vh] flex flex-col items-center justify-center">
        <Navigation />
        <div className="container mx-auto text-center">
          <div className="h-12 w-48 bg-gray-200 animate-pulse rounded mx-auto mb-12" />
          <div className="h-8 w-96 bg-gray-200 animate-pulse rounded mx-auto mb-12" />
          <div className="flex justify-center gap-12">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-6 w-32 bg-gray-200 animate-pulse rounded" />
            ))}
          </div>
        </div>
      </section>
    );
  }

  if (!content) return null;

  return (
    <section className="relative min-h-[80vh] flex flex-col items-center justify-center">
      <Navigation />
      
      <div className="container mx-auto text-center relative">
        {session && !isEditing && (
          <Button
            variant="ghost"
            size="icon"
            className="absolute top-0 right-0"
            onClick={handleEdit}
          >
            <Pencil className="h-4 w-4" />
          </Button>
        )}

        {isEditing ? (
          <>
            <div className="mb-12">
              <Input
                value={editedContent.title}
                onChange={(e) => setEditedContent({ ...editedContent, title: e.target.value })}
                className="text-4xl font-bold text-center"
              />
            </div>
            <div className="mb-12">
              <Input
                value={editedContent.subtitle}
                onChange={(e) => setEditedContent({ ...editedContent, subtitle: e.target.value })}
                className="text-xl text-center"
              />
            </div>
            <div className="flex justify-center gap-12 text-gray-700">
              {editedContent.features.map((feature, index) => (
                <div key={index} className="flex flex-col items-center gap-2">
                  <Select
                    value={feature.icon}
                    onValueChange={(value) => {
                      const newFeatures = [...editedContent.features];
                      newFeatures[index] = { ...feature, icon: value };
                      setEditedContent({ ...editedContent, features: newFeatures });
                    }}
                  >
                    <SelectTrigger className="w-40">
                      <SelectValue placeholder="Select icon" />
                    </SelectTrigger>
                    <SelectContent>
                      {availableIcons.map((icon) => (
                        <SelectItem key={icon} value={icon}>
                          {icon}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <Input
                    value={feature.text}
                    onChange={(e) => {
                      const newFeatures = [...editedContent.features];
                      newFeatures[index] = { ...feature, text: e.target.value };
                      setEditedContent({ ...editedContent, features: newFeatures });
                    }}
                    className="w-40"
                  />
                </div>
              ))}
            </div>
            <div className="mt-6 flex justify-center gap-2">
              <Button onClick={handleSave} size="sm">
                <Check className="h-4 w-4 mr-2" />
                Save
              </Button>
              <Button onClick={handleCancel} variant="outline" size="sm">
                <X className="h-4 w-4 mr-2" />
                Cancel
              </Button>
            </div>
          </>
        ) : (
          <>
            <h1 className="text-6xl font-bold bg-gradient-to-r from-blue-600 to-rose-600 bg-clip-text text-transparent mb-12">
              {content.title}
            </h1>
            <p className="text-2xl text-gray-600 mb-12">
              {content.subtitle}
            </p>
            <div className="flex justify-center gap-12 text-gray-700">
              {content.features.map((feature, index) => {
                const Icon = iconMap[feature.icon];
                return (
                  <div key={index} className="flex items-center gap-2">
                    <Icon className="h-6 w-6 text-blue-600" />
                    <span>{feature.text}</span>
                  </div>
                );
              })}
            </div>
          </>
        )}
      </div>
    </section>
  );
};