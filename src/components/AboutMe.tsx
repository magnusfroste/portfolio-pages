import { motion } from "framer-motion";
import { Brain, Rocket, Command, Loader2, Edit2 } from "lucide-react";
import { useAboutMe } from "@/hooks/useAboutMe";
import { useSession } from "@/hooks/useSession";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useState } from "react";

const iconMap: { [key: string]: any } = {
  Brain,
  Rocket,
  Command,
};

export const AboutMe = () => {
  const session = useSession();
  const { aboutMe, isLoading, updateAboutMe } = useAboutMe(session);
  const [isEditing, setIsEditing] = useState(false);
  const [editedContent, setEditedContent] = useState(aboutMe);

  // Handle loading state
  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  // If there's no data, show nothing
  if (!aboutMe?.mainText || !aboutMe?.highlights) {
    return null;
  }

  const handleSave = async () => {
    if (await updateAboutMe(editedContent)) {
      setIsEditing(false);
    }
  };

  const updateHighlight = (index: number, field: string, value: string) => {
    const newHighlights = [...editedContent.highlights];
    newHighlights[index] = { ...newHighlights[index], [field]: value };
    setEditedContent({ ...editedContent, highlights: newHighlights });
  };

  const updateMainText = (index: number, value: string) => {
    const newMainText = [...editedContent.mainText];
    newMainText[index] = value;
    setEditedContent({ ...editedContent, mainText: newMainText });
  };

  // Update editedContent when aboutMe changes
  if (!editedContent && aboutMe) {
    setEditedContent(aboutMe);
  }

  return (
    <section className="py-20 px-4 bg-secondary/30">
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="max-w-6xl mx-auto"
      >
        <div className="flex justify-between items-center mb-12">
          <h2 className="text-3xl font-bold text-center w-full bg-clip-text text-transparent bg-gradient-to-r from-primary to-accent">
            About Me
          </h2>
          {session && (
            <Dialog open={isEditing} onOpenChange={setIsEditing}>
              <DialogTrigger asChild>
                <Button variant="outline" size="icon">
                  <Edit2 className="h-4 w-4" />
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle>Edit About Me Section</DialogTitle>
                </DialogHeader>
                {editedContent && (
                  <div className="space-y-6 py-4">
                    <div className="space-y-4">
                      <h3 className="font-medium">Main Text</h3>
                      {editedContent.mainText.map((text, index) => (
                        <Textarea
                          key={index}
                          value={text}
                          onChange={(e) => updateMainText(index, e.target.value)}
                          className="min-h-[100px]"
                        />
                      ))}
                    </div>
                    <div className="space-y-4">
                      <h3 className="font-medium">Highlights</h3>
                      {editedContent.highlights.map((highlight, index) => (
                        <div key={index} className="space-y-2 p-4 border rounded-lg">
                          <Input
                            value={highlight.title}
                            onChange={(e) => updateHighlight(index, 'title', e.target.value)}
                            placeholder="Title"
                          />
                          <Textarea
                            value={highlight.description}
                            onChange={(e) => updateHighlight(index, 'description', e.target.value)}
                            placeholder="Description"
                          />
                        </div>
                      ))}
                    </div>
                    <div className="flex justify-end space-x-2">
                      <Button variant="outline" onClick={() => setIsEditing(false)}>
                        Cancel
                      </Button>
                      <Button onClick={handleSave}>
                        Save Changes
                      </Button>
                    </div>
                  </div>
                )}
              </DialogContent>
            </Dialog>
          )}
        </div>
        
        <div className="grid md:grid-cols-2 gap-12">
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="space-y-6"
          >
            {aboutMe.mainText.map((text, index) => (
              <p key={index} className="text-lg leading-relaxed">
                {text}
              </p>
            ))}
          </motion.div>
          
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4 }}
            className="space-y-8"
          >
            {aboutMe.highlights.map((highlight, index) => {
              const IconComponent = iconMap[highlight.icon];
              return (
                <div key={index} className="flex items-start gap-4">
                  <div className="p-3 bg-primary/10 rounded-lg">
                    <IconComponent className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold mb-2">{highlight.title}</h3>
                    <p className="text-muted-foreground">
                      {highlight.description}
                    </p>
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