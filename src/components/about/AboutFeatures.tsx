import { Brain, Rocket, Command } from "lucide-react";
import { Feature } from "@/types/about";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

const iconMap: { [key: string]: any } = {
  Brain,
  Rocket,
  Command,
};

type AboutFeaturesProps = {
  features: Feature[];
  isEditing: boolean;
  register: any;
};

export const AboutFeatures = ({ features, isEditing, register }: AboutFeaturesProps) => {
  return (
    <div className="space-y-8">
      {features.map((feature, index) => {
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
                    {...register(`features.${index}.title`)}
                    defaultValue={feature.title}
                    className="text-xl font-semibold mb-2"
                  />
                  <Textarea
                    {...register(`features.${index}.description`)}
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
    </div>
  );
};