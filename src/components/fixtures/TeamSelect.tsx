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

const TeamSelect = ({ control, name, label, isOpponent = false }: TeamSelectProps) => {
  const [open, setOpen] = useState(false);
  const [searchValue, setSearchValue] = useState("");

  const { data: teams = [], isLoading } = useQuery({
    queryKey: [isOpponent ? "opponent-teams" : "home-teams"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("teams")
        .select("*")
        .eq("is_opponent", isOpponent)
        .order("name");
      
      if (error) {
        console.error("Error fetching teams:", error);
        throw error;
      }
      
      return data || [];
    },
  });

  const filteredTeams = teams.filter(team => 
    team.name.toLowerCase().includes(searchValue.toLowerCase()) ||
    team.age_group.toLowerCase().includes(searchValue.toLowerCase())
  );

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
                >
                  {isLoading ? (
                    <div className="flex items-center gap-2">
                      <Loader2 className="h-4 w-4 animate-spin" />
                      Loading...
                    </div>
                  ) : field.value ? (
                    teams.find((team) => team.id === field.value)?.name || "Select team"
                  ) : (
                    `Select ${label.toLowerCase()}`
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
                <CommandEmpty>No team found.</CommandEmpty>
                <CommandGroup className="max-h-[300px] overflow-y-auto">
                  {isLoading ? (
                    <CommandItem disabled>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
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
                        value={team.id}
                        onSelect={() => {
                          field.onChange(team.id);
                          setOpen(false);
                        }}
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
            </PopoverContent>
          </Popover>
          <FormMessage />
        </FormItem>
      )}
    />
  );
};

export default TeamSelect;