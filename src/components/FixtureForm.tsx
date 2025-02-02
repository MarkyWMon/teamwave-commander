import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { format, addDays, nextSunday } from "date-fns";
import { CalendarIcon } from "lucide-react";
import { toast } from "sonner";

const formSchema = z.object({
  home_team_id: z.string().uuid(),
  away_team_id: z.string().uuid(),
  pitch_id: z.string().uuid(),
  match_date: z.date(),
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
      match_date: nextSunday(addDays(new Date(), 1)),
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

  const { data: homeTeams } = useQuery({
    queryKey: ["home-teams"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("teams")
        .select("*")
        .eq("is_opponent", false)
        .order("name");
      
      if (error) throw error;
      return data;
    },
  });

  const { data: awayTeams } = useQuery({
    queryKey: ["away-teams"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("teams")
        .select("*")
        .eq("is_opponent", true)
        .order("name");
      
      if (error) throw error;
      return data;
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
      const { error } = await supabase
        .from("fixtures")
        .insert({
          ...values,
          match_date: values.match_date.toISOString(),
          created_by: session.user.id,
        });

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
        <FormField
          control={form.control}
          name="home_team_id"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Home Team</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select home team" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {homeTeams?.map((team) => (
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

        <FormField
          control={form.control}
          name="away_team_id"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Away Team</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select away team" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {awayTeams?.map((team) => (
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

        <FormField
          control={form.control}
          name="pitch_id"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Pitch</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select pitch" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
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

        <FormField
          control={form.control}
          name="match_date"
          render={({ field }) => (
            <FormItem className="flex flex-col">
              <FormLabel>Match Date</FormLabel>
              <Popover>
                <PopoverTrigger asChild>
                  <FormControl>
                    <Button
                      variant="outline"
                      className={cn(
                        "w-full pl-3 text-left font-normal",
                        !field.value && "text-muted-foreground"
                      )}
                    >
                      {field.value ? (
                        format(field.value, "PPP")
                      ) : (
                        <span>Pick a date</span>
                      )}
                      <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                    </Button>
                  </FormControl>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={field.value}
                    onSelect={field.onChange}
                    disabled={(date) =>
                      date < new Date()
                    }
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? "Creating..." : "Create Fixture"}
        </Button>
      </form>
    </Form>
  );
};

export default FixtureForm;