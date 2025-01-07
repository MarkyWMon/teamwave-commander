import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useToast } from "@/components/ui/use-toast";
import { createTeam, getTeams } from "@/services/teamService";
import type { Team } from "@/types/team";

const Teams = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [isCreating, setIsCreating] = useState(false);

  const { data: teams, isLoading } = useQuery({
    queryKey: ['teams'],
    queryFn: () => getTeams(false),
  });

  const createTeamMutation = useMutation({
    mutationFn: createTeam,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['teams'] });
      setIsCreating(false);
      toast({
        title: "Success",
        description: "Team created successfully",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Failed to create team",
        variant: "destructive",
      });
      console.error("Error creating team:", error);
    },
  });

  const handleCreateTeam = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    
    const teamData = {
      name: `Withdean Youth ${formData.get('gender')} ${formData.get('color')} U${formData.get('ageGroup')}`,
      isOpponent: false,
      ageGroup: `U${formData.get('ageGroup')}`,
      gender: formData.get('gender') as 'boys' | 'girls' | 'mixed',
      colors: {
        primary: formData.get('primaryColor') as string,
        alternate: formData.get('alternateColor') as string,
      },
      weeklySchedule: {
        dayOfWeek: formData.get('matchDay') as string,
        time: formData.get('matchTime') as string,
      },
      personnel: [],
    };

    createTeamMutation.mutate(teamData as any);
  };

  return (
    <div className="space-y-8">
      <div className="space-y-2">
        <h1 className="text-4xl font-bold tracking-tight">Teams</h1>
        <p className="text-lg text-foreground/60">
          Manage your teams and their information
        </p>
      </div>

      <Button onClick={() => setIsCreating(true)} className="mb-6">
        Create New Team
      </Button>

      {isCreating && (
        <form onSubmit={handleCreateTeam} className="space-y-4 p-6 border rounded-lg bg-card">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Age Group</label>
              <Input name="ageGroup" type="number" min="7" max="18" required />
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium">Gender</label>
              <Select name="gender" required>
                <SelectTrigger>
                  <SelectValue placeholder="Select gender" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="boys">Boys</SelectItem>
                  <SelectItem value="girls">Girls</SelectItem>
                  <SelectItem value="mixed">Mixed</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Team Color</label>
              <Input name="color" placeholder="e.g. Red" required />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Primary Color</label>
              <Input name="primaryColor" type="color" required />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Alternate Color</label>
              <Input name="alternateColor" type="color" required />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Match Day</label>
              <Select name="matchDay" required>
                <SelectTrigger>
                  <SelectValue placeholder="Select day" />
                </SelectTrigger>
                <SelectContent>
                  {['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'].map(day => (
                    <SelectItem key={day} value={day.toLowerCase()}>{day}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Match Time</label>
              <Input name="matchTime" type="time" required />
            </div>
          </div>

          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => setIsCreating(false)}>
              Cancel
            </Button>
            <Button type="submit">Create Team</Button>
          </div>
        </form>
      )}

      {isLoading ? (
        <div>Loading teams...</div>
      ) : (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Team Name</TableHead>
              <TableHead>Age Group</TableHead>
              <TableHead>Match Schedule</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {teams?.map((team) => (
              <TableRow key={team.id}>
                <TableCell>{team.name}</TableCell>
                <TableCell>{team.ageGroup}</TableCell>
                <TableCell>
                  {team.weeklySchedule.dayOfWeek} at {team.weeklySchedule.time}
                </TableCell>
                <TableCell>
                  <Button variant="outline" size="sm">
                    Edit
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}
    </div>
  );
};

export default Teams;