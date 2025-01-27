import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import type { TablesInsert } from "@/integrations/supabase/types";
import type { FormValues } from "./types";

interface PitchFormSubmitProps {
  values: FormValues;
  isEditing: boolean;
  pitchId?: string;
  onSuccess?: () => void;
}

export const submitPitchForm = async ({
  values,
  isEditing,
  pitchId,
  onSuccess,
}: PitchFormSubmitProps) => {
  try {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) throw new Error("You must be logged in to manage pitches");

    const pitchData = {
      ...values,
      created_by: session.user.id,
    };

    if (isEditing && pitchId) {
      const { error } = await supabase
        .from("pitches")
        .update(pitchData)
        .eq("id", pitchId);

      if (error) throw error;
      toast.success("Pitch updated successfully");
    } else {
      const { error } = await supabase
        .from("pitches")
        .insert(pitchData);

      if (error) throw error;
      toast.success("Pitch created successfully");
    }

    onSuccess?.();
  } catch (error: any) {
    console.error("Error submitting pitch form:", error);
    toast.error(error.message);
  }
};