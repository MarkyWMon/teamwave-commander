import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Form } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import TeamSelect from "./fixtures/TeamSelect";
import DateTimeSelect from "./fixtures/DateTimeSelect";
import PitchSelect from "./fixtures/PitchSelect";
import { setHours, setMinutes } from "date-fns";
import type { Database } from "@/integrations/supabase/types";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

type MatchStatus = Database["public"]["Enums"]["match_status"];

const formSchema = z.object({
  home_team_id: z.string().uuid("Please select a home team"),
  away_team_id: z.string().uuid("Please select an away team"),
  pitch_id: z.string().uuid("Please select a pitch"),
  match_date: z.date(),
  kick_off_time: z.string(),
  notes: z.string().optional(),
});

interface FixtureEditDialogProps {
  fixture: any;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const FixtureEditDialog = ({ fixture, open, onOpenChange }: FixtureEditDialogProps) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showCancelDialog, setShowCancelDialog] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      home_team_id: fixture.home_team_id,
      away_team_id: fixture.away_team_id,
      pitch_id: fixture.pitch_id,
      match_date: new Date(fixture.match_date),
      kick_off_time: new Date(fixture.match_date).toLocaleTimeString([], { 
        hour: '2-digit', 
        minute: '2-digit', 
        hour12: false 
      }),
      notes: fixture.notes || "",
    },
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      setIsSubmitting(true);
      console.log("Updating fixture with values:", values);

      const [hours, minutes] = values.kick_off_time.split(":").map(Number);
      const matchDateTime = setMinutes(setHours(values.match_date, hours), minutes);

      const fixtureData = {
        home_team_id: values.home_team_id,
        away_team_id: values.away_team_id,
        pitch_id: values.pitch_id,
        match_date: matchDateTime.toISOString(),
        notes: values.notes || "",
      };

      const { error } = await supabase
        .from("fixtures")
        .update(fixtureData)
        .eq("id", fixture.id);

      if (error) throw error;

      toast.success("Fixture updated successfully");
      onOpenChange(false);
    } catch (error: any) {
      console.error("Error updating fixture:", error);
      toast.error(error.message || "Failed to update fixture");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancelFixture = async () => {
    try {
      setIsSubmitting(true);
      const { error } = await supabase
        .from("fixtures")
        .update({ status: "cancelled" as MatchStatus })
        .eq("id", fixture.id);

      if (error) throw error;

      toast.success("Fixture cancelled successfully");
      onOpenChange(false);
    } catch (error: any) {
      console.error("Error cancelling fixture:", error);
      toast.error(error.message || "Failed to cancel fixture");
    } finally {
      setIsSubmitting(false);
      setShowCancelDialog(false);
    }
  };

  const isFixtureCancelled = fixture.status === "cancelled";

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Edit Fixture</DialogTitle>
          </DialogHeader>
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
                <PitchSelect control={form.control} />
                <DateTimeSelect control={form.control} />
              </div>
              <div className="flex justify-between gap-4">
                <Button 
                  type="button" 
                  variant="destructive"
                  onClick={() => setShowCancelDialog(true)}
                  disabled={isFixtureCancelled || isSubmitting}
                >
                  Cancel Fixture
                </Button>
                <Button type="submit" disabled={isSubmitting || isFixtureCancelled}>
                  {isSubmitting ? "Updating..." : "Update Fixture"}
                </Button>
              </div>
            </form>
          </Form>
        </DialogContent>
      </Dialog>

      <AlertDialog open={showCancelDialog} onOpenChange={setShowCancelDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Cancel Fixture</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to cancel this fixture? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>No, keep fixture</AlertDialogCancel>
            <AlertDialogAction onClick={handleCancelFixture} className="bg-destructive text-destructive-foreground">
              Yes, cancel fixture
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};

export default FixtureEditDialog;