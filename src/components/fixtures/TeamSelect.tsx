import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Control } from "react-hook-form";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem } from "@/components/ui/command";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { Check, Loader2 } from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Button } from "@/components/ui/button";

interface TeamSelectProps {
  control: Control<any>;
  name: string;
  label: string;
  isOpponent?: boolean;
}

interface Team {
  id: string;
  name: string;
  age_group: string;
}

const TeamSelect = ({ control, name, label, isOpponent = false }: TeamSelectProps) => {
  const [open, setOpen] = useState(false);
  const [searchValue, setSearchValue] = useState("");

  const { data: teams = [], isLoading, error } = useQuery<Team[]>({
    queryKey: [isOpponent ? "opponent-teams" : "home-teams"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("teams")
        .select("id, name, age_group")
        .eq("is_opponent", isOpponent)
        .order("name");
      
      if (error) throw error;
      return data || [];
    },
    retry: 2,
    staleTime: 30000,
  });

  // Ensure teams is never undefined before filtering
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
        <FormItem>
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
                    getSelectedTeamName(field.value) || `Select ${label.toLowerCase()}`
                  )}
                </Button>
              </FormControl>
            </PopoverTrigger>
            <PopoverContent className="w-[--radix-popover-trigger-width] p-0">
              {error ? (
                <div className="p-4 text-sm text-destructive">
                  Error loading teams. Please try again.
                </div>
              ) : (
                <Command>
                  <CommandInput
                    placeholder={`Search ${label.toLowerCase()}...`}
                    value={searchValue}
                    onValueChange={setSearchValue}
                    className="h-9"
                  />
                  <CommandEmpty>No team found.</CommandEmpty>
                  <CommandGroup className="max-h-[300px] overflow-y-auto">
                    {isLoading ? (
                      <CommandItem disabled className="flex items-center gap-2">
                        <Loader2 className="h-4 w-4 animate-spin" />
                        Loading teams...
                      </CommandItem>
                    ) : filteredTeams.length === 0 ? (
                      <CommandItem disabled>
                        {isOpponent ? "No opponent teams found" : "No home teams found"}
                      </CommandItem>
                    ) : (
                      filteredTeams.map((team) => (
                        <CommandItem
                          key={team.id}
                          onSelect={() => {
                            field.onChange(team.id);
                            setOpen(false);
                          }}
                          className="cursor-pointer"
                        >
                          <Check
                            className={cn(
                              "mr-2 h-4 w-4",
                              field.value === team.id ? "opacity-100" : "opacity-0"
                            )}
                          />
                          {team.name} ({team.age_group})
                        </CommandItem>
                      ))
                    )}
                  </CommandGroup>
                </Command>
              )}
            </PopoverContent>
          </Popover>
          <FormMessage />
        </FormItem>
      )}
    />
  );
};

export default TeamSelect;