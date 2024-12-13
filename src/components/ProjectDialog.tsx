import { Dialog, DialogContent } from "@/components/ui/dialog";

type PortfolioCard = {
  id: number;
  header: string;
  description: string;
  link: string;
  image_url: string;
  sort_order: number;
};

type ProjectDialogProps = {
  isOpen: boolean;
  onClose: () => void;
  project: PortfolioCard | null;
};

export const ProjectDialog = ({ isOpen, onClose, project }: ProjectDialogProps) => {
  if (!project) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl">
        <div className="grid gap-4">
          <div className="space-y-2">
            <h2 className="text-2xl font-bold">{project.header}</h2>
            <p className="text-zinc-500 dark:text-zinc-400">{project.description}</p>
          </div>
          <div className="aspect-video overflow-hidden rounded-lg">
            <iframe
              src={project.link}
              className="w-full h-full"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};