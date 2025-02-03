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
  const { data: teams, isLoading } = useQuery({
    queryKey: [isOpponent ? "opponent-teams" : "home-teams"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("teams")
        .select("*")
        .eq("is_opponent", isOpponent)
        .order("name");
      
      if (error) throw error;
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