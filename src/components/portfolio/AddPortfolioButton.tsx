import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";

type AddPortfolioButtonProps = {
  onAdd: () => void;
};

export const AddPortfolioButton = ({ onAdd }: AddPortfolioButtonProps) => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="mt-8 flex justify-center"
    >
      <Button
        variant="outline"
        size="lg"
        onClick={onAdd}
        className="flex items-center gap-2"
      >
        <Plus className="h-4 w-4" />
        Add New Project
      </Button>
    </motion.div>
  );
};