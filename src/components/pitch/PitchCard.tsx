import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Edit2, Leaf, Grid3X3 } from "lucide-react";
import { useState } from "react";
import PitchViewDialog from "./PitchViewDialog";
import PitchDialog from "./PitchDialog";

interface PitchCardProps {
  pitch: {
    id: string;
    name: string;
    surface_type: string;
    lighting_type: string;
    city: string;
    address_line1: string;
    postal_code: string;
  };
  onEdit: (pitch: any) => void;
}

const getSurfaceIcon = (type: string) => {
  switch (type) {
    case "grass":
      return <Leaf className="h-4 w-4 text-green-600" />;
    case "3g":
    case "4g":
    case "5g":
      return <Grid3X3 className="h-4 w-4 text-blue-600" />;
    default:
      return null;
  }
};

const PitchCard = ({ pitch, onEdit }: PitchCardProps) => {
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);

  return (
    <>
      <Card 
        className="w-full hover:shadow-md transition-shadow cursor-pointer"
        onClick={() => setIsViewDialogOpen(true)}
      >
        <CardContent className="pt-6">
          <div className="space-y-2">
            <div className="flex justify-between items-start">
              <h3 className="font-semibold text-lg">{pitch.name}</h3>
              <div className="flex gap-2">
                {getSurfaceIcon(pitch.surface_type)}
              </div>
            </div>
            <p className="text-sm text-muted-foreground">{pitch.city}</p>
          </div>
        </CardContent>
        <CardFooter>
          <Button
            variant="ghost"
            size="sm"
            className="ml-auto"
            onClick={(e) => {
              e.stopPropagation();
              setIsEditDialogOpen(true);
            }}
          >
            <Edit2 className="h-4 w-4 mr-2" />
            Edit
          </Button>
        </CardFooter>
      </Card>

      <PitchViewDialog 
        open={isViewDialogOpen}
        onOpenChange={setIsViewDialogOpen}
        pitch={pitch}
      />

      <PitchDialog
        open={isEditDialogOpen}
        onOpenChange={setIsEditDialogOpen}
        pitch={pitch}
        onClose={() => {
          setIsEditDialogOpen(false);
          onEdit(pitch);
        }}
      />
    </>
  );
};

export default PitchCard;