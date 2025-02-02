import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";

interface PitchViewDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  pitch: {
    name: string;
    address_line1: string;
    city: string;
    postal_code: string;
    surface_type: string;
  };
}

const PitchViewDialog = ({ open, onOpenChange, pitch }: PitchViewDialogProps) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>{pitch.name}</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div>
            <h4 className="text-sm font-medium text-muted-foreground">Address</h4>
            <p className="mt-1">{pitch.address_line1}</p>
            <p>{pitch.city}</p>
            <p>{pitch.postal_code}</p>
          </div>
          <div>
            <h4 className="text-sm font-medium text-muted-foreground">Surface Type</h4>
            <p className="mt-1 capitalize">{pitch.surface_type.replace('_', ' ')}</p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default PitchViewDialog;