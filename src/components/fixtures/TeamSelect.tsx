import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Control } from "react-hook-form";

interface TeamSelectProps {
  control: Control<any>;
  name: string;
  label: string;
  isOpponent?: boolean;
}

const TeamSelect = ({ control, name, label, isOpponent = false }: TeamSelectProps) => {
  const { data: teams, isLoading } = useQuery({
    queryKey: [isOpponent ? "opponent-teams" : "home-teams"],
    queryFn: async () => {
      console.log("Fetching teams with is_opponent =", isOpponent); // Debug log
      
      const { data, error } = await supabase
        .from("teams")
        .select("*")
        .eq("is_opponent", isOpponent)
        .order("name");
      
      if (error) {
        console.error("Error fetching teams:", error);
        throw error;
      }
      
      console.log("Teams fetched:", data); // Debug log
      return data || [];
    },
  });

  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => (
        <FormItem>
          <FormLabel>{label}</FormLabel>
          <Select onValueChange={field.onChange} defaultValue={field.value}>
            <FormControl>
              <SelectTrigger>
                <SelectValue placeholder={`Select ${label.toLowerCase()}`} />
              </SelectTrigger>
            </FormControl>
            <SelectContent>
              {isLoading ? (
                <SelectItem value="loading" disabled>Loading teams...</SelectItem>
              ) : teams?.length === 0 ? (
                <SelectItem value="no-teams" disabled>
                  {isOpponent ? "No opponent teams found" : "No home teams found"}
                </SelectItem>
              ) : (
                teams?.map((team) => (
                  <SelectItem key={team.id} value={team.id}>
                    {team.name} ({team.age_group})
                  </SelectItem>
                ))
              )}
            </SelectContent>
          </Select>
          <FormMessage />
        </FormItem>
      )}
    />
  );
};

export default TeamSelect;