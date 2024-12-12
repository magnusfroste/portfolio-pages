import { Save, X } from "lucide-react";
import { Button } from "../ui/button";

type PortfolioCardActionsProps = {
  onSave: () => void;
  onCancel: () => void;
};

export const PortfolioCardActions = ({ onSave, onCancel }: PortfolioCardActionsProps) => {
  return (
    <div className="flex gap-4">
      <Button
        variant="default"
        onClick={onSave}
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
  );
};