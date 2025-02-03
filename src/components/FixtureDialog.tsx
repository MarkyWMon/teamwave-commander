import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import FixtureForm from "./FixtureForm";

interface FixtureDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const FixtureDialog = ({ open, onOpenChange }: FixtureDialogProps) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto bg-background border shadow-lg">
        <DialogHeader>
          <DialogTitle>Create New Fixture</DialogTitle>
          <DialogDescription>
            Schedule a new match by selecting teams, venue, and time.
          </DialogDescription>
        </DialogHeader>
        <FixtureForm onSuccess={() => onOpenChange(false)} />
      </DialogContent>
    </Dialog>
  );
};

export default FixtureDialog;