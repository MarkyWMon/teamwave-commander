import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import Papa from "papaparse";
import { TablesInsert } from "@/integrations/supabase/types";
import { Card, CardContent } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";

interface TeamImportDialogProps {
  onSuccess?: () => void;
}

type TeamInsert = TablesInsert<"teams">;
type TeamOfficialInsert = TablesInsert<"team_officials">;

interface ImportedTeam {
  name: string;
  contact_name?: string;
  contact_email?: string;
  contact_phone?: string;
}

const ageGroups = Array.from({ length: 11 }, (_, i) => `U${i + 8}`);
const roles = ["manager", "coach", "assistant_manager", "fixtures_secretary"] as const;

const TeamImportDialog = ({ onSuccess }: TeamImportDialogProps) => {
  const [file, setFile] = useState<File | null>(null);
  const [headers, setHeaders] = useState<string[]>([]);
  const [mappings, setMappings] = useState<Record<string, string>>({});
  const [importedTeams, setImportedTeams] = useState<ImportedTeam[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedAgeGroup, setSelectedAgeGroup] = useState<string>("U12");
  const [isOpponent, setIsOpponent] = useState(true);
  const [selectedRole, setSelectedRole] = useState<typeof roles[number]>("fixtures_secretary");
  const [showPreview, setShowPreview] = useState(false);

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

  const handlePreview = () => {
    if (!file || !mappings.name) return;

    Papa.parse(file, {
      header: true,
      complete: (results) => {
        const teams = results.data.map((row: any) => ({
          name: row[mappings.name],
          contact_name: mappings.contact_name ? row[mappings.contact_name] : undefined,
          contact_email: mappings.contact_email ? row[mappings.contact_email] : undefined,
          contact_phone: mappings.contact_phone ? row[mappings.contact_phone] : undefined,
        }));
        setImportedTeams(teams);
        setShowPreview(true);
      },
    });
  };

  const handleSubmit = async () => {
    try {
      setIsLoading(true);
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) throw new Error("No session");

      // Create import record
      const { data: importRecord, error: importError } = await supabase
        .from("team_imports")
        .insert({
          created_by: session.user.id,
          file_name: file!.name,
          field_mappings: mappings,
        })
        .select()
        .single();

      if (importError) throw importError;

      // Process teams and officials
      for (const team of importedTeams) {
        // Insert team
        const { data: newTeam, error: teamError } = await supabase
          .from("teams")
          .insert({
            name: isOpponent ? team.name : `Withdean Youth ${team.name}`,
            age_group: selectedAgeGroup,
            is_opponent: isOpponent,
            created_by: session.user.id,
            gender: "boys",
            team_color: isOpponent ? "blue" : team.name,
          })
          .select()
          .single();

        if (teamError) throw teamError;

        // Insert team official if contact details exist
        if (team.contact_name) {
          const { error: officialError } = await supabase
            .from("team_officials")
            .insert({
              team_id: newTeam.id,
              full_name: team.contact_name,
              role: selectedRole,
              email: team.contact_email || null,
              phone: team.contact_phone || null,
            });

          if (officialError) throw officialError;
        }
      }

      toast.success("Teams imported successfully");
      onSuccess?.();
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {!showPreview ? (
        <>
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
              
              <div className="space-y-2">
                <label className="text-sm font-medium">Team Name</label>
                <Select
                  onValueChange={(value) => setMappings((prev) => ({ ...prev, name: value }))}
                  value={mappings.name}
                >
                  <SelectTrigger className="bg-background">
                    <SelectValue placeholder="Select team name field" />
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

              <div className="space-y-2">
                <label className="text-sm font-medium">Contact Name</label>
                <Select
                  onValueChange={(value) => setMappings((prev) => ({ ...prev, contact_name: value }))}
                  value={mappings.contact_name}
                >
                  <SelectTrigger className="bg-background">
                    <SelectValue placeholder="Select contact name field" />
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

              <div className="space-y-2">
                <label className="text-sm font-medium">Contact Email</label>
                <Select
                  onValueChange={(value) => setMappings((prev) => ({ ...prev, contact_email: value }))}
                  value={mappings.contact_email}
                >
                  <SelectTrigger className="bg-background">
                    <SelectValue placeholder="Select contact email field" />
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

              <div className="space-y-2">
                <label className="text-sm font-medium">Contact Phone</label>
                <Select
                  onValueChange={(value) => setMappings((prev) => ({ ...prev, contact_phone: value }))}
                  value={mappings.contact_phone}
                >
                  <SelectTrigger className="bg-background">
                    <SelectValue placeholder="Select contact phone field" />
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

              <Button
                onClick={handlePreview}
                disabled={!mappings.name}
                className="w-full"
              >
                Preview Import
              </Button>
            </div>
          )}
        </>
      ) : (
        <div className="space-y-6">
          <div className="space-y-4">
            <h3 className="font-medium">Bulk Settings</h3>
            
            <div className="space-y-2">
              <Label>Age Group (applies to all teams)</Label>
              <Select onValueChange={setSelectedAgeGroup} value={selectedAgeGroup}>
                <SelectTrigger className="bg-background">
                  <SelectValue placeholder="Select age group" />
                </SelectTrigger>
                <SelectContent>
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
                  onCheckedChange={(checked) => setIsOpponent(checked as boolean)}
                />
                <span>Opponent Teams</span>
              </div>
            </div>

            <div className="space-y-2">
              <Label>Contact Role</Label>
              <Select onValueChange={(value: typeof roles[number]) => setSelectedRole(value)} value={selectedRole}>
                <SelectTrigger className="bg-background">
                  <SelectValue placeholder="Select role" />
                </SelectTrigger>
                <SelectContent>
                  {roles.map((role) => (
                    <SelectItem key={role} value={role}>
                      {role.replace("_", " ")}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="font-medium">Teams to Import</h3>
            {importedTeams.map((team, index) => (
              <Card key={index}>
                <CardContent className="pt-6">
                  <div className="space-y-2">
                    <p><strong>Team:</strong> {team.name}</p>
                    {team.contact_name && <p><strong>Contact:</strong> {team.contact_name}</p>}
                    {team.contact_email && <p><strong>Email:</strong> {team.contact_email}</p>}
                    {team.contact_phone && <p><strong>Phone:</strong> {team.contact_phone}</p>}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="flex gap-2 justify-end">
            <Button variant="outline" onClick={() => setShowPreview(false)}>
              Back to Mapping
            </Button>
            <Button onClick={handleSubmit} disabled={isLoading}>
              {isLoading ? "Importing..." : "Import Teams"}
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default TeamImportDialog;