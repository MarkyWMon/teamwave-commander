import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Edit2 } from "lucide-react";

interface PitchListProps {
  pitches: any[];
  onEdit: (pitch: any) => void;
}

const PitchList = ({ pitches, onEdit }: PitchListProps) => {
  return (
    <div className="border rounded-lg">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Location</TableHead>
            <TableHead>Surface</TableHead>
            <TableHead>Lighting</TableHead>
            <TableHead className="w-[100px]">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {pitches.map((pitch) => (
            <TableRow key={pitch.id}>
              <TableCell className="font-medium">{pitch.name}</TableCell>
              <TableCell>{pitch.city}</TableCell>
              <TableCell>{pitch.surface_type.replace(/_/g, " ")}</TableCell>
              <TableCell>{pitch.lighting_type.replace(/_/g, " ")}</TableCell>
              <TableCell>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => onEdit(pitch)}
                >
                  <Edit2 className="h-4 w-4" />
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default PitchList;