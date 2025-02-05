import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { PortfolioItemForm } from "@/components/PortfolioItemForm";

const EditPortfolioItem = () => {
  const { id } = useParams();
  const [portfolioItem, setPortfolioItem] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPortfolioItem = async () => {
      try {
        if (!id) return;
        
        const { data, error } = await supabase
          .from("portfolio_cards")
          .select("*")
          .eq("id", parseInt(id))
          .single();

        if (error) throw error;
        setPortfolioItem(data);
      } catch (error) {
        console.error("Error fetching portfolio item:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchPortfolioItem();
  }, [id]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!portfolioItem) {
    return <div>Portfolio item not found</div>;
  }

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">Edit Portfolio Item</h1>
      <PortfolioItemForm initialData={portfolioItem} id={parseInt(id as string)} />
    </div>
  );
};

export default EditPortfolioItem;