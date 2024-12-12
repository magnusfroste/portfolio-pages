import { motion } from "framer-motion";
import { Edit, X } from "lucide-react";
import { Card } from "@/components/ui/card";
import { useForm } from "react-hook-form";
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuTrigger,
} from "@/components/ui/context-menu";
import { EditablePortfolioContent } from "./portfolio/EditablePortfolioContent";
import { StaticPortfolioContent } from "./portfolio/StaticPortfolioContent";
import { PortfolioCardActions } from "./portfolio/PortfolioCardActions";
import { ImageUploadField } from "./ImageUploadField";
import { FormProvider } from "react-hook-form";

type PortfolioCardProps = {
  item: any;
  session: any;
  isEditing: boolean;
  onEdit: () => void;
  onSave: (data: any) => void;
  onCancel: () => void;
  onDelete: () => void;
  onClick: () => void;
};

export const PortfolioCard = ({
  item,
  session,
  isEditing,
  onEdit,
  onSave,
  onCancel,
  onDelete,
  onClick,
}: PortfolioCardProps) => {
  const form = useForm({
    defaultValues: {
      header: item.header,
      description: item.description,
      link: item.link,
      image_url: item.image_url,
    },
  });

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2 }}
    >
      <ContextMenu>
        <ContextMenuTrigger>
          <Card className="overflow-hidden hover:shadow-lg transition-shadow duration-300">
            <div className="grid md:grid-cols-2 gap-10 items-start">
              <div className="p-6">
                <div className="relative w-full rounded-md overflow-hidden" style={{ height: '300px' }}>
                  {isEditing ? (
                    <FormProvider {...form}>
                      <ImageUploadField form={form} initialImageUrl={item.image_url} />
                    </FormProvider>
                  ) : (
                    item.image_url && (
                      <img
                        src={item.image_url}
                        alt={item.header}
                        className="absolute inset-0 w-full h-full object-cover object-center"
                        loading="lazy"
                      />
                    )
                  )}
                </div>
              </div>
              <div className="p-12 flex flex-col justify-between">
                {isEditing ? (
                  <>
                    <EditablePortfolioContent form={form} item={item} />
                    {session && <PortfolioCardActions 
                      onSave={() => onSave(form.getValues())} 
                      onCancel={onCancel} 
                    />}
                  </>
                ) : (
                  <StaticPortfolioContent item={item} onClick={onClick} />
                )}
              </div>
            </div>
          </Card>
        </ContextMenuTrigger>
        {session && (
          <ContextMenuContent>
            {!isEditing && (
              <ContextMenuItem onClick={onEdit}>
                <Edit className="h-4 w-4 mr-2" />
                Edit
              </ContextMenuItem>
            )}
            <ContextMenuItem onClick={onDelete} className="text-red-600">
              <X className="h-4 w-4 mr-2" />
              Delete
            </ContextMenuItem>
          </ContextMenuContent>
        )}
      </ContextMenu>
    </motion.div>
  );
};