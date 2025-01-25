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
import { X } from "lucide-react";

const ageGroups = Array.from({ length: 11 }, (_, i) => `U${i + 8}`);
const roles = ["manager", "coach", "assistant_manager", "other"] as const;

const officialSchema = z.object({
  full_name: z.string().min(2, "Name must be at least 2 characters"),
  role: z.enum(roles),
  email: z.string().email().optional().or(z.literal("")),
  phone: z.string().optional().or(z.literal("")),
});

const formSchema = z.object({
  name: z.string().min(2, "Team name must be at least 2 characters"),
  age_group: z.string(),
  officials: z.array(officialSchema),
});

type FormValues = z.infer<typeof formSchema>;

interface TeamFormProps {
  onSuccess?: () => void;
}

const TeamForm = ({ onSuccess }: TeamFormProps) => {
  const queryClient = useQueryClient();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      age_group: "U12",
      officials: [{ full_name: "", role: "manager", email: "", phone: "" }],
    },
  });

  const onSubmit = async (values: FormValues) => {
    try {
      setIsSubmitting(true);
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) throw new Error("No session");

      // Insert team
      const { data: team, error: teamError } = await supabase
        .from("teams")
        .insert({
          name: values.name,
          age_group: values.age_group,
          created_by: session.user.id,
        })
        .select()
        .single();

      if (teamError) throw teamError;

      // Insert officials
      const { error: officialsError } = await supabase
        .from("team_officials")
        .insert(
          values.officials.map((official) => ({
            ...official,
            team_id: team.id,
          }))
        );

      if (officialsError) throw officialsError;

      queryClient.invalidateQueries({ queryKey: ["teams"] });
      toast.success("Team created successfully");
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
                <Input {...field} />
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
            <div key={index} className="space-y-4 p-4 border rounded-lg relative">
              {index > 0 && (
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="absolute top-2 right-2"
                  onClick={() => {
                    const officials = form.getValues("officials");
                    form.setValue(
                      "officials",
                      officials.filter((_, i) => i !== index)
                    );
                  }}
                >
                  <X className="h-4 w-4" />
                </Button>
              )}

              <FormField
                control={form.control}
                name={`officials.${index}.full_name`}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Full Name</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name={`officials.${index}.role`}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Role</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select role" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {roles.map((role) => (
                          <SelectItem key={role} value={role}>
                            {role.replace("_", " ")}
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
                name={`officials.${index}.email`}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input {...field} type="email" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name={`officials.${index}.phone`}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Phone</FormLabel>
                    <FormControl>
                      <Input {...field} type="tel" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          ))}
        </div>

        <div className="flex justify-end gap-2">
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? "Creating..." : "Create Team"}
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default TeamForm;