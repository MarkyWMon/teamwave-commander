import { Team } from "@/types/team";
import { Check, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  CommandEmpty,
  CommandGroup,
  CommandItem,
} from "@/components/ui/command";

interface TeamSelectListProps {
  isLoading: boolean;
  error: Error | null;
  teams: Team[];
  selectedValue: string;
  onSelect: (value: string) => void;
  setOpen: (open: boolean) => void;
}

const TeamSelectList = ({
  isLoading,
  error,
  teams,
  selectedValue,
  onSelect,
  setOpen,
}: TeamSelectListProps) => {
  if (isLoading) {
    return (
      <CommandGroup>
        <CommandItem disabled className="flex items-center gap-2">
          <Loader2 className="h-4 w-4 animate-spin" />
          Loading teams...
        </CommandItem>
      </CommandGroup>
    );
  }

  if (error) {
    return (
      <CommandGroup>
        <CommandItem disabled className="text-destructive">
          Error loading teams. Please try again.
        </CommandItem>
      </CommandGroup>
    );
  }

  if (teams.length === 0) {
    return (
      <CommandEmpty>No teams found.</CommandEmpty>
    );
  }

  return (
    <CommandGroup className="max-h-[300px] overflow-y-auto">
      {teams.map((team) => (
        <CommandItem
          key={team.id}
          onSelect={() => {
            onSelect(team.id);
            setOpen(false);
          }}
          className="cursor-pointer"
        >
          <Check
            className={cn(
              "mr-2 h-4 w-4",
              selectedValue === team.id ? "opacity-100" : "opacity-0"
            )}
          />
          {team.name} ({team.age_group})
        </CommandItem>
      ))}
    </CommandGroup>
  );
};

export default TeamSelectList;