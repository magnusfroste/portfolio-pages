import { useEffect, useState } from "react";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";
import { Card, CardContent } from "@/components/ui/card";
import { supabase } from "@/integrations/supabase/client";
import { ImageUploadField } from "./ImageUploadField";
import { useForm } from "react-hook-form";
import { Button } from "./ui/button";
import { useToast } from "./ui/use-toast";
import { Loader2 } from "lucide-react";

type CarouselImage = {
  id: number;
  image_url: string;
  caption: string | null;
  sort_order: number | null;
};

export const ImageCarousel = () => {
  const [images, setImages] = useState<CarouselImage[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();
  const form = useForm({
    defaultValues: {
      image_url: "",
      caption: "",
    },
  });

  const fetchImages = async () => {
    try {
      const { data, error } = await supabase
        .from("portfolio_carousel")
        .select("*")
        .order("sort_order", { ascending: true });

      if (error) throw error;
      setImages(data || []);
    } catch (error) {
      console.error("Error fetching images:", error);
      toast({
        title: "Error",
        description: "Failed to load carousel images",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchImages();
  }, []);

  const onSubmit = async (values: { image_url: string; caption: string }) => {
    try {
      const { error } = await supabase.from("portfolio_carousel").insert({
        image_url: values.image_url,
        caption: values.caption,
        sort_order: images.length,
      });

      if (error) throw error;

      toast({
        title: "Success",
        description: "Image added to carousel",
      });

      form.reset();
      fetchImages();
    } catch (error) {
      console.error("Error adding image:", error);
      toast({
        title: "Error",
        description: "Failed to add image to carousel",
        variant: "destructive",
      });
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <section className="py-20 px-4">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-3xl font-bold text-center mb-12 bg-clip-text text-transparent bg-gradient-to-r from-primary to-accent">
          Gallery
        </h2>

        {images.length > 0 ? (
          <Carousel className="w-full max-w-4xl mx-auto">
            <CarouselContent>
              {images.map((image) => (
                <CarouselItem key={image.id}>
                  <Card>
                    <CardContent className="flex aspect-video items-center justify-center p-0">
                      <img
                        src={image.image_url}
                        alt={image.caption || "Gallery image"}
                        className="w-full h-full object-cover"
                      />
                    </CardContent>
                  </Card>
                </CarouselItem>
              ))}
            </CarouselContent>
            <CarouselPrevious />
            <CarouselNext />
          </Carousel>
        ) : (
          <p className="text-center text-muted-foreground">No images in the carousel yet.</p>
        )}

        <form onSubmit={form.handleSubmit(onSubmit)} className="mt-8 max-w-md mx-auto space-y-4">
          <ImageUploadField form={form} />
          <Button type="submit" className="w-full">
            Add to Carousel
          </Button>
        </form>
      </div>
    </section>
  );
};