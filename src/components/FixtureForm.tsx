import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import TeamSelect from "./fixtures/TeamSelect";
import DateTimeSelect from "./fixtures/DateTimeSelect";
import { setHours, setMinutes, nextSunday } from "date-fns";

const formSchema = z.object({
  home_team_id: z.string().uuid("Please select a home team"),
  away_team_id: z.string().uuid("Please select an away team"),
  pitch_id: z.string().uuid("Please select a pitch"),
  match_date: z.date(),
  kick_off_time: z.string(),
  notes: z.string().optional(),
});

interface FixtureFormProps {
  onSuccess?: () => void;
}

const FixtureForm = ({ onSuccess }: FixtureFormProps) => {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      match_date: nextSunday(new Date()),
      kick_off_time: "14:00",
      notes: "",
    },
  });

  const { data: session } = useQuery({
    queryKey: ["session"],
    queryFn: async () => {
      const { data: { session }, error } = await supabase.auth.getSession();
      if (error) throw error;
      if (!session) throw new Error("No session");
      return session;
    },
  });

  const { data: pitches } = useQuery({
    queryKey: ["pitches"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("pitches")
        .select("*")
        .order("name");
      
      if (error) throw error;
      return data;
    },
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    if (!session?.user) {
      toast.error("You must be logged in to create fixtures");
      return;
    }

    try {
      setIsSubmitting(true);
      const [hours, minutes] = values.kick_off_time.split(":").map(Number);
      const matchDateTime = setMinutes(setHours(values.match_date, hours), minutes);

      const fixtureData = {
        home_team_id: values.home_team_id,
        away_team_id: values.away_team_id,
        pitch_id: values.pitch_id,
        match_date: matchDateTime.toISOString(),
        notes: values.notes,
        created_by: session.user.id,
      };

      const { error } = await supabase
        .from("fixtures")
        .insert(fixtureData);

      if (error) throw error;
      
      toast.success("Fixture created successfully");
      onSuccess?.();
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <div className="grid gap-6">
          <TeamSelect
            control={form.control}
            name="home_team_id"
            label="Home Team"
            isOpponent={false}
          />
          
          <TeamSelect
            control={form.control}
            name="away_team_id"
            label="Away Team"
            isOpponent={true}
          />

          <FormField
            control={form.control}
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

          <DateTimeSelect control={form.control} />
        </div>

        <Button type="submit" className="w-full" disabled={isSubmitting}>
          {isSubmitting ? "Creating..." : "Create Fixture"}
        </Button>
      </form>
    </Form>
  );
};

export default FixtureForm;