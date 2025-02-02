import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { UseFormReturn } from "react-hook-form";
import { useEffect } from "react";

const ageGroups = Array.from({ length: 11 }, (_, i) => `U${i + 8}`);
const DEFAULT_HOME_TEAM = "Withdean Youth FC";

interface TeamBasicInfoFormProps {
  form: UseFormReturn<any>;
}

const TeamBasicInfoForm = ({ form }: TeamBasicInfoFormProps) => {
  const isOpponent = form.watch("is_opponent");

  // Effect to handle team name population based on team type
  useEffect(() => {
    if (!isOpponent) {
      form.setValue("name", DEFAULT_HOME_TEAM);
    } else {
      // Only clear if it's the default home team name
      if (form.getValues("name") === DEFAULT_HOME_TEAM) {
        form.setValue("name", "");
      }
    }
  }, [isOpponent, form]);

  return (
    <div className="space-y-6">
      <FormField
        control={form.control}
        name="is_opponent"
        render={({ field }) => (
          <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
            <FormControl>
              <Checkbox
                checked={field.value}
                onCheckedChange={field.onChange}
              />
            </FormControl>
            <div className="space-y-1 leading-none">
              <FormLabel>Team Type</FormLabel>
              <p className="text-sm text-muted-foreground">
                {field.value ? "Opponent Team" : "Home Team"}
              </p>
            </div>
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="name"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Team Name</FormLabel>
            <FormControl>
              <Input 
                {...field} 
                placeholder={isOpponent ? "Enter opponent team name" : "Enter team name"}
                readOnly={!isOpponent}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      {!isOpponent && (
        <FormField
          control={form.control}
          name="team_color"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Team Color</FormLabel>
              <FormControl>
                <Input 
                  {...field} 
                  placeholder="Enter team color (e.g., Blue, Red)" 
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      )}

      <FormField
        control={form.control}
        name="age_group"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Age Group</FormLabel>
            <Select onValueChange={field.onChange} defaultValue={field.value}>
              <FormControl>
                <SelectTrigger className="bg-background">
                  <SelectValue placeholder="Select age group" />
                </SelectTrigger>
              </FormControl>
              <SelectContent className="bg-background border shadow-lg">
                {ageGroups.map((age) => (
                  <SelectItem key={age} value={age} className="cursor-pointer">
                    {age}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
};

export default TeamBasicInfoForm;