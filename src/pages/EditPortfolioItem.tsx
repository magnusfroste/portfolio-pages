import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { PortfolioItemForm } from "@/components/PortfolioItemForm";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";

const EditPortfolioItem = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [portfolioItem, setPortfolioItem] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchPortfolioItem = async () => {
      try {
        const { data, error } = await supabase
          .from("portfolio_cards")
          .select("*")
          .eq("id", id)
          .single();

        if (error) throw error;

        setPortfolioItem(data);
      } catch (error) {
        console.error("Error:", error);
        toast({
          title: "Error",
          description: "Failed to load portfolio item",
          variant: "destructive",
        });
        navigate("/dashboard");
      } finally {
        setIsLoading(false);
      }
    };

    fetchPortfolioItem();
  }, [id, navigate, toast]);

  if (isLoading) {
    return (
      <div className="container mx-auto p-6">
        <h1 className="text-2xl font-bold mb-6">Loading...</h1>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">Edit Portfolio Item</h1>
      <PortfolioItemForm initialData={portfolioItem} id={Number(id)} />
    </div>
  );
};

export default EditPortfolioItem;