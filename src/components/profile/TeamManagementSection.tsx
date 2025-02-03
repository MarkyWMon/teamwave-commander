import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Team } from "@/types/team";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

interface TeamManagementSectionProps {
  managedTeams: string[];
  onTeamsChange: (teamIds: string[]) => void;
}

const TeamManagementSection = ({ managedTeams, onTeamsChange }: TeamManagementSectionProps) => {
  const { data: teams, isLoading } = useQuery({
    queryKey: ["available-teams"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("teams")
        .select("*")
        .eq("is_opponent", false)
        .order("name");
      
      if (error) throw error;
      return data as Team[];
    },
  });

  const handleTeamToggle = (teamId: string, checked: boolean) => {
    if (checked) {
      onTeamsChange([...managedTeams, teamId]);
    } else {
      onTeamsChange(managedTeams.filter(id => id !== teamId));
    }
  };

  if (isLoading) return <div>Loading teams...</div>;

  return (
    <Card>
      <CardHeader>
        <CardTitle>Team Management</CardTitle>
        <CardDescription>Select the teams you manage</CardDescription>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-[200px] rounded-md border p-4">
          <div className="space-y-4">
            {teams?.map((team) => (
              <div key={team.id} className="flex items-center space-x-2">
                <Checkbox
                  id={team.id}
                  checked={managedTeams.includes(team.id)}
                  onCheckedChange={(checked) => handleTeamToggle(team.id, checked as boolean)}
                />
                <Label htmlFor={team.id} className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                  {team.name} ({team.age_group})
                </Label>
              </div>
            ))}
            {teams?.length === 0 && (
              <p className="text-sm text-muted-foreground">No teams available. Create some teams first.</p>
            )}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
};

export default TeamManagementSection;