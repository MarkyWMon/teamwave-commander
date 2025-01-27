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
    if (!session) throw new Error("No session");

    if (isEditing && pitchId) {
      const { error } = await supabase
        .from("pitches")
        .update(values)
        .eq("id", pitchId);

      if (error) throw error;
      toast.success("Pitch updated successfully");
    } else {
      // Ensure all required fields are present and correctly typed
      const insertData: TablesInsert<"pitches"> = {
        ...values,
        created_by: session.user.id,
        name: values.name,
        address_line1: values.address_line1,
        city: values.city,
        postal_code: values.postal_code,
        latitude: values.latitude,
        longitude: values.longitude,
        surface_type: values.surface_type,
        lighting_type: values.lighting_type,
      };

      const { error } = await supabase
        .from("pitches")
        .insert(insertData);

      if (error) throw error;
      toast.success("Pitch created successfully");
    }

    onSuccess?.();
  } catch (error: any) {
    toast.error(error.message);
  }
};