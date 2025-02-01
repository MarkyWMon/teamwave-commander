import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Edit2, Leaf, Grid3X3 } from "lucide-react";

interface PitchCardProps {
  pitch: {
    id: string;
    name: string;
    surface_type: string;
    lighting_type: string;
    city: string;
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
  return (
    <Card className="w-full hover:shadow-md transition-shadow">
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
          onClick={() => onEdit(pitch)}
        >
          <Edit2 className="h-4 w-4 mr-2" />
          Edit
        </Button>
      </CardFooter>
    </Card>
  );
};

export default PitchCard;