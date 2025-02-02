import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import FixtureForm from "./FixtureForm";

interface FixtureDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const FixtureDialog = ({ open, onOpenChange }: FixtureDialogProps) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Create New Fixture</DialogTitle>
        </DialogHeader>
        <FixtureForm onSuccess={() => onOpenChange(false)} />
      </DialogContent>
    </Dialog>
  );
};

export default FixtureDialog;