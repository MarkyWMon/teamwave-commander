import { toast } from "sonner";
import type { UseFormReturn } from "react-hook-form";

export const geocodeAddress = async (
  address: string,
  mapboxToken: string,
  form: UseFormReturn<any>
) => {
  try {
    const response = await fetch(
      `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(
        address
      )}.json?access_token=${mapboxToken}&country=GB`
    );

    const data = await response.json();

    if (data.features && data.features.length > 0) {
      const [longitude, latitude] = data.features[0].center;
      const place = data.features[0];
      
      // Update form with coordinates and map URL
      form.setValue("longitude", longitude);
      form.setValue("latitude", latitude);
      form.setValue("map_url", `https://www.google.com/maps?q=${latitude},${longitude}`);
      
      return {
        longitude,
        latitude,
        place_name: place.place_name,
      };
    }
    return null;
  } catch (error) {
    console.error("Error geocoding address:", error);
    toast.error("Failed to find location for this address");
    return null;
  }
};