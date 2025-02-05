import { useEffect, useState } from "react";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";
import { Card, CardContent } from "@/components/ui/card";
import { supabase } from "@/integrations/supabase/client";
import { ImageUploadField } from "./ImageUploadField";
import { useForm, FormProvider } from "react-hook-form";
import { Button } from "./ui/button";
import { useToast } from "./ui/use-toast";
import { Loader2, Image as ImageIcon } from "lucide-react";

type CarouselImage = {
  id: number;
  image_url: string;
  caption: string | null;
  sort_order: number | null;
};

export const ImageCarousel = () => {
  const [images, setImages] = useState<CarouselImage[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [session, setSession] = useState<any>(null);
  const { toast } = useToast();
  const form = useForm({
    defaultValues: {
      image_url: "",
      caption: "",
    },
  });

  useEffect(() => {
    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
    });

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    return () => subscription.unsubscribe();
  }, []);

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
      if (!session?.user?.id) {
        throw new Error("You must be logged in to add images");
      }

      const { error } = await supabase.from("portfolio_carousel").insert({
        image_url: values.image_url,
        caption: values.caption,
        sort_order: images.length,
        user_id: session.user.id,
      });

      if (error) throw error;

      toast({
        title: "Success",
        description: "Image added to carousel",
      });

      form.reset();
      fetchImages();
    } catch (error: any) {
      console.error("Error adding image:", error);
      toast({
        title: "Error",
        description: error.message || "Failed to add image to carousel",
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
        <h2 className="text-3xl font-bold text-center mb-12 bg-clip-text text-transparent bg-gradient-to-r from-primary to-accent flex items-center justify-center gap-3">
          <ImageIcon className="w-10 h-10 text-accent" />
          Featured In...
        </h2>

        {images.length > 0 ? (
          <Carousel className="w-full max-w-4xl mx-auto" opts={{ loop: true, align: "start", startIndex: 0, duration: 20 }}>
            <CarouselContent>
              {images.map((image) => (
                <CarouselItem key={image.id}>
                  <Card>
                    <CardContent className="flex aspect-[16/9] items-center justify-center p-0 overflow-hidden">
                      <img
                        src={image.image_url}
                        alt={image.caption || "Gallery image"}
                        className="w-full h-full object-contain"
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

        {session && (
          <FormProvider {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="mt-8 max-w-md mx-auto space-y-4">
              <ImageUploadField form={form} />
              <Button type="submit" className="w-full">
                Add to Featured In...
              </Button>
            </form>
          </FormProvider>
        )}
      </div>
    </section>
  );
};