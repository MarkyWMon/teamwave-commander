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

    // Ensure all required fields are present
    const pitchData: TablesInsert<"pitches"> = {
      name: values.name,
      address_line1: values.address_line1,
      address_line2: values.address_line2,
      city: values.city,
      county: values.county,
      postal_code: values.postal_code,
      latitude: values.latitude,
      longitude: values.longitude,
      surface_type: values.surface_type,
      lighting_type: values.lighting_type,
      parking_info: values.parking_info,
      access_instructions: values.access_instructions,
      equipment_requirements: values.equipment_requirements,
      amenities: values.amenities,
      usage_restrictions: values.usage_restrictions,
      special_instructions: values.special_instructions,
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