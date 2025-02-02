import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import Papa from "papaparse";
import { TablesInsert } from "@/integrations/supabase/types";

interface TeamImportDialogProps {
  onSuccess?: () => void;
}

type TeamInsert = TablesInsert<"teams">;

const TeamImportDialog = ({ onSuccess }: TeamImportDialogProps) => {
  const [file, setFile] = useState<File | null>(null);
  const [headers, setHeaders] = useState<string[]>([]);
  const [mappings, setMappings] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      setFile(selectedFile);
      Papa.parse(selectedFile, {
        header: true,
        preview: 1,
        complete: (results) => {
          if (results.meta.fields) {
            setHeaders(results.meta.fields);
          }
        },
      });
    }
  };

  const handleSubmit = async () => {
    if (!file) return;

    try {
      setIsLoading(true);
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) throw new Error("No session");

      // Create import record
      const { data: importRecord, error: importError } = await supabase
        .from("team_imports")
        .insert({
          created_by: session.user.id,
          file_name: file.name,
          field_mappings: mappings,
        })
        .select()
        .single();

      if (importError) throw importError;

      // Process CSV file
      Papa.parse(file, {
        header: true,
        complete: async (results) => {
          const teams: TeamInsert[] = results.data.map((row: any) => ({
            name: row[mappings.name],
            age_group: row[mappings.age_group] || "U12",
            is_opponent: true,
            created_by: session.user.id,
            gender: "boys" as const,
            team_color: "blue",
          }));

          const { error: teamsError } = await supabase
            .from("teams")
            .insert(teams);

          if (teamsError) throw teamsError;

          toast.success("Teams imported successfully");
          onSuccess?.();
        },
        error: (error) => {
          throw new Error(error.message);
        },
      });
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const requiredFields = ["name", "age_group"];

  return (
    <div className="space-y-6">
      <div>
        <Input
          type="file"
          accept=".csv"
          onChange={handleFileChange}
          className="cursor-pointer"
        />
        <p className="text-sm text-muted-foreground mt-2">
          Upload a CSV file containing team information
        </p>
      </div>

      {headers.length > 0 && (
        <div className="space-y-4">
          <h3 className="font-medium">Map CSV Fields</h3>
          {requiredFields.map((field) => (
            <div key={field} className="space-y-2">
              <label className="text-sm font-medium">
                {field.replace("_", " ").charAt(0).toUpperCase() + field.slice(1)}
              </label>
              <Select
                onValueChange={(value) => setMappings((prev) => ({ ...prev, [field]: value }))}
                value={mappings[field]}
              >
                <SelectTrigger className="bg-background">
                  <SelectValue placeholder={`Select ${field.replace("_", " ")} field`} />
                </SelectTrigger>
                <SelectContent>
                  {headers.map((header) => (
                    <SelectItem key={header} value={header}>
                      {header}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          ))}

          <Button
            onClick={handleSubmit}
            disabled={isLoading || !requiredFields.every((field) => mappings[field])}
            className="w-full"
          >
            {isLoading ? "Importing..." : "Import Teams"}
          </Button>
        </div>
      )}
    </div>
  );
};

export default TeamImportDialog;