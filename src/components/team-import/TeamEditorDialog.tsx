import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
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

export default TeamEditorDialog;