import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { useState } from "react";

interface ImportedTeam {
  name: string;
  contact_name?: string;
  contact_email?: string;
  contact_phone?: string;
}

interface TeamEditorDialogProps {
  team: ImportedTeam;
  onSave: (updatedTeam: ImportedTeam) => void;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  roles: readonly string[];
}

const TeamEditorDialog = ({ team, onSave, open, onOpenChange, roles }: TeamEditorDialogProps) => {
  const [editedTeam, setEditedTeam] = useState(team);
  const [selectedRole, setSelectedRole] = useState<string>("fixtures_secretary");

  const handleInputChange = (field: keyof ImportedTeam, value: string) => {
    setEditedTeam(prev => ({
      ...prev,
      [field]: value
    }));
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-white">
        <DialogHeader>
          <DialogTitle>Edit Team Details</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div className="space-y-2">
            <Label>Team Name</Label>
            <Input
              value={editedTeam.name}
              onChange={(e) => handleInputChange('name', e.target.value)}
              placeholder="Enter team name"
            />
          </div>
          <div className="space-y-2">
            <Label>Contact Name</Label>
            <Input
              value={editedTeam.contact_name || ''}
              onChange={(e) => handleInputChange('contact_name', e.target.value)}
              placeholder="Enter contact name"
            />
          </div>
          <div className="space-y-2">
            <Label>Contact Email</Label>
            <Input
              type="email"
              value={editedTeam.contact_email || ''}
              onChange={(e) => handleInputChange('contact_email', e.target.value)}
              placeholder="Enter contact email"
            />
          </div>
          <div className="space-y-2">
            <Label>Contact Phone</Label>
            <Input
              type="tel"
              value={editedTeam.contact_phone || ''}
              onChange={(e) => handleInputChange('contact_phone', e.target.value)}
              placeholder="Enter contact phone"
            />
          </div>
          <div className="space-y-2">
            <Label>Contact Role</Label>
            <Select onValueChange={setSelectedRole} value={selectedRole}>
              <SelectTrigger className="bg-white">
                <SelectValue placeholder="Select role" />
              </SelectTrigger>
              <SelectContent className="bg-white border shadow-lg">
                {roles.map((role) => (
                  <SelectItem key={role} value={role}>
                    {role.replace("_", " ")}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <Button onClick={() => {
            onSave(editedTeam);
            onOpenChange(false);
          }}>
            Save Changes
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

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

      <div className="space-y-4">
        <h3 className="font-medium">Bulk Settings</h3>
        
        <div className="space-y-2">
          <Label>Age Group (applies to all teams)</Label>
          <Select onValueChange={setSelectedAgeGroup} value={selectedAgeGroup}>
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
              onCheckedChange={(checked) => setIsOpponent(checked as boolean)}
            />
            <span>{isOpponent ? "Opponent Teams" : "Home Teams"}</span>
          </div>
        </div>
      </div>

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