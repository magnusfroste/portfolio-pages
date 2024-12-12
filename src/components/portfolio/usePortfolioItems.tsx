import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";
import { arrayMove } from "@dnd-kit/sortable";

export const usePortfolioItems = (session: any) => {
  const [portfolioItems, setPortfolioItems] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    const fetchPortfolioItems = async () => {
      try {
        const { data, error } = await supabase
          .from('portfolio_cards')
          .select('*')
          .order('sort_order', { ascending: true });

        if (error) throw error;
        setPortfolioItems(data || []);
      } catch (error) {
        console.error('Error:', error);
        toast({
          title: "Error",
          description: "Failed to fetch portfolio items",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchPortfolioItems();
  }, [toast]);

  const reorderItems = async (oldIndex: number, newIndex: number) => {
    try {
      const newItems = arrayMove(portfolioItems, oldIndex, newIndex);
      
      // Update the sort_order of all items
      const updates = newItems.map((item, index) => ({
        id: item.id,
        sort_order: index,
      }));

      const { error } = await supabase
        .from('portfolio_cards')
        .upsert(updates);

      if (error) throw error;

      setPortfolioItems(newItems);

      toast({
        title: "Success",
        description: "Portfolio items reordered successfully",
      });
    } catch (error) {
      console.error('Error reordering items:', error);
      toast({
        title: "Error",
        description: "Failed to reorder portfolio items",
        variant: "destructive",
      });
    }
  };

  const addNewCard = async () => {
    if (!session?.user?.id) {
      toast({
        title: "Error",
        description: "You must be logged in to add items",
        variant: "destructive",
      });
      return null;
    }

    try {
      const newCard = {
        header: "New Project",
        description: "Click to edit description",
        link: "",
        sort_order: portfolioItems.length,
        user_id: session.user.id
      };

      const { data, error } = await supabase
        .from('portfolio_cards')
        .insert([newCard])
        .select()
        .single();

      if (error) throw error;

      setPortfolioItems(prev => [...prev, data]);

      toast({
        title: "Success",
        description: "New portfolio item created",
      });
      
      return data.id;
    } catch (error) {
      console.error('Error adding new card:', error);
      toast({
        title: "Error",
        description: "Failed to create new portfolio item",
        variant: "destructive",
      });
      return null;
    }
  };

  const deleteItem = async (id: number) => {
    if (!session?.user?.id) {
      toast({
        title: "Error",
        description: "You must be logged in to delete items",
        variant: "destructive",
      });
      return;
    }

    try {
      const { error } = await supabase
        .from('portfolio_cards')
        .delete()
        .eq('id', id);

      if (error) throw error;

      setPortfolioItems(prevItems => prevItems.filter(item => item.id !== id));
      toast({
        title: "Success",
        description: "Portfolio item deleted successfully",
      });
    } catch (error) {
      console.error('Error deleting item:', error);
      toast({
        title: "Error",
        description: "Failed to delete portfolio item",
        variant: "destructive",
      });
    }
  };

  const updateItem = async (item: any, formData: any) => {
    if (!session?.user?.id) {
      toast({
        title: "Error",
        description: "You must be logged in to update items",
        variant: "destructive",
      });
      return false;
    }

    try {
      const { error } = await supabase
        .from('portfolio_cards')
        .update({
          header: formData.header,
          description: formData.description,
          link: formData.link,
          image_url: formData.image_url,
          user_id: session.user.id
        })
        .eq('id', item.id);

      if (error) throw error;

      setPortfolioItems(prevItems =>
        prevItems.map(prevItem =>
          prevItem.id === item.id
            ? { ...prevItem, ...formData }
            : prevItem
        )
      );

      toast({
        title: "Success",
        description: "Portfolio item updated successfully",
      });

      return true;
    } catch (error) {
      console.error('Error updating item:', error);
      toast({
        title: "Error",
        description: "Failed to update portfolio item",
        variant: "destructive",
      });
      return false;
    }
  };

  return {
    portfolioItems,
    isLoading,
    addNewCard,
    deleteItem,
    updateItem,
    reorderItems,
  };
};