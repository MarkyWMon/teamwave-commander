import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { supabase } from "@/integrations/supabase/client";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import TeamOfficialForm, { officialSchema } from "./TeamOfficialForm";
import { Team } from "@/types/team";

const ageGroups = Array.from({ length: 11 }, (_, i) => `U${i + 8}`);

const formSchema = z.object({
  name: z.string().min(2, "Team name must be at least 2 characters"),
  age_group: z.string(),
  officials: z.array(officialSchema),
});

type FormValues = z.infer<typeof formSchema>;

interface TeamFormProps {
  team?: Team;
  onSuccess?: () => void;
}

const TeamForm = ({ team, onSuccess }: TeamFormProps) => {
  const queryClient = useQueryClient();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const isEditing = !!team;

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: team?.name || "",
      age_group: team?.age_group || "U12",
      officials: team?.team_officials?.map(official => ({
        full_name: official.full_name,
        role: official.role,
        email: official.email || "",
        phone: official.phone || "",
      })) || [{ full_name: "", role: "manager", email: "", phone: "" }],
    },
  });

  const onSubmit = async (values: FormValues) => {
    try {
      setIsSubmitting(true);
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) throw new Error("No session");

      if (isEditing && team) {
        // Update team
        const { error: teamError } = await supabase
          .from("teams")
          .update({
            name: values.name,
            age_group: values.age_group,
          })
          .eq("id", team.id);

        if (teamError) throw teamError;

        // Delete existing officials
        const { error: deleteError } = await supabase
          .from("team_officials")
          .delete()
          .eq("team_id", team.id);

        if (deleteError) throw deleteError;
      } else {
        // Insert new team
        const { data: newTeam, error: teamError } = await supabase
          .from("teams")
          .insert({
            name: values.name,
            age_group: values.age_group,
            created_by: session.user.id,
            gender: "boys", // Default value, will be updated in next implementation
          })
          .select()
          .single();

        if (teamError) throw teamError;
        team = newTeam;
      }

      // Insert officials
      const officialsToInsert = values.officials.map((official) => ({
        team_id: team!.id,
        full_name: official.full_name,
        role: official.role,
        email: official.email || null,
        phone: official.phone || null,
      }));

      const { error: officialsError } = await supabase
        .from("team_officials")
        .insert(officialsToInsert);

      if (officialsError) throw officialsError;

      queryClient.invalidateQueries({ queryKey: ["teams"] });
      toast.success(isEditing ? "Team updated successfully" : "Team created successfully");
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
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Team Name</FormLabel>
              <FormControl>
                <Input {...field} placeholder="Enter team color (e.g., Red Team)" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="age_group"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Age Group</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select age group" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {ageGroups.map((age) => (
                    <SelectItem key={age} value={age}>
                      {age}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-medium">Team Officials</h3>
            <Button
              type="button"
              variant="outline"
              onClick={() => {
                const officials = form.getValues("officials");
                form.setValue("officials", [
                  ...officials,
                  { full_name: "", role: "manager", email: "", phone: "" },
                ]);
              }}
            >
              Add Official
            </Button>
          </div>

          {form.watch("officials").map((_, index) => (
            <TeamOfficialForm
              key={index}
              index={index}
              form={form}
              onRemove={() => {
                const officials = form.getValues("officials");
                form.setValue(
                  "officials",
                  officials.filter((_, i) => i !== index)
                );
              }}
              isRemovable={index > 0}
            />
          ))}
        </div>

        <div className="flex justify-end gap-2">
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? (isEditing ? "Updating..." : "Creating...") : (isEditing ? "Update Team" : "Create Team")}
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default TeamForm;