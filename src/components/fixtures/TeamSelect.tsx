import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Control } from "react-hook-form";
import { Command, CommandInput } from "@/components/ui/command";
import { useState } from "react";
import { Loader2, ChevronsUpDown } from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { Team } from "@/types/team";
import TeamSelectList from "./TeamSelectList";
import { cn } from "@/lib/utils";

interface TeamSelectProps {
  control: Control<any>;
  name: string;
  label: string;
  isOpponent?: boolean;
}

const TeamSelect = ({ control, name, label, isOpponent = false }: TeamSelectProps) => {
  const [open, setOpen] = useState(false);
  const [searchValue, setSearchValue] = useState("");

  const { data: teams, isLoading, error } = useQuery<Team[]>({
    queryKey: [isOpponent ? "opponent-teams" : "home-teams"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("teams")
        .select("*")
        .eq("is_opponent", isOpponent)
        .order("name");
      
      if (error) throw error;
      return data || [];
    },
  });

  const filteredTeams = teams?.filter(team => 
    team.name.toLowerCase().includes(searchValue.toLowerCase()) ||
    team.age_group.toLowerCase().includes(searchValue.toLowerCase())
  ) || [];

  const getSelectedTeamName = (value: string | undefined) => {
    if (!value || !teams) return "";
    const team = teams.find((team) => team.id === value);
    return team ? `${team.name} (${team.age_group})` : "";
  };

  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => (
        <FormItem className="flex flex-col">
          <FormLabel>{label}</FormLabel>
          <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
              <FormControl>
                <Button
                  variant="outline"
                  role="combobox"
                  aria-expanded={open}
                  className={cn(
                    "w-full justify-between",
                    !field.value && "text-muted-foreground"
                  )}
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <div className="flex items-center gap-2">
                      <Loader2 className="h-4 w-4 animate-spin" />
                      Loading...
                    </div>
                  ) : (
                    <>
                      {getSelectedTeamName(field.value) || `Select ${label.toLowerCase()}`}
                      <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                    </>
                  )}
                </Button>
              </FormControl>
            </PopoverTrigger>
            <PopoverContent className="w-[--radix-popover-trigger-width] p-0">
              <Command>
                <CommandInput
                  placeholder={`Search ${label.toLowerCase()}...`}
                  value={searchValue}
                  onValueChange={setSearchValue}
                  className="h-9"
                />
                <TeamSelectList
                  isLoading={isLoading}
                  error={error}
                  teams={filteredTeams}
                  selectedValue={field.value}
                  onSelect={field.onChange}
                  setOpen={setOpen}
                />
              </Command>
            </PopoverContent>
          </Popover>
          <FormMessage />
        </FormItem>
      )}
    />
  );
};

export default TeamSelect;