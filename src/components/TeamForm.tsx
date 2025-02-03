import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { officialSchema } from "./TeamOfficialForm";
import { Team } from "@/types/team";
import TeamBasicInfoForm from "./TeamBasicInfoForm";
import TeamOfficialsList from "./TeamOfficialsList";
import { useQueryClient } from "@tanstack/react-query";

const formSchema = z.object({
  name: z.string().min(2, "Team name must be at least 2 characters"),
  age_group: z.string(),
  is_opponent: z.boolean().default(false),
  team_color: z.string().optional(),
  officials: z.array(officialSchema),
});

type FormValues = z.infer<typeof formSchema>;

interface TeamFormProps {
  team?: Team;
  onSuccess?: () => void;
}

const TeamForm = ({ team, onSuccess }: TeamFormProps) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const isEditing = !!team;
  const queryClient = useQueryClient();

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: team?.name || "",
      age_group: team?.age_group || "U12",
      is_opponent: team?.is_opponent || false,
      team_color: team?.team_color || "",
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

      const teamData = {
        name: values.name,
        age_group: values.age_group,
        is_opponent: values.is_opponent,
        team_color: values.team_color || "gray", // Set a default color if none provided
      };

      if (isEditing && team) {
        // Update team
        const { error: teamError } = await supabase
          .from("teams")
          .update(teamData)
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
            ...teamData,
            created_by: session.user.id,
            gender: "boys", // Default value, will be updated in next implementation
          })
          .select("*, team_officials(*)")
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

      await queryClient.invalidateQueries({ queryKey: ["teams"] });
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
        <TeamBasicInfoForm form={form} />
        <TeamOfficialsList form={form} />
        
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