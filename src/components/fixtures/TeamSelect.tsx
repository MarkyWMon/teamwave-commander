import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Control } from "react-hook-form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Team } from "@/types/team";

interface TeamSelectProps {
  control: Control<any>;
  name: string;
  label: string;
  isOpponent?: boolean;
}

const TeamSelect = ({ control, name, label, isOpponent = false }: TeamSelectProps) => {
  const { data: session } = useQuery({
    queryKey: ["session"],
    queryFn: async () => {
      const { data: { session }, error } = await supabase.auth.getSession();
      if (error) throw error;
      if (!session) throw new Error("No session");
      return session;
    },
  });

  const { data: profile } = useQuery({
    queryKey: ["profile"],
    enabled: !!session?.user,
    queryFn: async () => {
      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", session!.user.id)
        .single();
      
      if (error) throw error;
      return data;
    },
  });

  const { data: teams, isLoading } = useQuery({
    queryKey: [isOpponent ? "opponent-teams" : "home-teams", profile?.managed_teams],
    enabled: isOpponent || !!profile,
    queryFn: async () => {
      console.log("Fetching teams with isOpponent:", isOpponent); // Debug log
      
      let query = supabase
        .from("teams")
        .select("*")
        .eq("is_opponent", isOpponent)
        .order("name");

      // If selecting home team, only show teams in managed_teams
      if (!isOpponent && profile?.managed_teams) {
        query = query.in("id", profile.managed_teams);
      }
      
      const { data, error } = await query;
      
      if (error) {
        console.error("Error fetching teams:", error); // Debug log
        throw error;
      }
      console.log("Fetched teams:", data); // Debug log
      return data;
    },
  });

  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => (
        <FormItem>
          <FormLabel>{label}</FormLabel>
          <Select
            disabled={isLoading}
            onValueChange={field.onChange}
            value={field.value}
          >
            <FormControl>
              <SelectTrigger>
                <SelectValue placeholder={`Select ${label.toLowerCase()}`} />
              </SelectTrigger>
            </FormControl>
            <SelectContent>
              {teams?.map((team) => (
                <SelectItem key={team.id} value={team.id}>
                  {team.name} ({team.age_group})
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <FormMessage />
        </FormItem>
      )}
    />
  );
};

export default TeamSelect;