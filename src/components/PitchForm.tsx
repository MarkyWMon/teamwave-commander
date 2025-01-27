import { useRef } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import PitchBasicInfo from "./PitchBasicInfo";
import PitchLocation from "./PitchLocation";
import PitchSpecifications from "./PitchSpecifications";
import PitchAmenities from "./PitchAmenities";
import type { TablesInsert } from "@/integrations/supabase/types";
import { formSchema, type FormValues } from "./pitch/types";
import { submitPitchForm } from "./pitch/PitchFormSubmit";

interface PitchFormProps {
  pitch?: TablesInsert<"pitches">;
  onSuccess?: () => void;
}

const PitchForm = ({ pitch, onSuccess }: PitchFormProps) => {
  const mapRef = useRef(null);
  const isEditing = !!pitch;

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: pitch?.name || "",
      address_line1: pitch?.address_line1 || "",
      address_line2: pitch?.address_line2 || "",
      city: pitch?.city || "",
      county: pitch?.county || "",
      postal_code: pitch?.postal_code || "",
      latitude: pitch?.latitude || 51.5074,
      longitude: pitch?.longitude || -0.1278,
      surface_type: pitch?.surface_type || "grass",
      lighting_type: pitch?.lighting_type || "none",
      parking_info: pitch?.parking_info || "",
      access_instructions: pitch?.access_instructions || "",
      equipment_requirements: pitch?.equipment_requirements || "",
      amenities: pitch?.amenities as FormValues["amenities"] || {
        changing_rooms: false,
        toilets: false,
        refreshments: false,
      },
      usage_restrictions: pitch?.usage_restrictions || "",
      special_instructions: pitch?.special_instructions || "",
    },
  });

  const onSubmit = async (values: FormValues) => {
    await submitPitchForm({
      values,
      isEditing,
      pitchId: pitch?.id,
      onSuccess,
    });
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <PitchBasicInfo form={form} />
        <PitchLocation form={form} mapRef={mapRef} />
        <PitchSpecifications form={form} />
        <PitchAmenities form={form} />
        
        <div className="flex justify-end gap-2">
          <Button type="submit">
            {isEditing ? "Update Pitch" : "Create Pitch"}
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default PitchForm;