import { useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import PitchForm from "@/components/PitchForm";

interface PitchDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  pitch?: any;
  onClose: () => void;
}

const PitchDialog = ({ open, onOpenChange, pitch, onClose }: PitchDialogProps) => {
  useEffect(() => {
    if (!open) {
      onClose();
    }
  }, [open, onClose]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{pitch ? "Edit Pitch" : "Add New Pitch"}</DialogTitle>
        </DialogHeader>
        <PitchForm pitch={pitch} onSuccess={() => onOpenChange(false)} />
      </DialogContent>
    </Dialog>
  );
};

export default PitchDialog;