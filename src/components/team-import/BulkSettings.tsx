import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";

interface BulkSettingsProps {
  selectedAgeGroup: string;
  onAgeGroupChange: (value: string) => void;
  isOpponent: boolean;
  onOpponentChange: (checked: boolean) => void;
  ageGroups: string[];
}

const BulkSettings = ({
  selectedAgeGroup,
  onAgeGroupChange,
  isOpponent,
  onOpponentChange,
  ageGroups
}: BulkSettingsProps) => {
  return (
    <div className="space-y-4">
      <h3 className="font-medium">Bulk Settings</h3>
      
      <div className="space-y-2">
        <Label>Age Group (applies to all teams)</Label>
        <Select onValueChange={onAgeGroupChange} value={selectedAgeGroup}>
          <SelectTrigger className="bg-white">
            <SelectValue placeholder="Select age group" />
          </SelectTrigger>
          <SelectContent className="bg-white border shadow-lg">
            {ageGroups.map((age) => (
              <SelectItem key={age} value={age}>
                {age}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label>Team Type</Label>
        <div className="flex items-center space-x-2">
          <Checkbox
            checked={isOpponent}
            onCheckedChange={(checked) => onOpponentChange(checked as boolean)}
          />
          <span>{isOpponent ? "Opponent Teams" : "Home Teams"}</span>
        </div>
      </div>
    </div>
  );
};

export default BulkSettings;