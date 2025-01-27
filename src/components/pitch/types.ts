import * as z from "zod";

export const formSchema = z.object({
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

export type FormValues = z.infer<typeof formSchema>;