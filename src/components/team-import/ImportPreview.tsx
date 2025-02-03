import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useState } from "react";
import TeamEditorDialog from "./TeamEditorDialog";
import BulkSettings from "./BulkSettings";

interface ImportedTeam {
  name: string;
  contact_name?: string;
  contact_email?: string;
  contact_phone?: string;
}

interface ImportPreviewProps {
  teams: ImportedTeam[];
  onTeamUpdate: (index: number, updatedTeam: ImportedTeam) => void;
  onBack: () => void;
  onSubmit: () => void;
  isLoading: boolean;
  roles: readonly string[];
}

const ImportPreview = ({ 
  teams, 
  onTeamUpdate,
  onBack, 
  onSubmit, 
  isLoading,
  roles
}: ImportPreviewProps) => {
  const [selectedTeam, setSelectedTeam] = useState<ImportedTeam | null>(null);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const ageGroups = Array.from({ length: 11 }, (_, i) => `U${i + 8}`);
  const [selectedAgeGroup, setSelectedAgeGroup] = useState<string>("U12");
  const [isOpponent, setIsOpponent] = useState(true);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between mb-4">
        <Button variant="outline" onClick={onBack}>
          Back to Mapping
        </Button>
        <Button onClick={onSubmit} disabled={isLoading}>
          {isLoading ? "Importing..." : "Import Teams"}
        </Button>
      </div>

      <BulkSettings
        selectedAgeGroup={selectedAgeGroup}
        onAgeGroupChange={setSelectedAgeGroup}
        isOpponent={isOpponent}
        onOpponentChange={setIsOpponent}
        ageGroups={ageGroups}
      />

      <div className="space-y-4">
        <h3 className="font-medium">Teams to Import</h3>
        {teams.map((team, index) => (
          <Card 
            key={index} 
            className="cursor-pointer hover:bg-gray-50 transition-colors"
            onClick={() => {
              setSelectedTeam(team);
              setEditDialogOpen(true);
            }}
          >
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

      {selectedTeam && (
        <TeamEditorDialog
          team={selectedTeam}
          onSave={(updatedTeam) => {
            const index = teams.findIndex(t => t === selectedTeam);
            if (index !== -1) {
              onTeamUpdate(index, updatedTeam);
            }
          }}
          open={editDialogOpen}
          onOpenChange={setEditDialogOpen}
          roles={roles}
        />
      )}

      <div className="flex gap-2 justify-end">
        <Button variant="outline" onClick={onBack}>
          Back to Mapping
        </Button>
        <Button onClick={onSubmit} disabled={isLoading}>
          {isLoading ? "Importing..." : "Import Teams"}
        </Button>
      </div>
    </div>
  );
};

export default ImportPreview;