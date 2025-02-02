import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

interface ImportFieldMappingProps {
  headers: string[];
  mappings: Record<string, string>;
  onMappingChange: (field: string, value: string) => void;
  onPreviewClick: () => void;
  file: File | null;
}

const ImportFieldMapping = ({ 
  headers, 
  mappings, 
  onMappingChange, 
  onPreviewClick,
  file 
}: ImportFieldMappingProps) => {
  return (
    <div className="space-y-6">
      <div>
        <Input
          type="file"
          accept=".csv"
          onChange={(e) => e.target.files?.[0]}
          className="cursor-pointer"
        />
        <p className="text-sm text-muted-foreground mt-2">
          Upload a CSV file containing team information
        </p>
      </div>

      {headers.length > 0 && (
        <div className="space-y-4">
          <h3 className="font-medium">Map CSV Fields</h3>
          
          <div className="space-y-2">
            <Label>Team Name</Label>
            <Select
              onValueChange={(value) => onMappingChange("name", value)}
              value={mappings.name}
            >
              <SelectTrigger className="bg-white">
                <SelectValue placeholder="Select team name field" />
              </SelectTrigger>
              <SelectContent className="bg-white">
                {headers.map((header) => (
                  <SelectItem key={header} value={header}>
                    {header}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>Contact Name</Label>
            <Select
              onValueChange={(value) => onMappingChange("contact_name", value)}
              value={mappings.contact_name}
            >
              <SelectTrigger className="bg-white">
                <SelectValue placeholder="Select contact name field" />
              </SelectTrigger>
              <SelectContent className="bg-white">
                {headers.map((header) => (
                  <SelectItem key={header} value={header}>
                    {header}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>Contact Email</Label>
            <Select
              onValueChange={(value) => onMappingChange("contact_email", value)}
              value={mappings.contact_email}
            >
              <SelectTrigger className="bg-white">
                <SelectValue placeholder="Select contact email field" />
              </SelectTrigger>
              <SelectContent className="bg-white">
                {headers.map((header) => (
                  <SelectItem key={header} value={header}>
                    {header}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>Contact Phone</Label>
            <Select
              onValueChange={(value) => onMappingChange("contact_phone", value)}
              value={mappings.contact_phone}
            >
              <SelectTrigger className="bg-white">
                <SelectValue placeholder="Select contact phone field" />
              </SelectTrigger>
              <SelectContent className="bg-white">
                {headers.map((header) => (
                  <SelectItem key={header} value={header}>
                    {header}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <Button
            onClick={onPreviewClick}
            disabled={!mappings.name}
            className="w-full"
          >
            Preview Import
          </Button>
        </div>
      )}
    </div>
  );
};

export default ImportFieldMapping;