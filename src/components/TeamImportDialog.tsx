import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import Papa from "papaparse";
import { TablesInsert } from "@/integrations/supabase/types";
import ImportFieldMapping from "./team-import/ImportFieldMapping";
import ImportPreview from "./team-import/ImportPreview";

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

const roles = ["manager", "coach", "assistant_manager", "fixtures_secretary"] as const;

const toTitleCase = (str: string) => {
  return str
    .toLowerCase()
    .split(' ')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
};

const TeamImportDialog = ({ onSuccess }: TeamImportDialogProps) => {
  const [file, setFile] = useState<File | null>(null);
  const [headers, setHeaders] = useState<string[]>([]);
  const [mappings, setMappings] = useState<Record<string, string>>({});
  const [importedTeams, setImportedTeams] = useState<ImportedTeam[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showPreview, setShowPreview] = useState(false);

  const handleFileChange = (selectedFile: File) => {
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
  };

  const handlePreview = () => {
    if (!file || !mappings.name) return;

    Papa.parse(file, {
      header: true,
      complete: (results) => {
        const teams = results.data.map((row: any) => ({
          name: toTitleCase(row[mappings.name]),
          contact_name: mappings.contact_name ? row[mappings.contact_name] : undefined,
          contact_email: mappings.contact_email ? row[mappings.contact_email] : undefined,
          contact_phone: mappings.contact_phone ? row[mappings.contact_phone] : undefined,
        }));
        setImportedTeams(teams);
        setShowPreview(true);
      },
    });
  };

  const handleTeamUpdate = (index: number, updatedTeam: ImportedTeam) => {
    const newTeams = [...importedTeams];
    newTeams[index] = updatedTeam;
    setImportedTeams(newTeams);
  };

  const handleSubmit = async () => {
    try {
      setIsLoading(true);
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) throw new Error("No session");

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

      for (const team of importedTeams) {
        const { data: newTeam, error: teamError } = await supabase
          .from("teams")
          .insert({
            name: team.name,
            age_group: "U12",
            created_by: session.user.id,
            gender: "boys",
            team_color: "blue",
            is_opponent: true,
          })
          .select()
          .single();

        if (teamError) throw teamError;

        if (team.contact_name) {
          const { error: officialError } = await supabase
            .from("team_officials")
            .insert({
              team_id: newTeam.id,
              full_name: team.contact_name,
              role: "fixtures_secretary",
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
        <ImportFieldMapping
          headers={headers}
          mappings={mappings}
          onMappingChange={(field, value) => setMappings(prev => ({ ...prev, [field]: value }))}
          onPreviewClick={handlePreview}
          file={file}
          onFileChange={handleFileChange}
        />
      ) : (
        <ImportPreview
          teams={importedTeams}
          onTeamUpdate={handleTeamUpdate}
          onBack={() => setShowPreview(false)}
          onSubmit={handleSubmit}
          isLoading={isLoading}
          roles={roles}
        />
      )}
    </div>
  );
};

export default TeamImportDialog;