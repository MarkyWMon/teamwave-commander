import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Control } from "react-hook-form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface PitchSelectProps {
  control: Control<any>;
}

const PitchSelect = ({ control }: PitchSelectProps) => {
  const { data: pitches = [] } = useQuery({
    queryKey: ["pitches"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("pitches")
        .select("*")
        .order("name");
      
      if (error) throw error;
      return data || [];
    },
  });

  return (
    <FormField
      control={control}
      name="pitch_id"
      render={({ field }) => (
        <FormItem>
          <FormLabel>Pitch</FormLabel>
          <Select onValueChange={field.onChange} defaultValue={field.value}>
            <FormControl>
              <SelectTrigger className="bg-background">
                <SelectValue placeholder="Select pitch" />
              </SelectTrigger>
            </FormControl>
            <SelectContent className="bg-background">
              {pitches?.map((pitch) => (
                <SelectItem key={pitch.id} value={pitch.id}>
                  {pitch.name}
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

export default PitchSelect;