import { PortfolioItemForm } from "@/components/PortfolioItemForm";

const AddPortfolioItem = () => {
  return (
    <div className="container mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">Add Portfolio Item</h1>
      <PortfolioItemForm />
    </div>
  );
};

export default AddPortfolioItem;