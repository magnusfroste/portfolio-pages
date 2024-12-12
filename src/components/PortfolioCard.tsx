import { motion } from "framer-motion";
import { ExternalLink, Edit, Save, X, Link } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "./ui/input";
import { Textarea } from "./ui/textarea";
import { ImageUploadField } from "./ImageUploadField";
import { useForm, FormProvider } from "react-hook-form";
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuTrigger,
} from "@/components/ui/context-menu";

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
                <div>
                  <CardHeader className="p-0">
                    {isEditing ? (
                      <Input
                        {...form.register('header')}
                        defaultValue={item.header}
                        className="text-2xl font-bold mb-6"
                        placeholder="Enter title"
                      />
                    ) : (
                      <CardTitle className="text-2xl mb-6">{item.header}</CardTitle>
                    )}
                  </CardHeader>
                  <CardContent className="p-0">
                    {isEditing ? (
                      <>
                        <Textarea
                          {...form.register('description')}
                          defaultValue={item.description}
                          className="mb-6 text-lg leading-relaxed min-h-[200px]"
                          placeholder="Enter description"
                          rows={8}
                        />
                        <div className="flex items-center space-x-2 mb-10">
                          <Link className="h-4 w-4 text-muted-foreground" />
                          <Input
                            {...form.register('link')}
                            defaultValue={item.link}
                            placeholder="Enter project URL"
                            className="flex-1"
                          />
                        </div>
                      </>
                    ) : (
                      <p className="text-muted-foreground mb-10 text-lg leading-relaxed">
                        {item.description}
                      </p>
                    )}
                  </CardContent>
                </div>
                <div className="flex gap-4">
                  {session && (
                    <>
                      {isEditing ? (
                        <div className="flex gap-4">
                          <Button
                            variant="default"
                            onClick={() => onSave(form.getValues())}
                            className="w-fit"
                          >
                            <Save className="h-4 w-4 mr-2" />
                            Save
                          </Button>
                          <Button
                            variant="outline"
                            onClick={onCancel}
                            className="w-fit"
                          >
                            <X className="h-4 w-4 mr-2" />
                            Cancel
                          </Button>
                        </div>
                      ) : null}
                    </>
                  )}
                  {!isEditing && (
                    <>
                      <Button
                        variant="default"
                        className="w-fit"
                        onClick={onClick}
                      >
                        View in App
                      </Button>
                      <Button
                        variant="outline"
                        className="w-fit"
                        asChild
                      >
                        <a href={item.link} target="_blank" rel="noopener noreferrer">
                          Open in New Tab <ExternalLink className="ml-2 h-4 w-4" />
                        </a>
                      </Button>
                    </>
                  )}
                </div>
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
            {isEditing && (
              <>
                <ContextMenuItem onClick={() => onSave(form.getValues())}>
                  <Save className="h-4 w-4 mr-2" />
                  Save
                </ContextMenuItem>
                <ContextMenuItem onClick={onCancel}>
                  <X className="h-4 w-4 mr-2" />
                  Cancel
                </ContextMenuItem>
              </>
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