import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface ProjectDialogProps {
  isOpen: boolean;
  onClose: () => void;
  project: {
    title: string;
    demoLink: string;
  } | null;
}

export const ProjectDialog = ({ isOpen, onClose, project }: ProjectDialogProps) => {
  if (!project) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-[90vw] w-[1200px] h-[80vh]">
        <DialogHeader>
          <DialogTitle>{project.title}</DialogTitle>
        </DialogHeader>
        <div className="flex-1 h-full min-h-[500px] mt-4">
          <iframe
            src={project.demoLink}
            className="w-full h-full border rounded-lg"
            title={project.title}
          />
        </div>
      </DialogContent>
    </Dialog>
  );
};