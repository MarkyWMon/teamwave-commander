import { useEffect, useRef } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Form } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import PitchBasicInfo from "./PitchBasicInfo";
import PitchLocation from "./PitchLocation";
import PitchSpecifications from "./PitchSpecifications";
import PitchAmenities from "./PitchAmenities";
import type { TablesInsert } from "@/integrations/supabase/types";

const formSchema = z.object({
  name: z.string().min(2, "Pitch name must be at least 2 characters"),
  address_line1: z.string().min(1, "Address is required"),
  address_line2: z.string().optional(),
  city: z.string().min(1, "City is required"),
  county: z.string().optional(),
  postal_code: z.string().min(1, "Postal code is required"),
  latitude: z.number(),
  longitude: z.number(),
  surface_type: z.enum(["grass", "artificial_grass", "hybrid", "3g", "4g", "5g", "astroturf", "other"]),
  lighting_type: z.enum(["none", "floodlights", "natural_only", "partial"]),
  parking_info: z.string().optional(),
  access_instructions: z.string().optional(),
  equipment_requirements: z.string().optional(),
  amenities: z.object({
    changing_rooms: z.boolean(),
    toilets: z.boolean(),
    refreshments: z.boolean(),
  }),
  usage_restrictions: z.string().optional(),
  special_instructions: z.string().optional(),
});

type FormValues = z.infer<typeof formSchema>;

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
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) throw new Error("No session");

      if (isEditing) {
        const { error } = await supabase
          .from("pitches")
          .update(values)
          .eq("id", pitch.id);

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