import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";
import { ImageUploadField } from "./ImageUploadField";

type PortfolioFormData = {
  header: string;
  description: string;
  link: string;
  sort_order: number;
  image_url?: string;
};

type PortfolioItemFormProps = {
  initialData?: PortfolioFormData;
  id?: number;
};

export const PortfolioItemForm = ({ initialData, id }: PortfolioItemFormProps) => {
  const { toast } = useToast();
  const navigate = useNavigate();

  const form = useForm<PortfolioFormData>({
    defaultValues: initialData || {
      header: "",
      description: "",
      link: "",
      sort_order: 0,
      image_url: "",
    },
  });

  const onSubmit = async (data: PortfolioFormData) => {
    try {
      if (id) {
        const { error } = await supabase
          .from("portfolio_cards")
          .update(data)
          .eq("id", id);

        if (error) throw error;

        toast({
          title: "Success",
          description: "Portfolio item updated successfully",
        });
      } else {
        const { error } = await supabase.from("portfolio_cards").insert(data);

        if (error) throw error;

        toast({
          title: "Success",
          description: "Portfolio item created successfully",
        });
      }

      navigate("/dashboard");
    } catch (error) {
      console.error("Error:", error);
      toast({
        title: "Error",
        description: "Failed to save portfolio item",
        variant: "destructive",
      });
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <FormField
          control={form.control}
          name="header"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Title</FormLabel>
              <FormControl>
                <Input placeholder="Enter title" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Description</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Enter description"
                  className="resize-none"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="link"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Demo Link</FormLabel>
              <FormControl>
                <Input placeholder="Enter demo link" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="sort_order"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Sort Order</FormLabel>
              <FormControl>
                <Input
                  type="number"
                  placeholder="Enter sort order"
                  {...field}
                  onChange={(e) => field.onChange(Number(e.target.value))}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <ImageUploadField form={form} initialImageUrl={initialData?.image_url} />

        <Button type="submit">
          {id ? "Update" : "Create"} Portfolio Item
        </Button>
      </form>
    </Form>
  );
};